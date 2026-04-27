"use client";

import { fetchServices, fetchTasks } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { useQuery } from "@tanstack/react-query";
import {
  ListTodo,
  Building2,
  Clock,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ── Status config ──

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
};

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Task card ──

function TaskCard({ task, slug, showDepartment }: { task: any; slug: string; showDepartment?: boolean }) {
  const config = statusConfig[task.status] ?? statusConfig.open;
  const StatusIcon = config.icon;
  const meta = serviceMeta[slug];

  return (
    <a
      href={`/${slug}/tasks/${task.id}`}
      className="border rounded-lg hover:border-foreground/20 transition-colors overflow-hidden block"
    >
      <div className="px-4 pt-4 pb-3">
        <p className="text-sm text-foreground line-clamp-2 leading-relaxed mb-2">{task.body}</p>
        {task.type && task.type !== "request" && (
          <span className="text-[11px] text-muted-foreground capitalize">{task.type.replace(/-/g, " ")}</span>
        )}
      </div>
      <div className="px-4 py-2.5 bg-muted/30 border-t flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {showDepartment && meta && (
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Building2 size={11} />
              {meta.label}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={11} />
            {formatDateTime(task.createdAt)}
          </span>
          {task.assignedTo && (
            <span className="flex items-center gap-1.5">
              <User size={11} />
              {task.assignedTo}
            </span>
          )}
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border",
            config.className,
          )}
        >
          <StatusIcon size={10} />
          {config.label}
          <ChevronRight size={11} />
        </span>
      </div>
    </a>
  );
}

// ── My Tasks page ──

function MyTasksInner({ slugs }: { slugs: string[] }) {
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch tasks from all services
  const queries = slugs.map((slug) => ({
    slug,
    // biome-ignore lint: hooks in map is fine since slugs are stable
    ...useQuery({
      queryKey: ["tasks", slug],
      queryFn: () => fetchTasks(slug),
      refetchInterval: 10_000,
    }),
  }));

  const allTasks = queries.flatMap((q) =>
    (q.data?.items ?? []).map((t: any) => ({ ...t, _slug: q.slug })),
  );

  const myTasks = allTasks
    .filter((t: any) => t.status !== "done")
    .filter((t: any) => statusFilter === "all" || t.status === statusFilter)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const reviewCount = allTasks.filter((t: any) => t.status === "review").length;
  const inProgressCount = allTasks.filter((t: any) => t.status === "in_progress").length;
  const doneCount = allTasks.filter((t: any) => t.status === "done").length;
  const isLoading = queries.some((q) => q.isLoading);

  const filters = ["all", "review", "in_progress", "open"] as const;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Needs Review</p>
          <p className="text-2xl font-semibold mt-1 text-violet-600">{reviewCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-semibold mt-1 text-blue-600">{inProgressCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Done</p>
          <p className="text-2xl font-semibold mt-1 text-emerald-600">{doneCount}</p>
        </div>
      </div>

      <div className="flex gap-1">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-md transition-colors capitalize",
              statusFilter === f
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f === "review" ? "Review" : f === "open" ? "Open" : f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      ) : myTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <CheckCircle2 className="size-8 mb-3 opacity-40" />
          <p className="text-sm">You're all caught up</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myTasks.map((task: any) => (
            <TaskCard key={task.id} task={task} slug={task._slug} showDepartment />
          ))}
        </div>
      )}
    </div>
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
      <AppPage
        breadcrumbs={[{ label: "Tasks" }, { label: "My Tasks" }]}
        title="My Tasks"
        description="Tasks assigned to you across all departments"
      >
        <MyTasksInner slugs={slugs} />
      </AppPage>
    </AppLayout>
  );
}
