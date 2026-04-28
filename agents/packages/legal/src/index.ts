import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AgentDefinition } from "@cometa/agents-sdk";
import { parse } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(join(__dirname, "../agent.yaml"), "utf-8");
const config = parse(raw);

function resolveEnv(value: string): string {
  return value.replace(/\$\{([A-Z_][A-Z0-9_]*)(?::-([^}]*))?\}/g, (_, name, fallback) => {
    return process.env[name] ?? fallback ?? "";
  });
}

export const legal: AgentDefinition = {
  slug: config.slug,
  name: config.name,
  model: config.model,
  system: config.system,
  mcpServers: (config.mcp_servers ?? [])
    .map((s: any) => ({ name: s.name, url: resolveEnv(s.url) }))
    .filter((s: { url: string }) => s.url.length > 0),
  builtinTools: config.builtin_tools ?? [],
  metadata: config.metadata,
};
