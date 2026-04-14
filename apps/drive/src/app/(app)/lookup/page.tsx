"use client";

import { type FileAccess, type Handoff, createAuthFetch } from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";
import { TASKS } from "@cometa/auth";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Clock, FileText, Search, Shield, Users } from "lucide-react";
import { useState } from "react";

function PermissionRow({ perm }: { perm: FileAccess["permissions"][number] }) {
  const dept = TASKS.find((d) => d.slug === perm.department);
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted shrink-0">
        {perm.type === "group" ? (
          <Users size={14} className="text-muted-foreground" />
        ) : (
          <Shield size={14} className="text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium">
          {perm.displayName ?? perm.emailAddress ?? perm.type}
        </span>
        {dept && <span className="ml-2 text-xs text-muted-foreground">({dept.name})</span>}
      </div>
      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground capitalize">
        {perm.role}
      </span>
    </div>
  );
}

function HandoffRow({ handoff }: { handoff: Handoff }) {
  const dept = TASKS.find((d) => d.slug === handoff.toDepartment);
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted shrink-0">
        <FileText size={14} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="truncate">{handoff.fromUserEmail}</span>
          <ArrowRight size={12} className="text-muted-foreground shrink-0" />
          <span className="font-medium">{dept?.name ?? handoff.toDepartment}</span>
        </div>
        {handoff.note && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{handoff.note}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {handoff.status === "active" ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs">
            <Clock size={10} /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs">
            <CheckCircle2 size={10} /> Done
          </span>
        )}
        <span className="text-xs text-muted-foreground">
          {new Date(handoff.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function FileAccessPanel({
  fileId,
  authFetch,
}: {
  fileId: string;
  authFetch: ReturnType<typeof createAuthFetch>;
}) {
  const { data, isLoading, error } = useQuery<FileAccess>({
    queryKey: ["file-access", fileId],
    queryFn: async () => {
      const res = await authFetch(`/api/access/file/${fileId}`);
      if (!res.ok) throw new Error("Failed to fetch file access");
      return res.json();
    },
    enabled: !!fileId,
  });

  if (isLoading)
    return <div className="animate-pulse text-muted-foreground p-4">Loading file info...</div>;
  if (error)
    return (
      <div className="text-destructive p-4 text-sm">
        Could not load file. Check that the file ID is correct and the service account has access.
      </div>
    );
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* File info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
          <FileText size={20} className="text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">{data.file.name}</h3>
          <p className="text-xs text-muted-foreground">{data.file.mimeType}</p>
        </div>
      </div>

      {/* Permissions */}
      <div>
        <h4 className="text-sm font-medium mb-2">Permissions ({data.permissions.length})</h4>
        <div className="space-y-2">
          {data.permissions.map((p) => (
            <PermissionRow key={p.id} perm={p} />
          ))}
          {data.permissions.length === 0 && (
            <p className="text-sm text-muted-foreground">No permissions found</p>
          )}
        </div>
      </div>

      {/* Handoff history */}
      {data.handoffHistory.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">
            Handoff History ({data.handoffHistory.length})
          </h4>
          <div className="space-y-2">
            {data.handoffHistory.map((h) => (
              <HandoffRow key={h.id} handoff={h} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LookupPage() {
  const { getToken } = useAuth();
  const authFetch = createAuthFetch(getToken);
  const [input, setInput] = useState("");
  const [fileId, setFileId] = useState<string | null>(null);

  const handleLookup = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Support pasting full Google Drive URLs — extract the file ID
    const urlMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    setFileId(urlMatch ? urlMatch[1] : trimmed);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">File Lookup</h1>
          <p className="text-muted-foreground">
            Check permissions and handoff history for any Google Drive file.
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              placeholder="Paste a Google Drive file ID or URL..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={handleLookup}
            className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Look up
          </button>
        </div>

        {/* Results */}
        {fileId && (
          <div className="border rounded-lg p-5">
            <FileAccessPanel fileId={fileId} authFetch={authFetch} />
          </div>
        )}

        {!fileId && (
          <div className="border rounded-lg p-8 text-center text-muted-foreground text-sm">
            Enter a Google Drive file ID or paste a Drive URL to see who has access and the handoff
            history.
          </div>
        )}
      </div>
    </div>
  );
}
