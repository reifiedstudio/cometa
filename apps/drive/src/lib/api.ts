const DRIVE_URL = process.env.NEXT_PUBLIC_DRIVE_URL ?? "http://localhost:3004";

export function createAuthFetch(getToken: () => Promise<string | null>) {
  return async (path: string, init?: RequestInit) => {
    const token = await getToken();
    return fetch(`${DRIVE_URL}${path}`, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };
}

export type Handoff = {
  id: string;
  googleDriveFileId: string;
  fileName: string;
  fromDepartment: string | null;
  fromUserId: string;
  fromUserEmail: string;
  toDepartment: string;
  note: string | null;
  taskId: string | null;
  policy: { senderAccess: string; onComplete: string };
  status: "active" | "completed";
  createdAt: string;
  completedAt: string | null;
};

export type FilePermission = {
  id: string;
  type: string;
  role: string;
  emailAddress?: string;
  displayName?: string;
  department?: string;
};

export type FileAccess = {
  file: { id: string; name: string; mimeType: string };
  permissions: FilePermission[];
  handoffHistory: Handoff[];
};

export type DepartmentFiles = {
  department: string;
  files: { id: string; name: string; mimeType: string; webViewLink?: string }[];
};
