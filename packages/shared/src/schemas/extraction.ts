import { z } from "zod";

// ── Line item schemas ──

const receiptItemSchema = z.object({
  name: z.string().nullable(),
  quantity: z.number().nullable(),
  unitPrice: z.number().nullable(),
});

const invoiceItemSchema = z.object({
  description: z.string().nullable(),
  quantity: z.number().nullable(),
  unitPrice: z.number().nullable(),
  total: z.number().nullable(),
});

const deliveryNoteItemSchema = z.object({
  description: z.string().nullable(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
});

const billItemSchema = z.object({
  description: z.string().nullable(),
  amount: z.number().nullable(),
});

// ── Extracted data schemas per document type ──

export const receiptExtractedDataSchema = z.object({
  supplier: z.string().nullable(),
  date: z.string().nullable(),
  subtotal: z.number().nullable(),
  tax: z.number().nullable(),
  tip: z.number().nullable(),
  total: z.number().nullable(),
  currency: z.string().nullable(),
  paymentMethod: z.string().nullable(),
  cardLastFour: z.string().nullable(),
  items: z.array(receiptItemSchema).nullable(),
});

export const invoiceExtractedDataSchema = z.object({
  supplier: z.string().nullable(),
  invoiceNumber: z.string().nullable(),
  date: z.string().nullable(),
  dueDate: z.string().nullable(),
  subtotal: z.number().nullable(),
  vat: z.number().nullable(),
  total: z.number().nullable(),
  currency: z.string().nullable(),
  paymentTerms: z.string().nullable(),
  items: z.array(invoiceItemSchema).nullable(),
});

export const contractExtractedDataSchema = z.object({
  parties: z.array(z.string()).nullable(),
  effectiveDate: z.string().nullable(),
  expiryDate: z.string().nullable(),
  contractType: z.string().nullable(),
  keyTerms: z.array(z.string()).nullable(),
  governingLaw: z.string().nullable(),
});

export const deliveryNoteExtractedDataSchema = z.object({
  supplier: z.string().nullable(),
  deliveryDate: z.string().nullable(),
  referenceNumber: z.string().nullable(),
  receiver: z.string().nullable(),
  address: z.string().nullable(),
  items: z.array(deliveryNoteItemSchema).nullable(),
});

export const billExtractedDataSchema = z.object({
  provider: z.string().nullable(),
  accountNumber: z.string().nullable(),
  billingPeriod: z.string().nullable(),
  amountDue: z.number().nullable(),
  dueDate: z.string().nullable(),
  currency: z.string().nullable(),
  items: z.array(billItemSchema).nullable(),
});

// ── Schema map ──

export const extractionSchemas = {
  receipt: receiptExtractedDataSchema,
  invoice: invoiceExtractedDataSchema,
  contract: contractExtractedDataSchema,
  delivery_note: deliveryNoteExtractedDataSchema,
  bill: billExtractedDataSchema,
} as const;

export type ExtractableDocumentType = keyof typeof extractionSchemas;

export type ReceiptData = z.infer<typeof receiptExtractedDataSchema>;
export type InvoiceData = z.infer<typeof invoiceExtractedDataSchema>;
export type ContractData = z.infer<typeof contractExtractedDataSchema>;
export type DeliveryNoteData = z.infer<typeof deliveryNoteExtractedDataSchema>;
export type BillData = z.infer<typeof billExtractedDataSchema>;

// ── Field display config ──
// Defines label, order, and formatting for each field per document type.
// The frontend uses this to render fields consistently.

export interface FieldConfig {
  key: string;
  label: string;
  isMoney?: boolean;
}

export interface ItemColumnConfig {
  key: string;
  label: string;
  align?: "left" | "right";
  isMoney?: boolean;
}

export interface TypeDisplayConfig {
  fields: FieldConfig[];
  itemColumns?: ItemColumnConfig[];
}

export const displayConfig: Record<ExtractableDocumentType, TypeDisplayConfig> = {
  receipt: {
    fields: [
      { key: "supplier", label: "Supplier" },
      { key: "date", label: "Date" },
      { key: "paymentMethod", label: "Payment Method" },
      { key: "cardLastFour", label: "Card" },
      { key: "currency", label: "Currency" },
      { key: "subtotal", label: "Subtotal", isMoney: true },
      { key: "tax", label: "Tax", isMoney: true },
      { key: "tip", label: "Tip", isMoney: true },
      { key: "total", label: "Total", isMoney: true },
    ],
    itemColumns: [
      { key: "name", label: "Item", align: "left" },
      { key: "quantity", label: "Qty", align: "right" },
      { key: "unitPrice", label: "Price", align: "right", isMoney: true },
    ],
  },
  invoice: {
    fields: [
      { key: "supplier", label: "Supplier" },
      { key: "invoiceNumber", label: "Invoice No." },
      { key: "date", label: "Date" },
      { key: "dueDate", label: "Due Date" },
      { key: "paymentTerms", label: "Payment Terms" },
      { key: "currency", label: "Currency" },
      { key: "subtotal", label: "Subtotal", isMoney: true },
      { key: "vat", label: "VAT", isMoney: true },
      { key: "total", label: "Total", isMoney: true },
    ],
    itemColumns: [
      { key: "description", label: "Description", align: "left" },
      { key: "quantity", label: "Qty", align: "right" },
      { key: "unitPrice", label: "Unit Price", align: "right", isMoney: true },
      { key: "total", label: "Total", align: "right", isMoney: true },
    ],
  },
  contract: {
    fields: [
      { key: "contractType", label: "Type" },
      { key: "effectiveDate", label: "Effective Date" },
      { key: "expiryDate", label: "Expiry Date" },
      { key: "governingLaw", label: "Governing Law" },
      { key: "parties", label: "Parties" },
      { key: "keyTerms", label: "Key Terms" },
    ],
  },
  delivery_note: {
    fields: [
      { key: "supplier", label: "Supplier" },
      { key: "deliveryDate", label: "Delivery Date" },
      { key: "referenceNumber", label: "Reference No." },
      { key: "receiver", label: "Receiver" },
      { key: "address", label: "Address" },
    ],
    itemColumns: [
      { key: "description", label: "Item", align: "left" },
      { key: "quantity", label: "Qty", align: "right" },
      { key: "unit", label: "Unit", align: "right" },
    ],
  },
  bill: {
    fields: [
      { key: "provider", label: "Provider" },
      { key: "accountNumber", label: "Account No." },
      { key: "billingPeriod", label: "Billing Period" },
      { key: "dueDate", label: "Due Date" },
      { key: "currency", label: "Currency" },
      { key: "amountDue", label: "Amount Due", isMoney: true },
    ],
    itemColumns: [
      { key: "description", label: "Description", align: "left" },
      { key: "amount", label: "Amount", align: "right", isMoney: true },
    ],
  },
};

// ── Prompt helper ──
// Generates a human-readable description of expected fields for the OpenAI prompt.

export function getSchemaDescription(): string {
  const lines: string[] = [];

  for (const [type, schema] of Object.entries(extractionSchemas)) {
    const shape = schema.shape;
    const fields = Object.entries(shape).map(([key, zodType]) => {
      const desc = zodType._def;
      if (key === "items" || key === "parties" || key === "keyTerms") {
        return `${key}: array`;
      }
      return key;
    });
    lines.push(`${type}: { ${fields.join(", ")} }`);
  }

  return lines.join("\n");
}
