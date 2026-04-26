const SIGNATURES_API_URL =
  process.env.NEXT_PUBLIC_SIGNATURES_API_URL ??
  "https://mcp.daniellourie.me/api/signatures";

let _getToken: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  _getToken = fn;
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = _getToken ? await _getToken() : null;
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, { ...options, headers });
}

// Signature requests
export async function listSignatureRequests(params?: { status?: string; limit?: number }) {
  const sp = new URLSearchParams();
  if (params?.status) sp.set("status", params.status);
  if (params?.limit) sp.set("limit", String(params.limit));
  const res = await authFetch(`${SIGNATURES_API_URL}/requests?${sp}`);
  if (!res.ok) throw new Error("Failed to fetch signature requests");
  return res.json();
}

export async function getSignatureRequest(id: string) {
  const res = await authFetch(`${SIGNATURES_API_URL}/requests/${id}`);
  if (!res.ok) throw new Error("Failed to fetch signature request");
  return res.json();
}

export async function getSignatureStatus(idOrSourceRef: string) {
  // Try source ref first, then request ID
  const sourceRes = await authFetch(`${SIGNATURES_API_URL}/requests/source/${idOrSourceRef}`);
  if (sourceRes.ok) return sourceRes.json();

  const idRes = await authFetch(`${SIGNATURES_API_URL}/requests/${idOrSourceRef}`);
  if (idRes.ok) {
    const data = await idRes.json();
    // Normalize shape to match source ref response
    return { id: data.request.id, status: data.request.status, message: data.request.message, signers: data.signers, createdAt: data.request.createdAt, expiresAt: data.request.expiresAt };
  }

  return null;
}

export async function createSignatureRequest(data: FormData) {
  const res = await authFetch(`${SIGNATURES_API_URL}/requests`, {
    method: "POST",
    body: data,
  });
  if (!res.ok) throw new Error("Failed to create signature request");
  return res.json();
}

export async function addSignerToRequest(requestId: string, email: string) {
  const res = await authFetch(`${SIGNATURES_API_URL}/requests/signers`, {
    method: "POST",
    body: JSON.stringify({ requestId, email }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || "Failed to add signer");
  }
  return res.json();
}

export async function removeSignerFromRequest(signerId: string) {
  const res = await authFetch(`${SIGNATURES_API_URL}/requests/signers/${signerId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove signer");
  return res.json();
}

export async function resendSignerEmail(signerId: string) {
  const res = await authFetch(`${SIGNATURES_API_URL}/requests/signers/${signerId}/resend`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to resend email");
  return res.json();
}

export async function updateSignatureRequest(
  requestId: string,
  data: { expiresAt?: string | null },
) {
  const res = await authFetch(`${SIGNATURES_API_URL}/requests/${requestId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update signature request");
  return res.json();
}

export async function getRequestDocument(requestId: string) {
  const res = await authFetch(`${SIGNATURES_API_URL}/requests/${requestId}/document`);
  if (!res.ok) throw new Error("Failed to get document");
  return res.json() as Promise<{ url: string; mimeType: string; fileName: string }>;
}

export async function fetchOverdueSignatures() {
  const res = await authFetch(`${SIGNATURES_API_URL}/requests/overdue`);
  if (!res.ok) throw new Error("Failed to fetch overdue");
  return res.json();
}
