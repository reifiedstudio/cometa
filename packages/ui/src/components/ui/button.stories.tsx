import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./button"
import { MailIcon, PlusIcon } from "lucide-react"

const meta: Meta = {
  title: "Components/Button",
  component: Button,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => <Button>Button</Button>,
}

export const Outline: Story = {
  render: () => <Button variant="outline">Outline</Button>,
}

export const Secondary: Story = {
  render: () => <Button variant="secondary">Secondary</Button>,
}

export const Ghost: Story = {
  render: () => <Button variant="ghost">Ghost</Button>,
}

export const Destructive: Story = {
  render: () => <Button variant="destructive">Destructive</Button>,
}

export const Link: Story = {
  render: () => <Button variant="link">Link</Button>,
}

export const WithIcon: Story = {
  render: () => (
    <Button>
      <MailIcon data-icon="inline-start" />
      Login with Email
    </Button>
  ),
}

export const IconOnly: Story = {
  render: () => (
    <Button size="icon">
      <PlusIcon />
    </Button>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
