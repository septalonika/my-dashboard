"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Users2 } from "lucide-react";

interface DashboardFiltersProps {
  searchTerm: string;
  statusFilter: string;
  sourceFilter: string;
  pageSize: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
}

export function DashboardFilters({
  searchTerm,
  statusFilter,
  sourceFilter,
  pageSize,
  onSearchChange,
  onStatusChange,
  onSourceChange,
  onPageSizeChange,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          placeholder="Search name, email, phone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-44">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="contacted">Contacted</SelectItem>
          <SelectItem value="qualified">Qualified</SelectItem>
          <SelectItem value="proposal">Proposal</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
          <SelectItem value="lost">Lost</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sourceFilter} onValueChange={onSourceChange}>
        <SelectTrigger className="w-44">
          <Users2 className="w-4 h-4 mr-2" />
          <SelectValue placeholder="All Sources" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="landing_page">Landing Page</SelectItem>
          <SelectItem value="referral">Referral</SelectItem>
          <SelectItem value="social_media">Social Media</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={pageSize.toString()}
        onValueChange={(v) => onPageSizeChange(Number(v))}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 per page</SelectItem>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="25">25 per page</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
