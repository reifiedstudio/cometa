export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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

  const res = await fetch(`${API_URL}/api/documents?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function fetchDocument(id: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/documents/${id}`);
  if (!res.ok) throw new Error("Failed to fetch document");
  return res.json();
}

export async function updateDocument(id: string, data: Record<string, unknown>): Promise<any> {
  const res = await fetch(`${API_URL}/api/documents/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update document");
  return res.json();
}

export async function uploadDocument(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload document");
  return res.json();
}

export async function searchDocuments(query: string, type?: string): Promise<any> {
  const searchParams = new URLSearchParams({ q: query });
  if (type && type !== "all") searchParams.set("type", type);

  const res = await fetch(`${API_URL}/api/search?${searchParams}`);
  if (!res.ok) throw new Error("Failed to search documents");
  return res.json();
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/documents/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete document");
}

export async function restoreDocument(id: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/documents/${id}/restore`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to restore document");
  return res.json();
}

export async function fetchTrashedDocuments(): Promise<any> {
  const res = await fetch(`${API_URL}/api/documents?status=rejected`);
  if (!res.ok) throw new Error("Failed to fetch trashed documents");
  return res.json();
}

export async function permanentlyDeleteDocument(id: string): Promise<void> {
  // For now uses the same delete endpoint — later can add a permanent delete
  const res = await fetch(`${API_URL}/api/documents/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete document");
}

export async function reprocessDocument(id: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/documents/${id}/reprocess`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to reprocess document");
  return res.json();
}
