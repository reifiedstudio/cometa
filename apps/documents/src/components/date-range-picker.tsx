"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

const presets = [
  {
    label: "Today",
    getValue: () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return { from: d, to: new Date() };
    },
  },
  {
    label: "Last 7 days",
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      d.setHours(0, 0, 0, 0);
      return { from: d, to: new Date() };
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      d.setHours(0, 0, 0, 0);
      return { from: d, to: new Date() };
    },
  },
  {
    label: "This month",
    getValue: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: new Date() };
    },
  },
  {
    label: "Last month",
    getValue: () => {
      const now = new Date();
      return {
        from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        to: new Date(now.getFullYear(), now.getMonth(), 0),
      };
    },
  },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

export default function DateRangePicker({
  onChange,
}: {
  onChange: (range: { from?: Date; to?: Date } | undefined) => void;
}) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [open, setOpen] = useState(false);

  const label = range?.from
    ? range.to
      ? `${formatDate(range.from)} – ${formatDate(range.to)}`
      : formatDate(range.from)
    : "All time";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground bg-card rounded-lg border border-border hover:bg-muted transition-colors">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {label}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex-row gap-0" align="end">
        <div className="border-r border-border p-2 space-y-0.5 w-36">
          <Button
            variant={!range ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setRange(undefined);
              onChange(undefined);
              setOpen(false);
            }}
            className={cn("w-full justify-start", !range ? "" : "text-muted-foreground")}
          >
            All time
          </Button>
          {presets.map((preset) => {
            const presetRange = preset.getValue();
            const isActive =
              range?.from?.toDateString() === presetRange.from.toDateString() &&
              range?.to?.toDateString() === presetRange.to.toDateString();
            return (
              <Button
                key={preset.label}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  const r = preset.getValue();
                  setRange(r);
                  onChange(r);
                  setOpen(false);
                }}
                className={cn(
                  "w-full justify-start whitespace-nowrap",
                  isActive ? "" : "text-muted-foreground",
                )}
              >
                {preset.label}
              </Button>
            );
          })}
        </div>
        <div className="p-2">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(r) => {
              setRange(r);
              if (r?.from && r?.to) {
                onChange(r);
              }
            }}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
