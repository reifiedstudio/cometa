/**
 * Markdown + Mermaid report generators.
 * Each function returns a markdown string with tables and mermaid chart blocks.
 */

function formatZAR(amount: number): string {
  const abs = Math.abs(amount);
  return `R ${abs.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function statusEmoji(status: string): string {
  const map: Record<string, string> = {
    completed: "✅",
    paid: "✅",
    approved: "✅",
    signed: "✅",
    processing: "🔄",
    assigned: "🔄",
    authorised: "🔵",
    active: "🔵",
    pending: "⏳",
    queued: "⏳",
    awaiting_approval: "⏳",
    draft: "📝",
    failed: "❌",
    overdue: "🔴",
    rejected: "❌",
  };
  return map[status] ?? "⚪";
}

// ── Financial Summary ──

export function mdFinancialSummary(data: {
  accountsReceivable: number;
  accountsPayable: number;
  overdueInvoices: number;
  overdueAmount: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  period: { from: string; to: string };
}): string {
  const margin =
    data.totalRevenue > 0 ? ((data.netProfit / data.totalRevenue) * 100).toFixed(1) : "0";

  return `## Financial Summary
*${data.period.from} to ${data.period.to}*

| Metric | Amount |
|--------|--------|
| **Revenue** | ${formatZAR(data.totalRevenue)} |
| **Expenses** | ${formatZAR(data.totalExpenses)} |
| **Net Profit** | ${formatZAR(data.netProfit)} (${margin}% margin) |
| Accounts Receivable | ${formatZAR(data.accountsReceivable)} |
| Accounts Payable | ${formatZAR(data.accountsPayable)} |
| Overdue | ${data.overdueInvoices} invoices (${formatZAR(data.overdueAmount)}) |

\`\`\`mermaid
pie title Revenue vs Expenses
  "Net Profit" : ${data.netProfit}
  "Expenses" : ${data.totalExpenses}
\`\`\``;
}

// ── P&L Report ──

export function mdProfitAndLoss(data: {
  period: { from: string; to: string };
  months: string[];
  revenue: Record<string, Record<string, number>>;
  costOfSales: Record<string, Record<string, number>>;
  operatingExpenses: Record<string, Record<string, number>>;
  totals: {
    revenue: Record<string, number>;
    costOfSales: Record<string, number>;
    grossProfit: Record<string, number>;
    operatingExpenses: Record<string, number>;
    netProfit: Record<string, number>;
  };
}): string {
  const totalRev = Object.values(data.totals.revenue).reduce((s, v) => s + v, 0);
  const totalExp =
    Object.values(data.totals.costOfSales).reduce((s, v) => s + v, 0) +
    Object.values(data.totals.operatingExpenses).reduce((s, v) => s + v, 0);
  const totalProfit = Object.values(data.totals.netProfit).reduce((s, v) => s + v, 0);

  // Revenue breakdown
  const revenueLines = Object.entries(data.revenue)
    .map(([name, months]) => {
      const total = Object.values(months).reduce((s, v) => s + v, 0);
      return `| ${name} | ${formatZAR(total)} |`;
    })
    .join("\n");

  // Cost breakdown
  const costLines = Object.entries(data.costOfSales)
    .map(([name, months]) => {
      const total = Object.values(months).reduce((s, v) => s + v, 0);
      return `| ${name} | (${formatZAR(total)}) |`;
    })
    .join("\n");

  // Expense breakdown
  const expenseLines = Object.entries(data.operatingExpenses)
    .map(([name, months]) => {
      const total = Object.values(months).reduce((s, v) => s + v, 0);
      return `| ${name} | (${formatZAR(total)}) |`;
    })
    .join("\n");

  // Monthly chart data
  const shortMonths = data.months.map((m) => {
    const month = Number.parseInt(m.split("-")[1]);
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      month - 1
    ];
  });

  const chartLines = shortMonths
    .map((m, i) => {
      const rev = data.totals.revenue[data.months[i]] ?? 0;
      return `  "${m}" : ${Math.round(rev / 1000)}`;
    })
    .join("\n");

  return `## Profit & Loss
*${data.period.from} to ${data.period.to}*

| | Total |
|---|---:|
| **Revenue** | **${formatZAR(totalRev)}** |
${revenueLines}
| **Cost of Sales** | **(${formatZAR(Object.values(data.totals.costOfSales).reduce((s, v) => s + v, 0))})** |
${costLines}
| **Gross Profit** | **${formatZAR(Object.values(data.totals.grossProfit).reduce((s, v) => s + v, 0))}** |
| **Operating Expenses** | **(${formatZAR(Object.values(data.totals.operatingExpenses).reduce((s, v) => s + v, 0))})** |
${expenseLines}
| **Net Profit** | **${formatZAR(totalProfit)}** |

\`\`\`mermaid
pie title Revenue Breakdown (R thousands)
${chartLines}
\`\`\``;
}

