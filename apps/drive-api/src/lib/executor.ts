import { getTask } from "@cometa/auth";
import {
  findPermissionByEmail,
  getFilePermissions,
  revokeAccess,
  shareFile,
} from "./google-drive.js";
import type { Handoff } from "./types.js";

/**
 * Execute a handoff: share file with target department, adjust sender access.
 */
export async function executeHandoff(handoff: Handoff): Promise<void> {
  const targetDept = getTask(handoff.toDepartment);
  if (!targetDept?.googleGroupEmail) {
    throw new Error(`Department "${handoff.toDepartment}" has no Google Group email configured`);
  }

  // Share with target department's Google Group
  const role = handoff.policy.senderAccess === "none" ? "writer" : "writer";
  await shareFile(handoff.googleDriveFileId, targetDept.googleGroupEmail, "writer");

  // Adjust sender access based on policy
  if (handoff.policy.senderAccess === "none") {
    // Revoke sender's access entirely
    const senderId = await findPermissionByEmail(handoff.googleDriveFileId, handoff.fromUserEmail);
    if (senderId) {
      await revokeAccess(handoff.googleDriveFileId, senderId);
    }
  } else if (handoff.policy.senderAccess === "viewer") {
    // Downgrade sender to viewer — remove current permission and re-add as reader
    const senderId = await findPermissionByEmail(handoff.googleDriveFileId, handoff.fromUserEmail);
    if (senderId) {
      await revokeAccess(handoff.googleDriveFileId, senderId);
      await shareFile(handoff.googleDriveFileId, handoff.fromUserEmail, "reader");
    }
  }
  // "editor" — sender keeps current access, no change needed
}

/**
 * Execute handoff completion policy.
 */
export async function executeCompletion(handoff: Handoff): Promise<void> {
  const targetDept = getTask(handoff.toDepartment);

  switch (handoff.policy.onComplete) {
    case "revoke": {
      // Remove target department's access
      if (targetDept?.googleGroupEmail) {
        const permId = await findPermissionByEmail(
          handoff.googleDriveFileId,
          targetDept.googleGroupEmail,
        );
        if (permId) {
          await revokeAccess(handoff.googleDriveFileId, permId);
        }
      }
      break;
    }
    case "return": {
      // Remove target department's access and restore sender to editor
      if (targetDept?.googleGroupEmail) {
        const permId = await findPermissionByEmail(
          handoff.googleDriveFileId,
          targetDept.googleGroupEmail,
        );
        if (permId) {
          await revokeAccess(handoff.googleDriveFileId, permId);
        }
      }
      // Restore sender as editor
      const senderPermId = await findPermissionByEmail(
        handoff.googleDriveFileId,
        handoff.fromUserEmail,
      );
      if (senderPermId) {
        // Already has access — revoke and re-add as writer
        await revokeAccess(handoff.googleDriveFileId, senderPermId);
      }
      await shareFile(handoff.googleDriveFileId, handoff.fromUserEmail, "writer");
      break;
    }
    case "keep":
      // Target department keeps access — nothing to do
      break;
  }
}

/**
 * Grant access to a file for a specific user.
 */
export async function executeGrant(
  fileId: string,
  email: string,
  role: "reader" | "writer",
): Promise<void> {
  await shareFile(fileId, email, role);
}
