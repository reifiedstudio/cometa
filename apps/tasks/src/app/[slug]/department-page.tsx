"use client";

import { fetchServices, fetchTasks } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AppLayout } from "@cometa/ui/app-layout";
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
import { useParams } from "next/navigation";
import { useState } from "react";

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200/60", icon: Clock },
  assigned: { label: "Assigned", className: "bg-blue-50 text-blue-700 border-blue-200/60", icon: MessageSquare },
  processing: { label: "Processing", className: "bg-blue-50 text-blue-700 border-blue-200/60", icon: Loader2 },
  awaiting_approval: { label: "Approval", className: "bg-amber-50 text-amber-700 border-amber-200/60", icon: AlertTriangle },
  completed: { label: "Done", className: "bg-emerald-50 text-emerald-700 border-emerald-200/60", icon: CheckCircle2 },
  failed: { label: "Failed", className: "bg-red-50 text-red-700 border-red-200/60", icon: AlertTriangle },
};

const serviceMeta: Record<string, { label: string; description: string }> = {
  accounting: { label: "Accounting", description: "Invoices, expenses, payments" },
  legal: { label: "Legal", description: "Contracts, compliance, reviews" },
  hr: { label: "Human Resources", description: "Hiring, onboarding, leave" },
  engineering: { label: "Engineering", description: "Bugs, deployments, infra" },
  marketing: { label: "Marketing", description: "Campaigns, content, analytics" },
};

const filters = ["all", "awaiting_approval", "processing", "pending", "completed"] as const;

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
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: servicesData } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", slug, statusFilter],
    queryFn: () => fetchTasks(slug, statusFilter === "all" ? undefined : statusFilter),
    refetchInterval: 10_000,
  });

  const tasks = data?.items ?? [];
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

  return (
    <AppLayout
      breadcrumbs={[{ label: "Tasks" }, { label: meta.label }]}
      navItems={navItems}
      onSignOut={() => {}}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{meta.label}</h1>
          <p className="text-sm text-muted-foreground mt-1">{meta.description}</p>
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
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
