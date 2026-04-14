import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Meta, StoryObj } from "@storybook/react";
import { Info, Trash2 } from "lucide-react";

const meta: Meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent>This is a tooltip</TooltipContent>
    </Tooltip>
  ),
};

export const OnIconButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="ghost" size="icon-sm">
            <Trash2 />
          </Button>
        }
      />
      <TooltipContent>Delete document</TooltipContent>
    </Tooltip>
  ),
};

export const OnText: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground cursor-help">
            <Info className="size-3" />
            Why is this disabled?
          </span>
        }
      />
      <TooltipContent>You don&apos;t have permission to edit this document.</TooltipContent>
    </Tooltip>
  ),
};
