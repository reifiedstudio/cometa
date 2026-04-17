import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "../../components/app-layout";
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
  Users,
  Settings2,
  Plus,
  X,
  Check,
  MoreHorizontal,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Auth data (mirrors @cometa/auth capabilities) ──

interface Capability {
  key: string;
  name: string;
  domain: string;
}

interface Role {
  key: string;
  name: string;
  description: string;
  capabilities: string[];
  isAdmin?: boolean;
}

const ROLES: Role[] = [
  { key: "org:admin", name: "Admin", description: "Full access to everything", capabilities: [], isAdmin: true },
  { key: "org:accounting_member", name: "Accounting", description: "Financial operations, invoices, reports", capabilities: ["dept:accounting", "accounting:view", "accounting:manage", "documents:list", "documents:read", "documents:search", "drive:list", "drive:handoff", "drive:access", "notes:create", "mcp:access"] },
  { key: "org:legal_member", name: "Legal", description: "Contracts, compliance, signatures", capabilities: ["dept:legal", "documents:list", "documents:read", "documents:search", "documents:approve", "signatures:request", "signatures:read", "signatures:cancel", "signatures:nudge", "signatures:manage", "signatures:audit", "drive:list", "drive:handoff", "drive:access", "notes:create", "utilities:create_document", "utilities:convert_pdf", "mcp:access"] },
  { key: "org:operations_member", name: "Operations", description: "Business operations, documents", capabilities: ["dept:operations", "documents:list", "documents:read", "documents:search", "drive:list", "drive:access", "notes:create", "mcp:access"] },
  { key: "org:hr_member", name: "HR", description: "People management, signatures", capabilities: ["dept:hr", "documents:list", "documents:read", "documents:search", "signatures:request", "signatures:read", "signatures:nudge", "drive:list", "drive:handoff", "drive:access", "notes:create", "mcp:access"] },
  { key: "org:member", name: "Member", description: "Basic access only", capabilities: ["documents:list", "documents:read", "drive:list", "drive:access", "mcp:access"] },
];

const CAPABILITIES: Capability[] = [
  { key: "dept:accounting", name: "Accounting department", domain: "departments" },
  { key: "dept:legal", name: "Legal department", domain: "departments" },
  { key: "dept:operations", name: "Operations department", domain: "departments" },
  { key: "dept:hr", name: "HR department", domain: "departments" },
  { key: "documents:list", name: "List documents", domain: "documents" },
  { key: "documents:read", name: "Read documents", domain: "documents" },
  { key: "documents:search", name: "Search documents", domain: "documents" },
  { key: "documents:approve", name: "Approve documents", domain: "documents" },
  { key: "documents:delete", name: "Delete documents", domain: "documents" },
  { key: "signatures:request", name: "Request signatures", domain: "signatures" },
  { key: "signatures:read", name: "View signatures", domain: "signatures" },
  { key: "signatures:cancel", name: "Cancel signatures", domain: "signatures" },
  { key: "signatures:nudge", name: "Nudge signers", domain: "signatures" },
  { key: "signatures:manage", name: "Manage signers", domain: "signatures" },
  { key: "signatures:audit", name: "View audit trail", domain: "signatures" },
  { key: "tasks:send", name: "Send messages", domain: "tasks" },
  { key: "tasks:read", name: "View tasks", domain: "tasks" },
  { key: "tasks:action", name: "Act on tasks", domain: "tasks" },
  { key: "accounting:view", name: "View financials", domain: "accounting" },
  { key: "accounting:manage", name: "Manage financials", domain: "accounting" },
  { key: "drive:create", name: "Create files", domain: "drive" },
  { key: "drive:list", name: "List files", domain: "drive" },
  { key: "drive:handoff", name: "Handoff files", domain: "drive" },
  { key: "drive:access", name: "Manage file access", domain: "drive" },
  { key: "notes:create", name: "Create notes", domain: "notes" },
  { key: "utilities:create_document", name: "Create branded documents", domain: "utilities" },
  { key: "utilities:convert_pdf", name: "Convert to PDF", domain: "utilities" },
  { key: "mcp:access", name: "MCP access", domain: "gateway" },
];

