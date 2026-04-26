import { createStorage } from "@cometa/storage";

export const storage = createStorage({
  bucket: process.env["S3_BUCKET"],
  prefix: process.env["NOTES_PREFIX"] ?? "notes/",
});
