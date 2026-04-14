import type { PermissionKey } from "@cometa/auth";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import type { Env } from "hono";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  orgId?: string;
  permissions: PermissionKey[];
}

export interface GatewayEnv extends Env {
  Variables: {
    user: AuthUser;
    auth: AuthInfo;
  };
}
