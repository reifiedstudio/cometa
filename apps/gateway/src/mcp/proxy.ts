/**
 * MCP Proxy — discovers tools from upstream MCP servers via their
 * /mcp/tools REST endpoint and forwards tool calls via raw JSON-RPC.
 * Cached in-memory so warm Lambda invocations skip the discovery round-trip.
 */

export interface UpstreamTool {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

interface ToolCache {
  tools: UpstreamTool[];
  fetchedAt: number;
}

// Module-scoped cache per URL — survives across warm Lambda invocations
const cacheMap = new Map<string, ToolCache>();
const CACHE_TTL = 5 * 60_000; // 5 minutes

// Expose last proxy error so /mcp/tools can surface it
let lastProxyError: { url: string; message: string; timestamp: string } | undefined;
export function getProxyStatus() {
  return lastProxyError;
}

async function fetchTools(url: string): Promise<UpstreamTool[]> {
  const catalogUrl = url.replace(/\/mcp\/?$/, "/mcp/tools");
  const res = await fetch(catalogUrl);
  if (!res.ok) {
    throw new Error(`Upstream tool catalog returned ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { tools: UpstreamTool[] };
  return data.tools;
}

export async function getUpstreamTools(url: string): Promise<UpstreamTool[]> {
  const cached = cacheMap.get(url);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.tools;
  }
  try {
    const tools = await fetchTools(url);
    cacheMap.set(url, { tools, fetchedAt: Date.now() });
    lastProxyError = undefined;
    return tools;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    lastProxyError = { url, message: msg, timestamp: new Date().toISOString() };
    throw err;
  }
}

/**
 * Forward a tool call to the upstream MCP server via raw JSON-RPC.
 */
export async function callUpstreamTool(url: string, name: string, args: Record<string, unknown>) {
  // Step 1: Initialize to get a session
  const initRes = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "cometa-gateway", version: "0.1.0" },
      },
    }),
  });

  const sessionId = initRes.headers.get("mcp-session-id");
  const initBody = await initRes.text();
  const initData = initBody.match(/data: (.+)/)?.[1];
  if (!initData) throw new Error("No initialize response");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;

  // Step 2: Send initialized notification
  await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "notifications/initialized",
    }),
  });

  // Step 3: Call the tool
  const toolRes = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });

  const toolBody = await toolRes.text();
  const toolData = toolBody.match(/data: (.+)/)?.[1];
  if (!toolData) throw new Error(`No tool response for ${name}`);

  const parsed = JSON.parse(toolData);
  if (parsed.error) throw new Error(parsed.error.message);
  return parsed.result;
}
