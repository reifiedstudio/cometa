export interface ServiceMessage {
  id: string;
  traceId: string;
  from: string;
  to: string;
  type: "task" | "approval" | "action" | "system";
  body: string;
  referenceId?: string;
  attachments?: Attachment[];
  status: "queued" | "processing" | "completed" | "failed";
  error?: string;
  userId?: string;
  userEmail?: string;
  timestamp: string;
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
  status: "pending" | "assigned" | "processing" | "awaiting_approval" | "completed" | "failed";
  assignedTo?: string;
  body: string;
  messages: string[];
  metadata?: Record<string, unknown>;
  sessionId?: string;
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
