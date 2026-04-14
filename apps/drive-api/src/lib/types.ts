import type { PermissionKey } from "@cometa/auth";
import type { Env } from "hono";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  orgId?: string;
  permissions: PermissionKey[];
}

export interface DriveEnv extends Env {
  Variables: {
    user: AuthUser;
  };
}

export interface HandoffPolicy {
  senderAccess: "editor" | "viewer" | "none";
  onComplete: "revoke" | "keep" | "return";
}

export interface Handoff {
  id: string;
  googleDriveFileId: string;
  fileName: string;
  fromDepartment: string | null;
  fromUserId: string;
  fromUserEmail: string;
  toDepartment: string;
  note: string | null;
  taskId: string | null;
  policy: HandoffPolicy;
  status: "active" | "completed";
  createdAt: string;
  completedAt: string | null;
}
