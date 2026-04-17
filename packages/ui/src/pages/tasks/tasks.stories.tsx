import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "../../components/app-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  ArrowLeft,
  Clock,
  Loader2,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Send,
  XCircle,
  User,
  Copy,
  Check,
  ChevronRight,
  Bot,
  Wrench,
  ListTodo,
  Building2,
  Calculator,
  Scale,
  Users,
  Code,
  Megaphone,
  UserPlus,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Types ──

interface Task {
  id: string;
  department: string;
  traceId: string;
  type: string;
  status: "pending" | "assigned" | "processing" | "awaiting_approval" | "completed" | "failed";
  assignedTo?: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceMessage {
  id: string;
  traceId: string;
  from: string;
  to: string;
  type: "task" | "approval" | "action" | "system";
  body: string;
  timestamp: string;
}

// ── Status config ──

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200/60", icon: Clock },
  assigned: { label: "Assigned", className: "bg-blue-50 text-blue-700 border-blue-200/60", icon: MessageSquare },
  processing: { label: "Processing", className: "bg-blue-50 text-blue-700 border-blue-200/60", icon: Loader2 },
  awaiting_approval: { label: "Approval", className: "bg-amber-50 text-amber-700 border-amber-200/60", icon: AlertTriangle },
  completed: { label: "Done", className: "bg-emerald-50 text-emerald-700 border-emerald-200/60", icon: CheckCircle2 },
  failed: { label: "Failed", className: "bg-red-50 text-red-700 border-red-200/60", icon: AlertTriangle },
};

// ── Departments ──

const departments: { slug: string; label: string; icon: LucideIcon; description: string }[] = [
  { slug: "accounting", label: "Accounting", icon: Calculator, description: "Invoices, expenses, payments" },
  { slug: "legal", label: "Legal", icon: Scale, description: "Contracts, compliance, reviews" },
  { slug: "hr", label: "Human Resources", icon: Users, description: "Hiring, onboarding, leave" },
  { slug: "engineering", label: "Engineering", icon: Code, description: "Bugs, deployments, infra" },
  { slug: "marketing", label: "Marketing", icon: Megaphone, description: "Campaigns, content, analytics" },
];

// ── Mock data ──

