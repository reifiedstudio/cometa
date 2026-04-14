import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AgentDefinition } from "@cometa/agents-sdk";
import { parse } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(join(__dirname, "../agent.yaml"), "utf-8");
const config = parse(raw);

const TASKS_MCP_URL =
  process.env.TASKS_MCP_URL ??
  "https://agfgro77yt22bbazajupls2ebu0jvfcn.lambda-url.us-east-1.on.aws/mcp";

export const accounting: AgentDefinition = {
  slug: config.slug,
  name: config.name,
  model: config.model,
  system: config.system,
  mcpServers: (config.mcp_servers ?? []).map((s: any) => ({
    name: s.name,
    url: s.url.replace(/\$\{TASKS_MCP_URL:-[^}]+\}/, TASKS_MCP_URL),
  })),
  metadata: config.metadata,
};
