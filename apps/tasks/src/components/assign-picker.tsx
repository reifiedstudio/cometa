"use client";

import { cn } from "@/lib/utils";
import { useOrganization } from "@clerk/clerk-react";
import { Check, Search, UserPlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AssignPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (userId: string, email: string, name: string) => void;
  currentAssignee?: string;
}

export function AssignPicker({ open, onOpenChange, onAssign, currentAssignee }: AssignPickerProps) {
  const { memberships } = useOrganization({ memberships: { pageSize: 50 } });
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const members = memberships?.data ?? [];
  const filtered = members.filter((m: any) => {
    if (!search) return true;
    const name = [m.publicUserData?.firstName, m.publicUserData?.lastName].filter(Boolean).join(" ");
    const email = m.publicUserData?.identifier ?? "";
    return name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Close on escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={() => onOpenChange(false)} />
      <div className="absolute left-0 top-full mt-1 z-50 w-72 rounded-lg border bg-card shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/50"
          />
          <button type="button" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
            <X size={14} />
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto py-1">
          {/* Unassign option */}
          {currentAssignee && (
            <button
              type="button"
              onClick={() => { onAssign("", "", "Unassigned"); onOpenChange(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 transition-colors text-muted-foreground"
            >
              <X size={14} />
              <span>Unassign</span>
            </button>
          )}
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted-foreground text-center">No members found</p>
          ) : (
            filtered.map((m: any) => {
              const name = [m.publicUserData?.firstName, m.publicUserData?.lastName].filter(Boolean).join(" ") || "—";
              const email = m.publicUserData?.identifier ?? "";
              const userId = m.publicUserData?.userId ?? m.id;
              const imageUrl = m.publicUserData?.imageUrl;
              const isSelected = currentAssignee === email || currentAssignee === userId;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { onAssign(userId, email, name); onOpenChange(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 transition-colors",
                    isSelected && "bg-muted/30",
                  )}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="size-6 rounded-full" />
                  ) : (
                    <div className="size-6 rounded-full bg-violet-100 flex items-center justify-center text-[10px] font-medium text-violet-700">
                      {name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium truncate">{name}</p>
                    <p className="text-xs text-muted-foreground truncate">{email}</p>
                  </div>
                  {isSelected && <Check size={14} className="text-emerald-500 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
