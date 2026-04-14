"use client";

import { AgentStream } from "@/components/agent-stream";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Page } from "@/components/ui/page";
import {
  fetchServiceMessages,
  fetchServiceTask,
  getTaskSessionStatus,
  performTaskAction,
  sendTaskSessionEvent,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
  User,
  XCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200/60",
    icon: Clock,
  },
  assigned: {
    label: "Assigned",
    className: "bg-blue-50 text-blue-700 border-blue-200/60",
    icon: MessageSquare,
  },
  processing: {
    label: "Processing",
    className: "bg-blue-50 text-blue-700 border-blue-200/60",
    icon: Loader2,
  },
  awaiting_approval: {
    label: "Awaiting Approval",
    className: "bg-amber-50 text-amber-700 border-amber-200/60",
    icon: AlertTriangle,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border-red-200/60",
    icon: AlertTriangle,
  },
};

export default function TaskDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const slug = params.slug as string;
  const taskId = params.taskId as string;
  const [actionComment, setActionComment] = useState("");

  const { data: taskData, isLoading: taskLoading } = useQuery({
    queryKey: ["service-task", slug, taskId],
    queryFn: () => fetchServiceTask(slug, taskId),
    refetchInterval: 10_000,
  });

  const { data: sessionData } = useQuery({
    queryKey: ["task-session", slug, taskId],
    queryFn: () => getTaskSessionStatus(slug, taskId),
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling once idle or no session
      if (!data || data.status === "idle" || data.status === "terminated") return false;
      return 5_000;
    },
  });

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["service-messages", slug, taskData?.task?.traceId],
    queryFn: () => fetchServiceMessages(slug),
    enabled: !!taskData?.task,
    refetchInterval: 10_000,
    select: (data) => {
      const messages = data?.messages ?? [];
      const traceId = taskData?.task?.traceId;
      if (traceId) {
        return messages.filter((m: any) => m.traceId === traceId);
      }
      return messages;
    },
  });

  const approveMutation = useMutation({
    mutationFn: () =>
      performTaskAction(
        slug,
        taskId,
        "approve",
        actionComment ? { comment: actionComment } : undefined,
      ),
    onSuccess: () => {
      toast.success("Task approved");
      setActionComment("");
      queryClient.invalidateQueries({ queryKey: ["service-task", slug, taskId] });
      queryClient.invalidateQueries({ queryKey: ["service-tasks", slug] });
    },
    onError: () => toast.error("Failed to approve task"),
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      performTaskAction(
        slug,
        taskId,
        "reject",
        actionComment ? { comment: actionComment } : undefined,
      ),
    onSuccess: () => {
      toast.success("Task rejected");
      setActionComment("");
      queryClient.invalidateQueries({ queryKey: ["service-task", slug, taskId] });
      queryClient.invalidateQueries({ queryKey: ["service-tasks", slug] });
    },
    onError: () => toast.error("Failed to reject task"),
  });

  const task = taskData?.task;
  const messages = messagesData ?? [];
  const isAwaitingApproval = task?.status === "awaiting_approval";
  const isPending = approveMutation.isPending || rejectMutation.isPending;

  if (taskLoading) {
    return (
      <Page>
        <Page.Header backHref={`/services/${slug}`} title="Task" />
        <Page.Body>
          <LoadingSpinner />
        </Page.Body>
      </Page>
    );
  }

  if (!task) {
    return (
      <Page>
        <Page.Header backHref={`/services/${slug}`} title="Task" />
        <Page.Body>
          <EmptyState icon={<MessageSquare />} message="Task not found" />
        </Page.Body>
      </Page>
    );
  }

  const config = statusConfig[task.status] ?? statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <Page>
      <Page.Header
        backHref={`/services/${slug}`}
        title={slug.charAt(0).toUpperCase() + slug.slice(1)}
      />

      <Page.Body width="centered">
        {/* Task info */}
        <Card className="mb-6">
          <Card.Body className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-foreground leading-relaxed">{task.body}</p>
              <Badge className={cn("gap-1.5 border shrink-0", config.className)}>
                <StatusIcon size={11} />
                {config.label}
              </Badge>
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
              {task.createdAt && (
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
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Agent activity stream */}
        {sessionData?.sessionId && (
          <div className="mb-6">
            <AgentStream
              slug={slug}
              taskId={taskId}
              sessionId={sessionData.sessionId}
              onComplete={() => {
                queryClient.invalidateQueries({ queryKey: ["service-task", slug, taskId] });
              }}
            />
          </div>
        )}

        {/* Message thread */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Message thread</h3>
          {messagesLoading ? (
            <LoadingSpinner className="py-8" />
          ) : messages.length === 0 ? (
            <EmptyState icon={<MessageSquare />} message="No messages yet" />
          ) : (
            <div className="space-y-3">
              {messages.map((msg: any, i: number) => (
                <Card key={msg.id ?? i}>
                  <Card.Body className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {msg.role === "user"
                          ? "You"
                          : msg.role === "assistant"
                            ? "Agent"
                            : (msg.role ?? "System")}
                      </span>
                      {msg.createdAt && (
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(msg.createdAt).toLocaleDateString("en-ZA", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.body}</p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        {isAwaitingApproval && (
          <Card>
            <Card.Header>
              <Card.Title>Action required</Card.Title>
            </Card.Header>
            <Card.Body className="space-y-3">
              <textarea
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                placeholder="Optional comment..."
                rows={2}
                className="w-full text-sm p-3 rounded-lg border bg-muted/50 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 resize-none placeholder:text-muted-foreground/50"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => rejectMutation.mutate()}
                  disabled={isPending}
                >
                  {rejectMutation.isPending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <XCircle size={12} />
                  )}
                  Reject
                </Button>
                <Button size="sm" onClick={() => approveMutation.mutate()} disabled={isPending}>
                  {approveMutation.isPending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={12} />
                  )}
                  Approve
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
      </Page.Body>
    </Page>
  );
}
