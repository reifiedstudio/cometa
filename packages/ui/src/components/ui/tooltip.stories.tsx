import type { Meta, StoryObj } from "@storybook/react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip"
import { Button } from "./button"

const meta: Meta = {
  title: "Components/Tooltip",
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover me
      </TooltipTrigger>
      <TooltipContent>
        This is a tooltip
      </TooltipContent>
    </Tooltip>
  ),
}
