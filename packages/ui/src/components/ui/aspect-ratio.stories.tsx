import type { Meta, StoryObj } from "@storybook/react"
import { AspectRatio } from "./aspect-ratio"

const meta: Meta = {
  title: "Components/AspectRatio",
  component: AspectRatio,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted">
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          16:9 Aspect Ratio
        </div>
      </AspectRatio>
    </div>
  ),
}
