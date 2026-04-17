import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "../../components/app-layout";
import {
  ArrowRight,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Flag,
  Home,
  Loader,
  PenLine,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  Upload,
  UserX,
  X,
} from "lucide-react";
import { useState } from "react";

// ── Mock data ──

const typeLabels: Record<string, string> = {
  invoice: "Invoice",
  receipt: "Receipt",
  contract: "Contract",
  delivery_note: "Delivery Note",
  bill: "Bill",
};

const typeTextColors: Record<string, string> = {
  invoice: "text-orange-600",
  receipt: "text-emerald-600",
  contract: "text-blue-600",
  delivery_note: "text-red-600",
  bill: "text-sky-600",
};

const statusBadge: Record<string, { icon: typeof Clock; bg: string; label: string }> = {
  approved: { icon: Check, bg: "bg-emerald-500", label: "Approved" },
  pending: { icon: Clock, bg: "bg-orange-500", label: "Pending" },
  processing: { icon: Loader, bg: "bg-blue-500", label: "Processing" },
  reviewed: { icon: Eye, bg: "bg-gray-500", label: "Reviewed" },
  rejected: { icon: X, bg: "bg-red-500", label: "Rejected" },
  awaiting_signature: { icon: PenLine, bg: "bg-blue-500", label: "Awaiting Signature" },
};

interface MockAuditLog {
  id: string;
  action: string;
  detail: string;
  newValue?: string;
  userEmail?: string;
  createdAt: string;
}

interface MockDocument {
  id: string;
  description: string;
  type: string;
  status: string;
  date: string;
  receivedAt: string;
  signatureProgress?: { signed: number; total: number } | null;
  extractedData?: Record<string, any>;
  aiSummary?: string;
  flags?: { type: string; message: string }[];
  isFlagged?: boolean;
  senderEmail?: string;
  source?: string;
  rejectionReason?: string;
}

