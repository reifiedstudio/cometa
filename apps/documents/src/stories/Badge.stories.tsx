import { Badge } from "@/components/ui/badge";
import type { Meta, StoryObj } from "@storybook/react";
import { Check, Clock } from "lucide-react";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: "Default" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Secondary" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Destructive" } };
export const Outline: Story = { args: { variant: "outline", children: "Outline" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Ghost" } };

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Check />
        Signed
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge className="gap-1.5 border bg-amber-50 text-amber-700 border-amber-200/60">
        <Clock className="size-3" />
        Pending
      </Badge>
      <Badge className="gap-1.5 border bg-emerald-50 text-emerald-700 border-emerald-200/60">
        <Check className="size-3" />
        Signed
      </Badge>
      <Badge className="gap-1.5 border bg-blue-50 text-blue-700 border-blue-200/60">Viewed</Badge>
    </div>
  ),
};
