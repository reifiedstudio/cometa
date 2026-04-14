import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
      <PopoverContent className="w-72 p-4">
        <PopoverHeader>
          <PopoverTitle>Filters</PopoverTitle>
          <PopoverDescription>Refine your document list.</PopoverDescription>
        </PopoverHeader>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" /> Receipts
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" /> Invoices
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" /> Contracts
          </label>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Simple: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button>Show details</Button>} />
      <PopoverContent className="w-64 p-3">
        <p className="text-sm text-foreground">Last updated 2 hours ago by alice@example.com.</p>
      </PopoverContent>
    </Popover>
  ),
};
