"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@cometa/ui/ui/button";
import { Separator } from "@cometa/ui/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@cometa/ui/ui/dropdown-menu";
import { DetailPanel } from "@cometa/ui/detail-panel";
import { MarkdownRenderer, exportToHtml } from "@cometa/renderer";
import { ArrowLeft, Download, PanelRight, Star, ChevronDown, FileText, Printer, Loader2 } from "lucide-react";
import Link from "next/link";
import { useNoteQuery, useStarNote } from "@/hooks/use-notes";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function expiryText(iso: string): string {
  const created = new Date(iso);
  const expires = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.max(0, Math.ceil((expires.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
  if (daysLeft === 0) return "Expired";
  return `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ViewerPage() {
  const pathname = usePathname();
  const noteId = pathname?.split("/view/")[1]?.replace(/\/$/, "") || "";
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [markdown, setMarkdown] = React.useState<string | null>(null);
  const [mdLoading, setMdLoading] = React.useState(false);

  const { data: note, isLoading, error } = useNoteQuery(noteId);
  const starMutation = useStarNote();

  const isLegacyHtml = note?.s3Key?.endsWith(".html");

  // Fetch raw markdown for .md notes
  React.useEffect(() => {
    if (!note?.contentUrl || isLegacyHtml) return;
    setMdLoading(true);
    fetch(note.contentUrl)
      .then((r) => r.text())
      .then(setMarkdown)
      .catch(() => setMarkdown("*Failed to load note content.*"))
      .finally(() => setMdLoading(false));
  }, [note?.contentUrl, isLegacyHtml]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <p className="text-sm text-muted-foreground">
          {error ? "Failed to load note" : "Note not found"}
        </p>
        <Button variant="ghost" size="sm" render={<Link href="/" />}>
          <ArrowLeft className="size-4" />
          Back to notes
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2" render={<Link href="/" />}>
              <ArrowLeft className="size-4" />
              Notes
            </Button>
            <Separator orientation="vertical" className="self-stretch" />
            <h2 className="min-w-0 truncate text-sm font-medium">{note.title}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => starMutation.mutate({ id: noteId, starred: !note.starred })}>
              <Star className={`size-4 ${note.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
              {note.starred ? "Saved" : "Save"}
            </Button>
            <div className="inline-flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-r-none"
                onClick={() => {
                  if (isLegacyHtml) {
                    window.open(note.contentUrl, "_blank");
                  } else if (markdown) {
                    downloadBlob(markdown, `${note.title}.md`, "text/markdown");
                  }
                }}
              >
                <Download className="size-4" />
                Download
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8 rounded-l-none" />}>
                  <ChevronDown className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  {!isLegacyHtml && markdown && (
                    <DropdownMenuItem
                      onClick={() => {
                        const html = exportToHtml(markdown, note.title);
                        downloadBlob(html, `${note.title}.html`, "text/html");
                      }}
                    >
                      <FileText className="size-4" />
                      HTML
                    </DropdownMenuItem>
                  )}
                  {isLegacyHtml && (
                    <DropdownMenuItem onClick={() => window.open(note.contentUrl, "_blank")}>
                      <FileText className="size-4" />
                      HTML
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => window.print()}>
                    <Printer className="size-4" />
                    Print
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator orientation="vertical" className="mx-1 self-stretch" />
            <Button
              variant={panelOpen ? "secondary" : "ghost"}
              size="icon"
              className="size-8"
              onClick={() => setPanelOpen(!panelOpen)}
            >
              <PanelRight className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        <div className="flex-1 overflow-y-auto">
          {isLegacyHtml ? (
            <iframe
              src={note.contentUrl}
              className="size-full border-0"
              title={note.title}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : mdLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : markdown ? (
            <div className="mx-auto max-w-3xl px-6 py-8">
              <MarkdownRenderer content={markdown} />
            </div>
          ) : null}
        </div>

        <DetailPanel
          open={panelOpen}
          onOpenChange={setPanelOpen}
          viewers={[]}
          share={{
            description: `Created by ${note.userEmail} on ${formatDate(note.createdAt)}. ${expiryText(note.createdAt)}.`,
          }}
        />
      </div>
    </div>
  );
}
