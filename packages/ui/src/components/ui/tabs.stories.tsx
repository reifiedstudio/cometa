import type { Meta, StoryObj } from "@storybook/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"

const meta: Meta = {
  title: "Components/Tabs",
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="mt-2">
        <p className="text-sm text-muted-foreground">
          Make changes to your account here. Click save when you are done.
        </p>
      </TabsContent>
      <TabsContent value="password" className="mt-2">
        <p className="text-sm text-muted-foreground">
          Change your password here. After saving, you will be logged out.
        </p>
      </TabsContent>
      <TabsContent value="notifications" className="mt-2">
        <p className="text-sm text-muted-foreground">
          Configure your notification preferences.
        </p>
      </TabsContent>
    </Tabs>
  ),
}

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-2">
        <p className="text-sm text-muted-foreground">Overview content goes here.</p>
      </TabsContent>
      <TabsContent value="analytics" className="mt-2">
        <p className="text-sm text-muted-foreground">Analytics content goes here.</p>
      </TabsContent>
      <TabsContent value="reports" className="mt-2">
        <p className="text-sm text-muted-foreground">Reports content goes here.</p>
      </TabsContent>
    </Tabs>
  ),
}
