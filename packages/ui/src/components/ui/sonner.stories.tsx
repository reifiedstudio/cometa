import type { Meta, StoryObj } from "@storybook/react"
import { toast } from "sonner"
import { Button } from "./button"

const meta: Meta = {
  title: "Components/Sonner",
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => toast("Event has been created", {
          description: "Sunday, December 03, 2024 at 9:00 AM",
        })}
      >
        Show Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Document uploaded successfully")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("Something went wrong")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Please review your changes")}
      >
        Warning
      </Button>
    </div>
  ),
}
