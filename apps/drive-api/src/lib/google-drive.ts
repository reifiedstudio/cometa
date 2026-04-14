import { TASKS, getTaskByGroupEmail } from "@cometa/auth";
import { type drive_v3, google } from "googleapis";

let driveClient: drive_v3.Drive | undefined;

function getDrive(): drive_v3.Drive {
  if (driveClient) return driveClient;

  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentials) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env var is not set");
  }

  const parsed = JSON.parse(credentials);
  const auth = new google.auth.GoogleAuth({
    credentials: parsed,
    scopes: ["https://www.googleapis.com/auth/drive"],
    // Domain-wide delegation: impersonate an admin user
    clientOptions: {
      subject: process.env.GOOGLE_ADMIN_EMAIL,
    },
  });

  driveClient = google.drive({ version: "v3", auth });
  return driveClient;
}

export interface FilePermission {
  id: string;
  type: "user" | "group" | "domain" | "anyone";
  role: "owner" | "organizer" | "fileOrganizer" | "writer" | "commenter" | "reader";
  emailAddress?: string;
  displayName?: string;
}

export interface FileInfo {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  owners?: { emailAddress: string; displayName: string }[];
}

/** Get all permissions on a file */
export async function getFilePermissions(fileId: string): Promise<FilePermission[]> {
  const drive = getDrive();
  const res = await drive.permissions.list({
    fileId,
    fields: "permissions(id,type,role,emailAddress,displayName)",
  });
  return (res.data.permissions ?? []) as FilePermission[];
}

/** Share a file with an email (user or group) */
export async function shareFile(
  fileId: string,
  email: string,
  role: "reader" | "writer",
): Promise<string> {
  const drive = getDrive();
  const res = await drive.permissions.create({
    fileId,
    sendNotificationEmail: false,
    requestBody: {
      type: email.includes("@") ? "user" : "group",
      role,
      emailAddress: email,
    },
    fields: "id",
  });
  return res.data.id!;
}

/** Revoke access by permission ID */
export async function revokeAccess(fileId: string, permissionId: string): Promise<void> {
  const drive = getDrive();
  await drive.permissions.delete({ fileId, permissionId });
}

/** Get file metadata */
export async function getFileInfo(fileId: string): Promise<FileInfo> {
  const drive = getDrive();
  const res = await drive.files.get({
    fileId,
    fields: "id,name,mimeType,webViewLink,iconLink,owners(emailAddress,displayName)",
  });
  return res.data as FileInfo;
}

/**
 * Resolve which department owns a file by checking its permissions
 * against known department Google Group emails.
 */
export async function resolveFileDepartment(fileId: string): Promise<string | null> {
  const permissions = await getFilePermissions(fileId);

  for (const perm of permissions) {
    if (perm.emailAddress) {
      const dept = getTaskByGroupEmail(perm.emailAddress);
      if (dept) return dept.slug;
    }
  }
  return null;
}

/** Find a permission ID for a specific email on a file */
export async function findPermissionByEmail(fileId: string, email: string): Promise<string | null> {
  const permissions = await getFilePermissions(fileId);
  const match = permissions.find((p) => p.emailAddress?.toLowerCase() === email.toLowerCase());
  return match?.id ?? null;
}

/** Check if the Google Drive client can connect */
export async function checkConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const drive = getDrive();
    await drive.about.get({ fields: "user" });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/** Create a new file in Google Drive */
export async function createFile(opts: {
  name: string;
  mimeType: string;
  content?: string;
  parentFolderId?: string;
}): Promise<FileInfo> {
  const drive = getDrive();

  const requestBody: Record<string, unknown> = {
    name: opts.name,
    mimeType: opts.mimeType,
  };
  if (opts.parentFolderId) {
    requestBody.parents = [opts.parentFolderId];
  }

  // Google Docs/Sheets/Slides are created empty (no media body needed)
  // For plain text or other content, we pass a media body
  const isGoogleNative = opts.mimeType.startsWith("application/vnd.google-apps.");

  if (isGoogleNative || !opts.content) {
    const res = await drive.files.create({
      requestBody,
      fields: "id,name,mimeType,webViewLink,iconLink,owners(emailAddress,displayName)",
    });
    return res.data as FileInfo;
  }

  // Non-native file with content
  const { Readable } = await import("stream");
  const res = await drive.files.create({
    requestBody,
    media: {
      mimeType: opts.mimeType,
      body: Readable.from(Buffer.from(opts.content, "utf-8")),
    },
    fields: "id,name,mimeType,webViewLink,iconLink,owners(emailAddress,displayName)",
  });
  return res.data as FileInfo;
}

/** List files shared with a specific email (group or user) */
export async function listFilesSharedWith(email: string, pageSize = 20): Promise<FileInfo[]> {
  const drive = getDrive();
  const res = await drive.files.list({
    q: `'${email}' in readers or '${email}' in writers`,
    fields: "files(id,name,mimeType,webViewLink,iconLink,owners(emailAddress,displayName))",
    pageSize,
    orderBy: "modifiedTime desc",
  });
  return (res.data.files ?? []) as FileInfo[];
}
