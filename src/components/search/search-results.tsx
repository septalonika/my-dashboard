"use client";

import { LeadInterface } from "@/interfaces/leads";
import { SearchResultCard } from "@/components/search/search-result-card";
import { Loader2, Search as SearchIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SearchResultsProps {
  data: LeadInterface[];
  loading: boolean;
  error: string | null;
  query: string;
  onLeadClick?: (lead: LeadInterface) => void;
}

export function SearchResults({
  data,
  loading,
  error,
  query,
  onLeadClick,
}: SearchResultsProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <div className="text-center">
          <p className="text-lg font-medium text-zinc-900 dark:text-white">
            Searching...
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Finding results for "{query}"
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            <p className="font-medium">Search failed</p>
            <p className="text-sm mt-1">{error}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state - no query
  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
          <SearchIcon className="w-8 h-8 text-zinc-400" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-zinc-900 dark:text-white">
            Start searching
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Type a name, email, or phone number to find leads
          </p>
        </div>
      </div>
    );
  }

  // Empty state - no results
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
          <SearchIcon className="w-8 h-8 text-zinc-400" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-zinc-900 dark:text-white">
            No results found
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            No leads match "{query}". Try a different search term.
          </p>
        </div>
      </div>
    );
  }

  // Results list
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Found {data.length} {data.length === 1 ? "result" : "results"} for "
          {query}"
        </p>
      </div>
      <div className="grid gap-4">
        {data.map((lead) => (
          <SearchResultCard
            key={lead.id}
            lead={lead}
            onClick={() => onLeadClick?.(lead)}
          />
        ))}
      </div>
    </div>
  );
}
