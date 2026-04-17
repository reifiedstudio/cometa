const API_URL =
  process.env.NEXT_PUBLIC_TASKS_API_URL ??
  "https://c5c2pqmpitjtmcaqfx63cd43bq0mxzmr.lambda-url.us-east-1.on.aws";

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });
}

// ── Services ──

export async function fetchServices() {
  const res = await apiFetch("/api/services");
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

// ── Messages ──

export async function fetchMessages(slug: string) {
  const res = await apiFetch(`/api/services/${slug}/messages`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function sendMessage(
  slug: string,
  body: string,
  options?: { type?: string; traceId?: string; referenceId?: string },
) {
  const res = await apiFetch(`/api/services/${slug}/messages`, {
    method: "POST",
    body: JSON.stringify({ body, ...options }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

// ── Tasks ──

export async function fetchTasks(slug: string, status?: string) {
  const params = status ? `?status=${status}` : "";
  const res = await apiFetch(`/api/services/${slug}/tasks${params}`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function fetchTask(slug: string, taskId: string) {
  const res = await apiFetch(`/api/services/${slug}/tasks/${taskId}`);
  if (!res.ok) throw new Error("Failed to fetch task");
  return res.json();
}

export async function performAction(
  slug: string,
  taskId: string,
  action: string,
  options?: { comment?: string },
) {
  const res = await apiFetch(`/api/services/${slug}/tasks/${taskId}/action`, {
    method: "POST",
    body: JSON.stringify({ action, ...options }),
  });
  if (!res.ok) throw new Error("Failed to perform action");
  return res.json();
}

// ── Traces ──

export async function fetchTrace(traceId: string) {
  const res = await apiFetch(`/api/services/traces/${traceId}`);
  if (!res.ok) throw new Error("Failed to fetch trace");
  return res.json();
}

// ── Sessions ──

export async function getSessionStatus(slug: string, taskId: string) {
  const res = await apiFetch(`/api/services/${slug}/tasks/${taskId}/session`);
  if (!res.ok && res.status !== 404) throw new Error("Failed to get session");
  if (res.status === 404) return null;
  return res.json();
}

export function getStreamUrl(slug: string, taskId: string): string {
  return `${API_URL}/api/services/${slug}/tasks/${taskId}/stream`;
}
