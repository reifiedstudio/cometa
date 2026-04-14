import { FilterTabs } from "@/components/ui/filter-tabs";
import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircle2, Clock, Users } from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof FilterTabs> = {
  title: "UI/FilterTabs",
  component: FilterTabs,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof FilterTabs>;

export const DocumentTypes: Story = {
  render: () => {
    const [active, setActive] = useState("all");
    return (
      <FilterTabs
        activeKey={active}
        onChange={setActive}
        tabs={[
          { key: "all", label: "All", count: 24 },
          { key: "invoice", label: "Invoices", count: 12 },
          { key: "receipt", label: "Receipts", count: 5 },
          { key: "contract", label: "Contracts", count: 4 },
          { key: "delivery_note", label: "Delivery Notes", count: 2 },
          { key: "bill", label: "Bills", count: 1 },
        ]}
      />
    );
  },
};

export const SignatureFilters: Story = {
  render: () => {
    const [active, setActive] = useState("all");
    return (
      <FilterTabs
        activeKey={active}
        onChange={setActive}
        tabs={[
          { key: "all", label: "All", count: 8, icon: <Users size={14} /> },
          { key: "awaiting", label: "Awaiting", count: 5, icon: <Clock size={14} /> },
          { key: "completed", label: "Completed", count: 3, icon: <CheckCircle2 size={14} /> },
        ]}
      />
    );
  },
};
