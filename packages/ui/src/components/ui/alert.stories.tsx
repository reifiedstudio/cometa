import type { Meta, StoryObj } from "@storybook/react"
import { Alert, AlertTitle, AlertDescription } from "./alert"
import { InfoIcon, TriangleAlertIcon } from "lucide-react"

const meta: Meta = {
  title: "Components/Alert",
  component: Alert,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Alert className="max-w-md">
      <InfoIcon />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-md">
      <TriangleAlertIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
}
