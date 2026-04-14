import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "../../components/app-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Search, Star, Clock, LayoutGrid, List, MoreHorizontal, Trash2, ExternalLink, Link2 } from "lucide-react";

const myNotes = [
  { id: 1, title: "Meeting Notes — Q2 Planning", snippet: "Key decisions: budget allocation for new hires, timeline for product launch...", date: "2 hours ago", starred: true },
  { id: 2, title: "Project Brief: Website Redesign", snippet: "Objective: modernize the company website with new branding guidelines...", date: "Yesterday", starred: false },
  { id: 3, title: "Interview Notes — Sarah K.", snippet: "Strong background in distributed systems. 8 years experience...", date: "2 days ago", starred: false },
  { id: 4, title: "1:1 with James", snippet: "Discussed career growth path, upcoming review cycle, and team dynamics...", date: "3 days ago", starred: false },
  { id: 5, title: "Product Roadmap Ideas", snippet: "AI-powered search, batch processing improvements, mobile app...", date: "1 week ago", starred: false },
  { id: 6, title: "Vendor Evaluation: Cloud Providers", snippet: "Comparing AWS, GCP, and Azure for our infrastructure needs...", date: "1 week ago", starred: false },
];

const savedNotes = [
  { id: 1, title: "Meeting Notes — Q2 Planning", snippet: "Key decisions: budget allocation for new hires, timeline for product launch...", date: "2 hours ago", starred: true },
  { id: 3, title: "Interview Notes — Sarah K.", snippet: "Strong background in distributed systems. 8 years experience...", date: "2 days ago", starred: true },
  { id: 7, title: "Financial Performance — Q1 2026", snippet: "Q1 2026 delivered R678,100 in total revenue with a combined net profit of R40,300...", date: "1 week ago", starred: true },
  { id: 8, title: "Infrastructure Cost Analysis", snippet: "Monthly breakdown of AWS spend across services, recommendations for optimization...", date: "2 weeks ago", starred: true },
];

function NoteMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={(e) => e.preventDefault()} />}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <ExternalLink className="size-4" />
          Open
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link2 className="size-4" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Star className="size-4" />
          Save
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NoteGrid({ notes }: { notes: typeof myNotes }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <a key={note.id} href="/?path=/story/pages-notes--viewer"><Card className="group flex cursor-pointer flex-col transition-colors hover:bg-muted/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{note.title}</CardTitle>
              <div className="flex items-center gap-1">
                {note.starred && <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" />}
                <NoteMenu />
              </div>
            </div>
            <CardDescription className="line-clamp-2 min-h-[2.5rem]">{note.snippet}</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Badge variant="secondary" className="text-xs">
              <Clock className="size-3" />
              {note.date}
            </Badge>
          </CardFooter>
        </Card></a>
      ))}
    </div>
  );
}

function NoteList({ notes }: { notes: typeof myNotes }) {
  return (
    <div className="divide-y rounded-lg border">
      {notes.map((note) => (
        <div key={note.id} className="group flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">{note.title}</p>
              {note.starred && <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />}
            </div>
            <p className="truncate text-xs text-muted-foreground">{note.snippet}</p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">{note.date}</span>
          <NoteMenu />
        </div>
      ))}
    </div>
  );
}

function ViewToggle({ view, onViewChange }: { view: "grid" | "list"; onViewChange: (v: "grid" | "list") => void }) {
  return (
    <div className="inline-flex items-center rounded-md border">
      <Button
        variant={view === "grid" ? "secondary" : "ghost"}
        size="icon"
        className="size-8 rounded-r-none"
        onClick={() => onViewChange("grid")}
      >
        <LayoutGrid className="size-4" />
      </Button>
      <Button
        variant={view === "list" ? "secondary" : "ghost"}
        size="icon"
        className="size-8 rounded-l-none border-l"
        onClick={() => onViewChange("list")}
      >
        <List className="size-4" />
      </Button>
    </div>
  );
}

function MyNotes() {
  const [view, setView] = React.useState<"grid" | "list">("grid");
  return (
    <AppLayout breadcrumbs={[{ label: "Notes" }, { label: "My Notes" }]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Notes</h1>
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "grid" ? <NoteGrid notes={myNotes} /> : <NoteList notes={myNotes} />}
    </AppLayout>
  );
}

function SavedNotes() {
  const [view, setView] = React.useState<"grid" | "list">("grid");
  return (
    <AppLayout breadcrumbs={[{ label: "Notes" }, { label: "Saved" }]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Saved</h1>
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "grid" ? <NoteGrid notes={savedNotes} /> : <NoteList notes={savedNotes} />}
    </AppLayout>
  );
}

const meta: Meta = {
  title: "Pages/Notes",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;
export const MyNotesPage: Story = { render: () => <MyNotes /> };
export const Saved: Story = { render: () => <SavedNotes /> };
