"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";

const presets = [
  { label: "Today", getValue: () => { const d = new Date(); d.setHours(0,0,0,0); return { from: d, to: new Date() }; } },
  { label: "Last 7 days", getValue: () => { const d = new Date(); d.setDate(d.getDate() - 7); d.setHours(0,0,0,0); return { from: d, to: new Date() }; } },
  { label: "Last 30 days", getValue: () => { const d = new Date(); d.setDate(d.getDate() - 30); d.setHours(0,0,0,0); return { from: d, to: new Date() }; } },
  { label: "This month", getValue: () => { const now = new Date(); return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: new Date() }; } },
  { label: "Last month", getValue: () => { const now = new Date(); return { from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) }; } },
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
      <PopoverTrigger className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#555A65] bg-white rounded-lg border border-[#EBEEF1] hover:bg-[#F8F8F8] transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {label}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex-row gap-0" align="end">
        <div className="border-r border-[#EBEEF1] p-2 space-y-0.5 w-36">
          <button
            type="button"
            onClick={() => {
              setRange(undefined);
              onChange(undefined);
              setOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 text-sm rounded-md transition-colors ${
              !range ? "bg-[#212327] text-white" : "text-[#555A65] hover:bg-[#F8F8F8]"
            }`}
          >
            All time
          </button>
          {presets.map((preset) => {
            const presetRange = preset.getValue();
            const isActive = range?.from?.toDateString() === presetRange.from.toDateString()
              && range?.to?.toDateString() === presetRange.to.toDateString();
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  const r = preset.getValue();
                  setRange(r);
                  onChange(r);
                  setOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
                  isActive ? "bg-[#212327] text-white" : "text-[#555A65] hover:bg-[#F8F8F8]"
                }`}
              >
                {preset.label}
              </button>
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