const ALL_CAPABILITY_KEYS = CAPABILITIES.map((c) => c.key);

function getCapabilitiesByDomain() {
  const grouped: Record<string, Capability[]> = {};
  for (const cap of CAPABILITIES) {
    if (!grouped[cap.domain]) grouped[cap.domain] = [];
    grouped[cap.domain].push(cap);
  }
  return grouped;
}

function getEffectiveCapabilities(role: string) {
  const roleDef = ROLES.find((r) => r.key === role);
  if (roleDef?.isAdmin) return [...ALL_CAPABILITY_KEYS];
  return roleDef?.capabilities ?? [];
}

// ── Mock members ──

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
  joinedAt: string;
  /** Per-user capability overrides (on top of role) */
  extraCapabilities: string[];
}

const MOCK_MEMBERS: Member[] = [
  { id: "1", firstName: "Daniel", lastName: "Lourie", email: "daniel@reified.studio", role: "org:member", joinedAt: "2026-04-12", extraCapabilities: ["documents:search"] },
  { id: "2", firstName: "Daniel", lastName: "Lourie", email: "daniel.robert.lourie@gmail.com", avatar: "https://ui-avatars.com/api/?name=DL&background=7c3aed&color=fff", role: "org:admin", joinedAt: "2026-04-12", extraCapabilities: [] },
  { id: "3", firstName: "Sarah", lastName: "Chen", email: "sarah@reified.studio", avatar: "https://ui-avatars.com/api/?name=SC&background=059669&color=fff", role: "org:accounting_member", joinedAt: "2026-04-10", extraCapabilities: [] },
  { id: "4", firstName: "James", lastName: "Park", email: "james@reified.studio", avatar: "https://ui-avatars.com/api/?name=JP&background=2563eb&color=fff", role: "org:legal_member", joinedAt: "2026-04-08", extraCapabilities: ["accounting:view"] },
  { id: "5", firstName: "Lisa", lastName: "Nguyen", email: "lisa@reified.studio", avatar: "https://ui-avatars.com/api/?name=LN&background=dc2626&color=fff", role: "org:hr_member", joinedAt: "2026-04-06", extraCapabilities: [] },
];

const ROLE_STYLES: Record<string, string> = {
  "org:admin": "bg-violet-50 text-violet-700",
  "org:accounting_member": "bg-emerald-50 text-emerald-700",
  "org:legal_member": "bg-blue-50 text-blue-700",
  "org:operations_member": "bg-amber-50 text-amber-700",
  "org:hr_member": "bg-rose-50 text-rose-700",
  "org:member": "bg-muted text-muted-foreground",
};

// ── Nav ──

const navItems: {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
}[] = [
  { title: "Members", url: "#members", icon: Users, isActive: true },
];

// ── Helpers ──

function roleName(key: string) {
  return ROLES.find((r) => r.key === key)?.name ?? "Member";
}

