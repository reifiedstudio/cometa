import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "../../components/app-layout";
import { Logo } from "../../components/logo";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  PenLine,
  Clock,
  ChevronRight,
  ArrowLeft,
  Eye,
  Check,
  Plus,
  Send,
  Trash2,
  Mail,
  CalendarDays,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Types ──

interface Signer {
  id: string;
  email: string;
  name?: string;
  status: "pending" | "viewed" | "signed" | "declined" | "expired";
  signedAt?: string;
}

interface SignatureRequest {
  id: string;
  sourceRef: string;
  status: "pending" | "partial" | "completed" | "expired";
  message?: string;
  signers: Signer[];
  createdAt: string;
  expiresAt?: string;
}

// ── Status styles ──

const requestStatusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  partial: "bg-blue-50 text-blue-700 border-blue-200/60",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  expired: "bg-muted text-muted-foreground border-border",
};

const signerStatusStyles: Record<string, { label: string; className: string; dotClassName: string }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200/60", dotClassName: "bg-amber-500" },
  viewed: { label: "Viewed", className: "bg-blue-50 text-blue-700 border-blue-200/60", dotClassName: "bg-blue-500" },
  signed: { label: "Signed", className: "bg-emerald-50 text-emerald-700 border-emerald-200/60", dotClassName: "bg-emerald-500" },
  declined: { label: "Removed", className: "bg-red-50 text-red-700 border-red-200/60", dotClassName: "bg-red-500" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground border-border", dotClassName: "bg-muted-foreground" },
};

const avatarColors = [
  { bg: "bg-amber-50", text: "text-amber-600" },
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-purple-50", text: "text-purple-600" },
  { bg: "bg-rose-50", text: "text-rose-600" },
  { bg: "bg-cyan-50", text: "text-cyan-600" },
];

function getAvatarColor(email: string) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash + email.charCodeAt(i)) | 0;
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (email) return email.substring(0, 2).toUpperCase();
  return "??";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Mock data ──

const MOCK_REQUESTS: SignatureRequest[] = [
  {
    id: "req-1",
    sourceRef: "Employment Agreement — Sarah Chen",
    status: "partial",
    message: "Please sign the updated employment agreement at your earliest convenience.",
    signers: [
      { id: "s1", email: "sarah@reified.studio", name: "Sarah Chen", status: "signed", signedAt: "2026-04-14T10:30:00Z" },
      { id: "s2", email: "daniel@reified.studio", name: "Daniel Lourie", status: "pending" },
    ],
    createdAt: "2026-04-12T09:00:00Z",
    expiresAt: "2026-04-22T09:00:00Z",
  },
  {
    id: "req-2",
    sourceRef: "NDA — Acme Corp",
    status: "completed",
    signers: [
      { id: "s3", email: "legal@acme.com", name: "Jane Smith", status: "signed", signedAt: "2026-04-10T14:00:00Z" },
      { id: "s4", email: "daniel@reified.studio", name: "Daniel Lourie", status: "signed", signedAt: "2026-04-10T16:30:00Z" },
    ],
    createdAt: "2026-04-08T11:00:00Z",
    expiresAt: "2026-04-18T11:00:00Z",
  },
  {
    id: "req-3",
    sourceRef: "Contractor Agreement — James Park",
    status: "pending",
    message: "Standard contractor terms for Q2 engagement.",
    signers: [
      { id: "s5", email: "james@reified.studio", name: "James Park", status: "viewed" },
      { id: "s6", email: "lisa@reified.studio", name: "Lisa Nguyen", status: "pending" },
      { id: "s7", email: "daniel@reified.studio", name: "Daniel Lourie", status: "pending" },
    ],
    createdAt: "2026-04-13T08:00:00Z",
    expiresAt: "2026-04-20T08:00:00Z",
  },
  {
    id: "req-4",
    sourceRef: "Board Resolution — Q1 Approval",
    status: "expired",
    signers: [
      { id: "s8", email: "sarah@reified.studio", name: "Sarah Chen", status: "signed", signedAt: "2026-03-28T09:00:00Z" },
      { id: "s9", email: "james@reified.studio", name: "James Park", status: "expired" },
    ],
    createdAt: "2026-03-20T10:00:00Z",
    expiresAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "req-5",
    sourceRef: "Lease Agreement — Office Space",
    status: "pending",
    signers: [
      { id: "s10", email: "landlord@properties.co.za", status: "pending" },
      { id: "s11", email: "daniel@reified.studio", name: "Daniel Lourie", status: "pending" },
    ],
    createdAt: "2026-04-14T15:00:00Z",
    expiresAt: "2026-04-28T15:00:00Z",
  },
];

