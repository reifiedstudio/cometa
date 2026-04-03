import OpenAI from "openai";

export interface ClassificationResult {
  type: "invoice" | "receipt" | "contract" | "delivery_note" | "bill";
  description: string;
  extractedData: Record<string, unknown>;
  aiSummary: string;
  flags: Array<{ type: "warning" | "success"; message: string }>;
}

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL ?? "gpt-5-nano";

const openai = apiKey ? new OpenAI({ apiKey }) : null;

const SYSTEM_PROMPT = `You are a document classification system. Given the OCR text from a document, return a JSON object with:
- type: one of "invoice", "receipt", "contract", "delivery_note", "bill"
- description: 2-3 word summary dash detail (e.g. "Invoice - Acme Corp supplies")
- extractedData: key-value pairs of important fields like supplier, invoice number, date, amounts
- aiSummary: 2-3 sentence business summary
- flags: array of {type: "warning" | "success", message: string} for things like duplicate detection hints, VAT verification

Return ONLY valid JSON, no markdown fencing.`;

export async function classifyDocument(ocrText: string): Promise<ClassificationResult> {
  if (!openai) {
    console.log("[openai] No API key available, returning mock classification");
    return {
      type: "invoice",
      description: "Invoice - Mock Document",
      extractedData: {
        supplier: "Mock Supplier Ltd",
        invoiceNumber: "INV-001",
        date: new Date().toISOString().split("T")[0],
        totalAmount: "0.00",
        currency: "GBP",
      },
      aiSummary:
        "This is a mock classification for local development. The document would be analysed by OpenAI in production. No real data was extracted.",
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

  return JSON.parse(content) as ClassificationResult;
}