const mockTasks: Task[] = [
  // Accounting
  {
    id: "tsk-001-abc",
    department: "accounting",
    traceId: "tr-001",
    type: "invoice-processing",
    status: "awaiting_approval",
    assignedTo: "accounting-agent",
    body: "Process invoice #INV-2024-0847 from Stellar Technologies for R45,200.00 — cloud hosting services for March 2024. Please verify line items against the service agreement.",
    createdAt: "2024-04-15T09:30:00Z",
    updatedAt: "2024-04-15T10:15:00Z",
  },
  {
    id: "tsk-002-def",
    department: "accounting",
    traceId: "tr-002",
    type: "expense-report",
    status: "processing",
    assignedTo: "accounting-agent",
    body: "Review and reconcile Q1 expense reports for the engineering team. Total submitted: R128,450. Flag any items over R5,000 for manual review.",
    createdAt: "2024-04-14T14:00:00Z",
    updatedAt: "2024-04-15T08:00:00Z",
  },
  {
    id: "tsk-003-ghi",
    department: "accounting",
    traceId: "tr-003",
    type: "payment",
    status: "completed",
    assignedTo: "accounting-agent",
    body: "Schedule payment for vendor Atlas Corp — R12,800 due by end of week. Bank details confirmed.",
    createdAt: "2024-04-13T11:00:00Z",
    updatedAt: "2024-04-14T09:30:00Z",
  },
  {
    id: "tsk-004-jkl",
    department: "accounting",
    traceId: "tr-004",
    type: "request",
    status: "pending",
    body: "Can you pull a profit and loss summary for the last 6 months? Need it for the board deck.",
    createdAt: "2024-04-15T11:45:00Z",
    updatedAt: "2024-04-15T11:45:00Z",
  },
  // Legal
  {
    id: "tsk-005-mno",
    department: "legal",
    traceId: "tr-005",
    type: "contract-review",
    status: "awaiting_approval",
    assignedTo: "legal-agent",
    body: "Review NDA with Horizon Partners — standard mutual NDA template. Flagged clause 7.2 (non-compete scope) as potentially too broad. Recommend narrowing to 12 months and SA jurisdiction only.",
    createdAt: "2024-04-14T16:00:00Z",
    updatedAt: "2024-04-15T09:00:00Z",
  },
  {
    id: "tsk-006-pqr",
    department: "legal",
    traceId: "tr-006",
    type: "compliance",
    status: "completed",
    body: "POPIA compliance check for the new customer onboarding flow. All data processing activities documented and consent mechanisms verified.",
    createdAt: "2024-04-12T10:00:00Z",
    updatedAt: "2024-04-13T15:00:00Z",
  },
  // HR
  {
    id: "tsk-007-stu",
    department: "hr",
    traceId: "tr-007",
    type: "onboarding",
    status: "processing",
    assignedTo: "hr-agent",
    body: "Prepare onboarding pack for new senior developer starting 22 April. IT access, Slack channels, welcome doc, and first-week schedule.",
    createdAt: "2024-04-15T08:00:00Z",
    updatedAt: "2024-04-15T08:30:00Z",
  },
  {
    id: "tsk-008-vwx",
    department: "hr",
    traceId: "tr-008",
    type: "leave-request",
    status: "awaiting_approval",
    assignedTo: "hr-agent",
    body: "Annual leave request from Sarah Chen — 28 April to 9 May (8 working days). Has 14 days remaining balance. No conflicts with team schedule.",
    createdAt: "2024-04-14T11:00:00Z",
    updatedAt: "2024-04-14T11:30:00Z",
  },
  // Engineering
  {
    id: "tsk-009-yza",
    department: "engineering",
    traceId: "tr-009",
    type: "incident",
    status: "processing",
    assignedTo: "engineering-agent",
    body: "Investigate elevated error rate on payments API — 5xx responses jumped from 0.1% to 2.3% starting at 14:00 UTC. Likely related to the database migration deployed at 13:45.",
    createdAt: "2024-04-15T14:15:00Z",
    updatedAt: "2024-04-15T14:20:00Z",
  },
  {
    id: "tsk-010-bcd",
    department: "engineering",
    traceId: "tr-010",
    type: "deployment",
    status: "completed",
    assignedTo: "engineering-agent",
    body: "Deploy v2.4.1 hotfix to production — fixes the PDF rendering issue in Safari. All tests passing, staging verified.",
    createdAt: "2024-04-14T16:30:00Z",
    updatedAt: "2024-04-14T17:00:00Z",
  },
  {
    id: "tsk-011-efg",
    department: "engineering",
    traceId: "tr-011",
    type: "request",
    status: "pending",
    body: "Set up monitoring dashboards for the new document processing pipeline. Need latency percentiles, error rates, and queue depth.",
    createdAt: "2024-04-15T10:00:00Z",
    updatedAt: "2024-04-15T10:00:00Z",
  },
  // Marketing
  {
    id: "tsk-012-hij",
    department: "marketing",
    traceId: "tr-012",
    type: "campaign",
    status: "awaiting_approval",
    assignedTo: "marketing-agent",
    body: "Draft email campaign for product launch — 3-email sequence targeting existing customers. Subject lines A/B tested, copy reviewed. Ready for final sign-off before scheduling.",
    createdAt: "2024-04-14T09:00:00Z",
    updatedAt: "2024-04-15T11:00:00Z",
  },
  {
    id: "tsk-013-klm",
    department: "marketing",
    traceId: "tr-013",
    type: "analytics",
    status: "completed",
    assignedTo: "marketing-agent",
    body: "Q1 marketing performance report — website traffic up 23%, conversion rate improved to 3.2%, CAC reduced by 15%. Full breakdown by channel attached.",
    createdAt: "2024-04-10T14:00:00Z",
    updatedAt: "2024-04-11T09:00:00Z",
  },
];

const mockMessages: ServiceMessage[] = [
  {
    id: "msg-001",
    traceId: "tr-001",
    from: "gateway",
    to: "accounting",
    type: "task",
    body: "Process invoice #INV-2024-0847 from Stellar Technologies for R45,200.00 — cloud hosting services for March 2024. Please verify line items against the service agreement.",
    timestamp: "2024-04-15T09:30:00Z",
  },
  {
    id: "msg-002",
    traceId: "tr-001",
    from: "accounting-agent",
    to: "gateway",
    type: "system",
    body: "Invoice received. I've extracted the line items:\n• Cloud compute (m5.xlarge × 3): R28,500\n• Storage (S3 + EBS): R8,200\n• Support plan (Business): R8,500\n\nTotal matches the invoice amount of R45,200.00. All items align with the service agreement dated 2024-01-15. Ready for approval.",
    timestamp: "2024-04-15T10:10:00Z",
  },
  {
    id: "msg-003",
    traceId: "tr-001",
    from: "accounting-agent",
    to: "gateway",
    type: "approval",
    body: "Task requires your approval. The invoice line items have been verified against the service agreement. Recommend approving payment.",
    timestamp: "2024-04-15T10:15:00Z",
  },
];

