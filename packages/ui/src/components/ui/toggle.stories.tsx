import type { Meta, StoryObj } from "@storybook/react"
import { Toggle } from "./toggle"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

const meta: Meta = {
  title: "Components/Toggle",
  component: Toggle,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  ),
}

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle italic">
      <ItalicIcon />
    </Toggle>
  ),
}

export const WithText: Story = {
  render: () => (
    <Toggle aria-label="Toggle underline">
      <UnderlineIcon data-icon="inline-start" />
      Underline
    </Toggle>
  ),
}
