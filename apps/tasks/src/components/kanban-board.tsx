"use client";

import { AssignPicker } from "@/components/assign-picker";
import { cn } from "@/lib/utils";
import { updateTask as updateTaskApi } from "@/lib/api";
import { Badge } from "@cometa/ui/ui/badge";
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import {
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  User,
  ChevronRight,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; className: string; dotColor: string; icon: typeof Clock }> = {
  open: { label: "Open", className: "bg-amber-50 text-amber-700 border-amber-200/60", dotColor: "bg-amber-500", icon: Clock },
  in_progress: { label: "In Progress", className: "bg-blue-50 text-blue-700 border-blue-200/60", dotColor: "bg-blue-500", icon: Loader2 },
  review: { label: "Review", className: "bg-violet-50 text-violet-700 border-violet-200/60", dotColor: "bg-violet-500", icon: AlertTriangle },
  done: { label: "Done", className: "bg-emerald-50 text-emerald-700 border-emerald-200/60", dotColor: "bg-emerald-500", icon: CheckCircle2 },
};

const COLUMNS = [
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
];

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Kanban Column ──

function KanbanColumn({ stageKey, children, count }: { stageKey: string; children: React.ReactNode; count: number }) {
  const config = statusConfig[stageKey] ?? statusConfig.open;
  const { ref, isDropTarget } = useDroppable({
    id: stageKey,
    data: { stageKey },
  });

  return (
    <div className="flex flex-col w-[280px] shrink-0 rounded-lg border overflow-hidden">
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b bg-muted/30 shrink-0">
        <div className={cn("size-2 rounded-full", config.dotColor)} />
        <span className="text-xs font-medium">{config.label}</span>
        <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      {/* Cards */}
      <div
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto p-2 space-y-2 transition-colors min-h-[200px]",
          isDropTarget && "bg-muted/20",
        )}
      >
        {children}
      </div>
    </div>
  );
}

// ── Sortable Card ──

function SortableCard({
  task,
  stageKey,
  index,
  slug,
  onAssign,
}: {
  task: any;
  stageKey: string;
  index: number;
  slug: string;
  onAssign: (taskId: string, email: string) => void;
}) {
  const { ref, status } = useSortable({
    id: task.id,
    index,
    group: stageKey,
    data: { stageKey },
  });
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div ref={ref} style={{ opacity: status === "dragging" ? 0.5 : 1 }}>
      <div
        onClick={() => window.location.href = `/${task._slug ?? slug}/tasks/${task.id}`}
        className="block rounded-lg border bg-card p-3 hover:border-foreground/20 transition-colors space-y-2 cursor-pointer"
      >
        <div className="space-y-1.5">
          <span className="text-xs font-medium capitalize block">
            {task.type?.replace(/[_-]/g, " ") ?? "Task"}
          </span>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className={cn(
                "inline-flex items-center gap-1 text-[10px] rounded-full px-1.5 py-0.5 transition-colors",
                task.assignedTo
                  ? "text-muted-foreground bg-muted hover:bg-muted/80"
                  : "text-muted-foreground/60 border border-dashed hover:bg-muted/50",
              )}
            >
              <User size={9} className="shrink-0" />
              <span className="truncate max-w-[120px]">{task.assignedTo === "agent" ? "AI Agent" : task.assignedTo ?? "Unassigned"}</span>
            </button>
            <AssignPicker
              open={showPicker}
              onOpenChange={setShowPicker}
              currentAssignee={task.assignedTo}
              onAssign={(userId, email) => onAssign(task.id, email)}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{task.body}</p>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={9} />
            {formatDateTime(task.createdAt)}
          </span>
          <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
}

// ── Kanban Board ──

interface KanbanBoardProps {
  tasks: any[];
  slug: string;
}

// Map old status names to new ones
function normalizeStatus(status: string): string {
  const map: Record<string, string> = {
    pending: "open",
    assigned: "in_progress",
    processing: "in_progress",
    awaiting_approval: "review",
    completed: "done",
    failed: "done",
  };
  return map[status] ?? status;
}

export function KanbanBoard({ tasks, slug }: KanbanBoardProps) {
  const queryClient = useQueryClient();

  const normalizedTasks = tasks.map((t) => ({ ...t, status: normalizeStatus(t.status) }));

  const columns: Record<string, any[]> = {};
  for (const col of COLUMNS) {
    columns[col.key] = normalizedTasks.filter((t) => t.status === col.key);
  }

  async function handleDragEnd(event: {
    operation: {
      source: { id: string | number; data?: Record<string, unknown> } | null;
      target: { id: string | number; data?: Record<string, unknown> } | null;
    };
    canceled: boolean;
  }) {
    if (event.canceled) return;
    const { source, target } = event.operation;
    if (!source || !target) return;

    const taskId = String(source.id);
    const newStatus = String((target.data as Record<string, unknown>)?.stageKey ?? target.id);
    const task = normalizedTasks.find((t) => t.id === taskId);

    if (task && task.status !== newStatus) {
      const taskSlug = task._slug ?? slug;
      try {
        await updateTaskApi(taskSlug, taskId, { status: newStatus });
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.success(`Moved to ${statusConfig[newStatus]?.label ?? newStatus}`);
      } catch {
        toast.error("Failed to update status");
      }
    }
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4 h-full">
        {COLUMNS.map((col) => {
          const items = columns[col.key] ?? [];
          return (
            <KanbanColumn key={col.key} stageKey={col.key} count={items.length}>
              {items.map((task, index) => (
                <SortableCard
                  key={task.id}
                  task={task}
                  stageKey={col.key}
                  index={index}
                  slug={slug}
                  onAssign={async (taskId, email) => {
                    const taskSlug = task._slug ?? slug;
                    try {
                      await updateTaskApi(taskSlug, taskId, { assignedTo: email || undefined });
                      queryClient.invalidateQueries({ queryKey: ["tasks"] });
                    } catch { /* ignore */ }
                  }}
                />
              ))}
            </KanbanColumn>
          );
        })}
      </div>
    </DragDropProvider>
  );
}