const mockAgentEntries = [
  { type: "status" as const, text: "Agent started", timestamp: "10:10:02" },
  { type: "tool" as const, text: "extract_invoice_data", detail: "Parsing PDF invoice...", timestamp: "10:10:05" },
  { type: "tool" as const, text: "lookup_service_agreement", detail: "Matching vendor: Stellar Technologies", timestamp: "10:10:12" },
  { type: "tool" as const, text: "verify_line_items", detail: "Cross-referencing 3 line items", timestamp: "10:10:18" },
  { type: "message" as const, text: "All line items verified against service agreement. Total matches. Moving to approval.", timestamp: "10:10:22" },
  { type: "status" as const, text: "Agent idle — awaiting approval", timestamp: "10:10:23" },
];

// ── Helpers ──

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ── Nav items builder ──

function buildNavItems(activePage: string, onNavigate: (page: string) => void) {
  const handle = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
  };

  return [
    { title: "My Tasks", url: "#", icon: ListTodo, isActive: activePage === "home", onClick: handle("home") },
    {
      title: "Departments",
      url: "#",
      icon: Building2,
      isActive: activePage !== "home",
      items: departments.map((d) => ({
        title: d.label,
        url: "#",
        onClick: handle(d.slug),
      })),
    },
  ];
}

// ── Story wrapper ──

function StoryShell({
  children,
  breadcrumbs,
  activePage = "home",
  onNavigate,
}: {
  children: React.ReactNode;
  breadcrumbs: { label: string; href?: string }[];
  activePage?: string;
  onNavigate: (page: string) => void;
}) {
  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      services={[
        { name: "Tasks", logo: ListTodo, description: "AI-powered task management" },
      ]}
      navItems={buildNavItems(activePage, onNavigate)}
      onSignOut={() => {}}
    >
      {children}
    </AppLayout>
  );
}

// ── Mock team members ──

const teamMembers = [
  { id: "u1", name: "Sarah Chen", avatar: "SC" },
  { id: "u2", name: "James Moyo", avatar: "JM" },
  { id: "u3", name: "Priya Naidoo", avatar: "PN" },
  { id: "u4", name: "David Kim", avatar: "DK" },
  { id: "u5", name: "Lerato Molefe", avatar: "LM" },
];

// ── Shared: Assign button ──

