/**
 * Bootstrap a shared vault for MCP static-bearer credentials.
 *
 * Run once (or whenever rotating the token / adding new MCP servers).
 *
 *   ANTHROPIC_API_KEY=... \
 *   MCP_AUTH_TOKEN=... \
 *   TASKS_MCP_URL=... INTAKE_MCP_URL=... NOTES_MCP_URL=... SIGNATURES_MCP_URL=... \
 *   bun run agents/bootstrap-vault.ts
 *
 * Stores the vault ID in SSM at /<NAME_PREFIX>/agents/vault-id.
 */
import Anthropic from "@anthropic-ai/sdk";
import { PutParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

const client = new Anthropic();
const ssm = new SSMClient({});

const NAME_PREFIX = process.env.NAME_PREFIX ?? "cometa-dev";
const SSM_PREFIX = `/${NAME_PREFIX}/agents`;

const TOKEN = process.env.MCP_AUTH_TOKEN;
if (!TOKEN) {
  console.error("MCP_AUTH_TOKEN env var is required");
  process.exit(1);
}

const URLS: Record<string, string | undefined> = {
  tasks: process.env.TASKS_MCP_URL,
  intake: process.env.INTAKE_MCP_URL,
  notes: process.env.NOTES_MCP_URL,
  signatures: process.env.SIGNATURES_MCP_URL,
};

for (const [name, url] of Object.entries(URLS)) {
  if (!url) {
    console.error(`${name.toUpperCase()}_MCP_URL is required`);
    process.exit(1);
  }
}

async function main() {
  console.log(`\nBootstrapping MCP vault (prefix: ${NAME_PREFIX})\n`);

  const reuseId = process.env.VAULT_ID;
  const vault = reuseId
    ? await client.beta.vaults.retrieve(reuseId)
    : await client.beta.vaults.create({ display_name: "Cometa MCP" });
  console.log(`Vault: ${vault.id}${reuseId ? " (reused)" : ""}`);

  for (const [name, url] of Object.entries(URLS)) {
    const cred = await client.beta.vaults.credentials.create(vault.id, {
      display_name: `mcp-${name}`,
      auth: {
        type: "static_bearer",
        token: TOKEN as string,
        mcp_server_url: url as string,
      },
    });
    console.log(`  credential ${name}: ${cred.id} → ${url}`);
  }

  await ssm.send(
    new PutParameterCommand({
      Name: `${SSM_PREFIX}/vault-id`,
      Type: "String",
      Value: vault.id,
      Overwrite: true,
    }),
  );
  console.log(`\nStored in SSM: ${SSM_PREFIX}/vault-id`);
}

main().catch((err) => {
  console.error("Vault bootstrap failed:", err);
  process.exit(1);
});
