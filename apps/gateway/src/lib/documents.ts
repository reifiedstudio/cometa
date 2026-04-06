/**
 * Shared document operations used by both REST routes and MCP tools.
 * Falls back to mock data when DATABASE_URL is not set (dev mode).
 */
import { mockDocuments, mockCounts } from "./mock-documents.js";

const USE_MOCK = !process.env.DATABASE_URL;

export interface ListDocumentsParams {
  type?: string;
  status?: string;
  sort?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ── Mock implementations ──

function mockList(params: ListDocumentsParams = {}) {
  let docs = [...mockDocuments];

  if (params.type && params.type !== "all") {
    docs = docs.filter((d) => d.type === params.type);
  }
  if (params.status) {
    docs = docs.filter((d) => d.status === params.status);
  }
  if (params.dateFrom) {
    docs = docs.filter((d) => d.receivedAt >= params.dateFrom!);
  }
  if (params.dateTo) {
    docs = docs.filter((d) => d.receivedAt <= params.dateTo!);
  }
  if (params.sort === "oldest") {
    docs.sort((a, b) => a.receivedAt.localeCompare(b.receivedAt));
  } else {
    docs.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  }

  return { documents: docs, total: docs.length, counts: mockCounts };
}

function mockGet(id: string) {
  return mockDocuments.find((d) => d.id === id) ?? null;
}

function mockSearch(query: string, type?: string) {
  const q = query.toLowerCase();
  let docs = mockDocuments.filter(
    (d) =>
      d.description?.toLowerCase().includes(q) ||
      d.aiSummary?.toLowerCase().includes(q) ||
      d.ocrText?.toLowerCase().includes(q),
  );
  if (type && type !== "all") {
    docs = docs.filter((d) => d.type === type);
  }
  return { documents: docs, total: docs.length };
}

function mockApprove(id: string) {
  const doc = mockDocuments.find((d) => d.id === id);
  if (!doc) return null;
  return { ...doc, status: "approved" as const, updatedAt: new Date().toISOString() };
}

function mockDelete(id: string) {
  const doc = mockDocuments.find((d) => d.id === id);
  if (!doc) return null;
  return { ...doc, status: "rejected" as const, updatedAt: new Date().toISOString() };
}

// ── Real implementations ──

async function dbList(params: ListDocumentsParams = {}) {
  const { db, schema } = await import("@cometa/db");
  const { and, asc, count, desc, eq, ne, sql } = await import("drizzle-orm");

  const { type, status, sort = "newest", dateFrom, dateTo } = params;
  const conditions = [];

  if (status !== "rejected") {
    conditions.push(ne(schema.documents.status, "rejected"));
  }
  if (type && type !== "all") {
    conditions.push(eq(schema.documents.type, type as (typeof schema.documents.type.enumValues)[number]));
  }
  if (status) {
    conditions.push(eq(schema.documents.status, status as (typeof schema.documents.status.enumValues)[number]));
  }
  if (dateFrom) {
    conditions.push(sql`${schema.documents.receivedAt} >= ${dateFrom}`);
  }
  if (dateTo) {
    conditions.push(sql`${schema.documents.receivedAt} <= ${dateTo}`);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const orderBy = sort === "oldest" ? asc(schema.documents.receivedAt) : desc(schema.documents.receivedAt);

  const [documents, countResults, totalResult] = await Promise.all([
    db.select().from(schema.documents).where(where).orderBy(orderBy),
    db.select({ type: schema.documents.type, count: count() }).from(schema.documents).groupBy(schema.documents.type),
    db.select({ count: count() }).from(schema.documents),
  ]);

  const total = totalResult[0]?.count ?? 0;
  const counts: Record<string, number> = { all: total, invoice: 0, receipt: 0, contract: 0, delivery_note: 0, bill: 0 };
  for (const row of countResults) {
    if (row.type && row.type in counts) counts[row.type] = row.count;
  }

  return { documents, total, counts };
}

async function dbGet(id: string) {
  const { db, schema } = await import("@cometa/db");
  const { eq } = await import("drizzle-orm");
  const [doc] = await db.select().from(schema.documents).where(eq(schema.documents.id, id)).limit(1);
  return doc ?? null;
}

async function dbSearch(query: string, type?: string) {
  const { db, schema } = await import("@cometa/db");
  const { and, desc, eq, or, sql } = await import("drizzle-orm");
  const searchPattern = `%${query}%`;
  const conditions = [
    or(
      sql`${schema.documents.description} ILIKE ${searchPattern}`,
      sql`${schema.documents.aiSummary} ILIKE ${searchPattern}`,
      sql`${schema.documents.ocrText} ILIKE ${searchPattern}`,
    ),
  ];
  if (type && type !== "all") {
    conditions.push(eq(schema.documents.type, type as (typeof schema.documents.type.enumValues)[number]));
  }
  const documents = await db.select().from(schema.documents).where(and(...conditions)).orderBy(desc(schema.documents.receivedAt));
  return { documents, total: documents.length };
}

async function dbApprove(id: string) {
  const { db, schema } = await import("@cometa/db");
  const { eq } = await import("drizzle-orm");
  const [updated] = await db.update(schema.documents).set({ status: "approved" as const, updatedAt: new Date() }).where(eq(schema.documents.id, id)).returning();
  return updated ?? null;
}

async function dbDelete(id: string) {
  const { db, schema } = await import("@cometa/db");
  const { eq } = await import("drizzle-orm");
  const [deleted] = await db.update(schema.documents).set({ status: "rejected" as const, updatedAt: new Date() }).where(eq(schema.documents.id, id)).returning();
  return deleted ?? null;
}

// ── Exports (pick mock or real based on env) ──

export async function listDocuments(params: ListDocumentsParams = {}) {
  if (USE_MOCK) return mockList(params);
  return dbList(params);
}

export async function getDocument(id: string) {
  if (USE_MOCK) return mockGet(id);
  return dbGet(id);
}

export async function searchDocuments(query: string, type?: string) {
  if (USE_MOCK) return mockSearch(query, type);
  return dbSearch(query, type);
}

export async function approveDocument(id: string) {
  if (USE_MOCK) return mockApprove(id);
  return dbApprove(id);
}

export async function deleteDocument(id: string) {
  if (USE_MOCK) return mockDelete(id);
  return dbDelete(id);
}