// ── Nav ──

const navItems: { title: string; url: string; icon?: LucideIcon; isActive?: boolean }[] = [
  { title: "Requests", url: "#requests", icon: PenLine, isActive: true },
];

// ── Request Detail ──

function RequestDetailPage({
  request,
  onBack,
}: {
  request: SignatureRequest;
  onBack: () => void;
}) {
  const signed = request.signers.filter((s) => s.status === "signed").length;
  const active = request.signers.filter((s) => s.status !== "declined").length;
  const remaining = active - signed;
  const isOverdue = request.expiresAt && new Date(request.expiresAt) < new Date();
  const daysLeft = request.expiresAt
    ? Math.ceil((new Date(request.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to requests
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{request.sourceRef}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Created {formatDate(request.createdAt)}
            </p>
          </div>
          <Badge className={`border ${requestStatusStyles[request.status]}`}>
            {request.status}
          </Badge>
        </div>
      </div>

      {/* Document */}
      <div className="rounded-lg border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-red-600">PDF</span>
          </div>
          <div>
            <p className="text-sm font-medium">{request.sourceRef}</p>
            <p className="text-xs text-muted-foreground">Uploaded {formatDate(request.createdAt)}</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium hover:bg-muted/50 transition-colors"
        >
          <Eye className="size-3.5" />
          View
        </button>
      </div>

      {/* Summary card */}
      <div className="rounded-lg border p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold">
              {signed} of {active} signed
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {remaining === 0
                ? "All signatures collected"
                : `${remaining} signature${remaining !== 1 ? "s" : ""} remaining`}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {request.expiresAt && (
              <>
                <Badge
                  className={`gap-1.5 border ${
                    isOverdue
                      ? "bg-red-50 text-red-600 border-red-200/60"
                      : daysLeft !== null && daysLeft <= 3
                        ? "bg-amber-50 text-amber-600 border-amber-200/60"
                        : "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                  }`}
                >
                  <Clock className="size-3" />
                  {isOverdue
                    ? `${Math.abs(daysLeft!)} day${Math.abs(daysLeft!) !== 1 ? "s" : ""} overdue`
                    : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Due {formatDate(request.expiresAt)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Signers list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium">Signers</h2>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="size-3" />
            Add
          </button>
        </div>
        <div className="rounded-lg border divide-y">
          {request.signers.map((signer) => {
            const config = signerStatusStyles[signer.status];
            const initials = getInitials(signer.name, signer.email);
            const avatarColor = getAvatarColor(signer.email);
            const canNudge = signer.status === "pending" || signer.status === "viewed";
            const canRemove = signer.status !== "signed" && signer.status !== "declined";

            return (
              <div
                key={signer.id}
                className={`flex items-center gap-3 px-4 py-3 ${signer.status === "declined" ? "opacity-40" : ""}`}
              >
                <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ${avatarColor.bg}`}>
                  <span className={`text-xs font-semibold ${avatarColor.text}`}>{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {signer.name || signer.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{signer.email}</p>
                </div>
                <Badge className={`gap-1.5 shrink-0 border ${config.className}`}>
                  {signer.status === "signed" ? (
                    <Check className="size-3" strokeWidth={2.5} />
                  ) : (
                    <span className={`size-1.5 rounded-full ${config.dotClassName}`} />
                  )}
                  {config.label}
                </Badge>
                {signer.status === "signed" && signer.signedAt ? (
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {new Date(signer.signedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                  </span>
                ) : canNudge ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Send className="size-3" />
                    Nudge
                  </button>
                ) : null}
                {canRemove && (
                  <button
                    type="button"
                    className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Message */}
      {request.message && (
        <div className="flex items-start gap-2 px-1">
          <Mail className="size-3 text-muted-foreground/50 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            &ldquo;{request.message}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

// ── Requests List ──

function RequestsListPage({
  requests,
  onSelectRequest,
}: {
  requests: SignatureRequest[];
  onSelectRequest: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Signature Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track and manage document signatures
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <p className="text-2xl font-semibold mt-1">{requests.length}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Awaiting Signatures</p>
          <p className="text-2xl font-semibold mt-1">
            {requests.filter((r) => r.status === "pending" || r.status === "partial").length}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-semibold mt-1">
            {requests.filter((r) => r.status === "completed").length}
          </p>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Signers</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => {
              const signed = req.signers.filter((s) => s.status === "signed").length;
              const total = req.signers.filter((s) => s.status !== "declined").length;
              return (
                <TableRow
                  key={req.id}
                  className="cursor-pointer"
                  onClick={() => onSelectRequest(req.id)}
                >
                  <TableCell>
                    <span className="text-sm font-medium">{req.sourceRef}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${requestStatusStyles[req.status]}`}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {signed}/{total}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {formatDate(req.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {req.expiresAt ? formatDate(req.expiresAt) : "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Main Component ──

function SignaturesApp() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedRequest = selectedId ? MOCK_REQUESTS.find((r) => r.id === selectedId) : null;

  const breadcrumbs = selectedRequest
    ? [{ label: "Signatures" }, { label: "Requests", href: "#requests" }, { label: selectedRequest.sourceRef }]
    : [{ label: "Signatures" }, { label: "Requests" }];

  return (
    // biome-ignore lint: click handler for sidebar nav interception
    <div onClick={(e) => {
      const target = (e.target as HTMLElement).closest("a[href='#requests']");
      if (target) { e.preventDefault(); setSelectedId(null); }
    }}>
      <AppLayout
        breadcrumbs={breadcrumbs}
        services={[
          { name: "Signatures", logo: PenLine, description: "E-signature management" },
        ]}
        navItems={navItems}
      >
        {selectedRequest ? (
          <RequestDetailPage
            request={selectedRequest}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <RequestsListPage
            requests={MOCK_REQUESTS}
            onSelectRequest={setSelectedId}
          />
        )}
      </AppLayout>
    </div>
  );
}

// ── Detail-only component ──

function SignaturesDetail() {
  const request = MOCK_REQUESTS[0]; // Employment Agreement — partial, has message
  return (
    <AppLayout
      breadcrumbs={[{ label: "Signatures" }, { label: "Requests" }, { label: request.sourceRef }]}
      services={[
        { name: "Signatures", logo: PenLine, description: "E-signature management" },
      ]}
      navItems={navItems}
    >
      <RequestDetailPage request={request} onBack={() => {}} />
    </AppLayout>
  );
}

// ── Signing flow (public page) ──

const STEPS = ["verify", "otp", "sign", "done"] as const;

function StepIndicator({ current }: { current: string }) {
  const idx = STEPS.indexOf(current as (typeof STEPS)[number]);
  return (
    <div className="flex items-center gap-1.5">
      {STEPS.slice(0, 3).map((s, i) => (
        <div
          key={s}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i <= idx ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

function SigningPage() {
  const [step, setStep] = useState<"verify" | "otp" | "sign" | "done">("verify");
  const [otpCode, setOtpCode] = useState("");
  const [signerName, setSignerName] = useState("");

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b">
            <div className="mb-5">
              <Logo className="h-5 w-auto" />
            </div>
            <h1 className="text-base font-semibold leading-tight">Employment Agreement — Sarah Chen</h1>
            <p className="text-xs text-muted-foreground mt-1.5">
              daniel@reified.studio has requested your signature
            </p>
            <div className="mt-3 px-3 py-2.5 bg-muted/60 rounded-lg">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                &ldquo;Please sign the updated employment agreement at your earliest convenience.&rdquo;
              </p>
            </div>
          </div>

          {/* Signers overview */}
          <div className="px-6 py-3.5 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Signers
              </p>
              <p className="text-[10px] text-muted-foreground">1 of 2 signed</p>
            </div>
            <div className="mt-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Check className="size-3 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs">Sarah Chen</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-medium">Signed</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-amber-50 flex items-center justify-center">
                    <Clock className="size-3 text-amber-600" />
                  </div>
                  <span className="text-xs">daniel@reified.studio</span>
                </div>
                <span className="text-[10px] text-amber-600 font-medium">Pending</span>
              </div>
            </div>
          </div>

          {/* View document (after OTP) */}
          {(step === "sign" || step === "done") && (
            <div className="px-6 py-3 border-b">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium hover:bg-muted/50 transition-colors"
              >
                View Document
              </button>
            </div>
          )}

          {/* Progress */}
          {step !== "done" && (
            <div className="px-6 pt-5 pb-1">
              <StepIndicator current={step} />
            </div>
          )}

          {/* Steps */}
          <div className="px-6 py-5">
            {step === "verify" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="size-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">Verify your identity</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      We'll send a code to <span className="font-medium text-foreground">daniel@reified.studio</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("otp")}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Send Verification Code
                </button>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="size-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">Enter verification code</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Check your email for a 6-digit code</p>
                  </div>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full px-4 py-3.5 text-center text-xl font-mono tracking-[0.4em] border rounded-lg outline-none focus:border-foreground focus:ring-2 focus:ring-ring/20 transition-all"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setStep("verify"); setOtpCode(""); }}
                    className="flex-1 py-2.5 rounded-lg border text-sm font-medium hover:bg-muted/50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("sign")}
                    className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}

            {step === "sign" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <PenLine className="size-4 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">Sign document</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Enter your full legal name to sign</p>
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 text-sm border rounded-lg outline-none focus:border-foreground focus:ring-2 focus:ring-ring/20 transition-all"
                  />
                  {signerName.trim() && (
                    <div className="mt-3 px-4 py-4 bg-muted/40 rounded-lg border border-dashed">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Signature preview</p>
                      <p className="text-2xl font-serif italic text-foreground">{signerName}</p>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStep("done")}
                  disabled={!signerName.trim()}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Sign Document
                </button>
                <p className="text-[11px] text-muted-foreground/50 text-center leading-relaxed">
                  By signing, you agree that your electronic signature is legally binding.
                </p>
              </div>
            )}

            {step === "done" && (
              <div className="text-center py-6">
                <div className="flex justify-center mb-4">
                  <div className="size-14 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Check className="size-7 text-emerald-600" strokeWidth={2.5} />
                  </div>
                </div>
                <h2 className="text-lg font-semibold mb-1">Document Signed</h2>
                <p className="text-sm text-muted-foreground">
                  Thank you, {signerName}. Your signature has been recorded.
                </p>
                <p className="text-xs text-muted-foreground/50 mt-4">You may close this page.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t bg-muted/30">
            <p className="text-[10px] text-muted-foreground/40 text-center tracking-wide inline-flex items-center justify-center gap-1 w-full">
              <Lock className="size-2.5" />
              Secured by Cometa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stories ──

const meta: Meta = {
  title: "Pages/Signatures",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Requests: Story = {
  render: () => <SignaturesApp />,
};

export const RequestDetail: Story = {
  render: () => <SignaturesDetail />,
};

export const Signing: Story = {
  render: () => <SigningPage />,
};
