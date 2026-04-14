"use client";

import DatePicker from "@/components/date-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  addSignerToRequest,
  getSignatureStatus,
  removeSignerFromRequest,
  resendSignerEmail,
  updateSignatureRequest,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { CalendarDays, Check, Clock, Loader2, Mail, Plus, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; className: string; dotClassName: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200/60",
    dotClassName: "bg-amber-500",
  },
  viewed: {
    label: "Viewed",
    className: "bg-blue-50 text-blue-700 border-blue-200/60",
    dotClassName: "bg-blue-500",
  },
  signed: {
    label: "Signed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    dotClassName: "bg-emerald-500",
  },
  declined: {
    label: "Removed",
    className: "bg-red-50 text-red-700 border-red-200/60",
    dotClassName: "bg-red-500",
  },
  expired: {
    label: "Expired",
    className: "bg-muted text-muted-foreground border-border",
    dotClassName: "bg-muted-foreground",
  },
};

const avatarColors = [
  { bg: "bg-amber-50", text: "text-amber-600" },
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-purple-50", text: "text-purple-600" },
  { bg: "bg-rose-50", text: "text-rose-600" },
  { bg: "bg-cyan-50", text: "text-cyan-600" },
];

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (email) return email.substring(0, 2).toUpperCase();
  return "??";
}

function getAvatarColor(email: string) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash + email.charCodeAt(i)) | 0;
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

interface Signer {
  id: string;
  email: string;
  status: string;
  signedAt?: string;
  name?: string;
}

interface SignatureData {
  id: string;
  status: string;
  message?: string;
  signers: Signer[];
  createdAt: string;
  expiresAt?: string;
}

interface SignatureStatusProps {
  documentId: string;
  emptyState?: React.ReactNode;
  readOnly?: boolean;
}

