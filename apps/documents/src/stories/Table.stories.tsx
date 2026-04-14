import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

const documents = [
  { id: "1", name: "Invoice #1042", type: "Invoice", status: "Approved", amount: "$1,200" },
  { id: "2", name: "Lease agreement", type: "Contract", status: "Pending", amount: "—" },
  { id: "3", name: "KURO RAMEN", type: "Receipt", status: "Approved", amount: "$48.50" },
  { id: "4", name: "Delivery 0091", type: "Delivery note", status: "Reviewed", amount: "—" },
];

export const Basic: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((d) => (
          <TableRow key={d.id}>
            <TableCell className="font-medium">{d.name}</TableCell>
            <TableCell className="text-muted-foreground">{d.type}</TableCell>
            <TableCell>
              <Badge variant="outline">{d.status}</Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">{d.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent documents.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.slice(0, 2).map((d) => (
          <TableRow key={d.id}>
            <TableCell>{d.name}</TableCell>
            <TableCell className="text-right tabular-nums">{d.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
