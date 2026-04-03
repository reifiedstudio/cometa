import { Hono } from "hono";
import { db, schema } from "@cometa/db";
import { and, asc, count, desc, eq, like, sql } from "drizzle-orm";

export const documentRoutes = new Hono();

// GET / — List documents with optional filters
documentRoutes.get("/", async (c) => {
  const type = c.req.query("type");
  const status = c.req.query("status");
  const sort = c.req.query("sort") ?? "newest";
  const dateFrom = c.req.query("dateFrom");
  const dateTo = c.req.query("dateTo");

  const conditions = [];

  if (type && type !== "all") {
    conditions.push(eq(schema.documents.type, type as typeof schema.documents.type.enumValues[number]));
  }

  if (status) {
    conditions.push(eq(schema.documents.status, status as typeof schema.documents.status.enumValues[number]));
  }

  if (dateFrom) {
    conditions.push(sql`${schema.documents.receivedAt} >= ${dateFrom}`);
  }

  if (dateTo) {
    conditions.push(sql`${schema.documents.receivedAt} <= ${dateTo}`);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const orderBy =
    sort === "oldest"
      ? asc(schema.documents.receivedAt)
      : desc(schema.documents.receivedAt);

  const [documents, countResults] = await Promise.all([
    db
      .select()
      .from(schema.documents)
      .where(where)
      .orderBy(orderBy),
    db
      .select({
        type: schema.documents.type,
        count: count(),
      })
      .from(schema.documents)
      .groupBy(schema.documents.type),
  ]);

  const totalResult = await db
    .select({ count: count() })
    .from(schema.documents);

  const total = totalResult[0]?.count ?? 0;

  const counts = {
    all: total,
    invoice: 0,
    receipt: 0,
    contract: 0,
    delivery_note: 0,
    bill: 0,
  };

  for (const row of countResults) {
    if (row.type && row.type in counts) {
      counts[row.type as keyof Omit<typeof counts, "all">] = row.count;
    }
  }

  return c.json({ documents, total, counts });
});

// GET /:id — Get single document
documentRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  const [document] = await db
    .select()
    .from(schema.documents)
    .where(eq(schema.documents.id, id))
    .limit(1);

  if (!document) {
    return c.json({ error: "Document not found" }, 404);
  }

  return c.json(document);
});

// PATCH /:id — Update document
documentRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const allowedFields = [
    "status",
    "type",
    "description",
    "isVerified",
    "flags",
  ] as const;

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }

  updates.updatedAt = new Date();

  const [updated] = await db
    .update(schema.documents)
    .set(updates)
    .where(eq(schema.documents.id, id))
    .returning();

  if (!updated) {
    return c.json({ error: "Document not found" }, 404);
  }

  return c.json(updated);
});

// DELETE /:id — Soft delete (move to bin)
documentRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const [deleted] = await db
    .update(schema.documents)
    .set({
      status: "reviewed" as const,
      updatedAt: new Date(),
    })
    .where(eq(schema.documents.id, id))
    .returning();

  if (!deleted) {
    return c.json({ error: "Document not found" }, 404);
  }

  return c.json({ id: deleted.id, status: "deleted" });
});
