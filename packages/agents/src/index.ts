// Re-export from new agents SDK
export {
  startSession,
  sendSessionEvent,
  streamSession,
  getSession,
  archiveSession,
  getAgentId,
  getEnvironmentId,
  deployAll,
} from "@cometa/agents-sdk";
export type {
  StartSessionOptions,
  SessionInfo,
  AgentDefinition,
  McpServerRef,
  DeployedAgent,
  DeployedEnvironment,
  AgentEvent,
} from "@cometa/agents-sdk";

// Re-export task definitions for backwards compat
import { accounting } from "@cometa/agent-accounting";
import { legal } from "@cometa/agent-legal";

export const tasks = [accounting, legal];
export { accounting, legal };
