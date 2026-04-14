import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "../../components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Users, FileText, HardDrive, PenTool, Activity, Shield } from "lucide-react";

const services = [
  { name: "Documents", icon: FileText, status: "healthy", requests: "12.4k", latency: "45ms" },
  { name: "Drive", icon: HardDrive, status: "healthy", requests: "8.2k", latency: "32ms" },
  { name: "Tasks", icon: Users, status: "healthy", requests: "3.1k", latency: "28ms" },
  { name: "Sign", icon: PenTool, status: "degraded", requests: "1.8k", latency: "120ms" },
];

const recentActivity = [
  { user: "sarah@company.com", action: "Uploaded 3 documents", time: "5 min ago" },
  { user: "james@company.com", action: "Created signature request", time: "12 min ago" },
  { user: "lisa@company.com", action: "Shared folder with team", time: "1 hour ago" },
  { user: "admin@company.com", action: "Updated permissions", time: "2 hours ago" },
  { user: "sarah@company.com", action: "Completed task review", time: "3 hours ago" },
];

function AdminHome() {
  return (
    <AppLayout breadcrumbs={[{ label: "Admin" }]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Badge variant="outline">
          <Shield className="size-3" />
          Administrator
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">142</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active Today</CardDescription>
            <CardTitle className="text-3xl">38</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Storage Used</CardDescription>
            <CardTitle className="text-3xl">2.4 TB</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>API Requests (24h)</CardDescription>
            <CardTitle className="text-3xl">25.5k</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{service.requests} req</span>
                    <span className="text-xs text-muted-foreground">{service.latency}</span>
                    <Badge variant={service.status === "healthy" ? "default" : "destructive"}>
                      {service.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.user}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

const meta: Meta = {
  title: "Pages/Admin/Home",
  component: AdminHome,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;
export const Default: Story = {};
