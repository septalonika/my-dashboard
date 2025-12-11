"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  bulkStatus: string;
  onSelectAll: (checked: boolean) => void;
  onBulkStatusChange: (status: string) => void;
  onBulkUpdate: () => void;
}

export function BulkActions({
  selectedCount,
  totalCount,
  bulkStatus,
  onSelectAll,
  onBulkStatusChange,
  onBulkUpdate,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
      <Checkbox
        checked={selectedCount === totalCount}
        onCheckedChange={onSelectAll}
      />
      <span className="font-medium">{selectedCount} selected</span>
      <Select value={bulkStatus} onValueChange={onBulkStatusChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Change status to..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="qualified">Qualified</SelectItem>
          <SelectItem value="proposal">Proposal</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
          <SelectItem value="lost">Lost</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={onBulkUpdate} variant="default" size="sm">
        Update {selectedCount}
      </Button>
    </div>
  );
}
