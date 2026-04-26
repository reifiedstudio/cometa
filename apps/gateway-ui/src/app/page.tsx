"use client";

import { useState } from "react";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { Badge } from "@cometa/ui/ui/badge";
import {
  FileText,
  PenTool,
  ListTodo,
  Wrench,
  Network,
  Home,
  ExternalLink,
  Copy,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Data ──

interface Tool {
  name: string;
  description: string;
  params: string[];
}

interface Service {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  tools: Tool[];
  hasDocs: boolean;
}

const MCP_ENDPOINT = process.env.NEXT_PUBLIC_MCP_URL ?? "https://mcp.daniellourie.me/mcp";
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "https://mcp.daniellourie.me";

const services: Service[] = [
  {
    name: "Gateway",
    slug: "gateway",
    icon: Network,
    description: "Core MCP tools — documents, notes",
    hasDocs: true,
    tools: [
      { name: "list_intake_documents", description: "List all intake documents with optional type, status, and date filters", params: ["type?", "status?", "dateFrom?", "dateTo?"] },
      { name: "get_intake_document", description: "Get a specific intake document by ID with extracted data and metadata", params: ["id"] },
      { name: "search_intake_documents", description: "Full-text search across intake documents", params: ["query", "type?"] },
      { name: "approve_intake_document", description: "Approve or deny an intake document after review", params: ["id", "status", "notes?"] },
      { name: "delete_intake_document", description: "Soft-delete an intake document", params: ["id"] },
      { name: "create_note", description: "Create a rich HTML note with optional PDF conversion", params: ["title", "html", "convertToPdf?"] },
    ],
  },
  {
    name: "Signatures",
    slug: "signatures",
    icon: PenTool,
    description: "E-signature lifecycle",
    hasDocs: true,
    tools: [
      { name: "request_signature", description: "Send a document for e-signature to one or more signers", params: ["documentId", "signerEmails[]", "message?"] },
      { name: "get_signature_status", description: "Check the current status of a signature request", params: ["requestId"] },
      { name: "list_signature_requests", description: "List all signature requests with optional filters", params: ["status?", "limit?"] },
      { name: "cancel_signature", description: "Cancel a pending signature request", params: ["requestId", "reason?"] },
      { name: "nudge_signer", description: "Send a reminder email to a signer who hasn't signed yet", params: ["signerId"] },
      { name: "add_signer", description: "Add a new signer to an existing signature request", params: ["requestId", "email"] },
      { name: "remove_signer", description: "Remove a signer from a pending request", params: ["signerId"] },
      { name: "get_audit_trail", description: "Get the full audit trail for a signature request", params: ["requestId"] },
    ],
  },
  {
    name: "Tasks",
    slug: "tasks",
    icon: ListTodo,
    description: "Department task management",
    hasDocs: true,
    tools: [
      { name: "send_department_message", description: "Send a message to a department's processing queue", params: ["department", "body", "type?"] },
      { name: "list_department_tasks", description: "List tasks assigned to a department", params: ["department", "status?"] },
      { name: "get_task", description: "Get details of a specific task", params: ["department", "taskId"] },
      { name: "perform_task_action", description: "Approve, reject, or reassign a task", params: ["department", "taskId", "action"] },
      { name: "get_trace", description: "Get all messages and tasks for a trace ID", params: ["traceId"] },
      { name: "start_agent_session", description: "Start a managed agent session for a task", params: ["department", "taskId", "message"] },
    ],
  },
  {
    name: "Intake",
    slug: "intake",
    icon: FileText,
    description: "Document OCR and classification",
    hasDocs: true,
    tools: [],
  },
  {
    name: "Utilities",
    slug: "utilities",
    icon: Wrench,
    description: "Document generation and PDF conversion",
    hasDocs: false,
    tools: [
      { name: "create_document", description: "Generate a branded document with company letterhead and signatures", params: ["title", "html", "format?"] },
      { name: "convert_to_pdf", description: "Convert HTML content to PDF and return a download URL", params: ["html", "filename?"] },
    ],
  },
];

const navItems: {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}[] = [
  {
    title: "Home",
    url: "#home",
    icon: Home,
  },
  ...services.map((svc) => {
    const items: { title: string; url: string }[] = [];
    if (svc.tools.length > 0) {
      items.push({ title: "MCP Tools", url: `#tools-${svc.slug}` });
    }
    if (svc.hasDocs) {
      items.push({ title: "API Docs", url: `#docs-${svc.slug}` });
    }
    return {
      title: svc.name,
      url: `#${svc.slug}`,
      icon: svc.icon,
      isActive: svc.slug === "gateway",
      items,
    };
  }),
];

// ── Component ──

export default function GatewayPage() {
  const [view, setView] = useState<{ type: "overview" | "tools" | "docs"; slug?: string }>({ type: "overview" });

  const activeService = view.slug ? services.find((s) => s.slug === view.slug) : null;

  const breadcrumbs = [
    { label: "Gateway" },
    ...(activeService
      ? [
          { label: activeService.name },
          ...(view.type === "tools" ? [{ label: "MCP Tools" }] : []),
          ...(view.type === "docs" ? [{ label: "API Docs" }] : []),
        ]
      : []),
  ];

  const handleClick = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest("a[href^='#']");
    if (!target) return;
    const href = target.getAttribute("href") ?? "";
    e.preventDefault();

    if (href === "#home") {
      setView({ type: "overview" });
    } else if (href.startsWith("#tools-")) {
      setView({ type: "tools", slug: href.replace("#tools-", "") });
    } else if (href.startsWith("#docs-")) {
      setView({ type: "docs", slug: href.replace("#docs-", "") });
    } else if (href.startsWith("#")) {
      const slug = href.replace("#", "");
      const svc = services.find((s) => s.slug === slug);
      if (svc) {
        if (svc.tools.length > 0) {
          setView({ type: "tools", slug });
        } else if (svc.hasDocs) {
          setView({ type: "docs", slug });
        }
      }
    }
  };

  return (
    // biome-ignore lint: click handler for sidebar nav interception
    <div onClick={handleClick} className="w-full">
      <AppLayout
        navItems={navItems}
      >
        {view.type === "overview" && (
          <AppPage breadcrumbs={breadcrumbs} title="Gateway" description="Central MCP server and API gateway for all Cometa services">
            <OverviewContent onNavigate={(type, slug) => setView({ type, slug })} />
          </AppPage>
        )}
        {view.type === "tools" && activeService && (
          <AppPage breadcrumbs={breadcrumbs} title={activeService.name} description={`${activeService.tools.length} MCP tools available`}>
            <ToolsContent service={activeService} />
          </AppPage>
        )}
        {view.type === "docs" && activeService && (
          <AppPage breadcrumbs={breadcrumbs} title={activeService.name} description="Interactive API reference" noPadding>
            <DocsContent service={activeService} />
          </AppPage>
        )}
      </AppLayout>
    </div>
  );
}

