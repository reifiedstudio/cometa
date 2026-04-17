import type { CapabilityKey } from "./capabilities";

/**
 * Maps MCP tool names → required capability.
 * The gateway checks this before executing any tool call.
 */
export const TOOL_CAPABILITIES: Record<string, CapabilityKey> = {
  // Documents (Intake)
  list_intake_documents: "documents:list",
  get_intake_document: "documents:read",
  search_intake_documents: "documents:search",
  approve_intake_document: "documents:approve",
  delete_intake_document: "documents:delete",

  // Signatures
  request_signature: "signatures:request",
  get_signature_status: "signatures:read",
  list_signature_requests: "signatures:read",
  cancel_signature: "signatures:cancel",
  nudge_signer: "signatures:nudge",
  add_signer: "signatures:manage",
  remove_signer: "signatures:manage",
  get_audit_trail: "signatures:audit",

  // Tasks
  send_department_message: "tasks:send",
  list_department_tasks: "tasks:read",
  get_task: "tasks:read",
  perform_task_action: "tasks:action",
  get_trace: "tasks:trace",
  start_agent_session: "tasks:agent",

  // Drive
  create_file: "drive:create",
  list_department_files: "drive:list",
  handoff_file: "drive:handoff",
  request_file_access: "drive:access",
  check_file_access: "drive:access",

  // Notes
  create_note: "notes:create",

  // Utilities
  create_branded_document: "utilities:create_document",
  convert_to_pdf: "utilities:convert_pdf",
};

/** Check if a user can call a specific MCP tool */
export function canCallTool(
  toolName: string,
  userCapabilities: string[],
): boolean {
  const required = TOOL_CAPABILITIES[toolName];
  // If tool has no capability mapping, allow by default (unknown tools)
  if (!required) return true;
  return userCapabilities.includes(required);
}

/** Get the required capability for a tool, or undefined if unmapped */
export function getToolCapability(toolName: string): CapabilityKey | undefined {
  return TOOL_CAPABILITIES[toolName];
}
