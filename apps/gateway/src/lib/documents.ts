/**
 * Document operations — proxied to documents-api Lambda via HTTP.
 * No longer uses direct DB access.
 */

const DOCUMENTS_API_URL = process.env["DOCUMENTS_API_URL"] ?? "http://localhost:3006";

export interface ListDocumentsParams {
  type?: string;
  status?: string;
  sort?: string;
  dateFrom?: string;
  dateTo?: string;
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${DOCUMENTS_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`documents-api ${path} returned ${res.status}: ${body}`);
  }
  return res.json();
}

export async function listDocuments(params: ListDocumentsParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.type && params.type !== "all") searchParams.set("type", params.type);
  if (params.status) searchParams.set("status", params.status);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) searchParams.set("dateTo", params.dateTo);

  return apiFetch(`/api/documents?${searchParams}`);
}

export async function getDocument(id: string) {
  try {
    return await apiFetch(`/api/documents/${id}`);
  } catch {
    return null;
  }
}

export async function searchDocuments(query: string, type?: string) {
  const searchParams = new URLSearchParams({ q: query });
  if (type && type !== "all") searchParams.set("type", type);
  return apiFetch(`/api/search?${searchParams}`);
}

export async function approveDocument(id: string) {
  try {
    return await apiFetch(`/api/documents/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "approved" }),
    });
  } catch {
    return null;
  }
}

export async function deleteDocument(id: string) {
  try {
    return await apiFetch(`/api/documents/${id}`, { method: "DELETE" });
  } catch {
    return null;
  }
}
