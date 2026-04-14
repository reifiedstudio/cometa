import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getNote, queryAllNotes, updateNote } from "@cometa/service-core";
import { Hono } from "hono";
import type { GatewayEnv } from "../lib/types.js";

const s3 = new S3Client({});
const NOTES_BUCKET = process.env["NOTES_BUCKET"] ?? "cometa-dev-use1-notes-content";

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

  const command = new GetObjectCommand({
    Bucket: NOTES_BUCKET,
    Key: note.s3Key,
  });
  const contentUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

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