const mockDocuments: MockDocument[] = [
  { id: "doc-1", description: "Monthly electricity bill from Eskom for March 2026", type: "bill", status: "approved", date: "15 Apr", receivedAt: "2026-04-15T09:30:00Z", signatureProgress: null, extractedData: { vendor: "Eskom Holdings", amount: "R 2,450.00", accountNumber: "4501234567", dueDate: "2026-04-30" }, aiSummary: "Electricity bill for March 2026. Account holder: Reified Studio. Amount due R2,450.00 by 30 April.", senderEmail: "billing@eskom.co.za", source: "email" },
  { id: "doc-2", description: "Software license agreement with Figma Inc", type: "contract", status: "awaiting_signature", date: "14 Apr", receivedAt: "2026-04-14T14:20:00Z", signatureProgress: { signed: 1, total: 3 }, extractedData: { counterparty: "Figma Inc", effectiveDate: "2026-05-01", termMonths: "12", value: "$4,200/yr" }, aiSummary: "Annual software license agreement for Figma Enterprise. 12-month term starting May 2026." },
  { id: "doc-3", description: "Office supplies purchase from Takealot", type: "receipt", status: "approved", date: "13 Apr", receivedAt: "2026-04-13T11:45:00Z", extractedData: { vendor: "Takealot", amount: "R 1,234.56", items: "Stationery, printer paper, toner" }, aiSummary: "Office supplies receipt. Ordered via Takealot marketplace." },
  { id: "doc-4", description: "Delivery of new MacBook Pro units", type: "delivery_note", status: "pending", date: "12 Apr", receivedAt: "2026-04-12T08:00:00Z", extractedData: { courier: "DHL Express", trackingNumber: "DHL-ZA-9876543", items: "3x MacBook Pro M4, 1x Magic Keyboard" }, flags: [{ type: "warning", message: "Missing signature" }], isFlagged: true, senderEmail: "logistics@dhl.com", source: "email" },
  { id: "doc-5", description: "Q1 2026 tax invoice from AWS", type: "invoice", status: "approved", date: "10 Apr", receivedAt: "2026-04-10T16:30:00Z", extractedData: { vendor: "Amazon Web Services", invoiceNumber: "INV-2026-Q1-4521", amount: "$3,847.22", period: "Jan-Mar 2026" }, aiSummary: "AWS infrastructure costs for Q1 2026. Includes EC2, S3, Lambda, and CloudFront usage." },
  { id: "doc-6", description: "Consulting services invoice from DesignCo", type: "invoice", status: "processing", date: "10 Apr", receivedAt: "2026-04-10T10:15:00Z" },
  { id: "doc-7", description: "Non-disclosure agreement with Acme Corp", type: "contract", status: "awaiting_signature", date: "9 Apr", receivedAt: "2026-04-09T13:00:00Z", signatureProgress: { signed: 0, total: 2 } },
  { id: "doc-8", description: "Monthly internet bill from Vumatel", type: "bill", status: "approved", date: "8 Apr", receivedAt: "2026-04-08T07:45:00Z", extractedData: { vendor: "Vumatel", amount: "R 999.00", accountNumber: "VUM-88821" } },
  { id: "doc-9", description: "Stationery delivery from Waltons", type: "delivery_note", status: "reviewed", date: "5 Apr", receivedAt: "2026-04-05T15:20:00Z" },
  { id: "doc-10", description: "Travel expense receipt — Cape Town trip", type: "receipt", status: "pending", date: "3 Apr", receivedAt: "2026-04-03T18:00:00Z", extractedData: { vendor: "FlySafair", amount: "R 2,100.00", route: "JNB → CPT return" }, flags: [{ type: "warning", message: "Missing boarding pass" }], isFlagged: true, source: "upload" },
  { id: "doc-11", description: "Annual insurance renewal from Santam", type: "contract", status: "approved", date: "1 Apr", receivedAt: "2026-04-01T09:00:00Z", signatureProgress: { signed: 2, total: 2 } },
  { id: "doc-12", description: "Water & sanitation bill — March 2026", type: "bill", status: "rejected", date: "28 Mar", receivedAt: "2026-03-28T10:30:00Z", flags: [{ type: "warning", message: "Amount mismatch" }], rejectionReason: "invalid", senderEmail: "accounts@joburg.org.za", source: "email" },
];

const trashDocuments: MockDocument[] = [
  { id: "trash-1", description: "Duplicate invoice from AWS", type: "invoice", status: "rejected", date: "11 Apr", receivedAt: "2026-04-11T12:00:00Z", flags: [{ type: "warning", message: "Duplicate" }] },
  { id: "trash-2", description: "Corrupted scan — illegible receipt", type: "receipt", status: "rejected", date: "7 Apr", receivedAt: "2026-04-07T09:00:00Z" },
  { id: "trash-3", description: "Wrong department — HR onboarding form", type: "contract", status: "rejected", date: "2 Apr", receivedAt: "2026-04-02T14:30:00Z" },
];

// ── Reusable components ──

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function DocumentRow({ doc, onClick }: { doc: MockDocument; onClick: () => void }) {
  const isProcessing = doc.status === "processing";
  const badge = statusBadge[doc.status];
  const Icon = badge?.icon;

  return (
    <div
      className={cn(
        "group flex items-center gap-3.5 px-3 py-3 rounded-lg transition-colors",
        isProcessing ? "opacity-50" : "cursor-pointer hover:bg-muted",
      )}
      onClick={() => !isProcessing && onClick()}
    >
      <div className="relative w-10 h-10 flex-shrink-0">
        <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden ring-1 ring-black/[0.04]">
          {isProcessing ? (
            <div className="w-full h-full bg-gradient-to-r from-border via-muted to-border bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText size={16} className="text-muted-foreground/30" />
            </div>
          )}
        </div>
        {badge && Icon && (
          <div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-card text-white",
              badge.bg,
              doc.status === "processing" && "animate-spin",
            )}
          >
            <Icon size={9} className="stroke-[3]" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate leading-tight">
          <span className={cn("font-semibold", typeTextColors[doc.type] ?? "text-muted-foreground")}>
            {typeLabels[doc.type] ?? doc.type}
          </span>
          <span className="text-muted-foreground/40 mx-1.5">&middot;</span>
          <span className="text-foreground">{doc.description}</span>
        </p>
        {doc.signatureProgress && doc.signatureProgress.total > 0 && (
          <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
            <PenLine size={10} />
            {doc.signatureProgress.signed === doc.signatureProgress.total
              ? `All ${doc.signatureProgress.total} signed`
              : `${doc.signatureProgress.signed} of ${doc.signatureProgress.total} signed`}
          </p>
        )}
      </div>

      <span className="text-[11px] text-muted-foreground/60 tabular-nums flex-shrink-0">
        {doc.date}
      </span>
    </div>
  );
}