function Avatar({ member, size = "sm" }: { member: Member; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "size-12 text-lg" : "size-8 text-xs";
  if (member.avatar) {
    return <img src={member.avatar} alt="" className={`${cls} rounded-full`} />;
  }
  return (
    <div className={`${cls} rounded-full bg-violet-100 flex items-center justify-center font-medium text-violet-700`}>
      {member.firstName[0]}{member.lastName[0]}
    </div>
  );
}

// ── Component ──

function AdminMembers() {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const selectedMember = selectedMemberId ? members.find((m) => m.id === selectedMemberId) : null;

  const handleChangeRole = (memberId: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
    );
  };

  const handleToggleCapability = (memberId: string, capKey: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const roleCaps = getEffectiveCapabilities(m.role);
        const fromRole = roleCaps.includes(capKey);
        if (fromRole) return m; // Can't toggle off role-granted caps
        const has = m.extraCapabilities.includes(capKey);
        return {
          ...m,
          extraCapabilities: has
            ? m.extraCapabilities.filter((c) => c !== capKey)
            : [...m.extraCapabilities, capKey],
        };
      }),
    );
  };

  const breadcrumbs = selectedMember
    ? [{ label: "Admin" }, { label: "Members", href: "#members" }, { label: `${selectedMember.firstName} ${selectedMember.lastName}` }]
    : [{ label: "Admin" }, { label: "Members" }];

  return (
    // biome-ignore lint: click handler for sidebar nav interception
    <div onClick={(e) => {
      const target = (e.target as HTMLElement).closest("a[href='#members']");
      if (target) { e.preventDefault(); setSelectedMemberId(null); }
    }}>
      <AppLayout
        breadcrumbs={breadcrumbs}
        services={[
          { name: "Admin", logo: Settings2, description: "Organization management" },
        ]}
        navItems={navItems}
      >
        {selectedMember ? (
          <MemberDetailPage
            member={selectedMember}
            onBack={() => setSelectedMemberId(null)}
            onChangeRole={(role) => handleChangeRole(selectedMember.id, role)}
            onToggleCapability={(capKey) => handleToggleCapability(selectedMember.id, capKey)}
          />
        ) : (
          <MembersListPage
            members={members}
            onSelectMember={(id) => setSelectedMemberId(id)}
            onInvite={() => setShowInvite(true)}
          />
        )}

        {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      </AppLayout>
    </div>
  );
}

// ── Members List Page ──

