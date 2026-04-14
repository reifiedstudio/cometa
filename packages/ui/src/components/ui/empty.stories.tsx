import type { Meta, StoryObj } from "@storybook/react"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "./empty"
import { Button } from "./button"
import { InboxIcon, PlusIcon } from "lucide-react"

const meta: Meta = {
  title: "Components/Empty",
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No documents yet</EmptyTitle>
        <EmptyDescription>
          Upload your first document to get started with processing and analysis.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <PlusIcon data-icon="inline-start" />
          Upload Document
        </Button>
      </EmptyContent>
    </Empty>
  ),
}
