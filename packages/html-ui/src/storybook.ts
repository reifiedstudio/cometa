/**
 * Generate a self-contained HTML storybook page showcasing all components.
 * Run: bun run packages/html-ui/src/storybook.ts > packages/html-ui/storybook.html
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
import {
  contactsReport,
  financialSummary,
  invoiceList,
  profitAndLossReport,
  taskSummary,
} from "./reports.js";
import { colors } from "./theme.js";

function story(title: string, content: string): string {
  return `<div style="margin-bottom:48px">
    <h2 style="font-size:16px;font-weight:600;color:#1a1a1a;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #e2e5e9">${title}</h2>
    <div>${content}</div>
  </div>`;
}

function row(items: string[]): string {
  return `<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start">${items.join("")}</div>`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Cometa HTML UI — Component Storybook</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f9fa; color: #1a1a1a; }
  .container { max-width: 800px; margin: 0 auto; padding: 40px 24px; }
  h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 40px; }
  nav { position: sticky; top: 0; background: #f8f9fa; padding: 12px 0; margin-bottom: 24px; border-bottom: 1px solid #e2e5e9; z-index: 10; }
  nav a { font-size: 12px; color: #6b7280; text-decoration: none; margin-right: 16px; }
  nav a:hover { color: #2563eb; }
</style>
</head>
<body>
<div class="container">
  <h1>Cometa HTML UI</h1>
  <p class="subtitle">Self-contained HTML components for MCP tool responses, emails, and reports. No JS, no external CSS.</p>

  <nav>
    <a href="#badges">Badges</a>
    <a href="#metrics">Metrics</a>
    <a href="#tables">Tables</a>
    <a href="#charts">Charts</a>
    <a href="#layout">Layout</a>
    <a href="#reports">Reports</a>
  </nav>

  <div id="badges">
  ${story(
    "Badges",
    row([
      badge("Default"),
      badge("Success", "success"),
      badge("Warning", "warning"),
      badge("Error", "error"),
      badge("Info", "info"),
      badge("Muted", "muted"),
    ]) +
      `<div style="height:16px"></div>` +
      row([
        statusBadge("completed"),
        statusBadge("processing"),
        statusBadge("pending"),
        statusBadge("failed"),
        statusBadge("overdue"),
        statusBadge("approved"),
        statusBadge("paid"),
        statusBadge("draft"),
      ]),
  )}
  </div>

  <div id="metrics">
  ${story(
    "Metric Cards",
    metricRow([
      metricCard({
        label: "Revenue",
        value: "R 2,450,000",
        change: "+12.5% vs prior",
        changeDirection: "up",
      }),
      metricCard({
        label: "Expenses",
        value: "R 1,890,000",
        change: "+3.2% vs prior",
        changeDirection: "down",
      }),
      metricCard({
        label: "Net Profit",
        value: "R 560,000",
        change: "22.9% margin",
        changeDirection: "up",
        sublabel: "12-month period",
      }),
    ]),
  )}
  </div>

  <div id="tables">
  ${story(
    "Table",
    section({
      title: "Recent Invoices",
      subtitle: "Last 5 invoices",
      content: table({
        headers: ["Ref", "Contact", "Date", "Status", "Amount"],
        rows: [
          ["INV-1042", "Vodacom Business", "2026-03-15", statusBadge("paid"), formatZAR(45000)],
          [
            "INV-1043",
            "Discovery Health",
            "2026-03-18",
            statusBadge("authorised"),
            formatZAR(82500),
          ],
          ["INV-1044", "Standard Bank", "2026-03-20", statusBadge("overdue"), formatZAR(125000)],
          ["INV-1045", "Naspers", "2026-03-22", statusBadge("paid"), formatZAR(33000)],
          ["INV-1046", "Takealot", "2026-03-25", statusBadge("draft"), formatZAR(67500)],
        ],
        alignRight: [4],
      }),
    }),
  )}

  ${story(
    "List Items",
    section({
      content: [
        listItem({
          title: "Vodacom Business",
          subtitle: "vodacom@accounts.co.za",
          right: formatZAR(45000),
          badge: statusBadge("paid"),
        }),
        listItem({
          title: "Discovery Health",
          subtitle: "procurement@discovery.co.za",
          right: formatZAR(82500),
          badge: statusBadge("authorised"),
        }),
        listItem({
          title: "Standard Bank",
          subtitle: "vendor@standardbank.co.za",
          badge: statusBadge("overdue"),
        }),
      ].join(""),
    }),
  )}

  ${story(
    "Key-Value Pairs",
    section({
      title: "Document Details",
      content: [
        kvPair("Type", "Invoice"),
        kvPair("Supplier", "AWS"),
        kvPair("Amount", formatZAR(14200)),
        kvPair("Due Date", "2026-04-15"),
        kvPair("Status", statusBadge("authorised")),
      ].join(""),
    }),
  )}
  </div>

  <div id="charts">
  ${story(
    "Bar Chart",
    section({
      title: "Monthly Revenue",
      content: barChart({
        data: [
          { label: "Oct", value: 180000 },
          { label: "Nov", value: 220000 },
          { label: "Dec", value: 140000 },
          { label: "Jan", value: 160000 },
          { label: "Feb", value: 200000 },
          { label: "Mar", value: 240000 },
        ],
        showValues: true,
        formatValue: (v) => "R" + Math.round(v / 1000) + "k",
      }),
    }),
  )}

  ${story(
    "Line Chart",
    section({
      title: "Revenue vs Expenses",
      content: lineChart({
        labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        series: [
          {
            label: "Revenue",
            data: [180000, 220000, 140000, 160000, 200000, 240000],
            color: colors.success,
          },
          {
            label: "Expenses",
            data: [150000, 170000, 160000, 140000, 155000, 180000],
            color: colors.error,
          },
        ],
        formatValue: (v) => "R" + Math.round(v / 1000) + "k",
      }),
    }),
  )}

  ${story(
    "Donut Chart",
    row([
      section({
        title: "Task Status",
        content:
          '<div style="display:flex;justify-content:center">' +
          donutChart({
            data: [
              { label: "Completed", value: 12, color: colors.success },
              { label: "Processing", value: 5, color: colors.info },
              { label: "Pending", value: 3, color: colors.warning },
              { label: "Failed", value: 1, color: colors.error },
            ],
            centerValue: "21",
            centerLabel: "total",
          }) +
          "</div>",
      }),
      section({
        title: "Invoice Split",
        content:
          '<div style="display:flex;justify-content:center">' +
          donutChart({
            data: [
              { label: "Paid", value: 45 },
              { label: "Authorised", value: 12 },
              { label: "Overdue", value: 5 },
              { label: "Draft", value: 3 },
            ],
            centerValue: "65",
            centerLabel: "invoices",
          }) +
          "</div>",
      }),
    ]),
  )}

  ${story(
    "Sparklines & Progress",
    `
    <div style="margin-bottom:16px">
      <span style="font-size:13px;color:#6b7280;margin-right:8px">Revenue trend</span>
      ${sparkline({ data: [180, 220, 140, 160, 200, 240], color: colors.success })}
    </div>
    <div style="margin-bottom:16px">
      <span style="font-size:13px;color:#6b7280;margin-right:8px">Expense trend</span>
      ${sparkline({ data: [150, 170, 160, 140, 155, 180], color: colors.error })}
    </div>
    <div style="margin-bottom:16px">
      ${progressBar({ value: 75, max: 100, label: "Q1 Target", color: colors.success })}
    </div>
    <div style="margin-bottom:16px">
      ${progressBar({ value: 45, max: 100, label: "Collection Rate", color: colors.warning })}
    </div>
    <div>
      ${stackedBar({
        segments: [
          { label: "Paid", value: 45, color: colors.success },
          { label: "Authorised", value: 12, color: colors.info },
          { label: "Overdue", value: 5, color: colors.error },
        ],
      })}
    </div>
  `,
  )}
  </div>

  <div id="layout">
  ${story(
    "Section / Card",
    section({
      title: "Card Title",
      subtitle: "Optional subtitle text",
      content: `<p style="font-size:13px;color:#6b7280">Any content goes inside a section — tables, charts, metrics, or plain text.</p>`,
    }),
  )}

  ${story("Empty State", section({ content: emptyState("No documents found matching your criteria") }))}
  </div>

  <div id="reports">
  ${story(
    "Financial Summary Report",
    financialSummary({
      accountsReceivable: 285500,
      accountsPayable: 95700,
      overdueInvoices: 3,
      overdueAmount: 178000,
      totalRevenue: 2450000,
      totalExpenses: 1890000,
      netProfit: 560000,
      period: { from: "2025-04", to: "2026-03" },
    }),
  )}
  </div>

</div>
</body>
</html>`;

console.log(html);
