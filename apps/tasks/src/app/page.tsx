"use client";

import { fetchServices, fetchTasks } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, Loader2 } from "lucide-react";

const serviceMeta: Record<string, { label: string; description: string }> = {
  accounting: { label: "Accounting", description: "Invoices, expenses, payments" },
  legal: { label: "Legal", description: "Contracts, compliance, reviews" },
};

function ServiceCard({ slug }: { slug: string }) {
  const meta = serviceMeta[slug] ?? { label: slug, description: "" };

  const { data } = useQuery({
    queryKey: ["tasks", slug],
    queryFn: () => fetchTasks(slug),
  });

  const tasks = data?.items ?? [];
  const pending = tasks.filter((t: any) => t.status === "awaiting_approval").length;
  const processing = tasks.filter((t: any) => t.status === "processing").length;

  return (
    <a
      href={`/${slug}`}
      className="group border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
          <Building2 size={16} className="text-muted-foreground" />
        </div>
        <ArrowRight
          size={14}
          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1"
        />
      </div>
      <h3 className="text-sm font-semibold mb-0.5">{meta.label}</h3>
      <p className="text-xs text-muted-foreground mb-3">{meta.description}</p>
      <div className="flex gap-3 text-xs text-muted-foreground">
        {pending > 0 && (
          <span className="text-amber-600 font-medium">{pending} awaiting approval</span>
        )}
        {processing > 0 && (
          <span className="text-blue-600 font-medium">{processing} processing</span>
        )}
        {pending === 0 && processing === 0 && tasks.length > 0 && <span>{tasks.length} tasks</span>}
      </div>
    </a>
  );
}

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  // Fall back to known services if SSM isn't set up
  const slugs = data?.services?.length
    ? data.services.map((s: any) => s.slug)
    : ["accounting", "legal"];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-lg font-semibold mb-1">Tasks</h1>
      <p className="text-sm text-muted-foreground mb-6">
        AI-powered task management — approvals, processing, and cross-department coordination.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {slugs.map((slug: string) => (
            <ServiceCard key={slug} slug={slug} />
          ))}
        </div>
      )}
    </div>
  );
}
