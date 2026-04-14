import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "../../components/app-layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Plus, Search, Upload, FileText, FileSpreadsheet, FileImage, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const documents = [
  { id: 1, name: "Invoice #4521", type: "Invoice", status: "processed", date: "2 hours ago", pages: 2 },
  { id: 2, name: "Q2 Financial Report", type: "Report", status: "processing", date: "4 hours ago", pages: 12 },
  { id: 3, name: "Vendor Agreement — Acme Corp", type: "Contract", status: "processed", date: "Yesterday", pages: 8 },
  { id: 4, name: "Receipt — Office Supplies", type: "Receipt", status: "processed", date: "2 days ago", pages: 1 },
  { id: 5, name: "Tax Form W-9", type: "Tax", status: "needs_review", date: "3 days ago", pages: 4 },
  { id: 6, name: "Insurance Certificate", type: "Certificate", status: "processed", date: "1 week ago", pages: 3 },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof CheckCircle2 }> = {
  processed: { label: "Processed", variant: "default", icon: CheckCircle2 },
  processing: { label: "Processing", variant: "secondary", icon: Clock },
  needs_review: { label: "Needs Review", variant: "destructive", icon: AlertCircle },
};

function DocumentsHome() {
  return (
    <AppLayout breadcrumbs={[{ label: "Documents" }]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Documents</h1>
        <Button>
          <Upload data-icon="inline-start" />
          Upload
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Documents</CardDescription>
            <CardTitle className="text-3xl">1,284</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Processing</CardDescription>
            <CardTitle className="text-3xl">3</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Needs Review</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search documents..." className="pl-9" />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pages</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => {
              const status = statusConfig[doc.status];
              const StatusIcon = status.icon;
              return (
                <TableRow key={doc.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>
                      <StatusIcon className="size-3" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.pages}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.date}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}

const meta: Meta = {
  title: "Pages/Documents/Home",
  component: DocumentsHome,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;
export const Default: Story = {};
