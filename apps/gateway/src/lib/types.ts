import type { Env } from "hono";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface GatewayEnv extends Env {
  Variables: {
    user: AuthUser;
    auth: AuthInfo;
  };
}
