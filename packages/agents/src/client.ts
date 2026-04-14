/**
 * Managed agents client — used by Lambdas and gateway to start/stream sessions.
 * Reads agent and environment IDs from SSM.
 */
import Anthropic from "@anthropic-ai/sdk";
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import type { AgentEvent } from "./types.js";

const anthropic = new Anthropic();
const ssm = new SSMClient({});

const NAME_PREFIX = process.env.NAME_PREFIX ?? "cometa-dev";
const SSM_PREFIX = `/${NAME_PREFIX}/agents`;

// In-memory cache for IDs (they rarely change)
const cache = new Map<string, string>();

async function getParam(name: string): Promise<string> {
  const cached = cache.get(name);
  if (cached) return cached;

  const result = await ssm.send(new GetParameterCommand({ Name: name }));

  const value = result.Parameter?.Value;
  if (!value) throw new Error(`SSM parameter not found: ${name}`);

  cache.set(name, value);
  return value;
}

/** Get the agent ID for a task slug */
export async function getAgentId(slug: string): Promise<string> {
  return getParam(`${SSM_PREFIX}/${slug}/agent-id`);
}

/** Get the shared environment ID */
export async function getEnvironmentId(): Promise<string> {
  return getParam(`${SSM_PREFIX}/environment-id`);
}

export interface StartSessionOptions {
  /** Task slug (e.g. 'accounting') */
  slug: string;
  /** Initial message to send to the agent */
  message: string;
  /** Optional session title */
  title?: string;
}

export interface SessionInfo {
  sessionId: string;
  agentId: string;
  environmentId: string;
}

/**
 * Start a new managed agent session for a task.
 * Creates the session and sends the initial user message.
 * Returns immediately — the agent runs on Anthropic's infrastructure.
 */
export async function startSession(options: StartSessionOptions): Promise<SessionInfo> {
  const [agentId, environmentId] = await Promise.all([
    getAgentId(options.slug),
    getEnvironmentId(),
  ]);

  // Create session
  const session = await anthropic.beta.sessions.create({
    agent: agentId,
    environment_id: environmentId,
    title: options.title ?? `${options.slug}: ${options.message.slice(0, 80)}`,
  });

  // Send initial user message (fire and forget — agent starts running)
  await anthropic.beta.sessions.events.send(session.id, {
    events: [
      {
        type: "user.message",
        content: [{ type: "text", text: options.message }],
      },
    ],
  });

  return {
    sessionId: session.id,
    agentId,
    environmentId,
  };
}

/**
 * Send a follow-up message to an existing session.
 * Used for human actions (approve/reject) or steering.
 */
export async function sendSessionEvent(sessionId: string, message: string): Promise<void> {
  await anthropic.beta.sessions.events.send(sessionId, {
    events: [
      {
        type: "user.message",
        content: [{ type: "text", text: message }],
      },
    ],
  });
}

/**
 * Stream events from a session. Returns an async iterator.
 * Use this for real-time streaming to the frontend.
 */
export async function streamSession(sessionId: string) {
  return anthropic.beta.sessions.events.stream(sessionId);
}

/**
 * Get session status.
 */
export async function getSession(sessionId: string) {
  return anthropic.beta.sessions.retrieve(sessionId);
}

/**
 * Archive a completed session.
 */
export async function archiveSession(sessionId: string) {
  return anthropic.beta.sessions.archive(sessionId);
}
