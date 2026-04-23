"use client";

import * as React from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@cometa/ui/ui/card";
import { Button } from "@cometa/ui/ui/button";
import { Badge } from "@cometa/ui/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@cometa/ui/ui/dropdown-menu";
import { Star, Clock, LayoutGrid, List, MoreHorizontal, Trash2, ExternalLink, Link2, StickyNote } from "lucide-react";
import Link from "next/link";
import { getNotePublicUrl, type Note } from "@/lib/api";
import { useNotesQuery, useStarNote, useDeleteNote } from "@/hooks/use-notes";

const navItems = [
  { title: "My Notes", url: "/", icon: StickyNote, isActive: true },
  { title: "Saved", url: "/saved", icon: Star },
];

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return new Date(iso).toLocaleDateString();
}

function NoteMenu({ note }: { note: Note }) {
  const starMutation = useStarNote();
  const deleteMutation = useDeleteNote();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={(e) => e.preventDefault()} />}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => { e.preventDefault(); window.open(`/view/${note.id}`, "_blank"); }}>
          <ExternalLink className="size-4" />
          Open
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(getNotePublicUrl(note.id)); }}>
          <Link2 className="size-4" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.preventDefault(); starMutation.mutate({ id: note.id, starred: !note.starred }); }}>
          <Star className="size-4" />
          {note.starred ? "Unsave" : "Save"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={(e) => { e.preventDefault(); deleteMutation.mutate(note.id); }}>
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NoteGrid({ notes }: { notes: Note[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Link key={note.id} href={`/view/${note.id}`}>
          <Card className="group flex cursor-pointer flex-col transition-colors hover:bg-muted/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{note.title}</CardTitle>
                <div className="flex items-center gap-1">
                  {note.starred && <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" />}
                  <NoteMenu note={note} />
                </div>
              </div>
              <CardDescription className="line-clamp-2 min-h-[2.5rem]">{note.snippet}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Badge variant="secondary" className="text-xs">
                <Clock className="size-3" />
                {formatRelativeTime(note.createdAt)}
              </Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function NoteList({ notes }: { notes: Note[] }) {
  return (
    <div className="divide-y rounded-lg border">
      {notes.map((note) => (
        <Link key={note.id} href={`/view/${note.id}`}>
          <div className="group flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">{note.title}</p>
                {note.starred && <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />}
              </div>
              <p className="truncate text-xs text-muted-foreground">{note.snippet}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(note.createdAt)}</span>
            <NoteMenu note={note} />
          </div>
        </Link>
      ))}
    </div>
  );
}

function ViewToggle({ view, onViewChange }: { view: "grid" | "list"; onViewChange: (v: "grid" | "list") => void }) {
  return (
    <div className="inline-flex items-center rounded-md border">
      <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="size-8 rounded-r-none" onClick={() => onViewChange("grid")}>
        <LayoutGrid className="size-4" />
      </Button>
      <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="size-8 rounded-l-none border-l" onClick={() => onViewChange("list")}>
        <List className="size-4" />
      </Button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex flex-col animate-pulse">
          <CardHeader>
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="mt-2 space-y-1.5">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-2/3 rounded bg-muted" />
            </div>
          </CardHeader>
          <CardFooter className="mt-auto">
            <div className="h-5 w-20 rounded bg-muted" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function MyNotesPage() {
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const { user } = useUser();
  const { signOut } = useClerk();
  const { data: notes, isLoading } = useNotesQuery();

  return (
    <AppLayout
      breadcrumbs={[{ label: "Notes" }, { label: "My Notes" }]}
      navItems={navItems}
      user={{
        name: user?.fullName || "User",
        email: user?.primaryEmailAddress?.emailAddress || "",
        avatar: user?.imageUrl || "",
      }}
      onSignOut={() => signOut()}
    >
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h1 className="text-lg font-semibold">My Notes</h1>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !notes?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <StickyNote className="size-10 mb-3" />
              <p className="text-sm">No notes yet</p>
              <p className="text-xs mt-1">Notes created via the MCP tool will appear here</p>
            </div>
          ) : view === "grid" ? (
            <NoteGrid notes={notes} />
          ) : (
            <NoteList notes={notes} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
