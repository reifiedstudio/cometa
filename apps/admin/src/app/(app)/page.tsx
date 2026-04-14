"use client";

import { useOrganization } from "@clerk/clerk-react";
import {
  TASKS,
  PERMISSIONS,
  type PermissionKey,
  ROLES,
  type RoleKey,
  getEffectivePermissions,
  getPermissionsByService,
} from "@cometa/auth";
import { Building2, Check, MoreHorizontal, Plus, Shield, Users, X } from "lucide-react";
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

function RoleBadge({ role }: { role: string }) {
  const roleDef = ROLES[role as RoleKey];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${ROLE_STYLES[role] ?? ROLE_STYLES["org:member"]}`}
    >
      {roleDef?.name ?? role}
    </span>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">{icon}</div>
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

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
          <button onClick={onClose} className="p-1 rounded hover:bg-muted">
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
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${role === r.key ? "border-primary" : "border-muted-foreground/30"}`}
                  >
                    {role === r.key && <div className="w-2 h-2 rounded-full bg-primary" />}
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

function MemberDetailPanel({
  member,
  onClose,
  onChangeRole,
}: {
  member: any;
  onClose: () => void;
  onChangeRole: (role: string) => void;
}) {
  const role = member.role as RoleKey;
  const extraPermissions = (member.publicMetadata?.extraPermissions as string[]) ?? [];
  const effectivePerms = getEffectivePermissions(role, extraPermissions);
  const permsByService = getPermissionsByService();
  const roleDef = ROLES[role];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Member Details</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-4">
            {member.publicUserData.imageUrl ? (
              <img src={member.publicUserData.imageUrl} alt="" className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-medium">
                {(member.publicUserData.firstName?.[0] ?? "?").toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold">
                {[member.publicUserData.firstName, member.publicUserData.lastName]
                  .filter(Boolean)
                  .join(" ") || "—"}
              </p>
              <p className="text-sm text-muted-foreground">{member.publicUserData.identifier}</p>
            </div>
          </div>

          {/* Role */}
          <div>
            <h3 className="text-sm font-medium mb-2">Role</h3>
            <div className="space-y-1">
              {ROLE_LIST.map((r) => (
                <button
                  key={r.key}
                  onClick={() => onChangeRole(r.key)}
                  className={`w-full text-left flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    role === r.key ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </div>
                  {role === r.key && <Check size={16} className="text-primary shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Effective permissions */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              Permissions
              {roleDef?.isAdmin && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  (admin — all granted)
                </span>
              )}
            </h3>
            {Object.entries(permsByService).map(([service, perms]) => (
              <div key={service} className="mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {service}
                </p>
                <div className="space-y-0.5">
                  {perms.map((perm) => {
                    const hasIt = effectivePerms.includes(perm.key as PermissionKey);
                    const fromRole = (ROLES[role]?.permissions as readonly string[])?.includes(
                      perm.key,
                    );
                    const isExtra = extraPermissions.includes(perm.key);

                    return (
                      <div
                        key={perm.key}
                        className={`flex items-center justify-between py-1.5 px-2 rounded text-sm ${hasIt ? "" : "text-muted-foreground"}`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${hasIt ? "bg-emerald-500" : "bg-muted-foreground/20"}`}
                          />
                          <span>{perm.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {roleDef?.isAdmin
                            ? "admin"
                            : fromRole
                              ? "role"
                              : isExtra
                                ? "custom"
                                : "—"}
                        </span>
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

export default function MembersPage() {
  const { organization, membership, memberships, isLoaded } = useOrganization({
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

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">{organization.name}</h1>
            <p className="text-muted-foreground">Manage members and access</p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Invite
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Users size={20} className="text-muted-foreground" />}
            label="Members"
            value={String(members.length)}
          />
          <StatCard
            icon={<Building2 size={20} className="text-muted-foreground" />}
            label="Tasks"
            value={String(TASKS.length)}
          />
          <StatCard
            icon={<Shield size={20} className="text-muted-foreground" />}
            label="Your Role"
            value={ROLES[membership?.role as RoleKey]?.name ?? "Member"}
          />
        </div>

        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                  Member
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                  Role
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                  Joined
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr
                  key={m.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedMember(m)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {m.publicUserData?.imageUrl ? (
                        <img
                          src={m.publicUserData?.imageUrl}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {(
                            m.publicUserData?.firstName?.[0] ??
                            m.publicUserData?.identifier?.[0] ??
                            "?"
                          ).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {[m.publicUserData?.firstName, m.publicUserData?.lastName]
                            .filter(Boolean)
                            .join(" ") || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {m.publicUserData?.identifier}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={m.role} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {new Date(m.createdAt).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <MoreHorizontal size={16} className="text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
        {selectedMember && (
          <MemberDetailPanel
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
            onChangeRole={handleChangeRole}
          />
        )}
      </div>
    </div>
  );
}
