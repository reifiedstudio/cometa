// Re-export from shared storage package
import { storage } from "@cometa/storage";

export const uploadFile = storage.upload.bind(storage);
export const getPresignedUrl = storage.getSignedUrl.bind(storage);
export const getFileBuffer = storage.getBuffer.bind(storage);
