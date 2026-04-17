"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ChevronRight, ExternalLink, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  connected: boolean;
  comingSoon?: boolean;
  fields?: { key: string; label: string; placeholder: string; type?: string }[];
}

const INTEGRATIONS: Integration[] = [
  {
    id: "xero",
    name: "Xero",
    description:
      "Automatically send approved invoices and receipts to your Xero organisation. Line items, totals, and tax are mapped automatically.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 12.533l-2.56 2.56a.467.467 0 01-.66 0 .467.467 0 010-.66l2.56-2.56-2.56-2.56a.467.467 0 010-.66.467.467 0 01.66 0l2.56 2.56 2.56-2.56a.467.467 0 01.66 0 .467.467 0 010 .66l-2.56 2.56 2.56 2.56a.467.467 0 010 .66.467.467 0 01-.66 0l-2.56-2.56z" />
      </svg>
    ),
    color: "text-[#13B5EA]",
    bgColor: "bg-[#13B5EA]/10",
    connected: false,
    fields: [
      {
        key: "clientId",
        label: "Client ID",
        placeholder: "Your Xero app client ID",
      },
      {
        key: "clientSecret",
        label: "Client Secret",
        placeholder: "Your Xero app client secret",
        type: "password",
      },
      {
        key: "tenantId",
        label: "Tenant ID",
        placeholder: "Your Xero organisation tenant ID",
      },
    ],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description:
      "Save approved documents and their extracted data to a Google Drive folder. PDFs are uploaded alongside a structured JSON summary.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M8.267 14.68l-1.6 2.773H0l4.8-8.32 1.6 2.773-2.133 3.694h3.733l.267.08zM12 0l4.8 8.32h-3.2L8.267 0H12zm7.2 14.68H14.4l4.8-8.32 1.6 2.773-1.6 2.774z" />
      </svg>
    ),
    color: "text-[#4285F4]",
    bgColor: "bg-[#4285F4]/10",
    connected: false,
    fields: [
      {
        key: "folderId",
        label: "Folder ID",
        placeholder: "Google Drive folder ID to save documents",
      },
      {
        key: "serviceAccountEmail",
        label: "Service Account Email",
        placeholder: "your-service@project.iam.gserviceaccount.com",
      },
    ],
  },
];

function IntegrationCard({ integration }: { integration: Integration }) {
  const [expanded, setExpanded] = useState(false);
  const [connected, setConnected] = useState(integration.connected);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  function handleConnect() {
    toast.success(`${integration.name} connected (demo)`);
    setConnected(true);
    setExpanded(false);
  }

  function handleDisconnect() {
    toast.success(`${integration.name} disconnected`);
    setConnected(false);
    setFieldValues({});
  }

  return (
    <div
      className={`rounded-xl border transition-all ${
        connected ? "border-emerald-200 bg-emerald-50/30" : "border bg-card"
      }`}
    >
      <div
        className={`flex items-center gap-4 p-5 ${!integration.comingSoon ? "cursor-pointer" : ""}`}
        onClick={() => !integration.comingSoon && setExpanded(!expanded)}
      >
        <div
          className={`w-12 h-12 rounded-xl ${integration.bgColor} flex items-center justify-center flex-shrink-0 ${integration.color}`}
        >
          {integration.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{integration.name}</h3>
            {connected && (
              <Badge className="bg-emerald-100 text-emerald-700 border-transparent">
                <Check size={10} />
                Connected
              </Badge>
            )}
            {integration.comingSoon && (
              <Badge className="bg-[#F0EEFF] text-[#7C3AED] border-transparent">Coming Soon</Badge>
            )}
          </div>
          <p className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">
            {integration.description}
          </p>
        </div>

        {!integration.comingSoon && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {connected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDisconnect();
                }}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
              >
                Configure
                <ExternalLink size={12} />
              </Button>
            )}
          </div>
        )}
      </div>

      {expanded && !integration.comingSoon && !connected && (
        <div className="px-5 pb-5 border-t">
          <div className="pt-4 space-y-4">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#FFFBEB] border border-[#FEF3C7]">
              <svg
                className="w-4 h-4 text-[#D97706] mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs text-[#92400E] leading-relaxed">
                This integration will trigger automatically when a document status is changed to
                &quot;Approved&quot;. Make sure your credentials are correct before enabling.
              </p>
            </div>

            {(integration.fields ?? []).map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  value={fieldValues[field.key] ?? ""}
                  onChange={(e) =>
                    setFieldValues((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-card text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors"
                />
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-muted-foreground/30">
                Credentials are encrypted at rest
              </p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setExpanded(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleConnect}>
                  <Check size={12} />
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IntegrationsPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-3 px-6 py-3 border-b bg-card">
        <Button variant="ghost" size="sm" onClick={() => router.push("/settings")}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="w-px h-5 bg-border" />
        <span className="text-sm text-muted-foreground">Settings</span>
        <ChevronRight size={14} className="text-muted-foreground/30" />
        <h1 className="text-sm font-semibold text-foreground">Integrations</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground">On Approve Integrations</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Connect external services that trigger when a document is approved. Approved documents
              and their extracted data are sent automatically.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-muted border">
            <div className="w-10 h-10 rounded-lg bg-card border flex items-center justify-center flex-shrink-0">
              <Settings size={18} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">How it works</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                When you change a document&apos;s status to &quot;Approved&quot;, all connected
                integrations receive the document data, extracted fields, and the original file.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {INTEGRATIONS.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-xs text-muted-foreground/30 text-center">
              Need a different integration? Let us know at support@cometa.so
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
