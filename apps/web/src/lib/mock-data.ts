export interface Document {
  id: string;
  type: "invoice" | "receipt" | "contract" | "delivery_note" | "bill";
  status:
    | "reviewed"
    | "pending"
    | "processing"
    | "overdue"
    | "awaiting_signature";
  flags: ("verified" | "duplicate")[];
  description: string;
  date: string;
  approved: boolean;
  thumbnailUrl?: string;
  s3Key?: string;
  mimeType?: string;
  extractedData?: {
    supplier?: string;
    invoiceNo?: string;
    date?: string;
    paymentTerms?: string;
    subtotal?: string;
    vat?: string;
    total?: string;
  };
  aiSummary?: string;
  aiFlags?: { type: "warning" | "success"; message: string }[];
  ocrText?: string;
  s3Url?: string;
}

export const documents: Document[] = [
  {
    id: "doc-001",
    type: "invoice",
    status: "reviewed",
    flags: ["verified"],
    description: "Diesel fuel — 500L @ R22.45/L, Engen Depot JHB",
    date: "12 Mar 2026",
    approved: true,
    extractedData: {
      supplier: "Shell SA (Pty) Ltd",
      invoiceNo: "INV-2026-04417",
      date: "12 Mar 2026",
      paymentTerms: "30 days",
      subtotal: "R11,225.00",
      vat: "R1,683.75",
      total: "R12,908.75",
    },
    aiSummary:
      "Invoice from Shell SA for diesel fuel delivery to the Middelburg depot. 500 litres at R22.45/L. Includes 15% VAT. Payment due within 30 days. Total R12,908.75. Maths checks out.",
    aiFlags: [
      {
        type: "warning",
        message:
          "Possible duplicate — similar invoice from Shell SA on 28 Feb",
      },
      {
        type: "success",
        message: "VAT calculation verified — R1,683.75 at 15%",
      },
    ],
  },
  {
    id: "doc-002",
    type: "receipt",
    status: "pending",
    flags: [],
    description: "Office supplies — cartridges, A4 paper, Telkom",
    date: "11 Mar 2026",
    approved: false,
    extractedData: {
      supplier: "Telkom Business",
      invoiceNo: "REC-88214",
      date: "11 Mar 2026",
      paymentTerms: "Paid",
      subtotal: "R3,420.00",
      vat: "R513.00",
      total: "R3,933.00",
    },
    aiSummary:
      "Receipt for office supplies purchased from Waltons via Telkom business account. Includes 50x A4 reams and 12x printer cartridges. VAT inclusive total of R3,933.00.",
    aiFlags: [
      {
        type: "success",
        message: "VAT calculation verified — R513.00 at 15%",
      },
    ],
  },
  {
    id: "doc-003",
    type: "contract",
    status: "awaiting_signature",
    flags: [],
    description: "CleanCo — monthly office cleaning, 12-month term",
    date: "10 Mar 2026",
    approved: false,
    extractedData: {
      supplier: "CleanCo Services (Pty) Ltd",
      invoiceNo: "CTR-2026-0091",
      date: "10 Mar 2026",
      paymentTerms: "Monthly in arrears",
      subtotal: "R8,500.00/mo",
      vat: "R1,275.00/mo",
      total: "R9,775.00/mo",
    },
    aiSummary:
      "12-month service agreement with CleanCo for daily office cleaning at the Sandton head office. R9,775/month inclusive of VAT. Includes 30-day cancellation clause. Auto-renewal unless 60 days written notice given.",
    aiFlags: [
      {
        type: "warning",
        message:
          "Auto-renewal clause detected — review before signing",
      },
      {
        type: "success",
        message: "B-BBEE Level 2 certificate on file for CleanCo",
      },
    ],
  },
  {
    id: "doc-004",
    type: "delivery_note",
    status: "processing",
    flags: [],
    description: "Cement — 40 bags CEM II, AfriSam Pretoria",
    date: "9 Mar 2026",
    approved: false,
    extractedData: {
      supplier: "AfriSam (Pty) Ltd",
      invoiceNo: "DN-PTA-44210",
      date: "9 Mar 2026",
      paymentTerms: "COD",
      subtotal: "R4,800.00",
      vat: "R720.00",
      total: "R5,520.00",
    },
    aiSummary:
      "Delivery note for 40 bags of CEM II 42.5N cement from AfriSam Pretoria depot. Delivered to Witbank construction site. Signed by site foreman J. Mokoena.",
    aiFlags: [
      {
        type: "success",
        message: "Delivery signature verified — J. Mokoena",
      },
    ],
  },
  {
    id: "doc-005",
    type: "bill",
    status: "overdue",
    flags: [],
    description: "Telkom fibre — monthly business line, #TK-889421",
    date: "8 Mar 2026",
    approved: false,
  },
  {
    id: "doc-006",
    type: "invoice",
    status: "reviewed",
    flags: ["verified"],
    description: "Fleet — Hilux service, brake pads + oil, Midas",
    date: "7 Mar 2026",
    approved: true,
  },
  {
    id: "doc-007",
    type: "receipt",
    status: "pending",
    flags: [],
    description: "Catering deposit — year-end, The Venue Sandton",
    date: "6 Mar 2026",
    approved: false,
  },
  {
    id: "doc-008",
    type: "invoice",
    status: "processing",
    flags: [],
    description: "PPE — 50x hard hats, 100x vests, Builders Express",
    date: "5 Mar 2026",
    approved: false,
  },
  {
    id: "doc-009",
    type: "delivery_note",
    status: "reviewed",
    flags: ["verified"],
    description: "Coal haulage — Mpumalanga to Richards Bay terminal",
    date: "4 Mar 2026",
    approved: true,
  },
  {
    id: "doc-010",
    type: "invoice",
    status: "pending",
    flags: ["duplicate"],
    description: "Conveyor belt repair — Sandvik parts, Witbank site",
    date: "3 Mar 2026",
    approved: false,
  },
  {
    id: "doc-011",
    type: "bill",
    status: "overdue",
    flags: [],
    description: "Eskom electricity — Witbank plant, Feb statement",
    date: "2 Mar 2026",
    approved: false,
  },
  {
    id: "doc-012",
    type: "receipt",
    status: "reviewed",
    flags: ["verified"],
    description: "Safety training — 20 staff, FirstAid Pro, Nelspruit",
    date: "1 Mar 2026",
    approved: true,
  },
];

export const typeCounts: Record<string, number> = {
  all: 128,
  invoice: 45,
  receipt: 31,
  contract: 18,
  delivery_note: 22,
  bill: 12,
};
