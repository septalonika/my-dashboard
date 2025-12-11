"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface LeadsTableHeaderProps {
  headers: Array<{ key: string; label: string }>;
  sortConfig: SortConfig;
  allSelected: boolean;
  onSort: (key: string) => void;
  onSelectAll: (checked: boolean) => void;
}

export function LeadsTableHeader({
  headers,
  sortConfig,
  allSelected,
  onSort,
  onSelectAll,
}: LeadsTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="border-b-2 border-zinc-200 dark:border-zinc-700">
        <TableHead className="w-12">
          <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
        </TableHead>
        {headers.map((header) => (
          <TableHead
            key={header.key}
            className="group cursor-pointer font-semibold text-zinc-700 dark:text-zinc-300 py-6 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            onClick={() => onSort(header.key)}
          >
            <div className="flex items-center gap-2">
              {header.label}
              {sortConfig.key === header.key && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    sortConfig.direction === "desc" ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
