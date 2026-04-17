"use client";

import { useOrganization } from "@clerk/clerk-react";
import { TASKS, ROLES, type RoleKey } from "@cometa/auth";
import { Bot, Building2, Users } from "lucide-react";

function TaskCard({
  task,
  memberCount,
}: { task: (typeof TASKS)[number]; memberCount: number }) {
  return (
    <div className="rounded-lg border p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
            <Building2 size={20} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">{task.name}</h3>
            <p className="text-xs text-muted-foreground font-mono">{task.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users size={14} />
            {memberCount}
          </span>
          <span className="flex items-center gap-1">
            <Bot size={14} />
            Agent
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{task.description}</p>

      <div className="flex gap-1.5">
        {task.services.map((s) => (
          <span
            key={s}
            className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const { memberships, isLoaded } = useOrganization({ memberships: { pageSize: 50 } });

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const members = memberships?.data ?? [];

  function countForTask(permKey: string): number {
    return members.filter((m) => {
      if (ROLES[m.role as RoleKey]?.isAdmin) return true;
      const roleDef = ROLES[m.role as RoleKey];
      return (roleDef?.capabilities as readonly string[])?.includes(permKey);
    }).length;
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="text-muted-foreground">
            Each task has an AI agent and access to specific services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TASKS.map((task) => (
            <TaskCard
              key={task.slug}
              task={task}
              memberCount={countForTask(task.capabilityKey)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
