import { formatZAR } from "./utils";

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
