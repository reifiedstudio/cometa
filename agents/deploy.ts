import { accounting } from "@cometa/agent-accounting";
import { legal } from "@cometa/agent-legal";
/**
 * Deploy all agents to Anthropic Managed Agents API.
 *
 * Usage: bun run deploy
 *   env: ANTHROPIC_API_KEY, NAME_PREFIX (default: cometa-dev), AWS_REGION
 */
import { deployAll } from "@cometa/agents-sdk";

deployAll([accounting, legal]).catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
