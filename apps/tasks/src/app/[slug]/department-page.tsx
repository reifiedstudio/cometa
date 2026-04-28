"use client";

import { fetchServices, fetchTasks } from "@/lib/api";
import { listAgentSlugs } from "@/lib/agents";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/clerk-react";
import { AssignPicker } from "@/components/assign-picker";
import { KanbanBoard } from "@/components/kanban-board";
import { updateTask as updateTaskApi } from "@/lib/api";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { FilterTabs } from "@cometa/ui/filter-tabs";
import { Button } from "@cometa/ui/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@cometa/ui/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ListTodo,
  Bot,
  Building2,
  Clock,
  Columns3,
  Eye,
  Inbox,
  LayoutList,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  open: { label: "Open", className: "bg-amber-50 text-amber-700 border-amber-200/60", icon: Clock },
  assigned: { label: "Assigned", className: "bg-blue-50 text-blue-700 border-blue-200/60", icon: MessageSquare },
  in_progress: { label: "In Progress", className: "bg-blue-50 text-blue-700 border-blue-200/60", icon: Loader2 },
  review: { label: "Review", className: "bg-violet-50 text-violet-700 border-violet-200/60", icon: AlertTriangle },
  done: { label: "Done", className: "bg-emerald-50 text-emerald-700 border-emerald-200/60", icon: CheckCircle2 },
};

const serviceMeta: Record<string, { label: string; description: string }> = {
  accounting: { label: "Accounting", description: "Invoices, expenses, payments" },
  legal: { label: "Legal", description: "Contracts, compliance, reviews" },
  hr: { label: "Human Resources", description: "Hiring, onboarding, leave" },
  engineering: { label: "Engineering", description: "Bugs, deployments, infra" },
  marketing: { label: "Marketing", description: "Campaigns, content, analytics" },
};

const filters = ["all", "review", "in_progress", "open", "done"] as const;

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DepartmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"created" | "updated">("created");
  const [view, setView] = useState<"list" | "board">("list");
  const [assignPickerFor, setAssignPickerFor] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: servicesData } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", slug],
    queryFn: () => fetchTasks(slug),
    refetchInterval: 10_000,
  });

  const allTasks = [...(data?.items ?? [])].sort((a: any, b: any) => {
    const dateA = sortBy === "updated" ? a.updatedAt : a.createdAt;
    const dateB = sortBy === "updated" ? b.updatedAt : b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  const tasks = statusFilter === "all" ? allTasks : allTasks.filter((t: any) => t.status === statusFilter);
  const meta = serviceMeta[slug] ?? { label: slug.charAt(0).toUpperCase() + slug.slice(1), description: "" };

  const slugs = servicesData?.services?.length
    ? servicesData.services.map((s: any) => s.slug)
    : ["accounting", "legal"];

  const knownAgentSlugs = listAgentSlugs();
  const agentSlugs = slugs.filter((s: string) => knownAgentSlugs.includes(s));

  const navItems = [
    { title: "My Tasks", url: "/", icon: ListTodo },
    { title: "My Requests", url: "/requests", icon: Inbox },
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
    {
      title: "Agents",
      url: "#",
      icon: Bot,
      isActive: true,
      items: agentSlugs.map((s: string) => ({
        title: `${serviceMeta[s]?.label ?? s.charAt(0).toUpperCase() + s.slice(1)} Agent`,
        url: `/agents/${s}`,
      })),
    },
  ];

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
        breadcrumbs={[{ label: "Tasks" }, { label: meta.label }]}
        title={meta.label}
        description={meta.description}
        actions={
          <div className="inline-flex items-center rounded-md border">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              className="size-8 rounded-r-none"
              onClick={() => setView("list")}
            >
              <LayoutList className="size-4" />
            </Button>
            <Button
              variant={view === "board" ? "secondary" : "ghost"}
              size="icon"
              className="size-8 rounded-l-none border-l"
              onClick={() => setView("board")}
            >
              <Columns3 className="size-4" />
            </Button>
          </div>
        }
        toolbar={view === "list" ? (
          <FilterTabs
            tabs={filters.map((f) => ({
              key: f,
              label: f === "all" ? "All" : f === "in_progress" ? "In Progress" : f === "review" ? "Review" : f === "open" ? "Open" : f === "done" ? "Done" : f,
              count: f === "all" ? allTasks.length : allTasks.filter((t: any) => t.status === f).length,
            }))}
            activeKey={statusFilter}
            onChange={setStatusFilter}
          />
        ) : undefined}
        toolbarRight={view === "list" ? (
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as "created" | "updated")}>
            <SelectTrigger className="h-8 text-xs w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Newest first</SelectItem>
              <SelectItem value="updated">Last updated</SelectItem>
            </SelectContent>
          </Select>
        ) : undefined}
      >
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground">No tasks found</div>
        ) : view === "board" ? (
          <KanbanBoard tasks={allTasks} slug={slug} />
        ) : (
          <div className="space-y-2">
            {tasks.map((task: any) => {
              const config = statusConfig[task.status] ?? statusConfig.open;
              const StatusIcon = config.icon;
              return (
                <div
                  key={task.id}
                  onClick={() => window.location.href = `/${slug}/tasks/${task.id}`}
                  className="border rounded-lg hover:border-foreground/20 transition-colors block cursor-pointer relative"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium capitalize">
                        {task.type?.replace(/[_-]/g, " ") ?? "Task"}
                      </span>
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setAssignPickerFor(assignPickerFor === task.id ? null : task.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 text-[11px] rounded-full px-2 py-0.5 transition-colors max-w-[200px]",
                            task.assignedTo
                              ? "text-muted-foreground bg-muted hover:bg-muted/80"
                              : "text-muted-foreground/60 border border-dashed hover:bg-muted/50",
                          )}
                        >
                          <User size={10} className="shrink-0" />
                          <span className="truncate">{task.assignedTo === "agent" ? "AI Agent" : task.assignedTo ?? "Unassigned"}</span>
                        </button>
                        <AssignPicker
                          open={assignPickerFor === task.id}
                          onOpenChange={(open) => setAssignPickerFor(open ? task.id : null)}
                          currentAssignee={task.assignedTo}
                          onAssign={async (userId, email) => {
                            try {
                              await updateTaskApi(slug, task.id, { assignedTo: email || undefined });
                              queryClient.invalidateQueries({ queryKey: ["tasks", slug] });
                            } catch { /* ignore */ }
                          }}
                        />
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0",
                        config.className,
                      )}
                    >
                      <StatusIcon size={10} />
                      {config.label}
                    </span>
                  </div>
                  {/* Body */}
                  <div className="px-4 py-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{task.body}</p>
                  </div>
                  {/* Footer */}
                  <div className="px-4 py-2 bg-muted/30 border-t flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} />
                        {formatDateTime(task.createdAt)}
                      </span>
                      {task.seenByAgent && (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Eye size={11} />
                          Seen by agent · {formatDateTime(task.seenByAgent.at)}
                        </span>
                      )}
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AppPage>
    </AppLayout>
  );
}