function MembersListPage({
  members,
  onSelectMember,
  onInvite,
}: {
  members: Member[];
  onSelectMember: (id: string) => void;
  onInvite: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Members</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage organization members and their roles
          </p>
        </div>
        <button
          type="button"
          onClick={onInvite}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" />
          Invite
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <p className="text-2xl font-semibold mt-1">{members.length}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Roles</p>
          <p className="text-2xl font-semibold mt-1">{ROLES.length}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Capabilities</p>
          <p className="text-2xl font-semibold mt-1">{CAPABILITIES.length}</p>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow
                key={member.id}
                className="cursor-pointer"
                onClick={() => onSelectMember(member.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar member={member} />
                    <div>
                      <p className="text-sm font-medium">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${ROLE_STYLES[member.role] ?? ROLE_STYLES["org:member"]}`}
                  >
                    {roleName(member.role)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(member.joinedAt).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <MoreHorizontal className="size-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Member Detail Page ──

function MemberDetailPage({
  member,
  onBack,
  onChangeRole,
  onToggleCapability,
}: {
  member: Member;
  onBack: () => void;
  onChangeRole: (role: string) => void;
  onToggleCapability: (capKey: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const roleCaps = getEffectiveCapabilities(member.role);
  const capsByDomain = getCapabilitiesByDomain();
  const roleDef = ROLES.find((r) => r.key === member.role);

  return (
    <div className="space-y-6">
      {/* Back + Profile header */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to members
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar member={member} size="lg" />
            <div>
              <h1 className="text-xl font-semibold">
                {member.firstName} {member.lastName}
              </h1>
              <p className="text-sm text-muted-foreground">{member.email}</p>
              <span
                className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${ROLE_STYLES[member.role] ?? ROLE_STYLES["org:member"]}`}
              >
                {roleName(member.role)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              editing
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border hover:bg-muted/50"
            }`}
          >
            {editing ? (
              <>
                <Check className="size-4" />
                Done
              </>
            ) : (
              <>
                <Pencil className="size-4" />
                Edit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two-column layout: Role + Capabilities */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Role */}
        <div>
          <h2 className="text-sm font-medium mb-3">Role</h2>
          {editing ? (
            <div className="space-y-1.5">
              {ROLES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => onChangeRole(r.key)}
                  className={`w-full text-left flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    member.role === r.key
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </div>
                  {member.role === r.key && (
                    <Check className="size-4 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">{roleDef?.name ?? "Member"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{roleDef?.description}</p>
            </div>
          )}
        </div>

        {/* Capabilities */}
        <div>
          <h2 className="text-sm font-medium mb-3">
            Capabilities
            {roleDef?.isAdmin && (
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                (admin — all granted)
              </span>
            )}
          </h2>
          <div className="rounded-lg border divide-y">
            {Object.entries(capsByDomain).map(([domain, caps]) => (
              <div key={domain} className="p-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  {domain}
                </p>
                <div className="space-y-1">
                  {caps.map((cap) => {
                    const fromRole = roleCaps.includes(cap.key);
                    const isExtra = member.extraCapabilities.includes(cap.key);
                    const hasIt = roleDef?.isAdmin || fromRole || isExtra;

                    return (
                      <div
                        key={cap.key}
                        className="flex items-center justify-between py-1 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-2 rounded-full ${
                              hasIt ? "bg-emerald-500" : "bg-muted-foreground/20"
                            }`}
                          />
                          <span className={hasIt ? "" : "text-muted-foreground"}>{cap.name}</span>
                          {isExtra && !fromRole && (
                            <span className="text-[10px] px-1 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                              custom
                            </span>
                          )}
                        </div>
                        {roleDef?.isAdmin ? (
                          <span className="text-xs text-muted-foreground">admin</span>
                        ) : editing ? (
                          <button
                            type="button"
                            onClick={() => onToggleCapability(cap.key)}
                            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
                              hasIt ? "bg-primary" : "bg-muted"
                            }`}
                          >
                            <span
                              className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform mt-[3px] ${
                                hasIt ? "translate-x-[18px]" : "translate-x-[3px]"
                              }`}
                            />
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {fromRole ? "role" : isExtra ? "custom" : "—"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Invite Modal ──

function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("org:member");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Invite Member</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <div className="space-y-1">
              {ROLES.map((r) => (
                <label
                  key={r.key}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    role === r.key
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.key}
                    checked={role === r.key}
                    onChange={() => setRole(r.key)}
                    className="sr-only"
                  />
                  <div
                    className={`size-4 rounded-full border-2 flex items-center justify-center ${
                      role === r.key
                        ? "border-primary"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {role === r.key && (
                      <div className="size-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!email}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Story ──

const meta: Meta = {
  title: "Pages/Admin",
  component: AdminMembers,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Members: Story = {};

function AdminMemberDetail() {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const member = members[1]; // Daniel Lourie (Admin)

  const handleChangeRole = (newRole: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m)),
    );
  };

  const handleToggleCapability = (capKey: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== member.id) return m;
        const roleCaps = getEffectiveCapabilities(m.role);
        if (roleCaps.includes(capKey)) return m;
        const has = m.extraCapabilities.includes(capKey);
        return {
          ...m,
          extraCapabilities: has
            ? m.extraCapabilities.filter((c) => c !== capKey)
            : [...m.extraCapabilities, capKey],
        };
      }),
    );
  };

  const updated = members.find((m) => m.id === member.id)!;

  return (
    <AppLayout
      breadcrumbs={[{ label: "Admin" }, { label: "Members" }, { label: `${updated.firstName} ${updated.lastName}` }]}
      services={[
        { name: "Admin", logo: Settings2, description: "Organization management" },
      ]}
      navItems={navItems}
    >
      <MemberDetailPage
        member={updated}
        onBack={() => {}}
        onChangeRole={handleChangeRole}
        onToggleCapability={handleToggleCapability}
      />
    </AppLayout>
  );
}

export const MemberPermissions: Story = {
  render: () => <AdminMemberDetail />,
};
