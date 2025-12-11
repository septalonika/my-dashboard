"use client";

import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  totalLeads: number;
  filteredLeads: number;
  currentPage: number;
  totalPages: number;
  onAddLead: () => void;
}

export function DashboardHeader({
  totalLeads,
  filteredLeads,
  currentPage,
  totalPages,
  onAddLead,
}: DashboardHeaderProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Leads List
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 mt-1">
        {filteredLeads} of {totalLeads} leads • Page {currentPage} of{" "}
        {totalPages}
      </p>
      <Button variant="default" onClick={onAddLead} className="mt-2">
        + Add Lead
      </Button>
    </div>
  );
}
