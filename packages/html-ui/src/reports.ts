/**
 * Pre-built report templates that compose components + charts.
 * Each function takes raw data and returns a complete HTML string.
 */

import { barChart, donutChart, lineChart, sparkline, stackedBar } from "./charts.js";
import {
  badge,
  divider,
  emptyState,
  formatZAR,
  kvPair,
  listItem,
  metricCard,
  metricRow,
  page,
  progressBar,
  section,
  statusBadge,
  table,
} from "./components.js";
import { colors } from "./theme.js";

// ── Financial Summary Report ──

export function financialSummary(data: {
  accountsReceivable: number;
  accountsPayable: number;
  overdueInvoices: number;
  overdueAmount: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  period: { from: string; to: string };
}): string {
  const profitMargin =
    data.totalRevenue > 0 ? ((data.netProfit / data.totalRevenue) * 100).toFixed(1) : "0";

  return page({
    title: "Financial Summary",
    subtitle: `${data.period.from} to ${data.period.to}`,
    children: [
      metricRow([
        metricCard({
          label: "Revenue",
          value: formatZAR(data.totalRevenue),
          sublabel: "Total for period",
        }),
        metricCard({
          label: "Expenses",
          value: formatZAR(data.totalExpenses),
          sublabel: "Total for period",
        }),
        metricCard({
          label: "Net Profit",
          value: formatZAR(data.netProfit),
          change: `${profitMargin}% margin`,
          changeDirection: data.netProfit > 0 ? "up" : "down",
        }),
      ]),
      metricRow([
        metricCard({
          label: "Receivable",
          value: formatZAR(data.accountsReceivable),
          sublabel: "Outstanding",
        }),
        metricCard({
          label: "Payable",
          value: formatZAR(data.accountsPayable),
          sublabel: "Outstanding",
        }),
        metricCard({
          label: "Overdue",
          value: `${data.overdueInvoices} invoices`,
          sublabel: formatZAR(data.overdueAmount),
          changeDirection: data.overdueInvoices > 0 ? "down" : "neutral",
          change: data.overdueInvoices > 0 ? "Action required" : "All clear",
        }),
      ]),
    ],
  });
}

// ── P&L Report ──

export function profitAndLossReport(data: {
  period: { from: string; to: string };
  months: string[];
  totals: {
    revenue: Record<string, number>;
    costOfSales: Record<string, number>;
    grossProfit: Record<string, number>;
    operatingExpenses: Record<string, number>;
    netProfit: Record<string, number>;
  };
}): string {
  const shortMonths = data.months.map((m) => {
    const [, month] = m.split("-");
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      Number.parseInt(month) - 1
    ];
  });

  const revenueData = data.months.map((m) => data.totals.revenue[m] ?? 0);
  const expenseData = data.months.map(
    (m) => (data.totals.costOfSales[m] ?? 0) + (data.totals.operatingExpenses[m] ?? 0),
  );
  const profitData = data.months.map((m) => data.totals.netProfit[m] ?? 0);

  const totalRev = revenueData.reduce((s, v) => s + v, 0);
  const totalExp = expenseData.reduce((s, v) => s + v, 0);
  const totalProfit = profitData.reduce((s, v) => s + v, 0);

  return page({
    title: "Profit & Loss",
    subtitle: `${data.period.from} to ${data.period.to}`,
    children: [
      metricRow([
        metricCard({ label: "Total Revenue", value: formatZAR(totalRev) }),
        metricCard({ label: "Total Expenses", value: formatZAR(totalExp) }),
        metricCard({
          label: "Net Profit",
          value: formatZAR(totalProfit),
          changeDirection: totalProfit > 0 ? "up" : "down",
          change: `${totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : 0}% margin`,
        }),
      ]),
      section({
        title: "Revenue vs Expenses",
        content: lineChart({
          labels: shortMonths,
          series: [
            { label: "Revenue", data: revenueData, color: colors.success },
            { label: "Expenses", data: expenseData, color: colors.error },
          ],
          formatValue: (v) => `R${Math.round(v / 1000)}k`,
        }),
      }),
      section({
        title: "Monthly Net Profit",
        content: barChart({
          data: shortMonths.map((label, i) => ({
            label,
            value: Math.max(0, profitData[i]),
            color: profitData[i] >= 0 ? colors.success : colors.error,
          })),
          showValues: true,
          formatValue: (v) => `R${Math.round(v / 1000)}k`,
        }),
      }),
    ],
  });
}

// ── Invoice List ──

