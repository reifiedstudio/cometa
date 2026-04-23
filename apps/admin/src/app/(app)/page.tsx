"use client";

import { useClerk, useOrganization } from "@clerk/clerk-react";
import {
  ALL_CAPABILITY_KEYS,
  type CapabilityKey,
  ROLES,
  type RoleKey,
  getEffectiveCapabilities,
  getCapabilitiesByDomain,
} from "@cometa/auth";
import { AppLayout } from "@cometa/ui/app-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cometa/ui/ui/table";
import {
  Users,
  Settings2,
  Plus,
  Check,
  MoreHorizontal,
  ArrowLeft,
  Pencil,
  X,
} from "lucide-react";
import { useState } from "react";

const ROLE_LIST = Object.values(ROLES);

const ROLE_STYLES: Record<string, string> = {
  "org:admin": "bg-violet-50 text-violet-700",
  "org:accounting_member": "bg-emerald-50 text-emerald-700",
  "org:legal_member": "bg-blue-50 text-blue-700",
  "org:operations_member": "bg-amber-50 text-amber-700",
  "org:hr_member": "bg-rose-50 text-rose-700",
  "org:member": "bg-muted text-muted-foreground",
};

const navItems = [
  { title: "Members", url: "/", icon: Users, isActive: true },
];

function roleName(key: string) {
  return ROLES[key as RoleKey]?.name ?? "Member";
}

function Avatar({ member, size = "sm" }: { member: any; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "size-12 text-lg" : "size-8 text-xs";
  const imageUrl = member.publicUserData?.imageUrl;
  const initial = (
    member.publicUserData?.firstName?.[0] ??
    member.publicUserData?.identifier?.[0] ??
    "?"
  ).toUpperCase();

  if (imageUrl) {
    return <img src={imageUrl} alt="" className={`${cls} rounded-full`} />;
  }
  return (
    <div className={`${cls} rounded-full bg-violet-100 flex items-center justify-center font-medium text-violet-700`}>
      {initial}
    </div>
  );
}

function memberName(m: any): string {
  return (
    [m.publicUserData?.firstName, m.publicUserData?.lastName]
      .filter(Boolean)
      .join(" ") || "—"
  );
}

// ── Invite Modal ──

function InviteModal({
  onClose,
  onInvite,
}: { onClose: () => void; onInvite: (email: string, role: string) => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("org:member");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await onInvite(email, role);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Invite Member</h2>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-muted">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <div className="space-y-1">
              {ROLE_LIST.map((r) => (
                <label
                  key={r.key}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    role === r.key ? "border-primary bg-primary/5" : "hover:bg-muted/50"
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
                      role === r.key ? "border-primary" : "border-muted-foreground/30"
                    }`}
                  >
                    {role === r.key && <div className="size-2 rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!email || loading}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Inviting..." : "Send Invite"}
          </button>
        </form>
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
  member: any;
  onBack: () => void;
  onChangeRole: (role: string) => void;
  onToggleCapability: (capKey: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const role = member.role as RoleKey;
  const extraCapabilities = (member.publicMetadata?.extraCapabilities as string[]) ?? [];
  const roleCaps = getEffectiveCapabilities(role, []);
  const capsByDomain = getCapabilitiesByDomain();
  const roleDef = ROLES[role];

  return (
    <div className="space-y-6">
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
              <h1 className="text-xl font-semibold">{memberName(member)}</h1>
              <p className="text-sm text-muted-foreground">{member.publicUserData?.identifier}</p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Role */}
        <div>
          <h2 className="text-sm font-medium mb-3">Role</h2>
          {editing ? (
            <div className="space-y-1.5">
              {ROLE_LIST.map((r) => (
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
                    const fromRole = roleCaps.includes(cap.key as CapabilityKey);
                    const isExtra = extraCapabilities.includes(cap.key);
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

// ── Members List ──

function MembersListPage({
  members,
  onSelectMember,
  onInvite,
}: {
  members: any[];
  onSelectMember: (m: any) => void;
  onInvite: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div>
          <h1 className="text-lg font-semibold">Members</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
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

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <p className="text-2xl font-semibold mt-1">{members.length}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Roles</p>
          <p className="text-2xl font-semibold mt-1">{ROLE_LIST.length}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Capabilities</p>
          <p className="text-2xl font-semibold mt-1">{ALL_CAPABILITY_KEYS.length}</p>
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
            {members.map((m) => (
              <TableRow
                key={m.id}
                className="cursor-pointer"
                onClick={() => onSelectMember(m)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar member={m} />
                    <div>
                      <p className="text-sm font-medium">{memberName(m)}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.publicUserData?.identifier}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${ROLE_STYLES[m.role] ?? ROLE_STYLES["org:member"]}`}
                  >
                    {roleName(m.role)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(m.createdAt).toLocaleDateString("en-ZA", {
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
    </div>
  );
}

// ── Main Page ──

export default function MembersPage() {
  const { signOut } = useClerk();
  const { organization, memberships, isLoaded } = useOrganization({
    memberships: { pageSize: 50 },
  });
  const [showInvite, setShowInvite] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No organization found.</p>
      </div>
    );
  }

  const members = memberships?.data ?? [];

  const handleInvite = async (email: string, role: string) => {
    try {
      await organization.inviteMember({ emailAddress: email, role });
      setShowInvite(false);
      memberships?.revalidate?.();
    } catch (err) {
      console.error("Invite failed:", err);
    }
  };

  const handleChangeRole = async (newRole: string) => {
    if (!selectedMember) return;
    try {
      await selectedMember.update({ role: newRole });
      memberships?.revalidate?.();
    } catch (err) {
      console.error("Role change failed:", err);
    }
  };

  const handleToggleCapability = async (capKey: string) => {
    if (!selectedMember) return;
    const extras = (selectedMember.publicMetadata?.extraCapabilities as string[]) ?? [];
    const roleCaps = getEffectiveCapabilities(selectedMember.role as RoleKey, []);
    if (roleCaps.includes(capKey as CapabilityKey)) return;
    const has = extras.includes(capKey);
    const updated = has ? extras.filter((c: string) => c !== capKey) : [...extras, capKey];
    try {
      await selectedMember.update({
        publicMetadata: { ...selectedMember.publicMetadata, extraCapabilities: updated },
      });
      memberships?.revalidate?.();
    } catch (err) {
      console.error("Capability toggle failed:", err);
    }
  };

  const breadcrumbs = selectedMember
    ? [
        { label: "Admin" },
        { label: "Members", href: "/" },
        { label: memberName(selectedMember) },
      ]
    : [{ label: "Admin" }, { label: "Members" }];

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      navItems={navItems}
      user={{
        name: organization.name,
        email: "",
        avatar: organization.imageUrl ?? "",
      }}
      onSignOut={() => signOut()}
    >
      {selectedMember ? (
        <MemberDetailPage
          member={selectedMember}
          onBack={() => setSelectedMember(null)}
          onChangeRole={handleChangeRole}
          onToggleCapability={handleToggleCapability}
        />
      ) : (
        <MembersListPage
          members={members}
          onSelectMember={setSelectedMember}
          onInvite={() => setShowInvite(true)}
        />
      )}

      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />
      )}
    </AppLayout>
  );
}
