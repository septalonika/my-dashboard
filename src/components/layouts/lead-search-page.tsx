"use client";

import { useState, useEffect } from "react";
import { useSearchStore } from "@/stores/useSearchStore";
import { LeadInterface } from "@/interfaces/leads";
import { SearchInput } from "@/components/search/search-input";
import { SearchResults } from "@/components/search/search-results";
import { LeadDetailDialog } from "@/components/dashboard/lead-detail-dialog";
import { Card } from "@/components/ui/card";

export function LeadSearchPage() {
  const [selectedLead, setSelectedLead] = useState<LeadInterface | null>(null);

  const { query, data, loading, error, search, clearSearch, cleanup } =
    useSearchStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const handleSearchChange = (value: string) => {
    search(value, {
      debounceMs: 300,
      minQueryLength: 1,
      endpoint: "/leads",
    });
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const handleLeadClick = (lead: LeadInterface) => {
    setSelectedLead(lead);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Search Leads
            </h1>
          </div>
        </div>

        {/* Search Input */}
        <Card className="p-6">
          <SearchInput
            value={query}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            loading={loading}
            placeholder="Search by name, email, or phone..."
          />
        </Card>

        {/* Search Results */}
        <Card className="p-6">
          <SearchResults
            data={data}
            loading={loading}
            error={error}
            query={query}
            onLeadClick={handleLeadClick}
          />
        </Card>
      </div>

      {/* Detail Dialog */}
      <LeadDetailDialog
        lead={selectedLead}
        onOpenChange={() => setSelectedLead(null)}
      />
    </div>
  );
}
