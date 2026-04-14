import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Select defaultValue="receipt">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Document type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="invoice">Invoice</SelectItem>
        <SelectItem value="receipt">Receipt</SelectItem>
        <SelectItem value="contract">Contract</SelectItem>
        <SelectItem value="bill">Bill</SelectItem>
        <SelectItem value="delivery_note">Delivery note</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Small: Story = {
  render: () => (
    <Select defaultValue="approved">
      <SelectTrigger size="sm" className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithPlaceholder: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Choose a status..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending review</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  ),
};
