import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DetailPanel } from "../components/detail-panel";
import { Button } from "../components/ui/button";
import { PanelRight } from "lucide-react";

const sampleViewers = [
  { name: "Sarah Kim", initials: "SK", time: "Viewing now", online: true },
  { name: "James Miller", initials: "JM", time: "Viewed 10 min ago", online: true },
  { name: "Lisa Rodriguez", initials: "LR", time: "Viewed 2 hours ago", online: false },
  { name: "Daniel Lourie", initials: "DL", time: "Viewed yesterday", online: false },
  { name: "Alex Chen", initials: "AC", time: "Viewed 3 days ago", online: false },
];

function DetailPanelDemo() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="text-sm font-medium">Page content</span>
          <Button
            variant={open ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setOpen(!open)}
          >
            <PanelRight className="size-4" />
          </Button>
        </div>
        <div className="flex-1 p-8">
          <p className="text-muted-foreground">Click the panel toggle to show/hide the detail panel.</p>
        </div>
      </div>
      <DetailPanel
        open={open}
        onOpenChange={setOpen}
        viewers={sampleViewers}
        share={{
          description: "Anyone with the link can view. Link expires in 30 days.",
        }}
      />
    </div>
  );
}

function DetailPanelWithCustomContent() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="text-sm font-medium">With custom content</span>
          <Button
            variant={open ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setOpen(!open)}
          >
            <PanelRight className="size-4" />
          </Button>
        </div>
        <div className="flex-1 p-8">
          <p className="text-muted-foreground">This panel has custom content above the viewers list.</p>
        </div>
      </div>
      <DetailPanel
        open={open}
        onOpenChange={setOpen}
        viewers={sampleViewers}
        share={{
          label: "Share document",
          description: "Share this document with your team.",
          buttonLabel: "Copy share link",
        }}
      >
        <div className="border-b p-4">
          <p className="text-sm font-medium">Properties</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span>Published</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>11 Apr 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Author</span>
              <span>daniel@cometa.so</span>
            </div>
          </div>
        </div>
      </DetailPanel>
    </div>
  );
}

function ViewersOnly() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="text-sm font-medium">Viewers only</span>
          <Button
            variant={open ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setOpen(!open)}
          >
            <PanelRight className="size-4" />
          </Button>
        </div>
        <div className="flex-1 p-8">
          <p className="text-muted-foreground">No share section, just viewers.</p>
        </div>
      </div>
      <DetailPanel
        open={open}
        onOpenChange={setOpen}
        viewers={sampleViewers}
      />
    </div>
  );
}

const meta: Meta = {
  title: "Patterns/Detail Panel",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;
export const Default: Story = { render: () => <DetailPanelDemo /> };
export const WithCustomContent: Story = { render: () => <DetailPanelWithCustomContent /> };
export const WithoutShare: Story = { render: () => <ViewersOnly /> };
