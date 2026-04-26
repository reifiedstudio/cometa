import type { PermissionKey } from "@cometa/auth";
import type { Env } from "hono";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  orgId?: string;
  permissions: PermissionKey[];
}

export interface NotesEnv extends Env {
  Variables: {
    user: AuthUser;
  };
}
