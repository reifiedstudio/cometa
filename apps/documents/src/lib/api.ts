const DOCUMENTS_API_URL = process.env.NEXT_PUBLIC_DOCUMENTS_API_URL ?? "http://localhost:3006";
export const API_URL = DOCUMENTS_API_URL;
const SIGNATURES_API_URL = process.env.NEXT_PUBLIC_SIGNATURES_API_URL ?? "http://localhost:3007";
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "";

// Token getter — set by the app layout once Clerk is available
let _getToken: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  _getToken = fn;
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = _getToken ? await _getToken() : null;
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, { ...options, headers });
}

// ── Documents (via documents-api) ──

export async function fetchDocuments(params?: {
  type?: string;
  status?: string;
  sort?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<any> {
  const searchParams = new URLSearchParams();
  if (params?.type && params.type !== "all") searchParams.set("type", params.type);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.dateFrom) searchParams.set("dateFrom", params.dateFrom);
  if (params?.dateTo) searchParams.set("dateTo", params.dateTo);

  const res = await authFetch(`${DOCUMENTS_API_URL}/api/documents?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function fetchDocument(id: string): Promise<any> {
  const res = await authFetch(`${DOCUMENTS_API_URL}/api/documents/${id}`);
  if (!res.ok) throw new Error("Failed to fetch document");
  return res.json();
}

export async function updateDocument(id: string, data: Record<string, unknown>): Promise<any> {
  const res = await authFetch(`${DOCUMENTS_API_URL}/api/documents/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update document");
  return res.json();
}

export async function uploadDocument(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await authFetch(`${DOCUMENTS_API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload document");
  return res.json();
}

export async function searchDocuments(query: string, type?: string): Promise<any> {
  const searchParams = new URLSearchParams({ q: query });
  if (type && type !== "all") searchParams.set("type", type);

  const res = await authFetch(`${DOCUMENTS_API_URL}/api/search?${searchParams}`);
  if (!res.ok) throw new Error("Failed to search documents");
  return res.json();
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await authFetch(`${DOCUMENTS_API_URL}/api/documents/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete document");
}

export async function restoreDocument(id: string): Promise<any> {
  const res = await authFetch(`${DOCUMENTS_API_URL}/api/documents/${id}/restore`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to restore document");
  return res.json();
}

export async function fetchTrashedDocuments(): Promise<any> {
  const res = await authFetch(`${DOCUMENTS_API_URL}/api/documents?status=rejected`);
  if (!res.ok) throw new Error("Failed to fetch trashed documents");
  return res.json();
}

export async function permanentlyDeleteDocument(id: string): Promise<void> {
  const res = await authFetch(`${DOCUMENTS_API_URL}/api/documents/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete document");
}

export async function reprocessDocument(id: string): Promise<any> {
  const res = await authFetch(`${DOCUMENTS_API_URL}/api/documents/${id}/reprocess`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to reprocess document");
  return res.json();
}

// ── Signatures (via signatures service) ──

export async function requestSignatures(data: {
  documentId: string;
  signerEmails: string[];
  message?: string;
  expiresInDays?: number;
}): Promise<any> {
  // Create a multipart form for the signatures service
  const formData = new FormData();
  formData.append("signerEmails", JSON.stringify(data.signerEmails));
  formData.append("sourceRef", data.documentId);
  if (data.message) formData.append("message", data.message);
  if (data.expiresInDays) formData.append("expiresInDays", String(data.expiresInDays));

  // Get the document file hash from documents-api
  const doc = await fetchDocument(data.documentId);
  formData.append("fileHash", doc.fileHash);
  formData.append("fileName", doc.originalName);

  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to send signature request");
  return res.json();
}

export async function addSignerToRequest(requestId: string, email: string): Promise<any> {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/signers`, {
    method: "POST",
    body: JSON.stringify({ requestId, email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to add signer");
  }
  return res.json();
}

export async function removeSignerFromRequest(signerId: string): Promise<any> {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/signers/${signerId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove signer");
  return res.json();
}

export async function resendSignerEmail(signerId: string): Promise<any> {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/signers/${signerId}/resend`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to resend email");
  return res.json();
}

export async function updateSignatureRequest(
  requestId: string,
  data: { expiresAt?: string | null },
): Promise<any> {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/${requestId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update signature request");
  return res.json();
}

export async function fetchOverdueSignatures(): Promise<any> {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/overdue`);
  if (!res.ok) throw new Error("Failed to fetch overdue signatures");
  return res.json();
}

export async function getSignatureStatus(documentId: string): Promise<any> {
  const res = await authFetch(`${SIGNATURES_API_URL}/api/requests/source/${documentId}`);
  if (!res.ok && res.status !== 404) throw new Error("Failed to get signature status");
  if (res.status === 404) return null;
  return res.json();
}

// ── Audit Logs (via documents-api) ──

export async function fetchAuditLogs(documentId: string): Promise<any> {
  const res = await authFetch(`${DOCUMENTS_API_URL}/api/documents/${documentId}/audit`);
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}

// ── Document Types (via documents-api) ──

export async function fetchDocumentTypes(): Promise<any> {
  const res = await authFetch(`${DOCUMENTS_API_URL}/api/document-types`);
  if (!res.ok) throw new Error("Failed to fetch document types");
  return res.json();
}

export async function fetchDocumentType(id: string): Promise<any> {
  const res = await authFetch(`${DOCUMENTS_API_URL}/api/document-types/${id}`);
  if (!res.ok) throw new Error("Failed to fetch document type");
  return res.json();
}

// ── Department Services (via gateway) ──

export async function fetchServices() {
  const res = await authFetch(`${GATEWAY_URL}/api/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function fetchServiceMessages(slug: string) {
  const res = await authFetch(`${GATEWAY_URL}/api/services/${slug}/messages`);
  if (!res.ok) throw new Error("Failed to fetch service messages");
  return res.json();
}

export async function fetchServiceTasks(slug: string, status?: string) {
  const params = status ? `?status=${status}` : "";
  const res = await authFetch(`${GATEWAY_URL}/api/services/${slug}/tasks${params}`);
  if (!res.ok) throw new Error("Failed to fetch service tasks");
  return res.json();
}

export async function fetchServiceTask(slug: string, taskId: string) {
  const res = await authFetch(`${GATEWAY_URL}/api/services/${slug}/tasks/${taskId}`);
  if (!res.ok) throw new Error("Failed to fetch service task");
  return res.json();
}

export async function sendServiceMessage(
  slug: string,
  body: string,
  options?: { type?: string; traceId?: string; referenceId?: string },
) {
  const res = await authFetch(`${GATEWAY_URL}/api/services/${slug}/messages`, {
    method: "POST",
    body: JSON.stringify({ body, ...options }),
  });
  if (!res.ok) throw new Error("Failed to send service message");
  return res.json();
}

export async function performTaskAction(
  slug: string,
  taskId: string,
  action: string,
  options?: { comment?: string; assignTo?: string },
) {
  const res = await authFetch(`${GATEWAY_URL}/api/services/${slug}/tasks/${taskId}/action`, {
    method: "POST",
    body: JSON.stringify({ action, ...options }),
  });
  if (!res.ok) throw new Error("Failed to perform task action");
  return res.json();
}

export async function fetchTrace(traceId: string) {
  const res = await authFetch(`${GATEWAY_URL}/api/services/traces/${traceId}`);
  if (!res.ok) throw new Error("Failed to fetch trace");
  return res.json();
}

// ── Agent Sessions ──

export async function startTaskSession(slug: string, taskId: string, message: string) {
  const res = await authFetch(`${GATEWAY_URL}/api/services/${slug}/tasks/${taskId}/session`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Failed to start session");
  return res.json();
}

export async function getTaskSessionStatus(slug: string, taskId: string) {
  const res = await authFetch(`${GATEWAY_URL}/api/services/${slug}/tasks/${taskId}/session`);
  if (!res.ok && res.status !== 404) throw new Error("Failed to get session status");
  if (res.status === 404) return null;
  return res.json();
}

export async function sendTaskSessionEvent(slug: string, taskId: string, message: string) {
  const res = await authFetch(
    `${GATEWAY_URL}/api/services/${slug}/tasks/${taskId}/session/events`,
    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
  );
  if (!res.ok) throw new Error("Failed to send session event");
  return res.json();
}

/** Returns an EventSource URL for streaming agent events */
export function getTaskStreamUrl(slug: string, taskId: string): string {
  return `${GATEWAY_URL}/api/services/${slug}/tasks/${taskId}/stream`;
}
