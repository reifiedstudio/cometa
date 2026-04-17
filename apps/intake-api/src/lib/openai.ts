import OpenAI from "openai";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "currency" | "list" | "table";
  columns?: { key: string; label: string; isMoney?: boolean }[];
}

export interface DocumentTypeInfo {
  slug: string;
  name: string;
  description?: string | null;
  fields: FieldDef[];
}

export interface ClassificationResult {
  type: string | null;
  description: string;
  extractedData: Record<string, unknown>;
  aiSummary: string;
  flags: Array<{ type: "warning" | "success"; message: string }>;
}

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const openai = apiKey ? new OpenAI({ apiKey }) : null;

// ── Helpers ──

async function loadActiveTypes(): Promise<DocumentTypeInfo[]> {
  const { db, schema } = await import("@cometa/db");
  const { eq } = await import("drizzle-orm");

  const types = await db
    .select({
      slug: schema.documentTypes.slug,
      name: schema.documentTypes.name,
      description: schema.documentTypes.description,
      fields: schema.documentTypes.fields,
    })
    .from(schema.documentTypes)
    .where(eq(schema.documentTypes.isActive, true));

  return types.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    fields: (t.fields as FieldDef[]) ?? [],
  }));
}

function describeField(f: FieldDef): string {
  switch (f.type) {
    case "number":
      return `  - ${f.key} (number): ${f.label}`;
    case "currency":
      return `  - ${f.key} (number, money — return as plain number, no currency symbol): ${f.label}`;
    case "date":
      return `  - ${f.key} (string, ISO date YYYY-MM-DD): ${f.label}`;
    case "list":
      return `  - ${f.key} (array of strings): ${f.label}`;
    case "table": {
      const cols = (f.columns ?? [])
        .map((c) => `${c.key}${c.isMoney ? " (number)" : ""}`)
        .join(", ");
      return `  - ${f.key} (array of objects {${cols}}): ${f.label}`;
    }
    default:
      return `  - ${f.key} (string): ${f.label}`;
  }
}

// ── Step 1: Classify type ──

export async function classifyType(
  ocrText: string,
  hint: string | undefined,
  types: DocumentTypeInfo[],
): Promise<string | null> {
  if (!openai) throw new Error("OPENAI_API_KEY is not configured");
  if (!types.length) return null;

  const typeList = types
    .map((t) => `### ${t.slug} — ${t.name}\n${t.description?.trim() ?? "(no description)"}`)
    .join("\n\n");

  const systemPrompt = `You are a document classifier. Pick the SINGLE best-matching type for the document below.

You must choose from these types and ONLY these types. Read each description carefully — they spell out what makes each type distinct from the others.

${typeList}

Decision rules:
- Match against the type DESCRIPTIONS, not just the type names. The descriptions explain what to look for and how to disambiguate similar types.
- If a sender hint is provided (the filename or email subject), treat it as a strong signal — but only if the document content supports it. Conflicts are won by the document content.
- If no type clearly fits, return {"type": null, "reason": "..."}. Do not guess.
- The "reason" field is mandatory and must be one short sentence citing the specific features that drove your decision.

Return ONLY valid JSON in this exact shape: {"type": "<slug or null>", "reason": "<one sentence>"}`;

  const userContent = hint
    ? `Sender hint (filename / email subject): "${hint}"\n\n--- DOCUMENT OCR TEXT ---\n${ocrText.slice(0, 8000)}`
    : `--- DOCUMENT OCR TEXT ---\n${ocrText.slice(0, 8000)}`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 200,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return null;

  try {
    const parsed = JSON.parse(content);
    const slug = parsed.type;
    if (parsed.reason) {
      console.log(`[classify] → ${slug ?? "null"} — ${parsed.reason}`);
    }
    if (slug && types.some((t) => t.slug === slug)) return slug;
  } catch {
    /* fall through */
  }
  return null;
}

// ── Step 2: Extract data using a specific type's schema ──

export interface ExtractionResult {
  description: string;
  aiSummary: string;
  extractedData: Record<string, unknown>;
  flags: Array<{ type: "warning" | "success"; message: string }>;
}

export async function extractDataForType(
  ocrText: string,
  type: DocumentTypeInfo,
): Promise<ExtractionResult> {
  if (!openai) throw new Error("OPENAI_API_KEY is not configured");

  const fieldDescriptions = type.fields.length
    ? type.fields.map(describeField).join("\n")
    : "  (no fields configured)";

  const fieldKeys = type.fields.map((f) => `"${f.key}"`).join(", ");

  const systemPrompt = `You are a structured data extraction system for documents of type "${type.name}".

Extract the following fields from the OCR text below and return JSON in this exact shape:

{
  "description": "<short 2-4 word title — e.g. 'Walmart receipt' or 'AWS invoice Sept 2024'>",
  "aiSummary": "<2-3 sentence business summary of what this document is and why it matters>",
  "extractedData": {
${type.fields.map((f) => `    "${f.key}": ...`).join(",\n")}
  },
  "flags": [
    { "type": "warning" | "success", "message": "<short note about anomalies or confirmations>" }
  ]
}

Field schema for "${type.name}":
${fieldDescriptions}

Rules:
- Use null for any field you cannot find in the document. Do NOT make up values.
- Only include keys ${fieldKeys || "(none)"} in extractedData. No extras.
- Money/currency fields must be plain numbers (e.g. 45.59, not "$45.59").
- Dates must be ISO format (YYYY-MM-DD).
- For table fields, extract ALL line items.
- For list fields, return an array of strings.
- flags can be empty array. Only flag genuinely notable things (missing totals, suspicious amounts, expiry warnings, etc.).
- Return ONLY valid JSON, no markdown fencing.`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: ocrText },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenAI");

  return JSON.parse(content) as ExtractionResult;
}

// ── Combined pipeline (used by the queue worker) ──

export async function classifyAndExtract(
  ocrText: string,
  hint?: string,
  forcedTypeSlug?: string | null,
): Promise<ClassificationResult> {
  const types = await loadActiveTypes();
  if (!types.length) {
    return {
      type: null,
      description: "Untitled document",
      extractedData: {},
      aiSummary: "No document types configured. Add one in Settings → Document Types.",
      flags: [{ type: "warning", message: "No document types configured" }],
    };
  }

  // Step 1: classify (or use forced type if provided)
  let chosenSlug: string | null = forcedTypeSlug ?? null;
  if (!chosenSlug) {
    chosenSlug = await classifyType(ocrText, hint, types);
  }

  if (!chosenSlug) {
    return {
      type: null,
      description: "Unrecognised document",
      extractedData: {},
      aiSummary: "Could not confidently classify this document into any configured type.",
      flags: [{ type: "warning", message: "Type could not be determined" }],
    };
  }

  const chosenType = types.find((t) => t.slug === chosenSlug);
  if (!chosenType) {
    return {
      type: null,
      description: "Unknown type",
      extractedData: {},
      aiSummary: `Classifier returned an unknown type "${chosenSlug}".`,
      flags: [{ type: "warning", message: `Unknown type "${chosenSlug}"` }],
    };
  }

  // Step 2: extract using the chosen type's schema
  const extracted = await extractDataForType(ocrText, chosenType);

  return {
    type: chosenSlug,
    description: extracted.description,
    extractedData: extracted.extractedData,
    aiSummary: extracted.aiSummary,
    flags: extracted.flags ?? [],
  };
}

// Backwards-compat shim — old name kept so we don't break the worker mid-deploy
export const classifyDocument = classifyAndExtract;
