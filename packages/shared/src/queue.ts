/** Processing queue message contract — used by all producers and the consumer */
export interface ProcessingMessage {
  documentId: string;
  s3Key: string;
  mimeType: string;
  /** Optional hint for AI classification (email subject, filename, etc.) */
  hint?: string;
}
