import { NoteCreatedEmail, sendEmail } from "@cometa/email";

const NOTES_DOMAIN = process.env["NOTES_DOMAIN"] ?? "notes.daniellourie.me";

export async function sendNoteCreatedEmail(params: {
  to: string;
  title: string;
  snippet: string;
  noteId: string;
}) {
  const viewUrl = `https://${NOTES_DOMAIN}/view/${params.noteId}`;
  await sendEmail({
    to: params.to,
    subject: `Note created: ${params.title}`,
    react: NoteCreatedEmail({
      title: params.title,
      snippet: params.snippet,
      viewUrl,
    }),
  });
}
