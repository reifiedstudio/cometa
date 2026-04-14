import { Calendar } from "@/components/ui/calendar";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Calendar>;

export const Single: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="rounded-xl border bg-card">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<{ from: Date; to?: Date } | undefined>({
      from: new Date(),
    });
    return (
      <div className="rounded-xl border bg-card">
        <Calendar mode="range" selected={range} onSelect={setRange as never} />
      </div>
    );
  },
};
