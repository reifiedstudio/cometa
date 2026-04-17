"use client";

import { AgentStream } from "@/components/agent-stream";
import { LinkPreviews } from "@/components/link-preview";
import { fetchMessages, fetchServices, fetchTask, getSessionStatus, performAction } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AppLayout } from "@cometa/ui/app-layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ListTodo,
  Loader2,
  MessageSquare,
  User,
  Wrench,
  XCircle,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700", icon: Clock },
  assigned: { label: "Assigned", className: "bg-blue-50 text-blue-700", icon: MessageSquare },
  processing: { label: "Processing", className: "bg-blue-50 text-blue-700", icon: Loader2 },
  awaiting_approval: {
    label: "Awaiting Approval",
    className: "bg-amber-50 text-amber-700",
    icon: AlertTriangle,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  failed: { label: "Failed", className: "bg-red-50 text-red-700", icon: AlertTriangle },
};

const serviceMeta: Record<string, { label: string; description: string }> = {
  accounting: { label: "Accounting", description: "Invoices, expenses, payments" },
  legal: { label: "Legal", description: "Contracts, compliance, reviews" },
  hr: { label: "Human Resources", description: "Hiring, onboarding, leave" },
  engineering: { label: "Engineering", description: "Bugs, deployments, infra" },
  marketing: { label: "Marketing", description: "Campaigns, content, analytics" },
};

export default function TaskDetailPage() {
  const params = useParams<{ slug: string; taskId: string }>();
  const pathname = usePathname();
  // Static export bakes placeholder params — read real values from URL
  const { slug, taskId } = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    // URL shape: /accounting/tasks/abc-123
    if (parts.length >= 3 && parts[1] === "tasks") {
      return { slug: parts[0]!, taskId: parts[2]! };
    }
    return { slug: params.slug, taskId: params.taskId };
  }, [pathname, params]);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: servicesData } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const { data: taskData, isLoading } = useQuery({
    queryKey: ["task", slug, taskId],
    queryFn: () => fetchTask(slug, taskId),
    refetchInterval: 10_000,
  });

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", slug, taskData?.traceId],
    queryFn: () => fetchMessages(slug),
    enabled: !!taskData,
    refetchInterval: 10_000,
    select: (data: any) => {
      const msgs = data?.items ?? [];
      return taskData?.traceId ? msgs.filter((m: any) => m.traceId === taskData.traceId) : msgs;
    },
  });

  const { data: sessionData } = useQuery({
    queryKey: ["session", slug, taskId],
    queryFn: () => getSessionStatus(slug, taskId),
    refetchInterval: (query) => {
      const d = query.state.data;
      if (!d || d.status === "idle" || d.status === "terminated") return false;
      return 5_000;
    },
  });

  const approveMutation = useMutation({
    mutationFn: () => performAction(slug, taskId, "approve", comment ? { comment } : undefined),
    onSuccess: () => {
      toast.success("Task approved");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["task", slug, taskId] });
    },
    onError: () => toast.error("Failed to approve"),
  });

  const rejectMutation = useMutation({
    mutationFn: () => performAction(slug, taskId, "reject", comment ? { comment } : undefined),
    onSuccess: () => {
      toast.success("Task rejected");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["task", slug, taskId] });
    },
    onError: () => toast.error("Failed to reject"),
  });

  const task = taskData;
  const messages = messagesData ?? [];
  const isAwaitingApproval = task?.status === "awaiting_approval";
  const isPending = approveMutation.isPending || rejectMutation.isPending;

  const meta = serviceMeta[slug] ?? { label: slug.charAt(0).toUpperCase() + slug.slice(1), description: "" };

  const slugs = servicesData?.services?.length
    ? servicesData.services.map((s: any) => s.slug)
    : ["accounting", "legal"];

  const navItems = [
    { title: "My Tasks", url: "/", icon: ListTodo },
    {
      title: "Departments",
      url: "#",
      icon: Building2,
      isActive: true,
      items: slugs.map((s: string) => ({
        title: serviceMeta[s]?.label ?? s.charAt(0).toUpperCase() + s.slice(1),
        url: `/${s}`,
      })),
    },
  ];

  const content = isLoading ? (
    <div className="flex justify-center py-16">
      <Loader2 size={20} className="animate-spin text-muted-foreground" />
    </div>
  ) : !task ? (
    <p className="text-sm text-muted-foreground text-center py-16">Task not found</p>
  ) : (
    <div className="space-y-6 max-w-3xl">
      <div className="border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-relaxed">{task.body}</p>
            <LinkPreviews text={task.body ?? ""} />
          </div>
          <span
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full",
              (statusConfig[task.status] ?? statusConfig.pending).className,
            )}
          >
            {(() => {
              const cfg = statusConfig[task.status] ?? statusConfig.pending;
              const Icon = cfg.icon;
              return <><Icon size={11} />{cfg.label}</>;
            })()}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {task.type && task.type !== "request" && (
            <div className="flex items-center gap-1.5">
              <MessageSquare size={12} />
              <span className="capitalize">{task.type.replace(/-/g, " ")}</span>
            </div>
          )}
          {task.assignedTo && (
            <div className="flex items-center gap-1.5">
              <User size={12} />
              <span>{task.assignedTo}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>
              {new Date(task.createdAt).toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(task.id);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted/60 hover:bg-muted transition-colors font-mono text-[11px] text-muted-foreground"
            title="Copy task ID"
          >
            <span className="max-w-[120px] truncate">{task.id}</span>
            {copied ? (
              <Check size={10} className="shrink-0 text-emerald-500" />
            ) : (
              <Copy size={10} className="shrink-0" />
            )}
          </button>
        </div>
      </div>

      {sessionData?.sessionId && (
        <AgentStream
          slug={slug}
          taskId={taskId}
          sessionId={sessionData.sessionId}
          onComplete={() => queryClient.invalidateQueries({ queryKey: ["task", slug, taskId] })}
        />
      )}

      <div>
        <h3 className="text-sm font-semibold mb-3">Messages</h3>
        {messagesLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg: any, i: number) => (
              <div key={msg.id ?? i} className="border border-border rounded-lg p-4 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium">
                    {msg.from === "gateway" ? "You" : msg.from}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.body}</p>
                <LinkPreviews text={msg.body ?? ""} />
              </div>
            ))}
          </div>
        )}
      </div>

      {isAwaitingApproval && (
        <div className="border border-border rounded-lg p-5 space-y-3">
          <h3 className="text-sm font-semibold">Action required</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment..."
            rows={2}
            className="w-full text-sm p-3 rounded-md border border-border bg-muted/30 outline-none focus:border-ring resize-none placeholder:text-muted-foreground/50"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => rejectMutation.mutate()}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-destructive text-white hover:bg-destructive/90 disabled:opacity-50 transition-colors"
            >
              {rejectMutation.isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <XCircle size={12} />
              )}
              Reject
            </button>
            <button
              onClick={() => approveMutation.mutate()}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {approveMutation.isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <CheckCircle2 size={12} />
              )}
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AppLayout
      breadcrumbs={[{ label: "Tasks" }, { label: meta.label }, { label: "Task" }]}
      navItems={navItems}
      onSignOut={() => {}}
    >
      {content}
    </AppLayout>
  );
}