function AssignButton({ assignedTo, onAssign }: { assignedTo?: string; onAssign: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = query
    ? teamMembers.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
    : teamMembers;

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(true); setQuery(""); }}
        className={cn(
          "inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md transition-colors",
          assignedTo
            ? "text-muted-foreground hover:bg-muted"
            : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted border border-dashed border-border",
        )}
      >
        {assignedTo ? (
          <>
            <span className="size-4 rounded-full bg-foreground/10 flex items-center justify-center text-[8px] font-bold uppercase">
              {assignedTo.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </span>
            {assignedTo}
          </>
        ) : (
          <>
            <UserPlus size={11} />
            Assign
          </>
        )}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-1/3 translate-y-0 p-0 overflow-hidden" showCloseButton={false}>
          <DialogHeader className="sr-only">
            <DialogTitle>Assign team member</DialogTitle>
            <DialogDescription>Search for a team member to assign to this task</DialogDescription>
          </DialogHeader>
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b">
            <Search size={14} className="text-muted-foreground/50 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search team members..."
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground/50"
              autoFocus
            />
          </div>
          {/* Results */}
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No members found</p>
            ) : (
              <div className="px-1">
                <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Team members</p>
                {filtered.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { onAssign(m.name); setOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2 py-2 text-sm rounded-lg transition-colors",
                      assignedTo === m.name ? "bg-muted" : "hover:bg-muted",
                    )}
                  >
                    <span className="size-7 rounded-full bg-foreground/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {m.avatar}
                    </span>
                    <span className="flex-1 text-left">{m.name}</span>
                    {assignedTo === m.name && (
                      <Check size={14} className="text-emerald-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
            {assignedTo && (
              <div className="px-1 border-t mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => { onAssign(""); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <XCircle size={14} />
                  Unassign {assignedTo}
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Shared: Task card ──

function TaskCard({
  task,
  onClick,
  showDepartment,
}: {
  task: Task;
  onClick: () => void;
  showDepartment?: boolean;
}) {
  const config = statusConfig[task.status] ?? statusConfig.pending;
  const StatusIcon = config.icon;
  const dept = departments.find((d) => d.slug === task.department);
  const DeptIcon = dept?.icon ?? Building2;
  const [assignee, setAssignee] = useState(task.assignedTo ?? "");

  return (
    <div
      className="border rounded-lg hover:border-foreground/20 transition-colors overflow-hidden cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
      role="button"
      tabIndex={0}
    >
      {/* Body */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-sm text-foreground line-clamp-2 leading-relaxed mb-2">{task.body}</p>
        {task.type && task.type !== "request" && (
          <span className="text-[11px] text-muted-foreground capitalize">{task.type.replace(/-/g, " ")}</span>
        )}
      </div>
      {/* Footer */}
      <div className="px-4 py-2.5 bg-muted/30 border-t flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {showDepartment && dept && (
            <span className="inline-flex items-center gap-1.5 font-medium">
              <DeptIcon size={11} />
              {dept.label}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={11} />
            {formatDateTime(task.createdAt)}
          </span>
          <AssignButton assignedTo={assignee} onAssign={setAssignee} />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border",
            config.className,
          )}
        >
          <StatusIcon size={10} />
          {config.label}
          <ChevronRight size={11} />
        </span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// Page: My Tasks (Home)
// ════════════════════════════════════════

function MyTasksPage({ onSelectTask }: { onSelectTask: (id: string) => void }) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const myTasks = mockTasks
    .filter((t) => t.status === "awaiting_approval" || t.status === "processing" || t.status === "assigned")
    .filter((t) => statusFilter === "all" || t.status === statusFilter);

  const approvalCount = mockTasks.filter((t) => t.status === "awaiting_approval").length;
  const processingCount = mockTasks.filter((t) => t.status === "processing").length;
  const completedCount = mockTasks.filter((t) => t.status === "completed").length;

  const filters = ["all", "awaiting_approval", "processing"] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tasks assigned to you across all departments
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Awaiting Approval</p>
          <p className="text-2xl font-semibold mt-1 text-amber-600">{approvalCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Processing</p>
          <p className="text-2xl font-semibold mt-1 text-blue-600">{processingCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-semibold mt-1 text-emerald-600">{completedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-md transition-colors capitalize",
              statusFilter === f
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {f === "all" ? "All" : f === "awaiting_approval" ? "Approval" : f}
          </button>
        ))}
      </div>

      {/* Task list */}
      {myTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <CheckCircle2 className="size-8 mb-3 opacity-40" />
          <p className="text-sm">You're all caught up</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onSelectTask(task.id)}
              showDepartment
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// Page: Department task list
// ════════════════════════════════════════

const departmentFilters = ["all", "awaiting_approval", "processing", "pending", "completed"] as const;

function DepartmentPage({
  slug,
  onSelectTask,
}: {
  slug: string;
  onSelectTask: (id: string) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const dept = departments.find((d) => d.slug === slug);
  const tasks = mockTasks
    .filter((t) => t.department === slug)
    .filter((t) => statusFilter === "all" || t.status === statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{dept?.label ?? slug}</h1>
        <p className="text-sm text-muted-foreground mt-1">{dept?.description}</p>
      </div>

      <div className="flex gap-1">
        {departmentFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-md transition-colors capitalize",
              statusFilter === f
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {f === "all" ? "All" : f === "awaiting_approval" ? "Approval" : f}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">No tasks found</div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onSelectTask(task.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// Page: Task Detail
// ════════════════════════════════════════

function TaskDetailPage({
  taskId,
  onBack,
}: {
  taskId: string;
  onBack: () => void;
}) {
  const task = mockTasks.find((t) => t.id === taskId) ?? mockTasks[0]!;
  const messages = mockMessages.filter((m) => m.traceId === task.traceId);
  const config = statusConfig[task.status] ?? statusConfig.pending;
  const StatusIcon = config.icon;
  const dept = departments.find((d) => d.slug === task.department);
  const isAwaitingApproval = task.status === "awaiting_approval";
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to {dept?.label ?? task.department}
      </button>

      {/* Task card */}
      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium leading-relaxed">{task.body}</p>
          <span
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border",
              config.className,
            )}
          >
            <StatusIcon size={11} />
            {config.label}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {task.type && task.type !== "request" && (
            <div className="flex items-center gap-1.5">
              <MessageSquare size={12} />
              <span className="capitalize">{task.type.replace(/-/g, " ")}</span>
            </div>
          )}
          {task.assignedTo && (
            <div className="flex items-center gap-1.5">
              <User size={12} />
              <span>{task.assignedTo}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{formatDateTime(task.createdAt)}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted/60 hover:bg-muted transition-colors font-mono text-[11px] text-muted-foreground"
          >
            <span className="max-w-[120px] truncate">{task.id}</span>
            {copied ? (
              <Check size={10} className="shrink-0 text-emerald-500" />
            ) : (
              <Copy size={10} className="shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Agent stream */}
      {task.status === "awaiting_approval" && (
        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-muted/50 border-b flex items-center gap-2">
            <Bot size={13} className="text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Agent Activity</span>
            <span className="ml-auto text-[10px] text-muted-foreground/60">idle</span>
          </div>
          <div className="px-4 py-3 space-y-2 max-h-48 overflow-y-auto text-xs">
            {mockAgentEntries.map((entry, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[10px] text-muted-foreground/50 tabular-nums shrink-0 mt-0.5 w-12">
                  {entry.timestamp}
                </span>
                {entry.type === "tool" ? (
                  <div className="flex items-start gap-1.5">
                    <Wrench size={11} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-blue-600">{entry.text}</span>
                      {entry.detail && (
                        <span className="text-muted-foreground ml-1.5">— {entry.detail}</span>
                      )}
                    </div>
                  </div>
                ) : entry.type === "message" ? (
                  <div className="flex items-start gap-1.5">
                    <Bot size={11} className="text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-foreground">{entry.text}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">{entry.text}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Messages</h3>
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="border rounded-lg p-4 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium">
                    {msg.from === "gateway" ? "You" : msg.from}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatDateTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval section */}
      {isAwaitingApproval && (
        <div className="border rounded-lg p-5 space-y-3">
          <h3 className="text-sm font-semibold">Action required</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment..."
            rows={2}
            className="w-full text-sm p-3 rounded-md border bg-muted/30 outline-none focus:border-ring resize-none placeholder:text-muted-foreground/50"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <XCircle size={12} />
              Reject
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <CheckCircle2 size={12} />
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// Stories
// ════════════════════════════════════════

const meta: Meta = {
  title: "Pages/Tasks",
  parameters: { layout: "fullscreen" },
};
export default meta;

type View =
  | { page: "home" }
  | { page: "department"; slug: string }
  | { page: "detail"; slug: string; taskId: string };

function TasksApp() {
  const [view, setView] = useState<View>({ page: "home" });

  const activePage = view.page === "home" ? "home" : view.slug;

  const handleNavigate = (page: string) => {
    if (page === "home") {
      setView({ page: "home" });
    } else {
      setView({ page: "department", slug: page });
    }
  };

  const deptLabel = view.page !== "home"
    ? departments.find((d) => d.slug === view.slug)?.label ?? view.slug
    : "";

  const breadcrumbs =
    view.page === "home"
      ? [{ label: "Tasks" }, { label: "My Tasks" }]
      : view.page === "department"
        ? [{ label: "Tasks" }, { label: deptLabel }]
        : [{ label: "Tasks" }, { label: deptLabel, href: "#" }, { label: "Task" }];

  return (
    <StoryShell breadcrumbs={breadcrumbs} activePage={activePage} onNavigate={handleNavigate}>
      {view.page === "home" && (
        <MyTasksPage
          onSelectTask={(id) => {
            const task = mockTasks.find((t) => t.id === id);
            setView({ page: "detail", slug: task?.department ?? "accounting", taskId: id });
          }}
        />
      )}
      {view.page === "department" && (
        <DepartmentPage
          slug={view.slug}
          onSelectTask={(id) => setView({ page: "detail", slug: view.slug, taskId: id })}
        />
      )}
      {view.page === "detail" && (
        <TaskDetailPage
          taskId={view.taskId}
          onBack={() => {
            // Go back to department if we came from one, otherwise home
            if (view.slug) {
              setView({ page: "department", slug: view.slug });
            } else {
              setView({ page: "home" });
            }
          }}
        />
      )}
    </StoryShell>
  );
}

export const Default: StoryObj = {
  render: () => <TasksApp />,
};
