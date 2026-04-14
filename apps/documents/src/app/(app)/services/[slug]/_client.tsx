"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Page } from "@/components/ui/page";
import { fetchServiceTasks, sendServiceMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Clock, Loader2, MessageSquare, Send } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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

const statusTabs = [
  "all",
  "pending",
  "assigned",
  "processing",
  "awaiting_approval",
  "completed",
  "failed",
] as const;

export default function DepartmentPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const slug = params.slug as string;
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [messageBody, setMessageBody] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["service-tasks", slug, statusFilter],
    queryFn: () => fetchServiceTasks(slug, statusFilter === "all" ? undefined : statusFilter),
    refetchInterval: 15_000,
  });

  const sendMutation = useMutation({
    mutationFn: () => sendServiceMessage(slug, messageBody),
    onSuccess: () => {
      toast.success("Message sent");
      setShowSendDialog(false);
      setMessageBody("");
      queryClient.invalidateQueries({ queryKey: ["service-tasks", slug] });
    },
    onError: () => toast.error("Failed to send message"),
  });

  const tasks = data?.tasks ?? [];

  return (
    <Page>
      <Page.Header backHref="/services" title={slug.charAt(0).toUpperCase() + slug.slice(1)}>
        <Button onClick={() => setShowSendDialog(true)}>
          <Send size={14} />
          Send message
        </Button>
      </Page.Header>

      <Page.Body>
        {/* Status filter tabs */}
        <div className="flex gap-1 mb-4 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                statusFilter === tab
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {tab === "all" ? "All" : (statusConfig[tab]?.label ?? tab)}
            </button>
          ))}
        </div>

        {/* Tasks list */}
        {isLoading ? (
          <LoadingSpinner />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<MessageSquare />}
            message="No tasks"
            hint={statusFilter !== "all" ? "Try a different filter" : undefined}
          />
        ) : (
          <div className="space-y-2">
            {tasks.map((task: any) => {
              const config = statusConfig[task.status] ?? statusConfig.pending;
              const Icon = config.icon;
              return (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => router.push(`/services/${slug}/tasks/${task.id}`)}
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{task.body}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {task.type !== "request" && (
                          <span className="capitalize">{task.type.replace(/-/g, " ")} · </span>
                        )}
                        {new Date(task.createdAt).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Badge className={cn("gap-1.5 border shrink-0", config.className)}>
                      <Icon size={11} />
                      {config.label}
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Page.Body>

      {/* Send message dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send to {slug}</DialogTitle>
            <DialogDescription>
              Describe the work in plain English. The department agent will process it.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMutation.mutate();
            }}
            className="space-y-4"
          >
            <textarea
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="e.g. Please review invoice #1042 from Acme Corp for R15,000"
              rows={4}
              className="w-full text-sm p-3 rounded-lg border bg-muted/50 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 resize-none placeholder:text-muted-foreground/50"
              autoFocus
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSendDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={sendMutation.isPending || !messageBody.trim()}
              >
                {sendMutation.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Send size={12} />
                )}
                Send
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
