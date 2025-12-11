"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { LeadInterface } from "@/interfaces/leads";
import { LeadAvatar } from "@/components/dashboard/lead-avatar";
import { LeadActions } from "@/components/dashboard/lead-actions";
import { format, formatDistanceToNow } from "date-fns";

const safeFormat = (dateString: string, formatStr: string) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "—" : format(date, formatStr);
  } catch {
    return "—";
  }
};

const safeDistance = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "—"
      : formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "—";
  }
};

const statusConfig: Record<string, any> = {
  contacted: "default",
  qualified: "default",
  proposal: "outline",
  negotiation: "secondary",
  closed: "success",
  lost: "destructive",
};

const sourceConfig: Record<string, any> = {
  landing_page: "sky",
  referral: "violet",
  social_media: "pink",
  email_campaign: "orange",
};

interface LeadTableRowProps {
  lead: LeadInterface;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function LeadTableRow({
  lead,
  isSelected,
  onSelect,
  onClick,
  onEdit,
  onDelete,
}: LeadTableRowProps) {
  return (
    <TableRow
      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-all duration-200 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 cursor-pointer group hover:shadow-md"
      onClick={onClick}
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </TableCell>
      <TableCell className="font-semibold text-zinc-900 dark:text-white py-5">
        <div className="flex items-center space-x-3">
          <LeadAvatar name={lead.name} />
          <span>{lead.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-zinc-900 dark:text-zinc-100 font-medium">
        {lead.email}
      </TableCell>
      <TableCell className="text-zinc-700 dark:text-zinc-300">
        {lead.phone}
      </TableCell>
      <TableCell>
        <Badge
          variant={statusConfig[lead.status] || "default"}
          className="px-3 py-1 text-xs font-semibold"
        >
          {lead.status.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={sourceConfig[lead.source] || "outline"}
          className="px-3 py-1 text-xs font-semibold"
        >
          {lead.source.replace("_", " ").toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
        {lead.owner?.name || "—"}
      </TableCell>
      <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
        {safeDistance(lead.lastActivityAt)}
      </TableCell>
      <TableCell className="text-sm text-zinc-500 dark:text-zinc-400">
        {safeFormat(lead.createdAt, "MMM dd")}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <LeadActions onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}
