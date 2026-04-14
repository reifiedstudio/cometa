import type { Meta, StoryObj } from "@storybook/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "./input-group"
import { SearchIcon, EyeIcon } from "lucide-react"

const meta: Meta = {
  title: "Components/InputGroup",
}
export default meta

type Story = StoryObj

export const WithIcon: Story = {
  render: () => (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  ),
}

export const WithButton: Story = {
  render: () => (
    <InputGroup className="max-w-sm">
      <InputGroupInput type="password" placeholder="Password" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="ghost" size="icon-xs">
          <EyeIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}
