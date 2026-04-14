export interface McpServerRef {
  /** Unique name for this MCP server (used to reference in tools) */
  name: string;
  /** Public URL of the MCP server */
  url: string;
}

export interface AgentDefinition {
  /** Unique slug used for SSM keys and service discovery */
  slug: string;
  /** Display name */
  name: string;
  /** Claude model to use */
  model: string;
  /** System prompt — the task's guidance */
  system: string;
  /** MCP servers this agent connects to */
  mcpServers?: McpServerRef[];
}

export interface EnvironmentDefinition {
  name: string;
  networking: "unrestricted" | "restricted";
}

export interface DeployedAgent {
  slug: string;
  agentId: string;
  version: number;
}

export interface DeployedEnvironment {
  environmentId: string;
}

export interface AgentEvent {
  type: string;
  [key: string]: unknown;
}
