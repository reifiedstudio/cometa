import type { Meta, StoryObj } from "@storybook/react"
import { Slider } from "./slider"

const meta: Meta = {
  title: "Components/Slider",
  component: Slider,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Slider defaultValue={[50]} max={100} className="max-w-md" />
  ),
}

export const Range: Story = {
  render: () => (
    <Slider defaultValue={[25, 75]} max={100} className="max-w-md" />
  ),
}
