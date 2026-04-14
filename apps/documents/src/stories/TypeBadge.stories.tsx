import { TypeBadge } from "@/components/ui/type-badge";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TypeBadge> = {
  title: "UI/TypeBadge",
  component: TypeBadge,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["invoice", "receipt", "contract", "delivery_note", "bill"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof TypeBadge>;

export const Invoice: Story = { args: { type: "invoice" } };
export const Receipt: Story = { args: { type: "receipt" } };
export const Contract: Story = { args: { type: "contract" } };
export const DeliveryNote: Story = { args: { type: "delivery_note" } };
export const Bill: Story = { args: { type: "bill" } };

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TypeBadge type="invoice" />
      <TypeBadge type="receipt" />
      <TypeBadge type="contract" />
      <TypeBadge type="delivery_note" />
      <TypeBadge type="bill" />
    </div>
  ),
};
