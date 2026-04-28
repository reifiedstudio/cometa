"use client";

import { fetchServices, fetchTasks } from "@/lib/api";
import { listAgentSlugs } from "@/lib/agents";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { FilterTabs } from "@cometa/ui/filter-tabs";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Inbox,
  ListTodo,
  Loader2,
  User,
} from "lucide-react";
import { useState } from "react";

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

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const filters = ["all", "review", "in_progress", "open", "done"] as const;

function MyRequestsContent({ slugs }: { slugs: string[] }) {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const [statusFilter, setStatusFilter] = useState("all");

  const queries = slugs.map((slug) => ({
    slug,
    // biome-ignore lint: hooks in map is fine since slugs are stable
    ...useQuery({
      queryKey: ["tasks", slug],
      queryFn: () => fetchTasks(slug),
      refetchInterval: 10_000,
    }),
  }));

  const myRequests = queries
    .flatMap((q) => (q.data?.items ?? []).map((t: any) => ({ ...t, _slug: q.slug })))
    .filter((t: any) => t.requestedBy === userEmail || t.requestedBy === user?.id)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredTasks = statusFilter === "all"
    ? myRequests
    : myRequests.filter((t: any) => t.status === statusFilter);

  const isLoading = queries.some((q) => q.isLoading);

  return (
    <AppPage
      breadcrumbs={[{ label: "Tasks" }, { label: "My Requests" }]}
      title="My Requests"
      description="Tasks you've requested across all departments"
      toolbar={
        <FilterTabs
          tabs={filters.map((f) => ({
            key: f,
            label: f === "all" ? "All" : f === "in_progress" ? "In Progress" : f === "review" ? "Review" : f === "open" ? "Open" : "Done",
            count: f === "all" ? myRequests.length : myRequests.filter((t: any) => t.status === f).length,
          }))}
          activeKey={statusFilter}
          onChange={setStatusFilter}
        />
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Inbox className="size-8 mb-3 opacity-40" />
          <p className="text-sm">You haven't requested anything yet</p>
          <p className="text-xs mt-1 opacity-70">Send a message to a department or ask via Claude.</p>
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
                <div className="px-4 py-3">
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{task.body}</p>
                </div>
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
              </a>
            );
          })}
        </div>
      )}
    </AppPage>
  );
}

export default function RequestsPage() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { data } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const slugs = data?.services?.length
    ? data.services.map((s: any) => s.slug)
    : ["accounting", "legal"];

  const knownAgentSlugs = listAgentSlugs();
  const agentSlugs = slugs.filter((s: string) => knownAgentSlugs.includes(s));

  const navItems = [
    { title: "My Tasks", url: "/", icon: ListTodo },
    { title: "My Requests", url: "/requests", icon: Inbox, isActive: true },
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
    {
      title: "Agents",
      url: "#",
      icon: Bot,
      isActive: true,
      items: agentSlugs.map((slug: string) => ({
        title: `${serviceMeta[slug]?.label ?? slug.charAt(0).toUpperCase() + slug.slice(1)} Agent`,
        url: `/agents/${slug}`,
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
      <MyRequestsContent slugs={slugs} />
    </AppLayout>
  );
}
