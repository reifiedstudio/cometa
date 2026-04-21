const SIGNATURES_API_URL =
  process.env.NEXT_PUBLIC_SIGNATURES_API_URL ??
  "https://ortmehx5z6apdjfl3lfylhjzce0gvjdr.lambda-url.us-east-1.on.aws";

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
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests?${sp}`);
  if (!res.ok) throw new Error("Failed to fetch signature requests");
  return res.json();
}

export async function getSignatureRequest(id: string) {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/${id}`);
  if (!res.ok) throw new Error("Failed to fetch signature request");
  return res.json();
}

export async function getSignatureStatus(sourceRef: string) {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/source/${sourceRef}`);
  if (!res.ok && res.status !== 404) throw new Error("Failed to get signature status");
  if (res.status === 404) return null;
  return res.json();
}

export async function createSignatureRequest(data: FormData) {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests`, {
    method: "POST",
    body: data,
  });
  if (!res.ok) throw new Error("Failed to create signature request");
  return res.json();
}

export async function addSignerToRequest(requestId: string, email: string) {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/signers`, {
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
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/signers/${signerId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove signer");
  return res.json();
}

export async function resendSignerEmail(signerId: string) {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/signers/${signerId}/resend`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to resend email");
  return res.json();
}

export async function updateSignatureRequest(
  requestId: string,
  data: { expiresAt?: string | null },
) {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/${requestId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update signature request");
  return res.json();
}

export async function fetchOverdueSignatures() {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/overdue`);
  if (!res.ok) throw new Error("Failed to fetch overdue");
  return res.json();
}
