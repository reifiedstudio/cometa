"use client"

import * as React from "react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Eye, Link2 } from "lucide-react"

export interface Viewer {
  name: string
  initials: string
  time: string
  online?: boolean
}

interface ShareConfig {
  label?: string
  description?: string
  buttonLabel?: string
  onCopyLink?: () => void
}

interface DetailPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  viewers?: Viewer[]
  share?: ShareConfig
  children?: React.ReactNode
}

export function DetailPanel({
  open,
  onOpenChange,
  viewers = [],
  share,
  children,
}: DetailPanelProps) {
  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className={`fixed inset-0 top-14 z-30 bg-white/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => onOpenChange(false)}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-14 z-40 h-[calc(100vh-3.5rem)] border-l bg-background shadow-lg transition-all duration-300 ease-in-out lg:static lg:z-auto lg:shadow-none ${open ? "w-80 translate-x-0 lg:translate-x-0" : "w-0 translate-x-full lg:translate-x-0 lg:border-l-0"}`}
      >
        <div className="flex h-full w-80 flex-col overflow-hidden">
          {/* Share section */}
          {share && (
            <div className="shrink-0 border-b bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Link2 className="size-4 text-muted-foreground" />
                {share.label ?? "Shared via link"}
              </div>
              {share.description && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {share.description}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={share.onCopyLink}
              >
                {share.buttonLabel ?? "Copy link"}
              </Button>
            </div>
          )}

          {/* Scrollable content */}
          <ScrollArea className="min-h-0 flex-1">
            {/* Custom content */}
            {children}

            {/* Viewers section */}
            {viewers.length > 0 && (
              <div className="border-b p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  Viewers
                  <Badge variant="secondary" className="ml-auto">
                    <Eye className="size-3" />
                    {viewers.length} views
                  </Badge>
                </div>
                <div className="-mx-4 mt-3 divide-y">
                  {viewers.map((viewer) => (
                    <div
                      key={viewer.initials}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="relative">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">
                            {viewer.initials}
                          </AvatarFallback>
                        </Avatar>
                        {viewer.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-green-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {viewer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {viewer.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </aside>
    </>
  )
}
