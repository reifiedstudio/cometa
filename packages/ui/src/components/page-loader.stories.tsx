import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { PageLoader } from "./page-loader"

const meta: Meta<typeof PageLoader> = {
  title: "Foundations/Page Loader",
  component: PageLoader,
  parameters: { layout: "fullscreen" },
}

export default meta
type Story = StoryObj<typeof PageLoader>

export const Default: Story = {
  args: { visible: true },
}

export const WithDismiss: Story = {
  render: () => {
    const [loading, setLoading] = useState(true)
    return (
      <div className="min-h-screen bg-background p-8">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          This is the page behind the loader. Click the button to toggle.
        </p>
        <button
          type="button"
          onClick={() => setLoading(!loading)}
          className="px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:bg-foreground/90"
        >
          {loading ? "Dismiss loader" : "Show loader"}
        </button>
        <PageLoader visible={loading} />
      </div>
    )
  },
}

export const CustomMessages: Story = {
  args: {
    visible: true,
    messages: [
      "Loading tonnes...",
      "Weighing cargo...",
      "Checking grade...",
      "Clearing port...",
      "Signing BOL...",
    ],
  },
}

export const LogoOnly: Story = {
  args: { visible: true, hideText: true },
}
