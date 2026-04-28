"use client";

import { fetchServices } from "@/lib/api";
import { getAgentConfig, listAgentSlugs, type AgentConfig } from "@/lib/agents";
import { useClerk, useUser } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { Switch } from "@cometa/ui/ui/switch";
import { Button } from "@cometa/ui/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Bot, Building2, Check, Inbox, ListTodo, RotateCcw, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const serviceMeta: Record<string, { label: string }> = {
  accounting: { label: "Accounting" },
  legal: { label: "Legal" },
  hr: { label: "Human Resources" },
  engineering: { label: "Engineering" },
  marketing: { label: "Marketing" },
  operations: { label: "Operations" },
};

function storageKey(slug: string) {
  return `cometa.agent.${slug}.skills`;
}

function loadToggles(config: AgentConfig): Record<string, boolean> {
  const defaults: Record<string, boolean> = {};
  for (const skill of config.skills) {
    defaults[skill.key] = skill.defaultEnabled;
  }
  if (typeof window === "undefined") return defaults;
  try {
    const stored = window.localStorage.getItem(storageKey(config.slug));
    if (!stored) return defaults;
    const parsed = JSON.parse(stored) as Record<string, boolean>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export default function AgentPage() {
  const { slug } = useParams<{ slug: string }>();
  const { signOut } = useClerk();
  const { user } = useUser();

  const config = getAgentConfig(slug);

  const { data: servicesData } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const slugs = servicesData?.services?.length
    ? servicesData.services.map((s: { slug: string }) => s.slug)
    : ["accounting", "legal"];

  const agentSlugs = useMemo(() => {
    const known = listAgentSlugs();
    return slugs.filter((s: string) => known.includes(s));
  }, [slugs]);

  const navItems = [
    { title: "My Tasks", url: "/", icon: ListTodo },
    { title: "My Requests", url: "/requests", icon: Inbox },
    {
      title: "Departments",
      url: "#",
      icon: Building2,
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
      {config ? (
        <AgentContent config={config} />
      ) : (
        <AppPage
          breadcrumbs={[{ label: "Agents" }, { label: slug }]}
          title="Agent not found"
          description="No agent is configured with this slug."
        >
          <div className="text-sm text-muted-foreground">
            Configure <code className="bg-muted px-1 rounded">{slug}</code> in <code className="bg-muted px-1 rounded">apps/tasks/src/lib/agents.ts</code>.
          </div>
        </AppPage>
      )}
    </AppLayout>
  );
}

function AgentContent({ config }: { config: AgentConfig }) {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => loadToggles(config));

  useEffect(() => {
    setToggles(loadToggles(config));
  }, [config]);

  const setToggle = (key: string, value: boolean) => {
    setToggles((prev) => {
      const next = { ...prev, [key]: value };
      try {
        window.localStorage.setItem(storageKey(config.slug), JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetToDefaults = () => {
    const defaults: Record<string, boolean> = {};
    for (const skill of config.skills) {
      defaults[skill.key] = skill.defaultEnabled;
    }
    setToggles(defaults);
    try {
      window.localStorage.removeItem(storageKey(config.slug));
    } catch {
      // ignore
    }
  };

  const enabledCount = config.skills.filter((s) => toggles[s.key] ?? s.defaultEnabled).length;
  const totalCount = config.skills.length;
  const deptLabel = serviceMeta[config.slug]?.label ?? config.slug;

  return (
    <AppPage
      breadcrumbs={[{ label: "Agents" }, { label: config.name }]}
      title={config.name}
      description={config.description}
      actions={
        <Button variant="outline" size="sm" onClick={resetToDefaults}>
          <RotateCcw className="size-3.5" />
          Reset to defaults
        </Button>
      }
    >
      <div className="max-w-3xl space-y-6">
        <div className="border rounded-lg p-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Bot className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium flex items-center gap-2">
                {config.name}
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-background border rounded-full px-1.5 py-0.5 font-normal">
                  <Building2 size={9} />
                  {deptLabel}
                </span>
              </div>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">{config.model}</div>
            </div>
            <div className="text-xs text-muted-foreground shrink-0">
              {enabledCount} of {totalCount} skills enabled
            </div>
          </div>
        </div>

        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Sparkles size={11} />
              Skills
            </h2>
          </div>
          <div className="space-y-2">
            {config.skills.map((skill) => {
              const enabled = toggles[skill.key] ?? skill.defaultEnabled;
              return (
                <div
                  key={skill.key}
                  className="border rounded-lg overflow-hidden transition-colors"
                >
                  <label
                    htmlFor={`toggle-${skill.key}`}
                    className="flex items-start justify-between gap-4 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{skill.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {skill.description}
                      </div>
                    </div>
                    <Switch
                      id={`toggle-${skill.key}`}
                      checked={enabled}
                      onCheckedChange={(checked) => setToggle(skill.key, checked)}
                    />
                  </label>
                  {enabled && skill.capabilities.length > 0 && (
                    <ul className="border-t bg-muted/20 px-4 py-2.5 space-y-1.5">
                      {skill.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check size={11} className="mt-0.5 shrink-0 text-emerald-600" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppPage>
  );
}
