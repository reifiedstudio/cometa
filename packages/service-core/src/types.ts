export interface ServiceMessage {
  id: string;
  traceId: string;
  from: string;
  to: string;
  type: "message" | "task" | "document" | "approval" | "action" | "system";
  body: string;
  referenceId?: string;
  /** Structured data for rich message types */
  data?: MessageData;
  attachments?: Attachment[];
  status: "queued" | "processing" | "completed" | "failed";
  error?: string;
  userId?: string;
  userEmail?: string;
  timestamp: string;
}

/** Typed data payloads for different message types */
export interface MessageData {
  /** type: "task" — linked task in another department */
  linkedTaskId?: string;
  linkedDepartment?: string;
  linkedTaskStatus?: string;
  /** type: "document" — reference to a document */
  documentId?: string;
  documentName?: string;
  documentType?: string;
  documentUrl?: string;
  /** type: "approval" — approval result */
  decision?: "approved" | "rejected";
  approvedBy?: string;
  /** Generic key-value for extensibility */
  [key: string]: unknown;
}

export interface Attachment {
  type: string;
  url: string;
  name?: string;
}

export interface Task {
  id: string;
  department: string;
  traceId: string;
  type: string;
  status: "open" | "in_progress" | "review" | "done";
  assignedTo?: string;
  /** Email or service slug of who originally requested this task. Used by the My Requests view. */
  requestedBy?: string;
  body: string;
  messages: string[];
  metadata?: Record<string, unknown>;
  sessionId?: string;
  /** Set the first time an agent posts a meaningful action (e.g. log_activity) against this task. */
  seenByAgent?: { sessionId?: string; at: string };
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  userId: string;
  userEmail: string;
  orgId: string;
  title: string;
  snippet: string;
  s3Key: string;
  template?: string;
  starred: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AutomationMode = "fully-automated" | "automated-with-approval" | "manual";

export interface ServiceConfig {
  name: string;
  guidance: string;
  automationModes?: Record<string, AutomationMode>;
}