function FilterTabs({
  tabs,
  activeKey,
  onChange,
}: {
  tabs: { key: string; label: string; count: number }[];
  activeKey: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors",
            activeKey === tab.key
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          {tab.label}
          <span className={cn(
            "text-[10px] tabular-nums",
            activeKey === tab.key ? "text-background/60" : "text-muted-foreground/50",
          )}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}

function QuickLink({ icon, label, description, onClick }: { icon: React.ReactNode; label: string; description: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted transition-colors text-left group w-full"
    >
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground/60 mt-0.5">{description}</p>
      </div>
      <ArrowRight size={14} className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
    </button>
  );
}

// ── Views ──

type View =
  | { type: "home" }
  | { type: "documents" }
  | { type: "trash" }
  | { type: "detail"; docId: string };

function HomePage({ onNavigate }: { onNavigate: (view: View) => void }) {
  const recentDocs = mockDocuments.slice(0, 6);

  return (
    <div className="flex-1 overflow-hidden min-h-0">
      <div className="px-6 py-4 border-b">
        <h1 className="text-lg font-semibold">Good afternoon</h1>
      </div>
      <div className="h-full flex gap-4 px-6 py-4">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="rounded-lg border flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold">Recent documents</h3>
              <button type="button" onClick={() => onNavigate({ type: "documents" })} className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all</button>
            </div>
            <div className="px-1 py-1 overflow-y-auto flex-1">
              {recentDocs.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} onClick={() => onNavigate({ type: "detail", docId: doc.id })} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentsListPage({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const counts: Record<string, number> = { all: mockDocuments.length };
  for (const d of mockDocuments) {
    counts[d.type] = (counts[d.type] ?? 0) + 1;
  }

  const tabs = Object.entries(counts).map(([key, count]) => ({
    key,
    label: key === "all" ? "All" : (typeLabels[key] ?? key) + "s",
    count,
  }));

  const filtered = activeFilter === "all" ? mockDocuments : mockDocuments.filter((d) => d.type === activeFilter);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-lg font-semibold">Documents</h1>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/60 rounded-md px-3 py-1.5 hover:bg-muted transition-colors">
            <Search size={14} />
            Search...
            <kbd className="text-[10px] bg-background rounded px-1 py-0.5 border">&#8984;K</kbd>
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 text-sm font-medium bg-foreground text-background rounded-md px-3 py-1.5 hover:bg-foreground/90 transition-colors">
            <Upload size={14} />
            Upload
          </button>
        </div>
      </div>

      <div className="flex items-center px-6 py-3 border-b">
        <FilterTabs tabs={tabs} activeKey={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-1">
        {filtered.map((doc) => (
          <DocumentRow key={doc.id} doc={doc} onClick={() => onNavigate({ type: "detail", docId: doc.id })} />
        ))}
      </div>
    </div>
  );
}

function TrashPage({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-lg font-semibold">Trash</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-1">
        {trashDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Trash2 className="size-8 mb-3 opacity-40" />
            <p className="text-sm">Trash is empty</p>
          </div>
        ) : (
          trashDocuments.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onClick={() => onNavigate({ type: "detail", docId: doc.id })} />
          ))
        )}
      </div>
    </div>
  );
}

// Mock audit logs per document
const mockAuditLogs: Record<string, MockAuditLog[]> = {
  "doc-1": [
    { id: "al-1", action: "status_changed", detail: "Status changed to approved", newValue: "approved", userEmail: "daniel@reified.dev", createdAt: "2026-04-15T11:00:00Z" },
    { id: "al-2", action: "fields_edited", detail: "Updated amount field", userEmail: "daniel@reified.dev", createdAt: "2026-04-15T10:30:00Z" },
    { id: "al-3", action: "status_changed", detail: "Status changed to pending", newValue: "pending", createdAt: "2026-04-15T09:30:00Z" },
  ],
  "doc-4": [
    { id: "al-4", action: "flagged", detail: "Document flagged for review", userEmail: "daniel@reified.dev", createdAt: "2026-04-12T10:00:00Z" },
    { id: "al-5", action: "type_changed", detail: "Type changed from receipt to delivery_note", userEmail: "daniel@reified.dev", createdAt: "2026-04-12T09:00:00Z" },
    { id: "al-6", action: "status_changed", detail: "Status changed to pending", newValue: "pending", createdAt: "2026-04-12T08:00:00Z" },
  ],
  "doc-12": [
    { id: "al-7", action: "status_changed", detail: "Document rejected — invalid document", newValue: "rejected", userEmail: "daniel@reified.dev", createdAt: "2026-03-29T14:00:00Z" },
    { id: "al-8", action: "flagged", detail: "Document flagged for review", userEmail: "daniel@reified.dev", createdAt: "2026-03-29T10:00:00Z" },
    { id: "al-9", action: "status_changed", detail: "Status changed to pending", newValue: "pending", createdAt: "2026-03-28T10:30:00Z" },
  ],
};

const rejectReasons = [
  { key: "invalid", label: "Invalid document" },
  { key: "poor_quality", label: "Poor quality" },
  { key: "missing_info", label: "Missing info" },
  { key: "duplicate", label: "Duplicate" },
  { key: "wrong_type", label: "Wrong type" },
  { key: "other", label: "Other" },
];

function AuditIcon({ action, newValue }: { action: string; newValue?: string }) {
  switch (action) {
    case "status_changed":
      if (newValue === "approved" || newValue === "reviewed")
        return <div className="w-[22px] h-[22px] rounded-full bg-emerald-100 flex items-center justify-center"><Check size={11} className="text-emerald-600" /></div>;
      if (newValue === "rejected")
        return <div className="w-[22px] h-[22px] rounded-full bg-red-100 flex items-center justify-center"><X size={11} className="text-red-600" /></div>;
      return <div className="w-[22px] h-[22px] rounded-full bg-muted flex items-center justify-center"><RotateCcw size={11} className="text-muted-foreground" /></div>;
    case "flagged":
    case "unflagged":
      return <div className="w-[22px] h-[22px] rounded-full bg-orange-100 flex items-center justify-center"><Flag size={11} className="text-orange-600" /></div>;
    case "type_changed":
      return <div className="w-[22px] h-[22px] rounded-full bg-blue-100 flex items-center justify-center"><FileText size={11} className="text-blue-600" /></div>;
    case "reprocessed":
      return <div className="w-[22px] h-[22px] rounded-full bg-purple-100 flex items-center justify-center"><RotateCcw size={11} className="text-purple-600" /></div>;
    case "trashed":
      return <div className="w-[22px] h-[22px] rounded-full bg-red-100 flex items-center justify-center"><Trash2 size={11} className="text-red-600" /></div>;
    case "restored":
      return <div className="w-[22px] h-[22px] rounded-full bg-emerald-100 flex items-center justify-center"><RotateCcw size={11} className="text-emerald-600" /></div>;
    case "fields_edited":
    case "description_changed":
      return <div className="w-[22px] h-[22px] rounded-full bg-muted flex items-center justify-center"><PenLine size={11} className="text-muted-foreground" /></div>;
    default:
      return <div className="w-[22px] h-[22px] rounded-full bg-muted flex items-center justify-center"><RotateCcw size={11} className="text-muted-foreground" /></div>;
  }
}

function DocumentDetailPage({ docId, onBack }: { docId: string; onBack: () => void }) {
  const allDocs = [...mockDocuments, ...trashDocuments];
  const [doc, setDoc] = useState(() => allDocs.find((d) => d.id === docId));
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState<string | null>(null);
  const [notifySender, setNotifySender] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (!doc) return <p className="p-6 text-muted-foreground">Document not found</p>;

  const badge = statusBadge[doc.status];
  const extracted = doc.extractedData ?? {};
  const isRejected = doc.status === "rejected";
  const isApproved = doc.status === "approved" || doc.status === "reviewed";
  const isLocked = isRejected || isApproved;
  const flags = doc.flags ?? [];
  const auditLogs = mockAuditLogs[doc.id] ?? [];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={16} />
            Back
          </button>
          <div className="w-px h-5 bg-border" />
          <span className="text-sm text-muted-foreground">Documents</span>
          <ChevronRight size={14} className="text-muted-foreground/30" />
          <h1 className="text-sm font-semibold text-foreground truncate max-w-[300px]">
            {doc.description}
          </h1>
          {badge && (
            <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full text-white", badge.bg)}>
              {badge.label}
            </span>
          )}
          {doc.isFlagged && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              <Flag size={10} />
              Flagged
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("inline-flex items-center rounded-lg border overflow-hidden", isLocked && "opacity-50 pointer-events-none")}>
            <button
              type="button"
              disabled={isLocked}
              onClick={() => { setSelectedType(doc.type); setShowTypeModal(true); }}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 hover:bg-muted transition-colors"
            >
              <FileText size={14} />
              {typeLabels[doc.type] ?? doc.type}
            </button>
            <button
              type="button"
              disabled={isLocked}
              className="px-2 py-1.5 hover:bg-muted transition-colors border-l"
              title="Reprocess"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Left — Document preview */}
        <div className="w-[55%] p-6 overflow-y-auto bg-muted/30">
          <div className="w-full max-w-[85%] mx-auto bg-card rounded-xl shadow-sm border overflow-hidden">
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <FileText size={64} strokeWidth={1} />
              <p className="text-sm mt-3">Document preview</p>
            </div>
          </div>
        </div>

        {/* Right — Details panel */}
        <div className="w-[45%] flex flex-col border-l">
          {/* Tabs */}
          <div className="flex border-b">
            {(["details", "activity"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 text-sm font-medium text-center transition-colors",
                  activeTab === tab
                    ? "text-foreground border-b-2 border-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab === "details" ? "Details" : "Activity"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "details" && (
              <>
                {/* Rejected banner */}
                {isRejected && (
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-red-50 border border-red-200">
                    <div>
                      <p className="text-sm font-medium text-red-800">This document has been rejected</p>
                      <p className="text-xs text-red-600 mt-0.5">It will be permanently deleted in 87 days</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDoc({ ...doc, status: "pending" })}
                      className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md text-red-700 border border-red-200 hover:bg-red-100 transition-colors flex-shrink-0"
                    >
                      <RotateCcw size={12} />
                      Restore
                    </button>
                  </div>
                )}

                {/* Approved banner */}
                {isApproved && (
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div>
                      <p className="text-sm font-medium text-emerald-800">This document has been approved</p>
                      <p className="text-xs text-emerald-600 mt-0.5">Fields are locked. Reopen to make changes.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDoc({ ...doc, status: "pending" })}
                      className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex-shrink-0"
                    >
                      <RotateCcw size={12} />
                      Reopen
                    </button>
                  </div>
                )}

                {/* AI Summary */}
                {doc.aiSummary && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{doc.aiSummary}</p>
                  </div>
                )}

                {/* Source info */}
                {(doc.senderEmail || doc.source) && (
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                    {doc.senderEmail && (
                      <span>From: <span className="text-foreground font-medium">{doc.senderEmail}</span></span>
                    )}
                    {doc.source && (
                      <span>Source: <span className="text-foreground font-medium capitalize">{doc.source}</span></span>
                    )}
                    <span>Received: <span className="text-foreground font-medium">{new Date(doc.receivedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></span>
                  </div>
                )}

                {/* Flags */}
                {flags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">Flags</h3>
                    {flags.map((flag, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-2.5 p-3 rounded-lg border",
                          flag.type === "warning" ? "bg-orange-50 border-orange-200" : "bg-emerald-50 border-emerald-200",
                        )}
                      >
                        <AlertTriangle size={14} className={flag.type === "warning" ? "text-orange-600 mt-0.5" : "text-emerald-600 mt-0.5"} />
                        <p className={cn("text-sm", flag.type === "warning" ? "text-orange-800" : "text-emerald-800")}>
                          {flag.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extracted Data — editable */}
                {Object.keys(extracted).length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="text-sm font-semibold text-foreground">Details</h3>
                    <div className="bg-card rounded-xl border p-4">
                      {Object.entries(extracted).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-2 border-b last:border-b-0 gap-4">
                          <p className="text-xs text-muted-foreground capitalize flex-shrink-0">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                          {editingField === key && !isLocked ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="text-sm font-medium text-right bg-transparent border-b border-foreground outline-none w-32"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setDoc({ ...doc, extractedData: { ...extracted, [key]: editValue } });
                                  setEditingField(null);
                                }}
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                <Check size={14} />
                              </button>
                              <button type="button" onClick={() => setEditingField(null)} className="text-muted-foreground hover:text-foreground">
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => { if (!isLocked) { setEditingField(key); setEditValue(String(value)); } }}
                              className={cn("text-sm font-medium text-right", !isLocked && "hover:text-muted-foreground cursor-pointer")}
                              disabled={isLocked}
                            >
                              {String(value)}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "activity" && (
              <div className="space-y-1">
                {auditLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p className="text-sm">No activity yet</p>
                    <p className="text-xs mt-1">Actions on this document will appear here</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
                    {auditLogs.map((log) => {
                      const date = new Date(log.createdAt);
                      const timeStr = date.toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
                      return (
                        <div key={log.id} className="relative flex gap-3 py-2.5 pl-1">
                          <div className="relative z-10 flex-shrink-0">
                            <AuditIcon action={log.action} newValue={log.newValue} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{log.detail}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-muted-foreground/60">{timeStr}</span>
                              {log.userEmail && <span className="text-[11px] text-muted-foreground/60">{log.userEmail}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between px-6 py-3 border-t">
            <div className="flex items-center gap-1">
              <button type="button" className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Download">
                <Download size={16} />
              </button>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => setDoc({ ...doc, isFlagged: !doc.isFlagged })}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    doc.isFlagged ? "text-orange-500 bg-orange-50 hover:bg-orange-100" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  title={doc.isFlagged ? "Remove flag" : "Flag for review"}
                >
                  <Flag size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isRejected ? (
                <button
                  type="button"
                  onClick={() => setDoc({ ...doc, status: "pending" })}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border hover:bg-muted transition-colors"
                >
                  <RotateCcw size={14} />
                  Restore
                </button>
              ) : isApproved ? (
                <button
                  type="button"
                  onClick={() => setDoc({ ...doc, status: "pending" })}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border hover:bg-muted transition-colors"
                >
                  <RotateCcw size={14} />
                  Reopen
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { setRejectReason(null); setNotifySender(false); setShowRejectModal(true); }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md bg-red-50 text-red-700 border border-red-200/60 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoc({ ...doc, status: "approved" })}
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
                  >
                    <Check size={14} />
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-card rounded-xl border shadow-lg max-w-md w-full mx-4 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Reject document</h2>
              <p className="text-sm text-muted-foreground mt-1">This document will be moved to the bin. You can restore it later if needed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {rejectReasons.map((reason) => (
                  <button
                    key={reason.key}
                    type="button"
                    onClick={() => setRejectReason(rejectReason === reason.key ? null : reason.key)}
                    className={cn(
                      "px-3 py-2 text-sm rounded-lg border transition-colors text-left",
                      rejectReason === reason.key
                        ? "border-red-300 bg-red-50 text-red-700 font-medium"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
            </div>

            {rejectReason && doc.senderEmail && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted border">
                <div>
                  <p className="text-sm font-medium text-foreground">Notify sender</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Send rejection email to {doc.senderEmail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifySender(!notifySender)}
                  className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", notifySender ? "bg-foreground" : "bg-border")}
                >
                  <span className={cn("inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform", notifySender ? "translate-x-[18px]" : "translate-x-[3px]")} />
                </button>
              </div>
            )}

            {rejectReason && !doc.senderEmail && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted border">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notify sender</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">No sender email on this document</p>
                </div>
                <button type="button" disabled className="relative inline-flex h-5 w-9 items-center rounded-full bg-muted cursor-not-allowed">
                  <span className="inline-block h-3.5 w-3.5 rounded-full bg-white translate-x-[3px]" />
                </button>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowRejectModal(false)} className="text-sm font-medium px-4 py-2 rounded-md border hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { setDoc({ ...doc, status: "rejected", rejectionReason: rejectReason ?? undefined }); setShowRejectModal(false); }}
                className="text-sm font-medium px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change type modal */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTypeModal(false)} />
          <div className="relative bg-card rounded-xl border shadow-lg max-w-md w-full mx-4 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Change document type</h2>
              <p className="text-sm text-muted-foreground mt-1">Select a new type. This will reprocess the document with the new extraction schema.</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(typeLabels).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedType(value)}
                  className={cn(
                    "px-3 py-2.5 text-sm rounded-lg border transition-colors text-left",
                    selectedType === value
                      ? "border-foreground bg-muted text-foreground font-medium"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowTypeModal(false)} className="text-sm font-medium px-4 py-2 rounded-md border hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedType || selectedType === doc.type}
                onClick={() => { if (selectedType) { setDoc({ ...doc, type: selectedType }); setShowTypeModal(false); } }}
                className={cn(
                  "text-sm font-medium px-4 py-2 rounded-md transition-colors",
                  !selectedType || selectedType === doc.type
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-foreground text-background hover:bg-foreground/90",
                )}
              >
                Change &amp; Reprocess
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main story shell ──

function IntakeApp() {
  const [view, setView] = useState<View>({ type: "home" });

  const navItems = [
    { title: "Home", url: "#", icon: Home, isActive: view.type === "home", onClick: (e: React.MouseEvent) => { e.preventDefault(); setView({ type: "home" }); } },
    { title: "Documents", url: "#", icon: FileText, isActive: view.type === "documents" || view.type === "detail", onClick: (e: React.MouseEvent) => { e.preventDefault(); setView({ type: "documents" }); } },
    { title: "Trash", url: "#", icon: Trash2, isActive: view.type === "trash", onClick: (e: React.MouseEvent) => { e.preventDefault(); setView({ type: "trash" }); } },
  ];

  const breadcrumbs = [{ label: "Intake" }];
  if (view.type === "documents") breadcrumbs.push({ label: "Documents" });
  else if (view.type === "trash") breadcrumbs.push({ label: "Trash" });
  else if (view.type === "detail") {
    breadcrumbs.push({ label: "Documents" });
    const doc = [...mockDocuments, ...trashDocuments].find((d) => d.id === view.docId);
    if (doc) breadcrumbs.push({ label: typeLabels[doc.type] ?? doc.type });
  } else {
    breadcrumbs.push({ label: "Home" });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs} navItems={navItems} onSignOut={() => {}}>
      {view.type === "home" && <HomePage onNavigate={setView} />}
      {view.type === "documents" && <DocumentsListPage onNavigate={setView} />}
      {view.type === "trash" && <TrashPage onNavigate={setView} />}
      {view.type === "detail" && <DocumentDetailPage docId={view.docId} onBack={() => setView({ type: "documents" })} />}
    </AppLayout>
  );
}

const meta: Meta = {
  title: "Pages/Intake",
  component: IntakeApp,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;
export const Default: Story = {};
