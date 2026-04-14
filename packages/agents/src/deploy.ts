/**
 * Deploy script — syncs agent definitions to Anthropic Managed Agents API
 * and stores the returned IDs in SSM Parameter Store.
 *
 * Usage: bun run deploy
 *   env: ANTHROPIC_API_KEY, NAME_PREFIX (default: cometa-dev), AWS_REGION
 */
import Anthropic from "@anthropic-ai/sdk";
import { PutParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { tasks } from "./tasks/index.js";
import type { AgentDefinition } from "./types.js";

const client = new Anthropic();
const ssm = new SSMClient({});
const NAME_PREFIX = process.env.NAME_PREFIX ?? "cometa-dev";
const SSM_PREFIX = `/${NAME_PREFIX}/agents`;

async function deployAgent(def: AgentDefinition) {
  console.log(`Deploying agent: ${def.slug}...`);

  const tools: any[] = [];

  // Add MCP toolsets for each connected MCP server
  for (const mcp of def.mcpServers ?? []) {
    tools.push({
      type: "mcp_toolset",
      mcp_server_name: mcp.name,
      permission_policy: "always_allow",
    });
  }

  const agent = await client.beta.agents.create({
    name: def.name,
    model: def.model,
    system: def.system,
    tools,
    mcp_servers: (def.mcpServers ?? []).map((mcp) => ({
      type: "url" as const,
      name: mcp.name,
      url: mcp.url,
    })),
  });

  console.log(`  Agent ID: ${agent.id}, version: ${agent.version}`);

  // Store agent ID in SSM
  await ssm.send(
    new PutParameterCommand({
      Name: `${SSM_PREFIX}/${def.slug}/agent-id`,
      Type: "String",
      Value: agent.id,
      Overwrite: true,
    }),
  );

  console.log(`  Stored in SSM: ${SSM_PREFIX}/${def.slug}/agent-id`);

  return { slug: def.slug, agentId: agent.id, version: agent.version };
}

async function deployEnvironment() {
  console.log("Deploying environment...");

  const environment = await client.beta.environments.create({
    name: `${NAME_PREFIX}-tasks`,
    config: {
      type: "cloud",
      networking: { type: "unrestricted" },
    },
  });

  console.log(`  Environment ID: ${environment.id}`);

  await ssm.send(
    new PutParameterCommand({
      Name: `${SSM_PREFIX}/environment-id`,
      Type: "String",
      Value: environment.id,
      Overwrite: true,
    }),
  );

  console.log(`  Stored in SSM: ${SSM_PREFIX}/environment-id`);

  return { environmentId: environment.id };
}

async function main() {
  console.log(`\nDeploying managed agents (prefix: ${NAME_PREFIX})\n`);

  // Deploy environment first
  const env = await deployEnvironment();

  // Deploy all task agents
  const results = [];
  for (const dept of tasks) {
    const result = await deployAgent(dept);
    results.push(result);
  }

  console.log("\n--- Deployment complete ---\n");
  console.log("Environment:", env.environmentId);
  for (const r of results) {
    console.log(`${r.slug}: ${r.agentId} (v${r.version})`);
  }
  console.log();
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
