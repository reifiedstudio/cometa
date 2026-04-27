"use client";

import { AgentStream } from "@/components/agent-stream";
import { AssignPicker } from "@/components/assign-picker";
import { LinkPreviews } from "@/components/link-preview";
import { fetchMessages, fetchServices, fetchTask, getSessionStatus, performAction, updateTask as updateTaskApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { DetailPanel } from "@cometa/ui/detail-panel";
import { Badge } from "@cometa/ui/ui/badge";
import { Button } from "@cometa/ui/ui/button";
import { Card, CardContent, CardFooter } from "@cometa/ui/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  ListTodo,
  Loader2,
  MessageSquare,
  PanelRight,
  User,
  UserPlus,
  XCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  open: { label: "Open", className: "bg-amber-50 text-amber-700 border-amber-200/60", icon: Clock },
  in_progress: { label: "In Progress", className: "bg-blue-50 text-blue-700 border-blue-200/60", icon: Loader2 },
  review: { label: "Review", className: "bg-violet-50 text-violet-700 border-violet-200/60", icon: AlertTriangle },
  done: { label: "Done", className: "bg-emerald-50 text-emerald-700 border-emerald-200/60", icon: CheckCircle2 },
};

const serviceMeta: Record<string, { label: string }> = {
  accounting: { label: "Accounting" },
  legal: { label: "Legal" },
  hr: { label: "Human Resources" },
  engineering: { label: "Engineering" },
  marketing: { label: "Marketing" },
  operations: { label: "Operations" },
};

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
        {part}
      </a>
    ) : part,
  );
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function TaskDetailPage() {
  const pathname = usePathname();
  const { slug, taskId } = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 3 && parts[1] === "tasks") {
      return { slug: parts[0]!, taskId: parts[2]! };
    }
    return { slug: "", taskId: "" };
  }, [pathname]);

  const { signOut } = useClerk();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelTab, setPanelTab] = useState<"details" | "activity">("details");
  const [showAssign, setShowAssign] = useState(false);
  const [showReviewer, setShowReviewer] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: servicesData } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const { data: task, isLoading } = useQuery({
    queryKey: ["task", slug, taskId],
    queryFn: () => fetchTask(slug, taskId),
    enabled: !!slug && !!taskId && taskId !== "_",
    refetchInterval: 10_000,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", slug, task?.traceId],
    queryFn: () => fetchMessages(slug),
    enabled: !!task,
    refetchInterval: 10_000,
    select: (data: any) => {
      const msgs = data?.items ?? [];
      return task?.traceId ? msgs.filter((m: any) => m.traceId === task.traceId) : msgs;
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

  const assignMutation = useMutation({
    mutationFn: ({ email }: { email: string }) => updateTaskApi(slug, taskId, { assignedTo: email || undefined }),
    onSuccess: (_, { email }) => {
      toast.success(email ? `Assigned to ${email}` : "Unassigned");
      queryClient.invalidateQueries({ queryKey: ["task", slug, taskId] });
    },
    onError: () => toast.error("Failed to assign"),
  });

  const statusMutation = useMutation({
    mutationFn: (action: string) => performAction(slug, taskId, action),
    onSuccess: () => { toast.success("Status updated"); queryClient.invalidateQueries({ queryKey: ["task", slug, taskId] }); },
    onError: () => toast.error("Failed to update"),
  });

  const meta = serviceMeta[slug] ?? { label: slug };
  const config = statusConfig[task?.status ?? "open"] ?? statusConfig.open;
  const StatusIcon = config.icon;

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
        title: serviceMeta[s]?.label ?? s,
        url: `/${s}`,
      })),
    },
  ];

  const typeLabel = task?.type?.replace(/[_-]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) ?? "";

  return (
    <AppLayout
      navItems={navItems}
      user={{
        name: user?.fullName || "User",
        email: user?.primaryEmailAddress?.emailAddress || "",
        avatar: user?.imageUrl || "",
      }}
      onSignOut={() => signOut()}
    >
      <AppPage
        breadcrumbs={[{ label: "Tasks" }, { label: meta.label, href: `/${slug}` }, { label: typeLabel || "Task" }]}
        title={typeLabel || "Task"}
        actions={
          <>
            {task && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`Take on task #${taskId} in ${slug} and start working on it. The task is: ${task.body.slice(0, 100)}`);
                    toast.success("Prompt copied — paste into Claude");
                  }}
                >
                  <Copy size={12} />
                  Take Task
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`From task #${taskId} in ${slug}, create a linked task in [department] for: [describe what needs to be done]`);
                    toast.success("Prompt copied — paste into Claude");
                  }}
                >
                  <Building2 size={12} />
                  Link Task
                </Button>
              </>
            )}
            <Button
              variant={panelOpen ? "secondary" : "ghost"}
              size="icon"
              className="size-8"
              onClick={() => setPanelOpen(!panelOpen)}
            >
              <PanelRight className="size-4" />
            </Button>
          </>
        }
        noPadding
      >
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : !task ? (
          <p className="text-sm text-muted-foreground text-center py-20">Task not found</p>
        ) : (
          <div className="flex flex-1 min-h-0">
            {/* Main content */}
            <div className={cn("flex-1 min-w-0 overflow-y-auto", panelOpen && "border-r")}>
              <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
                {/* Task body */}
                <Card className={task.metadata?.parentTaskId ? "pt-0" : ""}>
                  {/* Spawned from reference */}
                  {task.metadata?.parentTaskId && (
                    <a
                      href={`/${task.metadata.parentDepartment}/tasks/${task.metadata.parentTaskId}`}
                      className="flex items-center gap-3 px-4 py-3 border-b bg-blue-50/50 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="size-7 rounded bg-blue-100 flex items-center justify-center shrink-0">
                        <Building2 size={13} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-blue-700">
                          Spawned from <span className="capitalize">{task.metadata.parentDepartment as string}</span>
                        </p>
                        <p className="text-[11px] text-blue-600/60 font-mono">{String(task.metadata.parentTaskId).slice(0, 12)}</p>
                      </div>
                      <ChevronRight size={14} className="text-blue-400 group-hover:text-blue-600 shrink-0" />
                    </a>
                  )}
                  <CardContent>
                    <p className="text-sm leading-relaxed">{linkify(task.body)}</p>
                  </CardContent>
                  <CardFooter className="flex-col items-stretch gap-0 p-0">
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock size={11} />
                          {formatDateTime(task.createdAt)}
                        </span>
                        {task.assignedTo && (
                          <span className="flex items-center gap-1.5">
                            <User size={11} />
                            {task.assignedTo === "agent" ? "AI Agent" : task.assignedTo}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(task.id);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors font-mono"
                      >
                        {task.id.slice(0, 8)}
                        {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                      </button>
                    </div>
                    {/* Action pills */}
                    {(task.status === "open" || task.status === "in_progress" || task.status === "review") && (
                      <div className="flex items-center gap-2 px-4 py-3 border-t">
                        {task.status === "open" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => statusMutation.mutate("start")} disabled={statusMutation.isPending}>
                              <Loader2 size={12} /> Start
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => statusMutation.mutate("done")} disabled={statusMutation.isPending}>
                              <CheckCircle2 size={12} /> Done
                            </Button>
                          </>
                        )}
                        {task.status === "in_progress" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => statusMutation.mutate("review")} disabled={statusMutation.isPending}>
                              <AlertTriangle size={12} /> Request Review
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => statusMutation.mutate("done")} disabled={statusMutation.isPending}>
                              <CheckCircle2 size={12} /> Done
                            </Button>
                          </>
                        )}
                        {task.status === "review" && (
                          <>
                            <Button size="sm" onClick={() => statusMutation.mutate("approve")} disabled={statusMutation.isPending}>
                              <CheckCircle2 size={12} /> Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => statusMutation.mutate("reject")} disabled={statusMutation.isPending}>
                              <XCircle size={12} /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </CardFooter>
                </Card>

                {/* Agent session */}
                {sessionData?.sessionId && (
                  <AgentStream
                    slug={slug}
                    taskId={taskId}
                    sessionId={sessionData.sessionId}
                    onComplete={() => queryClient.invalidateQueries({ queryKey: ["task", slug, taskId] })}
                  />
                )}

                {/* Add message button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`Add a message to task #${taskId} in ${slug}: [your message here]`);
                      toast.success("Prompt copied — paste into Claude");
                    }}
                  >
                    <MessageSquare size={12} />
                    Add Message
                  </Button>
                </div>

                {/* Messages thread — timeline cards */}
                {messages.length > 0 && (
                  <div className="relative pt-2">
                    {/* Timeline line */}
                    <div className="absolute left-[13px] top-6 bottom-4 w-px bg-border" />

                    <div className="space-y-0">
                      {messages.map((msg: any, i: number) => {
                        const isAgent = msg.from === "agent";
                        const isGateway = msg.from === "gateway";
                        const isSystem = msg.type === "system";
                        const data = msg.data ?? {};

                        return (
                          <div key={msg.id ?? i} className="relative flex gap-3 pb-4">
                            {/* Timeline dot */}
                            <div className={cn(
                              "size-7 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-background",
                              isAgent ? "bg-violet-100" : isGateway ? "bg-blue-100" : "bg-muted",
                            )}>
                              {isAgent ? <Bot size={13} className="text-violet-600" /> :
                               isGateway ? <User size={13} className="text-blue-600" /> :
                               <Building2 size={13} className="text-muted-foreground" />}
                            </div>

                            {/* Card */}
                            <div className={cn(
                              "flex-1 min-w-0 rounded-lg border p-4",
                              isSystem ? "bg-muted/30 border-dashed" : "bg-card",
                            )}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold">
                                  {isAgent ? "AI Agent" : isGateway ? "You" : msg.from}
                                </span>
                                <Badge variant="secondary" className="text-[10px] font-normal">
                                  <Clock size={10} />
                                  {formatRelative(msg.timestamp)}
                                </Badge>
                              </div>

                              <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                                {linkify(msg.body)}
                              </p>

                              {/* Document reference */}
                              {msg.type === "document" && data.documentName && (
                                <div className="mt-3 flex items-center gap-3 rounded-md border p-2.5 bg-muted/30">
                                  <div className="size-8 rounded bg-red-50 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-bold text-red-600">PDF</span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">{data.documentName}</p>
                                    {data.documentType && <p className="text-xs text-muted-foreground capitalize">{data.documentType}</p>}
                                  </div>
                                </div>
                              )}

                              {/* Linked task */}
                              {msg.type === "task" && data.linkedDepartment && (
                                <a
                                  href={`/${data.linkedDepartment}/tasks/${data.linkedTaskId}`}
                                  className="mt-3 flex items-center gap-3 rounded-md border p-2.5 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                                >
                                  <div className="size-8 rounded bg-blue-50 flex items-center justify-center shrink-0">
                                    <Building2 size={14} className="text-blue-600" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium capitalize">{data.linkedDepartment}</p>
                                    <p className="text-xs text-muted-foreground">{data.linkedTaskId ? `Task ${String(data.linkedTaskId).slice(0, 12)}` : "Linked task"}</p>
                                  </div>
                                  {data.linkedTaskStatus && (
                                    <Badge className={cn("border text-[10px]", (statusConfig[data.linkedTaskStatus as string] ?? statusConfig.open).className)}>
                                      {(statusConfig[data.linkedTaskStatus as string] ?? statusConfig.open).label}
                                    </Badge>
                                  )}
                                </a>
                              )}

                              {/* Approval waiting */}
                              {msg.type === "approval" && !data.decision && task?.status === "review" && (
                                <div className="mt-3 rounded-md border border-amber-200 bg-amber-50/50 p-2.5">
                                  <div className="flex items-center gap-2 text-xs font-medium text-amber-700">
                                    <AlertTriangle size={12} />
                                    Waiting for your decision
                                  </div>
                                </div>
                              )}

                              {/* Approval result */}
                              {msg.type === "approval" && data.decision && (
                                <div className={cn("mt-3 rounded-md border p-2.5", data.decision === "approved" ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50")}>
                                  <div className={cn("flex items-center gap-2 text-xs font-medium", data.decision === "approved" ? "text-emerald-700" : "text-red-700")}>
                                    {data.decision === "approved" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                    {data.decision === "approved" ? "Approved" : "Rejected"}
                                    {data.approvedBy && <span className="font-normal">by {data.approvedBy as string}</span>}
                                  </div>
                                </div>
                              )}

                              <LinkPreviews text={msg.body ?? ""} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Detail panel with tabs */}
            <DetailPanel open={panelOpen} onOpenChange={setPanelOpen}>
              {/* Tabs */}
              <div className="flex border-b shrink-0">
                <button
                  type="button"
                  onClick={() => setPanelTab("details")}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium text-center transition-colors",
                    panelTab === "details" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => setPanelTab("activity")}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium text-center transition-colors relative",
                    panelTab === "activity" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Activity
                  {messages.length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-muted rounded-full px-1.5 py-0.5">{messages.length}</span>
                  )}
                </button>
              </div>

              {/* Details tab */}
              {panelTab === "details" && (
                <div className="p-4 space-y-5">
                  {/* People */}
                  <div className="space-y-2">
                    {/* Assignee */}
                    <div className="relative">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Assignee</p>
                      <button
                        type="button"
                        onClick={() => setShowAssign(!showAssign)}
                        className="w-full flex items-center gap-2 rounded-lg border p-2 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className={cn("size-6 rounded-full flex items-center justify-center shrink-0", task.assignedTo ? "bg-violet-100" : "bg-muted")}>
                          {task.assignedTo ? <User size={11} className="text-violet-600" /> : <UserPlus size={11} className="text-muted-foreground" />}
                        </div>
                        <span className="text-xs font-medium truncate">{task.assignedTo === "agent" ? "AI Agent" : task.assignedTo?.split("@")[0] ?? "Unassigned"}</span>
                      </button>
                      <AssignPicker open={showAssign} onOpenChange={setShowAssign} currentAssignee={task.assignedTo} onAssign={(userId, email) => assignMutation.mutate({ email })} />
                    </div>
                    {/* Reviewer */}
                    <div className="relative">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Reviewer</p>
                      <button
                        type="button"
                        onClick={() => setShowReviewer(!showReviewer)}
                        className="w-full flex items-center gap-2 rounded-lg border p-2 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className={cn("size-6 rounded-full flex items-center justify-center shrink-0", task.metadata?.reviewBy ? "bg-amber-100" : "bg-muted")}>
                          {task.metadata?.reviewBy ? <User size={11} className="text-amber-600" /> : <UserPlus size={11} className="text-muted-foreground" />}
                        </div>
                        <span className="text-xs font-medium truncate">{(task.metadata?.reviewBy as string)?.split("@")[0] ?? "Not set"}</span>
                      </button>
                      <AssignPicker open={showReviewer} onOpenChange={setShowReviewer} currentAssignee={task.metadata?.reviewBy as string} onAssign={(userId, email) => assignMutation.mutate({ email })} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="rounded-lg border divide-y">
                    <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                      <span className="text-muted-foreground text-xs">Status</span>
                      <Badge className={cn("border text-[10px]", config.className)}>
                        <StatusIcon size={9} />
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                      <span className="text-muted-foreground text-xs">Department</span>
                      <span className="text-xs font-medium">{meta.label}</span>
                    </div>
                    {task.type && task.type !== "request" && (
                      <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                        <span className="text-muted-foreground text-xs">Type</span>
                        <span className="text-xs font-medium capitalize">{task.type.replace(/[_-]/g, " ")}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                      <span className="text-muted-foreground text-xs">Created</span>
                      <span className="text-xs tabular-nums">{formatDateTime(task.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity tab — simple event log */}
              {panelTab === "activity" && (
                <div className="p-4">
                  {messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
                  ) : (
                    <div className="space-y-0">
                      {messages.map((msg: any, i: number) => {
                        const isAgent = msg.from === "agent";
                        const isGateway = msg.from === "gateway";
                        const sender = isAgent ? "AI Agent" : isGateway ? "You" : msg.from;
                        const action = msg.type === "document" ? "attached a document"
                          : msg.type === "task" ? "linked a task"
                          : msg.type === "approval" ? (msg.data?.decision === "approved" ? "approved" : msg.data?.decision === "rejected" ? "rejected" : "requested approval")
                          : msg.type === "system" ? "system update"
                          : "posted a message";

                        return (
                          <div key={msg.id ?? i} className="flex items-start gap-2 py-2 border-b border-dashed last:border-0">
                            <div className="size-1.5 rounded-full bg-muted-foreground/30 mt-1.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs">
                                <span className="font-medium">{sender}</span>
                                <span className="text-muted-foreground"> {action}</span>
                              </p>
                              <p className="text-[10px] text-muted-foreground">{formatRelative(msg.timestamp)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </DetailPanel>
          </div>
        )}
      </AppPage>
    </AppLayout>
  );
}
