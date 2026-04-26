"use client";

import { useClerk, useOrganization, useUser } from "@clerk/clerk-react";
import { ROLES, type RoleKey } from "@cometa/auth";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { CollectionProvider, CollectionView, CollectionItem, ViewToggle } from "@cometa/ui/collection-view";
import { Badge } from "@cometa/ui/ui/badge";
import { Button } from "@cometa/ui/ui/button";
import { Users, Plus, X } from "lucide-react";
import { useState } from "react";

const ROLE_LIST = Object.values(ROLES);

const ROLE_STYLES: Record<string, string> = {
  "org:admin": "bg-violet-50 text-violet-700 border-violet-200/60",
  "org:accounting_member": "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  "org:legal_member": "bg-blue-50 text-blue-700 border-blue-200/60",
  "org:operations_member": "bg-amber-50 text-amber-700 border-amber-200/60",
  "org:hr_member": "bg-rose-50 text-rose-700 border-rose-200/60",
  "org:member": "bg-muted text-muted-foreground border-border",
};

const navItems = [
  { title: "Members", url: "/", icon: Users, isActive: true },
];

function roleName(key: string) {
  return ROLES[key as RoleKey]?.name ?? "Member";
}

function memberName(m: any): string {
  return (
    [m.publicUserData?.firstName, m.publicUserData?.lastName]
      .filter(Boolean)
      .join(" ") || m.publicUserData?.identifier || "—"
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
                  <input type="radio" name="role" value={r.key} checked={role === r.key} onChange={() => setRole(r.key)} className="sr-only" />
                  <div className={`size-4 rounded-full border-2 flex items-center justify-center ${role === r.key ? "border-primary" : "border-muted-foreground/30"}`}>
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

export default function MembersPage() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { organization, memberships, isLoaded } = useOrganization({
    memberships: { pageSize: 50 },
  });
  const [showInvite, setShowInvite] = useState(false);

  const members = memberships?.data ?? [];

  const handleInvite = async (email: string, role: string) => {
    try {
      await organization?.inviteMember({ emailAddress: email, role });
      setShowInvite(false);
      memberships?.revalidate?.();
    } catch (err) {
      console.error("Invite failed:", err);
    }
  };

  return (
    <AppLayout
      navItems={navItems}
      user={{
        name: user?.fullName || "User",
        email: user?.primaryEmailAddress?.emailAddress || "",
        avatar: user?.imageUrl || "",
      }}
      onSignOut={() => signOut()}
    >
      <CollectionProvider>
        <AppPage
          breadcrumbs={[{ label: "Admin" }, { label: "Members" }]}
          title="Members"
          description={isLoaded ? `${members.length} members` : undefined}
          actions={
            <>
              <ViewToggle />
              <Button onClick={() => setShowInvite(true)}>
                <Plus size={14} />
                Invite
              </Button>
            </>
          }
        >
          {!isLoaded ? null : !members.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Users className="size-8 mb-3 opacity-40" />
              <p className="text-sm">No members yet</p>
            </div>
          ) : (
            <CollectionView pageSize={12}>
              {members.map((m: any) => (
                <CollectionItem
                  key={m.id}
                  title={memberName(m)}
                  description={m.publicUserData?.identifier}
                  timestamp={m.createdAt}
                  href={`/members/${m.publicUserData?.userId ?? m.id}`}
                  badge={
                    <Badge className={`border text-[11px] ${ROLE_STYLES[m.role] ?? ROLE_STYLES["org:member"]}`}>
                      {roleName(m.role)}
                    </Badge>
                  }
                />
              ))}
            </CollectionView>
          )}
        </AppPage>
      </CollectionProvider>

      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />
      )}
    </AppLayout>
  );
}
