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
  /** Built-in agent toolset names to enable (e.g. "web_fetch", "web_search"). Everything else stays disabled. */
  builtinTools?: BuiltinToolName[];
  /** Custom skills (uploaded .md files) */
  skills?: SkillDefinition[];
  /** Metadata attached to the agent */
  metadata?: Record<string, string>;
}

export type BuiltinToolName =
  | "bash"
  | "edit"
  | "read"
  | "write"
  | "glob"
  | "grep"
  | "web_fetch"
  | "web_search";

export interface SkillDefinition {
  /** Skill name */
  name: string;
  /** Local file path relative to the agent package */
  file: string;
  /** Description shown to the model */
  description: string;
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
