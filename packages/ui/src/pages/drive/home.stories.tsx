import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "../../components/app-layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Plus, Search, Upload, Folder, FileText, FileImage, FileSpreadsheet, Film, MoreHorizontal, Grid, List } from "lucide-react";

const items = [
  { id: 1, name: "Project Assets", type: "folder", items: 24, modified: "2 hours ago" },
  { id: 2, name: "Contracts", type: "folder", items: 8, modified: "Yesterday" },
  { id: 3, name: "Brand Guidelines.pdf", type: "pdf", size: "4.2 MB", modified: "3 hours ago" },
  { id: 4, name: "Q2 Budget.xlsx", type: "spreadsheet", size: "1.1 MB", modified: "Yesterday" },
  { id: 5, name: "Product Screenshot.png", type: "image", size: "2.8 MB", modified: "2 days ago" },
  { id: 6, name: "Demo Recording.mp4", type: "video", size: "48 MB", modified: "3 days ago" },
  { id: 7, name: "Meeting Notes.docx", type: "document", size: "320 KB", modified: "4 days ago" },
  { id: 8, name: "Design Mockups", type: "folder", items: 15, modified: "1 week ago" },
];

const typeIcons: Record<string, typeof FileText> = {
  folder: Folder,
  pdf: FileText,
  spreadsheet: FileSpreadsheet,
  image: FileImage,
  video: Film,
  document: FileText,
};

function DriveHome() {
  return (
    <AppLayout breadcrumbs={[{ label: "Drive" }]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Drive</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload data-icon="inline-start" />
            Upload
          </Button>
          <Button>
            <Plus data-icon="inline-start" />
            New Folder
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search files and folders..." className="pl-9" />
        </div>
        <Button variant="outline" size="icon"><Grid className="size-4" /></Button>
        <Button variant="ghost" size="icon"><List className="size-4" /></Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = typeIcons[item.type] || FileText;
          return (
            <div
              key={item.id}
              className="group flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
              <div>
                <p className="truncate font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.type === "folder" ? `${item.items} items` : item.size} · {item.modified}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

const meta: Meta = {
  title: "Pages/Drive/Home",
  component: DriveHome,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;
export const Default: Story = {};
