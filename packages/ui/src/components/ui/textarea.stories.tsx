import type { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "./textarea"
import { Label } from "./label"

const meta: Meta = {
  title: "Components/Textarea",
  component: Textarea,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => <Textarea placeholder="Type your message here." className="max-w-sm" />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Textarea disabled placeholder="Disabled textarea" className="max-w-sm" />
  ),
}
