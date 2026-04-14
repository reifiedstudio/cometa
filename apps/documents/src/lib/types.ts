export interface Document {
  id: string;
  type: string;
  status:
    | "reviewed"
    | "approved"
    | "pending"
    | "processing"
    | "rejected"
    | "overdue"
    | "awaiting_signature";
  flags: { type: "warning" | "success"; message: string }[];
  description: string;
  date: string;
  approved: boolean;
  thumbnailUrl?: string;
  s3Key?: string;
  mimeType?: string;
  originalName?: string;
  sizeBytes?: number;
  source?: string;
  senderEmail?: string;
  extractedData?: Record<string, unknown>;
  aiSummary?: string;
  ocrText?: string;
  s3Url?: string;
  isDuplicate?: boolean;
  isVerified?: boolean;
  isFlagged?: boolean;
  typeVersion?: number;
  rejectionReason?: string;
  signatureRequestId?: string;
  signatureProgress?: { signed: number; total: number } | null;
  receivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
