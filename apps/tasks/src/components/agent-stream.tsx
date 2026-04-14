"use client";

import { getStreamUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AlertCircle, Bot, CheckCircle2, Loader2, Wrench } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface StreamEntry {
  id: number;
  type: "message" | "tool" | "status";
  text: string;
}

interface AgentStreamProps {
  slug: string;
  taskId: string;
  sessionId: string;
  onComplete?: () => void;
}

export function AgentStream({ slug, taskId, sessionId, onComplete }: AgentStreamProps) {
  const [entries, setEntries] = useState<StreamEntry[]>([]);
  const [status, setStatus] = useState<"connecting" | "streaming" | "idle" | "error">("connecting");
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const addEntry = useCallback((entry: Omit<StreamEntry, "id">) => {
    setEntries((prev) => [...prev, { ...entry, id: idRef.current++ }]);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const url = getStreamUrl(slug, taskId);
    const es = new EventSource(url);

    es.onopen = () => setStatus("streaming");
    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (event.type === "agent.message" && event.content) {
          const text = event.content
            .filter((b: any) => b.type === "text")
            .map((b: any) => b.text)
            .join("");
          if (text) addEntry({ type: "message", text });
        } else if (event.type === "agent.tool_use") {
          addEntry({ type: "tool", text: `Using ${event.name}` });
        } else if (event.type === "session.status_idle") {
          setStatus("idle");
          addEntry({ type: "status", text: "Agent finished" });
          onComplete?.();
          es.close();
        }
      } catch {}
    };
    es.onerror = () => {
      setStatus("error");
      es.close();
    };
    return () => es.close();
  }, [sessionId, slug, taskId, addEntry, onComplete]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries]);

  const statusLabel = {
    connecting: "Connecting",
    streaming: "Running",
    idle: "Complete",
    error: "Error",
  }[status];
  const StatusIcon = {
    connecting: Loader2,
    streaming: Loader2,
    idle: CheckCircle2,
    error: AlertCircle,
  }[status];
  const statusClass = {
    connecting: "bg-amber-50 text-amber-700",
    streaming: "bg-blue-50 text-blue-700",
    idle: "bg-emerald-50 text-emerald-700",
    error: "bg-red-50 text-red-700",
  }[status];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-xs font-semibold flex items-center gap-1.5">
          <Bot size={13} /> Agent Activity
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full",
            statusClass,
          )}
        >
          <StatusIcon
            size={10}
            className={status === "connecting" || status === "streaming" ? "animate-spin" : ""}
          />
          {statusLabel}
        </span>
      </div>
      <div ref={scrollRef} className="max-h-80 overflow-y-auto px-4 py-3 space-y-2">
        {entries.length === 0 && status === "connecting" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-4 justify-center">
            <Loader2 size={12} className="animate-spin" /> Connecting to agent...
          </div>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-start gap-2 text-sm",
              entry.type === "status" && "justify-center",
            )}
          >
            {entry.type === "message" && (
              <>
                <Bot size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                <p className="whitespace-pre-wrap leading-relaxed">{entry.text}</p>
              </>
            )}
            {entry.type === "tool" && (
              <>
                <Wrench size={14} className="mt-0.5 shrink-0 text-blue-500" />
                <span className="text-muted-foreground">{entry.text}</span>
              </>
            )}
            {entry.type === "status" && (
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 py-1">
                <CheckCircle2 size={12} className="text-emerald-500" /> {entry.text}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
