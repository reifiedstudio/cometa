"use client"

import { cn } from "../lib/cn"

interface FilterTab {
  key: string
  label: string
  count?: number
}

interface FilterTabsProps {
  tabs: FilterTab[]
  activeKey: string
  onChange: (key: string) => void
  className?: string
}

/**
 * Pill-style filter tabs with optional counts.
 *
 * ```tsx
 * <FilterTabs
 *   tabs={[
 *     { key: "all", label: "All", count: 32 },
 *     { key: "open", label: "Open", count: 12 },
 *   ]}
 *   activeKey={filter}
 *   onChange={setFilter}
 * />
 * ```
 */
export function FilterTabs({ tabs, activeKey, onChange, className }: FilterTabsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-colors",
            activeKey === tab.key
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "text-[10px] tabular-nums",
              activeKey === tab.key ? "text-background/70" : "text-muted-foreground/60",
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