export function invoiceList(data: {
  invoices: {
    id: string;
    contact: string;
    date: string;
    dueDate: string;
    status: string;
    total: number;
    type: string;
  }[];
  totalAmount: number;
  title?: string;
}): string {
  if (data.invoices.length === 0) {
    return page({
      title: data.title ?? "Invoices",
      children: [emptyState("No invoices found")],
    });
  }

  const rows = data.invoices
    .slice(0, 20)
    .map((inv) => [inv.id, inv.contact, inv.date, statusBadge(inv.status), formatZAR(inv.total)]);

  return page({
    title: data.title ?? "Invoices",
    subtitle: `${data.invoices.length} invoices — Total: ${formatZAR(data.totalAmount)}`,
    children: [
      section({
        content: table({
          headers: ["Ref", "Contact", "Date", "Status", "Amount"],
          rows,
          alignRight: [4],
        }),
      }),
      ...(data.invoices.length > 20
        ? [
            `<div style="font-size:11px;color:${colors.textMuted};text-align:center;padding:8px">Showing 20 of ${data.invoices.length} invoices</div>`,
          ]
        : []),
    ],
  });
}

// ── Task Summary ──

export function taskSummary(data: {
  department: string;
  tasks: {
    id: string;
    body: string;
    status: string;
    type: string;
    createdAt: string;
  }[];
}): string {
  const statusCounts: Record<string, number> = {};
  for (const t of data.tasks) {
    statusCounts[t.status] = (statusCounts[t.status] ?? 0) + 1;
  }

  const donut = donutChart({
    data: Object.entries(statusCounts).map(([label, value]) => {
      const c =
        label === "completed"
          ? colors.success
          : label === "processing"
            ? colors.info
            : label === "pending"
              ? colors.warning
              : label === "failed"
                ? colors.error
                : colors.chart[0];
      return { label: label.replace(/_/g, " "), value, color: c };
    }),
    centerValue: String(data.tasks.length),
    centerLabel: "total",
  });

  const rows = data.tasks
    .slice(0, 15)
    .map((t) => [
      `<span style="font-family:monospace;font-size:10px;color:${colors.textMuted}">${t.id.slice(0, 8)}</span>`,
      t.body.length > 60 ? t.body.slice(0, 57) + "..." : t.body,
      statusBadge(t.status),
      t.createdAt.split("T")[0],
    ]);

  const label = data.department.charAt(0).toUpperCase() + data.department.slice(1);

  return page({
    title: `${label} — Tasks`,
    subtitle: `${data.tasks.length} tasks`,
    children: [
      metricRow([
        metricCard({ label: "Total Tasks", value: String(data.tasks.length) }),
        metricCard({ label: "Pending", value: String(statusCounts["pending"] ?? 0) }),
        metricCard({ label: "Completed", value: String(statusCounts["completed"] ?? 0) }),
      ]),
      section({
        title: "Status Distribution",
        content: `<div style="display:flex;justify-content:center">${donut}</div>`,
      }),
      section({
        title: "Recent Tasks",
        content: table({
          headers: ["ID", "Description", "Status", "Created"],
          rows,
        }),
      }),
    ],
  });
}

// ── Contacts / Outstanding Balances ──

export function contactsReport(data: {
  contacts: {
    name: string;
    type: string;
    email: string;
    outstandingBalance: number;
  }[];
}): string {
  const customers = data.contacts.filter((c) => c.type === "customer");
  const suppliers = data.contacts.filter((c) => c.type === "supplier");
  const totalReceivable = customers.reduce((s, c) => s + Math.max(0, c.outstandingBalance), 0);
  const totalPayable = suppliers.reduce(
    (s, c) => s + Math.abs(Math.min(0, c.outstandingBalance)),
    0,
  );

  const makeRows = (list: typeof data.contacts) =>
    list.map((c) => [
      c.name,
      c.email,
      c.outstandingBalance === 0
        ? badge("Settled", "success")
        : c.outstandingBalance > 0
          ? badge(formatZAR(c.outstandingBalance), "warning")
          : badge(formatZAR(c.outstandingBalance), "error"),
    ]);

  return page({
    title: "Contacts & Balances",
    children: [
      metricRow([
        metricCard({
          label: "Total Receivable",
          value: formatZAR(totalReceivable),
          sublabel: `${customers.length} customers`,
        }),
        metricCard({
          label: "Total Payable",
          value: formatZAR(totalPayable),
          sublabel: `${suppliers.length} suppliers`,
        }),
      ]),
      section({
        title: "Customers",
        content: table({ headers: ["Name", "Email", "Balance"], rows: makeRows(customers) }),
      }),
      section({
        title: "Suppliers",
        content: table({ headers: ["Name", "Email", "Balance"], rows: makeRows(suppliers) }),
      }),
    ],
  });
}
