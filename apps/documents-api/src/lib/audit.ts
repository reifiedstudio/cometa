import { db, schema } from "@cometa/db";

export async function logAudit(
  documentId: string,
  action: string,
  detail: string,
  user?: { id: string; email: string } | null,
  previousValue?: string | null,
  newValue?: string | null,
) {
  try {
    await db.insert(schema.auditLogs).values({
      documentId,
      action,
      detail,
      previousValue: previousValue ?? null,
      newValue: newValue ?? null,
      userId: user?.id ?? null,
      userEmail: user?.email ?? null,
    });
  } catch (err) {
    console.error("[audit] Failed to log:", err);
  }
}
