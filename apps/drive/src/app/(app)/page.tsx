"use client";

import { type DepartmentFiles, type Handoff, createAuthFetch } from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";
import { TASKS } from "@cometa/auth";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Clock, FileText, Users } from "lucide-react";
import { useState } from "react";

function StatusBadge({ status }: { status: string }) {
  return status === "active" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
      <Clock size={12} /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
      <CheckCircle2 size={12} /> Completed
    </span>
  );
}

function PolicyBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">
      {label}: {value}
    </span>
  );
}

function HandoffRow({ handoff }: { handoff: Handoff }) {
  const dept = TASKS.find((d) => d.slug === handoff.toDepartment);
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted shrink-0">
        <FileText size={18} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-sm truncate">{handoff.fileName}</span>
          <StatusBadge status={handoff.status} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{handoff.fromUserEmail}</span>
          <ArrowRight size={12} />
          <span className="font-medium">{dept?.name ?? handoff.toDepartment}</span>
        </div>
        {handoff.note && (
          <p className="text-xs text-muted-foreground mt-1 truncate">{handoff.note}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="flex gap-1">
          <PolicyBadge label="keeps" value={handoff.policy.senderAccess} />
          <PolicyBadge label="on done" value={handoff.policy.onComplete} />
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(handoff.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function DepartmentCard({
  slug,
  authFetch,
}: { slug: string; authFetch: ReturnType<typeof createAuthFetch> }) {
  const [expanded, setExpanded] = useState(false);
  const dept = TASKS.find((d) => d.slug === slug)!;

  const { data, isLoading } = useQuery<DepartmentFiles>({
    queryKey: ["dept-files", slug],
    queryFn: async () => {
      const res = await authFetch(`/api/access/department/${slug}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: expanded,
  });

  return (
    <div className="border rounded-lg p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
            <Users size={16} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{dept.name}</h3>
            <p className="text-xs text-muted-foreground">
              {dept.googleGroupEmail ?? "No group configured"}
            </p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{expanded ? "Hide" : "Show files"}</span>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t">
          {isLoading && (
            <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
          )}
          {data?.files?.length === 0 && (
            <div className="text-xs text-muted-foreground">No files shared</div>
          )}
          {data?.files?.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
            >
              <FileText size={14} className="text-muted-foreground shrink-0" />
              <span className="text-sm truncate flex-1">{f.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {f.mimeType?.split("/").pop()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HandoffsPage() {
  const { getToken } = useAuth();
  const authFetch = createAuthFetch(getToken);

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Drive</h1>
          <p className="text-muted-foreground">
            File handoffs and department access across Google Drive.
          </p>
        </div>

        {/* Department Files */}
        <div>
          <h2 className="text-lg font-medium mb-3">Department Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TASKS.map((dept) => (
              <DepartmentCard key={dept.slug} slug={dept.slug} authFetch={authFetch} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
