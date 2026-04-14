import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { ScrollArea } from "../../components/ui/scroll-area";
import { DetailPanel } from "../../components/detail-panel";
import { ArrowLeft, Download, PanelRight, Star, ChevronDown, FileText, Code } from "lucide-react";

const snapshotData = [
  { label: "Revenue", jan: "R198,300", feb: "R232,900", mar: "R246,900", total: "R678,100", bold: false },
  { label: "Cost of Sales", jan: "R57,900", feb: "R59,400", mar: "R90,400", total: "R207,700", bold: false },
  { label: "Gross Profit", jan: "R140,400", feb: "R173,500", mar: "R156,500", total: "R470,400", bold: false },
  { label: "Operating Expenses", jan: "R116,100", feb: "R139,500", mar: "R163,000", total: "R418,600", bold: false },
  { label: "Net Profit", jan: "R20,400", feb: "R30,300", mar: "-R10,400", total: "R40,300", bold: true },
  { label: "Gross Margin", jan: "70.8%", feb: "74.5%", mar: "63.4%", total: "69.4%", bold: false },
  { label: "Net Margin", jan: "10.3%", feb: "13.0%", mar: "-4.2%", total: "5.9%", bold: false },
];

const viewers = [
  { name: "Sarah Kim", initials: "SK", time: "Viewing now", online: true },
  { name: "James Miller", initials: "JM", time: "Viewed 10 min ago", online: true },
  { name: "Lisa Rodriguez", initials: "LR", time: "Viewed 2 hours ago", online: false },
  { name: "Daniel Lourie", initials: "DL", time: "Viewed yesterday", online: false },
  { name: "Alex Chen", initials: "AC", time: "Viewed 3 days ago", online: false },
  { name: "Rachel Green", initials: "RG", time: "Viewed 3 days ago", online: false },
  { name: "Tom Bradley", initials: "TB", time: "Viewed 4 days ago", online: false },
  { name: "Nina Patel", initials: "NP", time: "Viewed 5 days ago", online: false },
  { name: "Chris Wong", initials: "CW", time: "Viewed 1 week ago", online: false },
  { name: "Emma Davis", initials: "ED", time: "Viewed 1 week ago", online: false },
  { name: "Mark Johnson", initials: "MJ", time: "Viewed 1 week ago", online: false },
  { name: "Priya Sharma", initials: "PS", time: "Viewed 2 weeks ago", online: false },
  { name: "David Park", initials: "DP", time: "Viewed 2 weeks ago", online: false },
  { name: "Sophie Turner", initials: "ST", time: "Viewed 3 weeks ago", online: false },
  { name: "Kevin Osei", initials: "KO", time: "Viewed 3 weeks ago", online: false },
];

function NotesViewer() {
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2" render={<a href="/?path=/story/pages-notes--my-notes-page" />}>
              <ArrowLeft className="size-4" />
              Notes
            </Button>
            <Separator orientation="vertical" className="self-stretch" />
            <h2 className="min-w-0 truncate text-sm font-medium">Financial Performance Report — Q1 2026 January to March Summary</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSaved(!saved)}
            >
              <Star className={`size-4 ${saved ? "fill-yellow-400 text-yellow-400" : ""}`} />
              {saved ? "Saved" : "Save"}
            </Button>
            <div className="inline-flex items-center">
              <Button variant="ghost" size="sm" className="rounded-r-none">
                <Download className="size-4" />
                Download
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8 rounded-l-none" />}>
                  <ChevronDown className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <DropdownMenuItem>
                    <Code className="size-4" />
                    Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="size-4" />
                    HTML
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator orientation="vertical" className="mx-1 self-stretch" />
            <Button
              variant={panelOpen ? "secondary" : "ghost"}
              size="icon"
              className="size-8"
              onClick={() => setPanelOpen(!panelOpen)}
            >
              <PanelRight className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>daniel@cometa.so</span>
              <span>·</span>
              <span>11 Apr 2026</span>
              <span>·</span>
              <span>Expires in 30 days</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Financial Performance — Q1 2026</h1>

            <h2 className="mt-8 text-xl font-semibold">January to March 2026</h2>
            <Separator className="my-4" />

            <div className="space-y-1 text-base leading-relaxed">
              <p>
                Q1 2026 delivered <strong>R678,100 in total revenue</strong> with a combined net profit of{" "}
                <strong>R40,300</strong>. Revenue grew consistently month-on-month — up 25% from January to
                March — which is an encouraging trend.
              </p>
              <p>
                However, March swung into a net loss of <strong>-R10,400</strong>, driven by a sharp rise in
                contractor costs and salaries that outpaced revenue growth. This is the key story of the
                quarter and the main area requiring attention heading into Q2.
              </p>
            </div>

            <Separator className="my-8" />

            <h2 className="text-xl font-semibold">Q1 Snapshot</h2>

            <div className="mt-4 rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]" />
                    <TableHead className="text-right">Jan 2026</TableHead>
                    <TableHead className="text-right">Feb 2026</TableHead>
                    <TableHead className="text-right">Mar 2026</TableHead>
                    <TableHead className="text-right font-bold">Q1 Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshotData.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className={row.bold ? "font-semibold" : ""}>{row.label}</TableCell>
                      <TableCell className={`text-right ${row.bold ? "font-semibold" : ""}`}>{row.jan}</TableCell>
                      <TableCell className={`text-right ${row.bold ? "font-semibold" : ""}`}>{row.feb}</TableCell>
                      <TableCell className={`text-right ${row.bold ? "font-semibold" : ""} ${row.mar?.startsWith("-") ? "text-red-500" : ""}`}>{row.mar}</TableCell>
                      <TableCell className="text-right font-bold">{row.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator className="my-8" />

            <h2 className="text-xl font-semibold">Revenue vs Net Profit</h2>

            <div className="mt-4 flex h-[300px] items-center justify-center rounded-lg border bg-muted/30">
              <div className="text-center text-sm text-muted-foreground">
                <p className="font-medium">Revenue vs Net Profit — Q1 2026 (ZAR)</p>
                <p className="mt-1">Chart placeholder</p>
              </div>
            </div>

            <Separator className="my-8" />

            <h2 className="text-xl font-semibold">Key Takeaways</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed">
              <li>Revenue growth is strong and consistent (+25% Jan→Mar)</li>
              <li>March net loss driven by contractor and salary cost spikes</li>
              <li>Gross margin compression from 70.8% to 63.4% needs monitoring</li>
              <li>Q2 priority: control operating expenses while maintaining growth trajectory</li>
            </ul>
          </div>
        </ScrollArea>

        {/* Right panel */}
        <DetailPanel
          open={panelOpen}
          onOpenChange={setPanelOpen}
          viewers={viewers}
          share={{
            description: "Anyone with the link can view this note. Link expires in 30 days.",
          }}
        />
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Pages/Notes",
  component: NotesViewer,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;
export const Viewer: Story = {};