// ── Panels ──

function OverviewContent({ onNavigate }: { onNavigate: (type: "tools" | "docs", slug: string) => void }) {
  const totalTools = services.reduce((sum, s) => sum + s.tools.length, 0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MCP_ENDPOINT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* MCP endpoint */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-2 mb-2">
          <Network className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">MCP Endpoint</span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
            {MCP_ENDPOINT}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md border p-2 hover:bg-muted transition-colors"
          >
            <Copy className="size-4 text-muted-foreground" />
          </button>
        </div>
        {copied && (
          <p className="text-xs text-muted-foreground mt-1">Copied to clipboard</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Services</p>
          <p className="text-2xl font-semibold mt-1">{services.length}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">MCP Tools</p>
          <p className="text-2xl font-semibold mt-1">{totalTools}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Status</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="size-2 rounded-full bg-emerald-500" />
            <p className="text-2xl font-semibold">Operational</p>
          </div>
        </div>
      </div>

      {/* Service cards */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Services</h2>
        <div className="space-y-2">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <button
                type="button"
                key={svc.slug}
                onClick={() => onNavigate(svc.tools.length > 0 ? "tools" : "docs", svc.slug)}
                className="w-full flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{svc.name}</p>
                    <p className="text-xs text-muted-foreground">{svc.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {svc.tools.length > 0 && (
                    <Badge variant="secondary" className="text-xs">{svc.tools.length} tools</Badge>
                  )}
                  {svc.hasDocs && (
                    <Badge variant="outline" className="text-xs">API</Badge>
                  )}
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ToolsContent({ service }: { service: Service }) {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  return (
    <div className="space-y-2">
        {service.tools.map((tool) => {
          const isOpen = expandedTool === tool.name;
          return (
            <div key={tool.name} className="rounded-lg border overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedTool(isOpen ? null : tool.name)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors text-left"
              >
                <div>
                  <p className="font-mono text-sm font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                </div>
                <ChevronRight className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
              </button>
              {isOpen && (
                <div className="border-t px-3 py-3 bg-muted/20">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Parameters</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.params.map((p) => (
                      <code key={p} className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                        {p}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
  );
}

function DocsContent({ service }: { service: Service }) {
  const docsUrl = `${GATEWAY_URL}/docs/${service.slug}`;

  return (
    <div className="flex-1 rounded-lg border overflow-hidden bg-background">
      <iframe
        src={docsUrl}
        title={`${service.name} API Docs`}
        className="w-full h-full border-0"
        style={{ minHeight: "600px" }}
      />
    </div>
  );
}
