import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "../../components/app-layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Plus, Search, PenTool, Clock, CheckCircle2, XCircle, Send } from "lucide-react";

const requests = [
  { id: 1, name: "Vendor Agreement — Acme Corp", signers: 2, signed: 1, status: "pending", sent: "2 hours ago" },
  { id: 2, name: "NDA — Partner Co.", signers: 1, signed: 1, status: "completed", sent: "Yesterday" },
  { id: 3, name: "Employment Contract — Sarah K.", signers: 2, signed: 0, status: "pending", sent: "2 days ago" },
  { id: 4, name: "Lease Agreement", signers: 3, signed: 3, status: "completed", sent: "3 days ago" },
  { id: 5, name: "Consulting Agreement", signers: 1, signed: 0, status: "expired", sent: "2 weeks ago" },
  { id: 6, name: "Board Resolution", signers: 4, signed: 2, status: "pending", sent: "1 week ago" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  completed: { label: "Completed", variant: "default" },
  expired: { label: "Expired", variant: "destructive" },
};

function SignHome() {
  return (
    <AppLayout breadcrumbs={[{ label: "Sign" }]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Signature Requests</h1>
        <Button>
          <Send data-icon="inline-start" />
          New Request
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">4</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">18</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Expired</CardDescription>
            <CardTitle className="text-3xl">2</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search signature requests..." className="pl-9" />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Signers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => {
              const status = statusConfig[req.status];
              return (
                <TableRow key={req.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <PenTool className="size-4 text-muted-foreground" />
                      {req.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {req.signed}/{req.signers} signed
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{req.sent}</TableCell>
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
  title: "Pages/Sign/Home",
  component: SignHome,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;
export const Default: Story = {};
