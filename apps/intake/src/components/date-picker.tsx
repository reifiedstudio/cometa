"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { useState } from "react";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  /** Only allow dates from today onwards */
  futureOnly?: boolean;
  /** Only allow dates up to today */
  pastOnly?: boolean;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Additional className for the trigger */
  className?: string;
  /** Compact mode — smaller trigger */
  compact?: boolean;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  futureOnly,
  pastOnly,
  minDate,
  maxDate,
  className,
  compact,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const disabledMatchers: Array<{ before: Date } | { after: Date }> = [];
  if (futureOnly) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    disabledMatchers.push({ before: today });
  }
  if (pastOnly) {
    disabledMatchers.push({ after: new Date() });
  }
  if (minDate) disabledMatchers.push({ before: minDate });
  if (maxDate) disabledMatchers.push({ after: maxDate });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-1.5 text-sm rounded-lg border border-border hover:bg-muted transition-colors",
          compact ? "px-2.5 py-1.5" : "px-3 py-2",
          value ? "text-foreground" : "text-muted-foreground/60",
          className,
        )}
      >
        <CalendarDays size={14} className="text-muted-foreground" />
        {value ? formatDate(value) : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          numberOfMonths={1}
          disabled={disabledMatchers.length > 0 ? disabledMatchers : undefined}
          defaultMonth={value}
        />
        {value && (
          <div className="border-t border-border pt-2 mt-1 px-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
            >
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
