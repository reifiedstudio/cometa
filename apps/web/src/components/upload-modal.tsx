"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { uploadDocument } from "@/lib/api";

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function UploadCloudIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#717983"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 16l-4-4-4 4" />
      <path d="M12 12v9" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
      <path d="M16 16l-4-4-4 4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#717983"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

type UploadStatus = "idle" | "uploading" | "done" | "error";

export default function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUploadStatus("idle");
      setSelectedFiles([]);
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      setSelectedFiles(files);
      setUploadStatus("uploading");
      setErrorMessage("");

      try {
        for (const file of files) {
          await uploadDocument(file);
        }
        setUploadStatus("done");
        onUploadComplete?.();
        // Auto-close after a short delay
        setTimeout(() => {
          onClose();
        }, 1200);
      } catch (err) {
        setUploadStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Upload failed. Please try again."
        );
      }
    },
    [onClose, onUploadComplete]
  );

  if (!isOpen) return null;

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleUpload(files);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      handleUpload(files);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-[#212327]">
            Upload Documents
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F8F8F8] text-[#555A65] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center py-12 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              isDragging
                ? "border-[#D09305] bg-[#FFFBEB]"
                : "border-[#EBEEF1] bg-[#F8F8F8] hover:border-[#D09305]/50 hover:bg-[#FFFBEB]/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileSelect}
            />
            {uploadStatus === "uploading" ? (
              <>
                <div className="mb-3 animate-pulse">
                  <UploadCloudIcon />
                </div>
                <p className="text-sm font-medium text-[#212327]">
                  Uploading{selectedFiles.length > 0 ? ` ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}` : ""}...
                </p>
                <p className="text-sm text-[#717983] mt-1">Please wait</p>
              </>
            ) : uploadStatus === "done" ? (
              <>
                <div className="mb-3 text-emerald-500">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-emerald-700">
                  Upload complete!
                </p>
              </>
            ) : uploadStatus === "error" ? (
              <>
                <div className="mb-3 text-red-500">
                  <UploadCloudIcon />
                </div>
                <p className="text-sm font-medium text-red-700">
                  Upload failed
                </p>
                <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <UploadCloudIcon />
                </div>
                <p className="text-sm font-medium text-[#212327]">
                  Drag & drop files here
                </p>
                <p className="text-sm text-[#717983] mt-1">or click to browse</p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-100 text-red-700">
                    PDF
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700">
                    JPG
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                    PNG
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Email hint */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-[#F8F8F8] rounded-lg">
            <MailIcon />
            <p className="text-sm text-[#717983]">
              Or email documents to{" "}
              <span className="font-medium text-[#555A65]">
                docs@yourcompany.co.za
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#EBEEF1]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[#555A65] bg-white border border-[#EBEEF1] rounded-lg hover:bg-[#F8F8F8] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={uploadStatus === "uploading" || uploadStatus === "done"}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadStatus === "uploading" ? "Uploading..." : uploadStatus === "done" ? "Done" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
