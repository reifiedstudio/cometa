import { getNote, putNote, queryAllNotes, updateNote } from "@cometa/service-core";
import { Hono } from "hono";
import { sendNoteCreatedEmail } from "../lib/email.js";
import { storage } from "../lib/s3.js";
import type { NotesEnv } from "../lib/types.js";

const NOTES_DOMAIN = process.env["NOTES_DOMAIN"] ?? "notes.daniellourie.me";

export const noteRoutes = new Hono<NotesEnv>();

// List all notes
noteRoutes.get("/", async (c) => {
  const result = await queryAllNotes();
  return c.json({ notes: result.items });
});

// Get single note + presigned URL for content
noteRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const note = await getNote(id);
  if (!note) return c.json({ error: "Note not found" }, 404);

  const contentUrl = await storage.getSignedUrl(note.s3Key, 900);
  return c.json({ ...note, contentUrl });
});

// Create a new note
noteRoutes.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{
    title: string;
    content: string;
    template?: string;
  }>();

  if (!body.title || !body.content) {
    return c.json({ error: "title and content are required" }, 400);
  }

  const slug = body.template ?? "note";
  const id = `${slug}-${Date.now()}`;
  const filename = `${id}.md`;

  await storage.upload(filename, Buffer.from(body.content, "utf-8"), "text/markdown; charset=utf-8");
  const s3Key = storage.fullKey(filename);

  const cleaned = body.content
    .replace(/[#*`>\-\[\]()!|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const snippet = cleaned.length > 200 ? cleaned.slice(0, 197) + "..." : cleaned;
  const now = new Date().toISOString();

  await putNote({
    id,
    userId: user.id,
    userEmail: user.email ?? "",
    orgId: user.orgId ?? "",
    title: body.title,
    snippet,
    s3Key,
    template: body.template,
    starred: false,
    deleted: false,
    createdAt: now,
    updatedAt: now,
  });

  const url = `https://${NOTES_DOMAIN}/view/${id}`;

  // Send confirmation email (fire-and-forget)
  if (user.email) {
    try {
      await sendNoteCreatedEmail({
        to: user.email,
        title: body.title,
        snippet,
        noteId: id,
      });
    } catch (err) {
      console.error("[notes] Failed to send email:", err);
    }
  }

  return c.json({ id, title: body.title, snippet, url, s3Key, createdAt: now }, 201);
});

// Star/unstar a note
noteRoutes.patch("/:id/star", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{ starred: boolean }>();
  await updateNote(id, { starred: body.starred });
  return c.json({ id, starred: body.starred });
});

// Soft-delete a note
noteRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await updateNote(id, { deleted: true });
  return c.json({ id, deleted: true });
});
