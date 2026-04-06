"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  onClick?: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  onClick,
  placeholder = "Search documents...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#717983]">
        <Search size={16} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        readOnly
        onClick={onClick}
        className="pl-9 pr-14 py-2 w-64 text-sm rounded-lg border border-[#EBEEF1] bg-white text-[#212327] placeholder:text-[#717983] focus:outline-none focus:ring-2 focus:ring-[#D09305]/30 focus:border-[#D09305] cursor-pointer"
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-[#717983] bg-[#F8F8F8] border border-[#EBEEF1] rounded">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}
