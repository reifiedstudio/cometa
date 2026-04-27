"use client";

import { fetchServices, fetchTasks } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/clerk-react";
import { KanbanBoard } from "@/components/kanban-board";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { Button } from "@cometa/ui/ui/button";
import { FilterTabs } from "@cometa/ui/filter-tabs";
import { useQuery } from "@tanstack/react-query";
import {
  ListTodo,
  Building2,
  Clock,
  Columns3,
  LayoutList,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  User,
} from "lucide-react";
import { useState } from "react";

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  open: { label: "Open", className: "bg-amber-50 text-amber-700 border-amber-200/60", icon: Clock },
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
  operations: { label: "Operations", description: "Delivery, vendors, facilities" },
};

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const filters = ["all", "review", "in_progress", "open", "done"] as const;

// ── My Tasks content ──

function MyTasksContent({ slugs }: { slugs: string[] }) {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"list" | "board">("list");

  const queries = slugs.map((slug) => ({
    slug,
    // biome-ignore lint: hooks in map is fine since slugs are stable
    ...useQuery({
      queryKey: ["tasks", slug],
      queryFn: () => fetchTasks(slug),
      refetchInterval: 10_000,
    }),
  }));

  const allTasks = queries
    .flatMap((q) => (q.data?.items ?? []).map((t: any) => ({ ...t, _slug: q.slug })))
    .filter((t: any) => t.assignedTo === userEmail || t.assignedTo === user?.id)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredTasks = statusFilter === "all"
    ? allTasks.filter((t: any) => t.status !== "done")
    : allTasks.filter((t: any) => t.status === statusFilter);

  const isLoading = queries.some((q) => q.isLoading);

  return (
    <AppPage
      breadcrumbs={[{ label: "Tasks" }, { label: "My Tasks" }]}
      title="My Tasks"
      description="Tasks across all departments"
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
            count: f === "all" ? allTasks.filter((t: any) => t.status !== "done").length : allTasks.filter((t: any) => t.status === f).length,
          }))}
          activeKey={statusFilter}
          onChange={setStatusFilter}
        />
      ) : undefined}
    >
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      ) : view === "board" ? (
        <KanbanBoard tasks={allTasks} slug="all" />
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <CheckCircle2 className="size-8 mb-3 opacity-40" />
          <p className="text-sm">You're all caught up</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task: any) => {
            const config = statusConfig[task.status] ?? statusConfig.open;
            const StatusIcon = config.icon;
            const meta = serviceMeta[task._slug];
            return (
              <a
                key={task.id}
                href={`/${task._slug}/tasks/${task.id}`}
                className="border rounded-lg hover:border-foreground/20 transition-colors block"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium capitalize">
                      {task.type?.replace(/[_-]/g, " ") ?? "Task"}
                    </span>
                    {meta && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">
                        <Building2 size={9} />
                        {meta.label}
                      </span>
                    )}
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[10px] rounded-full px-1.5 py-0.5",
                      task.assignedTo ? "text-muted-foreground bg-muted" : "text-muted-foreground/60 border border-dashed",
                    )}>
                      <User size={9} className="shrink-0" />
                      <span className="truncate max-w-[150px]">{task.assignedTo === "agent" ? "AI Agent" : task.assignedTo ?? "Unassigned"}</span>
                    </span>
                  </div>
                  <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0", config.className)}>
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
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock size={11} />
                    {formatDateTime(task.createdAt)}
                  </span>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </AppPage>
  );
}

// ── Main page ──

export default function HomePage() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { data } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const slugs = data?.services?.length
    ? data.services.map((s: any) => s.slug)
    : ["accounting", "legal"];

  const navItems = [
    { title: "My Tasks", url: "/", icon: ListTodo, isActive: true },
    {
      title: "Departments",
      url: "#",
      icon: Building2,
      isActive: true,
      items: slugs.map((slug: string) => ({
        title: serviceMeta[slug]?.label ?? slug.charAt(0).toUpperCase() + slug.slice(1),
        url: `/${slug}`,
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
      <MyTasksContent slugs={slugs} />
    </AppLayout>
  );
}
