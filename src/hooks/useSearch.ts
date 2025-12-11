"use client";

import { useEffect } from "react";
import { useSearchStore } from "@/stores/useSearchStore";

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  endpoint?: string;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { query, data, loading, error, search, clearSearch, cleanup } =
    useSearchStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Wrapper untuk search dengan options
  const handleSearch = (searchQuery: string) => {
    search(searchQuery, options);
  };

  return {
    query,
    data,
    loading,
    error,
    search: handleSearch,
    clearSearch,
  };
}
