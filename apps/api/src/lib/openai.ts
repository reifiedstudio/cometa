import OpenAI from "openai";
import { extractionSchemas, getSchemaDescription, type DocumentType } from "@cometa/shared";

export interface ClassificationResult {
  type: DocumentType;
  description: string;
  extractedData: Record<string, unknown>;
  aiSummary: string;
  flags: Array<{ type: "warning" | "success"; message: string }>;
}

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL ?? "gpt-5-nano";

const openai = apiKey ? new OpenAI({ apiKey }) : null;

const SYSTEM_PROMPT = `You are a document classification and extraction system. Given the OCR text from a document, return a JSON object with:

- type: one of "invoice", "receipt", "contract", "delivery_note", "bill"
- description: 2-3 word summary dash detail (e.g. "Receipt - Trader Joe's groceries")
- extractedData: structured data matching the schema for the detected type (see below)
- aiSummary: 2-3 sentence business summary
- flags: array of {type: "warning" | "success", message: string} for issues or confirmations

IMPORTANT: extractedData must match the schema for the detected document type. Use null for fields you cannot find. Do NOT add fields outside the schema.

Schemas per type:
${getSchemaDescription()}

For items arrays, extract ALL line items from the document.
For money fields, return numbers not strings (e.g. 45.59 not "$45.59").
For dates, use ISO format (e.g. "2024-09-28").

Return ONLY valid JSON, no markdown fencing.`;

export async function classifyDocument(ocrText: string): Promise<ClassificationResult> {
  if (!openai) {
    console.log("[openai] No API key available, returning mock classification");
    return {
      type: "receipt",
      description: "Receipt - Mock Document",
      extractedData: {
        supplier: "Mock Supplier Ltd",
        date: new Date().toISOString().split("T")[0],
        subtotal: 0,
        tax: 0,
        tip: null,
        total: 0,
        currency: "USD",
        paymentMethod: null,
        cardLastFour: null,
        items: [],
      },
      aiSummary: "This is a mock classification for local development.",
      flags: [
        { type: "warning", message: "Mock classification — AI not connected" },
      ],
    };
  }

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: ocrText },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  const raw = JSON.parse(content) as ClassificationResult;

  // Validate extractedData against the schema for this type
  const schema = extractionSchemas[raw.type];
  if (schema && raw.extractedData) {
    const result = schema.safeParse(raw.extractedData);
    if (result.success) {
      raw.extractedData = result.data;
    } else {
      console.warn("[openai] Extracted data failed validation, using raw:", result.error.issues);
    }
  }

  return raw;
}
