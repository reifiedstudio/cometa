import type { Meta, StoryObj } from "@storybook/react";
import { AppLayout } from "../../components/app-layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Plus, Search, CheckCircle2, Clock, AlertCircle, Users, ArrowRight } from "lucide-react";

const tasks = [
  { id: 1, title: "Review Q2 budget proposal", assignee: "Sarah K.", priority: "high", status: "in_progress", due: "Today" },
  { id: 2, title: "Update vendor compliance docs", assignee: "James M.", priority: "medium", status: "todo", due: "Tomorrow" },
  { id: 3, title: "Prepare board presentation", assignee: "You", priority: "high", status: "in_progress", due: "Apr 15" },
  { id: 4, title: "Schedule team retrospective", assignee: "You", priority: "low", status: "todo", due: "Apr 18" },
  { id: 5, title: "Approve new hire onboarding", assignee: "Lisa R.", priority: "medium", status: "done", due: "Apr 10" },
  { id: 6, title: "File expense reports", assignee: "You", priority: "low", status: "done", due: "Apr 8" },
];

const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  high: "destructive",
  medium: "default",
  low: "secondary",
};

const statusIcons: Record<string, typeof CheckCircle2> = {
  done: CheckCircle2,
  in_progress: Clock,
  todo: AlertCircle,
};

function TasksHome() {
  return (
    <AppLayout breadcrumbs={[{ label: "Tasks" }]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <Button>
          <Plus data-icon="inline-start" />
          New Task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>To Do</CardDescription>
            <CardTitle className="text-3xl">8</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">5</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">23</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search tasks..." className="pl-9" />
      </div>

      <div className="space-y-2">
        {tasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          return (
            <div
              key={task.id}
              className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <StatusIcon className={`size-5 shrink-0 ${task.status === "done" ? "text-green-500" : task.status === "in_progress" ? "text-blue-500" : "text-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
                <p className="text-sm text-muted-foreground">{task.assignee} · Due {task.due}</p>
              </div>
              <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
              <ArrowRight className="size-4 text-muted-foreground" />
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

const meta: Meta = {
  title: "Pages/Tasks/Home",
  component: TasksHome,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;
export const Default: Story = {};
