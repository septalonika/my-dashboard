"use client";

import { useState, useMemo } from "react";
import { LeadInterface } from "@/interfaces/leads";

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export function useLeadFilters(leads: LeadInterface[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "createdAt",
    direction: "desc",
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;
      const matchesSource =
        sourceFilter === "all" || lead.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let aVal = a[sortConfig.key as keyof LeadInterface];
      let bVal = b[sortConfig.key as keyof LeadInterface];

      if (sortConfig.key === "owner") {
        aVal = a.owner?.name || "";
        bVal = b.owner?.name || "";
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      const aNum = new Date(aVal as string).getTime();
      const bNum = new Date(bVal as string).getTime();

      return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
    });
  }, [filteredLeads, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    sortConfig,
    handleSort,
    filteredLeads,
    sortedLeads,
  };
}
