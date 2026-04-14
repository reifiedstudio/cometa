"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Page } from "@/components/ui/page";
import { fetchServices } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const services = data?.services ?? [];

  return (
    <Page>
      <Page.Header title="Services" />
      <Page.Body>
        {isLoading ? (
          <LoadingSpinner />
        ) : services.length === 0 ? (
          <EmptyState icon={<Building2 />} message="No department services configured" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc: any) => (
              <button
                key={svc.slug}
                type="button"
                onClick={() => router.push(`/services/${svc.slug}`)}
                className="text-left"
              >
                <Card className="p-4 hover:bg-muted transition-colors group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                        <Building2 size={16} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground capitalize">
                        {svc.slug}
                      </h3>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Department service</p>
                </Card>
              </button>
            ))}
          </div>
        )}
      </Page.Body>
    </Page>
  );
}
