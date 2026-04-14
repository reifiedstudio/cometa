import { StatusBadge } from "@/components/ui/status-badge";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof StatusBadge> = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["reviewed", "pending", "processing", "rejected", "overdue", "awaiting_signature"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Reviewed: Story = { args: { status: "reviewed" } };
export const Pending: Story = { args: { status: "pending" } };
export const Processing: Story = { args: { status: "processing" } };
export const Rejected: Story = { args: { status: "rejected" } };
export const Overdue: Story = { args: { status: "overdue" } };
export const AwaitingSignature: Story = { args: { status: "awaiting_signature" } };

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="reviewed" />
      <StatusBadge status="pending" />
      <StatusBadge status="processing" />
      <StatusBadge status="rejected" />
      <StatusBadge status="overdue" />
      <StatusBadge status="awaiting_signature" />
    </div>
  ),
};
