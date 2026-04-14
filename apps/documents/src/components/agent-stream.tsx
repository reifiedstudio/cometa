"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTaskStreamUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AlertCircle, Bot, CheckCircle2, Loader2, Wrench } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface AgentEvent {
  type: string;
  content?: { type: string; text: string }[];
  name?: string;
  input?: Record<string, unknown>;
}

interface StreamEntry {
  id: number;
  type: "message" | "tool" | "status";
  text: string;
  toolName?: string;
  timestamp: Date;
}

interface AgentStreamProps {
  slug: string;
  taskId: string;
  sessionId: string | null;
  onComplete?: () => void;
}

export function AgentStream({ slug, taskId, sessionId, onComplete }: AgentStreamProps) {
  const [entries, setEntries] = useState<StreamEntry[]>([]);
  const [status, setStatus] = useState<"connecting" | "streaming" | "idle" | "error">("connecting");
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const addEntry = useCallback((entry: Omit<StreamEntry, "id" | "timestamp">) => {
    setEntries((prev) => [...prev, { ...entry, id: idRef.current++, timestamp: new Date() }]);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const url = getTaskStreamUrl(slug, taskId);
    const eventSource = new EventSource(url);

    eventSource.onopen = () => setStatus("streaming");

    eventSource.onmessage = (e) => {
      try {
        const event: AgentEvent = JSON.parse(e.data);

        switch (event.type) {
          case "agent.message":
            if (event.content) {
              const text = event.content
                .filter((b) => b.type === "text")
                .map((b) => b.text)
                .join("");
              if (text) addEntry({ type: "message", text });
            }
            break;

          case "agent.tool_use":
            addEntry({
              type: "tool",
              text: `Using ${event.name}`,
              toolName: event.name,
            });
            break;

          case "session.status_idle":
            setStatus("idle");
            addEntry({ type: "status", text: "Agent finished" });
            onComplete?.();
            eventSource.close();
            break;
        }
      } catch {
        // Ignore malformed events
      }
    };

    eventSource.onerror = () => {
      setStatus("error");
      eventSource.close();
    };

    return () => eventSource.close();
  }, [sessionId, slug, taskId, addEntry, onComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [entries]);

  if (!sessionId) return null;

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center gap-2">
            <Bot size={14} />
            Agent Activity
          </Card.Title>
          <StatusBadge status={status} />
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div ref={scrollRef} className="max-h-80 overflow-y-auto px-4 py-3 space-y-2">
          {entries.length === 0 && status === "connecting" && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-4 justify-center">
              <Loader2 size={12} className="animate-spin" />
              Connecting to agent...
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
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {entry.text}
                  </p>
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
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  {entry.text}
                </span>
              )}
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "connecting":
      return (
        <Badge className="gap-1 bg-amber-50 text-amber-700 border-amber-200/60 border">
          <Loader2 size={10} className="animate-spin" /> Connecting
        </Badge>
      );
    case "streaming":
      return (
        <Badge className="gap-1 bg-blue-50 text-blue-700 border-blue-200/60 border">
          <Loader2 size={10} className="animate-spin" /> Running
        </Badge>
      );
    case "idle":
      return (
        <Badge className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200/60 border">
          <CheckCircle2 size={10} /> Complete
        </Badge>
      );
    case "error":
      return (
        <Badge className="gap-1 bg-red-50 text-red-700 border-red-200/60 border">
          <AlertCircle size={10} /> Error
        </Badge>
      );
    default:
      return null;
  }
}
