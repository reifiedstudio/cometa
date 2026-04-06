"use client";

import { cn } from "@/lib/utils";

interface FilterTab {
  key: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export function FilterTabs({ tabs, activeKey, onChange, className }: FilterTabsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {tabs.map((tab) => {
        const isActive = activeKey === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
              isActive
                ? "bg-[#212327] text-white"
                : "bg-[#F8F8F8] text-[#555A65] hover:bg-[#EBEEF1]",
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count != null && (
              <span className={cn("text-xs", isActive ? "text-white/70" : "text-[#717983]")}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
