import { createStorage } from "@cometa/storage";
import { getNote, queryAllNotes, updateNote } from "@cometa/service-core";
import { Hono } from "hono";
import type { GatewayEnv } from "../lib/types.js";

const notesStorage = createStorage({
  bucket: process.env["NOTES_BUCKET"],
  prefix: process.env["NOTES_PREFIX"] ?? "notes/",
});

export const noteRoutes = new Hono<GatewayEnv>();

// List all notes (any authenticated user)
noteRoutes.get("/", async (c) => {
  const result = await queryAllNotes();
  return c.json({ notes: result.items });
});

// Get single note + presigned URL for content
noteRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const note = await getNote(id);
  if (!note) return c.json({ error: "Note not found" }, 404);

  const contentUrl = await notesStorage.getSignedUrl(note.s3Key, 900);
  return c.json({ ...note, contentUrl });
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
