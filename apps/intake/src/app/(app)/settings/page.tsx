"use client";

import { Page } from "@/components/ui/page";
import { ChevronRight, FileText, Plug, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const sections = [
  {
    key: "types",
    title: "Document Types",
    description:
      "Define the types of documents your organisation processes. Each type has an extraction schema that tells AI what data to pull from uploads.",
    icon: <FileText size={24} />,
    color: "text-foreground",
    bgColor: "bg-muted",
    href: "/settings/types",
  },
  {
    key: "integrations",
    title: "Integrations",
    description:
      "Connect external services like Xero and Google Drive that trigger when a document is approved.",
    icon: <Plug size={24} />,
    color: "text-foreground",
    bgColor: "bg-muted",
    href: "/settings/integrations",
  },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <Page>
      <Page.Header title="Settings" />

      <Page.Body width="wide">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground">Workspace Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage document types, integrations, and other workspace configuration.
          </p>
        </div>

        <div className="grid gap-4">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => router.push(section.href)}
              className="group flex items-center gap-5 p-5 rounded-xl border bg-card hover:border-border hover:shadow-sm text-left transition-all"
            >
              <div
                className={`w-14 h-14 rounded-xl ${section.bgColor} flex items-center justify-center flex-shrink-0 ${section.color}`}
              >
                {section.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                <p className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">
                  {section.description}
                </p>
              </div>

              <ChevronRight
                size={18}
                className="text-muted-foreground/30 group-hover:text-muted-foreground flex-shrink-0 transition-colors"
              />
            </button>
          ))}
        </div>
      </Page.Body>
    </Page>
  );
}