export default function SignatureStatus({
  documentId,
  emptyState,
  readOnly,
}: SignatureStatusProps) {
  const [data, setData] = useState<SignatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddSigner, setShowAddSigner] = useState(false);
  const [newSignerEmail, setNewSignerEmail] = useState("");
  const [addingSignerLoading, setAddingSignerLoading] = useState(false);

  async function load() {
    try {
      const result = await getSignatureStatus(documentId);
      setData(result);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [documentId]);

  async function handleRemove(signer: Signer) {
    setActionLoading(signer.id);
    try {
      await removeSignerFromRequest(signer.id);
      toast.success(`${signer.email} removed`);
      load();
    } catch {
      toast.error("Failed to remove signer");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleResend(signer: Signer) {
    setActionLoading(signer.id);
    try {
      await resendSignerEmail(signer.id);
      toast.success(`Reminder sent to ${signer.email}`);
    } catch {
      toast.error("Failed to send reminder");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDueDateChange(date: Date | undefined) {
    if (!data || !date) return;
    try {
      await updateSignatureRequest(data.id, { expiresAt: date.toISOString() });
      toast.success("Due date updated");
      load();
    } catch {
      toast.error("Failed to update due date");
    }
  }

  async function handleAddSigner(e: React.FormEvent) {
    e.preventDefault();
    if (!data || !newSignerEmail.trim()) return;
    setAddingSignerLoading(true);
    try {
      await addSignerToRequest(data.id, newSignerEmail.trim());
      toast.success(`Signing request sent to ${newSignerEmail.trim()}`);
      setNewSignerEmail("");
      setShowAddSigner(false);
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to add signer");
    } finally {
      setAddingSignerLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
        <Loader2 size={14} className="animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!data) return emptyState ? <>{emptyState}</> : null;

  const signed = data.signers.filter((s) => s.status === "signed").length;
  const total = data.signers.filter((s) => s.status !== "declined").length;
  const remaining = total - signed;
  const isOverdue = data.expiresAt && new Date(data.expiresAt) < new Date();
  const currentDueDate = data.expiresAt ? new Date(data.expiresAt) : undefined;
  const daysLeft = data.expiresAt
    ? Math.ceil((new Date(data.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* Summary header */}
        <Card>
          <Card.Body>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold text-foreground">
                  {signed} of {total} signed
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {remaining === 0
                    ? "All signatures collected"
                    : `${remaining} signature${remaining !== 1 ? "s" : ""} remaining`}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {data.expiresAt ? (
                  <>
                    <Badge
                      className={cn(
                        "gap-1.5 border",
                        isOverdue
                          ? "bg-red-50 text-red-600 border-red-200/60"
                          : daysLeft !== null && daysLeft <= 3
                            ? "bg-amber-50 text-amber-600 border-amber-200/60"
                            : "bg-emerald-50 text-emerald-600 border-emerald-200/60",
                      )}
                    >
                      <Clock size={12} />
                      {isOverdue
                        ? `${Math.abs(daysLeft!)} day${Math.abs(daysLeft!) !== 1 ? "s" : ""} overdue`
                        : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Due{" "}
                      {new Date(data.expiresAt).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">No due date</span>
                )}
                {!readOnly && (
                  <DatePicker
                    value={currentDueDate}
                    onChange={handleDueDateChange}
                    placeholder={data.expiresAt ? "Change" : "Set due date"}
                    futureOnly
                    compact
                    className="border-0 hover:bg-muted text-xs text-muted-foreground gap-1 px-2 py-1"
                  />
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Signers */}
        <Card>
          <Card.Header>
            <Card.Title>Signers</Card.Title>
            {!readOnly && !showAddSigner && (
              <Button variant="ghost" size="xs" onClick={() => setShowAddSigner(true)}>
                <Plus size={13} />
                Add
              </Button>
            )}
          </Card.Header>

          <div className="divide-y divide-border">
            {data.signers.map((signer) => {
              const config = statusConfig[signer.status] ?? statusConfig.pending;
              const isLoading = actionLoading === signer.id;
              const canNudge = signer.status === "pending" || signer.status === "viewed";
              const canRemove = signer.status !== "signed" && signer.status !== "declined";
              const initials = getInitials(signer.name, signer.email);
              const avatarColor = getAvatarColor(signer.email);

              return (
                <div
                  key={signer.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    signer.status === "declined" && "opacity-40",
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "size-9 rounded-full flex items-center justify-center shrink-0",
                      avatarColor.bg,
                    )}
                  >
                    <span className={cn("text-xs font-semibold", avatarColor.text)}>
                      {initials}
                    </span>
                  </div>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {signer.name || signer.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{signer.email}</p>
                  </div>

                  {/* Status badge */}
                  <Badge className={cn("gap-1.5 shrink-0 border", config.className)}>
                    {signer.status === "signed" ? (
                      <Check size={11} strokeWidth={2.5} />
                    ) : (
                      <span className={cn("size-1.5 rounded-full", config.dotClassName)} />
                    )}
                    {config.label}
                  </Badge>

                  {/* Date or Nudge */}
                  {signer.status === "signed" && signer.signedAt ? (
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                      {new Date(signer.signedAt).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  ) : canNudge && !readOnly ? (
                    <Button
                      variant="outline"
                      size="xs"
                      disabled={isLoading}
                      onClick={() => handleResend(signer)}
                    >
                      {isLoading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Send size={12} />
                      )}
                      Nudge
                    </Button>
                  ) : null}

                  {/* Remove */}
                  {canRemove && !readOnly && (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            disabled={isLoading}
                            onClick={() => handleRemove(signer)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          />
                        }
                      >
                        <Trash2 size={13} />
                      </TooltipTrigger>
                      <TooltipContent>Remove signer</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add signer dialog */}
          {!readOnly && (
            <Dialog
              open={showAddSigner}
              onOpenChange={(open) => {
                setShowAddSigner(open);
                if (!open) setNewSignerEmail("");
              }}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add signer</DialogTitle>
                  <DialogDescription>
                    They&apos;ll receive an email with a secure link to sign this document.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSigner} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="signer-email" className="text-xs font-medium text-foreground">
                      Email address
                    </label>
                    <input
                      id="signer-email"
                      type="email"
                      required
                      value={newSignerEmail}
                      onChange={(e) => setNewSignerEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full text-sm h-9 px-3 rounded-lg border bg-muted/50 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors placeholder:text-muted-foreground/50"
                      autoFocus
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAddSigner(false);
                        setNewSignerEmail("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={addingSignerLoading || !newSignerEmail.trim()}
                    >
                      {addingSignerLoading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Send size={12} />
                      )}
                      Send invite
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </Card>

        {/* Message */}
        {data.message && (
          <div className="flex items-start gap-2 px-1">
            <Mail size={12} className="text-muted-foreground/50 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              &ldquo;{data.message}&rdquo;
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