// ── Invoice List ──

export function mdInvoiceList(data: {
  invoices: {
    id: string;
    contact: string;
    date: string;
    status: string;
    total: number;
    type: string;
  }[];
  totalAmount: number;
  title?: string;
}): string {
  if (data.invoices.length === 0) {
    return `## ${data.title ?? "Invoices"}\n\nNo invoices found.`;
  }

  const rows = data.invoices
    .slice(0, 25)
    .map(
      (inv) =>
        `| ${inv.id} | ${inv.contact} | ${inv.date} | ${statusEmoji(inv.status)} ${inv.status} | ${formatZAR(inv.total)} |`,
    )
    .join("\n");

  const statusCounts: Record<string, number> = {};
  for (const inv of data.invoices) {
    statusCounts[inv.status] = (statusCounts[inv.status] ?? 0) + 1;
  }

  const pieLines = Object.entries(statusCounts)
    .map(([status, count]) => `  "${status}" : ${count}`)
    .join("\n");

  return `## ${data.title ?? "Invoices"}
*${data.invoices.length} invoices — Total: ${formatZAR(data.totalAmount)}*

| Ref | Contact | Date | Status | Amount |
|-----|---------|------|--------|-------:|
${rows}
${data.invoices.length > 25 ? `\n*Showing 25 of ${data.invoices.length}*\n` : ""}
\`\`\`mermaid
pie title Invoice Status
${pieLines}
\`\`\``;
}

// ── Task Summary ──

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
      const body = t.body.length > 50 ? t.body.slice(0, 47) + "..." : t.body;
      return `| \`${t.id.slice(0, 8)}\` | ${body} | ${statusEmoji(t.status)} ${t.status.replace(/_/g, " ")} | ${t.createdAt.split("T")[0]} |`;
    })
    .join("\n");

  const pieLines = Object.entries(statusCounts)
    .map(([status, count]) => `  "${status.replace(/_/g, " ")}" : ${count}`)
    .join("\n");

  return `## ${label} — Tasks
*${data.tasks.length} tasks*

| ID | Description | Status | Created |
|----|-------------|--------|---------|
${rows}

\`\`\`mermaid
pie title Task Status
${pieLines}
\`\`\``;
}

// ── Contacts ──

export function mdContactsReport(data: {
  contacts: {
    name: string;
    type: string;
    email: string;
    outstandingBalance: number;
  }[];
}): string {
  const customers = data.contacts.filter((c) => c.type === "customer");
  const suppliers = data.contacts.filter((c) => c.type === "supplier");

  const custRows = customers
    .map(
      (c) =>
        `| ${c.name} | ${c.email} | ${c.outstandingBalance === 0 ? "✅ Settled" : formatZAR(c.outstandingBalance)} |`,
    )
    .join("\n");

  const suppRows = suppliers
    .map(
      (c) =>
        `| ${c.name} | ${c.email} | ${c.outstandingBalance === 0 ? "✅ Settled" : `(${formatZAR(c.outstandingBalance)})`} |`,
    )
    .join("\n");

  return `## Contacts & Balances

### Customers
| Name | Email | Outstanding |
|------|-------|------------:|
${custRows}

### Suppliers
| Name | Email | Outstanding |
|------|-------|------------:|
${suppRows}`;
}
