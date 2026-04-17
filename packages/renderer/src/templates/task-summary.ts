import { statusEmoji } from "./utils";

export function mdTaskSummary(data: {
  department: string;
  tasks: {
    id: string;
    body: string;
    status: string;
    type: string;
    createdAt: string;
  }[];
}): string {
  const label = data.department.charAt(0).toUpperCase() + data.department.slice(1);

  const statusCounts: Record<string, number> = {};
  for (const t of data.tasks) {
    statusCounts[t.status] = (statusCounts[t.status] ?? 0) + 1;
  }

  const rows = data.tasks
    .slice(0, 15)
    .map((t) => {
      const body = t.body.length > 50 ? `${t.body.slice(0, 47)}...` : t.body;
      return `| \`${t.id.slice(0, 8)}\` | ${body} | ${statusEmoji(t.status)} ${t.status.replace(/_/g, " ")} | ${t.createdAt.split("T")[0]} |`;
    })
    .join("\n");

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    label: status.replace(/_/g, " "),
    value: count,
  }));

  return `## ${label} — Tasks
*${data.tasks.length} tasks*

| ID | Description | Status | Created |
|----|-------------|--------|---------|
${rows}

\`\`\`chart
${JSON.stringify({ type: "pie", title: "Task Status", data: chartData })}
\`\`\``;
}
