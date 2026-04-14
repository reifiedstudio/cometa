import type { Meta, StoryObj } from "@storybook/react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./resizable"

const meta: Meta = {
  title: "Components/Resizable",
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
