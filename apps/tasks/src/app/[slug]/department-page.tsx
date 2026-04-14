"use client";

import { fetchTasks, sendMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Clock, Loader2, MessageSquare, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700", icon: Clock },
  assigned: { label: "Assigned", className: "bg-blue-50 text-blue-700", icon: MessageSquare },
  processing: { label: "Processing", className: "bg-blue-50 text-blue-700", icon: Loader2 },
  awaiting_approval: {
    label: "Approval",
    className: "bg-amber-50 text-amber-700",
    icon: AlertTriangle,
  },
  completed: { label: "Done", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  failed: { label: "Failed", className: "bg-red-50 text-red-700", icon: AlertTriangle },
};

const filters = ["all", "awaiting_approval", "processing", "pending", "completed"] as const;

export default function TasksPage() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [newMessage, setNewMessage] = useState("");
  const [showSend, setShowSend] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", slug, statusFilter],
    queryFn: () => fetchTasks(slug, statusFilter === "all" ? undefined : statusFilter),
    refetchInterval: 10_000,
  });

  const sendMutation = useMutation({
    mutationFn: () => sendMessage(slug, newMessage),
    onSuccess: () => {
      toast.success("Message sent");
      setNewMessage("");
      setShowSend(false);
      queryClient.invalidateQueries({ queryKey: ["tasks", slug] });
    },
    onError: () => toast.error("Failed to send message"),
  });

  const tasks = data?.items ?? [];
  const label = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <a
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              All Tasks
            </a>
            <span className="text-xs text-muted-foreground">/</span>
          </div>
          <h1 className="text-lg font-semibold">{label}</h1>
        </div>
        <button
          onClick={() => setShowSend(!showSend)}
          className="text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
        >
          <Send size={12} className="inline mr-1.5" />
          Send message
        </button>
      </div>

      {showSend && (
        <div className="border border-border rounded-lg p-4 mb-6 space-y-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Describe what you need..."
            rows={3}
            className="w-full text-sm p-3 rounded-md border border-border bg-muted/30 outline-none focus:border-ring resize-none placeholder:text-muted-foreground/50"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowSend(false)}
              className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => sendMutation.mutate()}
              disabled={!newMessage.trim() || sendMutation.isPending}
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {sendMutation.isPending ? (
                <Loader2 size={12} className="inline animate-spin" />
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-1 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-md transition-colors capitalize",
              statusFilter === f
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {f === "all" ? "All" : f === "awaiting_approval" ? "Approval" : f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">No tasks found</div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task: any) => {
            const config = statusConfig[task.status] ?? statusConfig.pending;
            const StatusIcon = config.icon;
            return (
              <a
                key={task.id}
                href={`/${slug}/tasks/${task.id}`}
                className="block border border-border rounded-lg p-4 hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                    {task.body}
                  </p>
                  <span
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full",
                      config.className,
                    )}
                  >
                    <StatusIcon size={10} />
                    {config.label}
                  </span>
                </div>
                <div className="flex gap-4 text-[11px] text-muted-foreground">
                  {task.type && task.type !== "request" && (
                    <span className="capitalize">{task.type.replace(/-/g, " ")}</span>
                  )}
                  <span>
                    {new Date(task.createdAt).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
