"use client";

import { useClerk, useUser } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { Button } from "@cometa/ui/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@cometa/ui/ui/dropdown-menu";
import { CollectionProvider, CollectionView, CollectionItem, ViewToggle } from "@cometa/ui/collection-view";
import { Star, MoreHorizontal, Trash2, ExternalLink, Link2, StickyNote } from "lucide-react";
import { getNotePublicUrl, type Note } from "@/lib/api";
import { useNotesQuery, useStarNote, useDeleteNote } from "@/hooks/use-notes";

const navItems = [
  { title: "My Notes", url: "/", icon: StickyNote, isActive: true },
  { title: "Saved", url: "/saved", icon: Star },
];

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

export default function MyNotesPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { data: notes, isLoading } = useNotesQuery();

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
          breadcrumbs={[{ label: "Notes" }, { label: "My Notes" }]}
          title="My Notes"
          actions={<ViewToggle />}
        >
          {isLoading ? null : !notes?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <StickyNote className="size-10 mb-3" />
              <p className="text-sm">No notes yet</p>
              <p className="text-xs mt-1">Notes created via the MCP tool will appear here</p>
            </div>
          ) : (
            <CollectionView pageSize={9}>
              {notes.map((note) => (
                <CollectionItem
                  key={note.id}
                  title={note.title}
                  description={note.snippet}
                  timestamp={note.createdAt}
                  href={`/view/${note.id}`}
                  indicator={
                    note.starred ? <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" /> : undefined
                  }
                  meta={note.userEmail || undefined}
                  actions={<NoteMenu note={note} />}
                />
              ))}
            </CollectionView>
          )}
        </AppPage>
      </CollectionProvider>
    </AppLayout>
  );
}
