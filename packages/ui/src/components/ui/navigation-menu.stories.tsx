import type { Meta, StoryObj } from "@storybook/react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./navigation-menu"

const meta: Meta = {
  title: "Components/NavigationMenu",
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <NavigationMenuLink href="#">
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">Introduction</div>
                  <p className="text-sm text-muted-foreground">
                    A brief overview of the project and its goals.
                  </p>
                </div>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">Installation</div>
                  <p className="text-sm text-muted-foreground">
                    How to install and set up the project.
                  </p>
                </div>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <NavigationMenuLink href="#">
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">Button</div>
                  <p className="text-sm text-muted-foreground">
                    Interactive button component with variants.
                  </p>
                </div>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">Dialog</div>
                  <p className="text-sm text-muted-foreground">
                    Modal dialog for important interactions.
                  </p>
                </div>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Documentation</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
