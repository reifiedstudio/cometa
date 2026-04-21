const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ??
  "https://tidgnwltqslwwpol45jzwtmgly0fcmen.lambda-url.us-east-1.on.aws";
const NOTES_DOMAIN = process.env.NEXT_PUBLIC_NOTES_DOMAIN ?? "notes.daniellourie.me";

export interface Note {
  id: string;
  userId: string;
  userEmail: string;
  orgId: string;
  title: string;
  snippet: string;
  s3Key: string;
  template?: string;
  starred: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteWithContent extends Note {
  contentUrl: string;
}

export function getNotePublicUrl(id: string): string {
  return `https://${NOTES_DOMAIN}/view/${id}`;
}

export { GATEWAY_URL };
