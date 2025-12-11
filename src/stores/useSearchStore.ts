"use client";

import { create } from "zustand";
import { LeadInterface } from "@/interfaces/leads";

interface SearchState {
  // State
  query: string;
  data: LeadInterface[];
  loading: boolean;
  error: string | null;

  // Abort controller reference
  abortController: AbortController | null;

  // Debounce timer reference
  debounceTimer: NodeJS.Timeout | null;

  // Actions
  setQuery: (query: string) => void;
  setData: (data: LeadInterface[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAbortController: (controller: AbortController | null) => void;
  setDebounceTimer: (timer: NodeJS.Timeout | null) => void;

  // Main search function
  search: (query: string, options?: SearchOptions) => void;
  performSearch: (query: string, options?: SearchOptions) => Promise<void>;
  clearSearch: () => void;

  // Cleanup
  cleanup: () => void;
}

interface SearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  endpoint?: string;
}
const defaultOptions: Required<SearchOptions> = {
  debounceMs: 300,
  minQueryLength: 1,
  endpoint: "/leads",
};

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  data: [],
  loading: false,
  error: null,
  abortController: null,
  debounceTimer: null,
  setQuery: (query) => set({ query }),
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setAbortController: (controller) => set({ abortController: controller }),
  setDebounceTimer: (timer) => set({ debounceTimer: timer }),

  // Search with debouncing
  search: (query, options = {}) => {
    const { debounceMs, minQueryLength } = { ...defaultOptions, ...options };
    const state = get();

    // Clear previous debounce timer
    if (state.debounceTimer) {
      clearTimeout(state.debounceTimer);
    }

    // Update query
    set({ query });

    // If query is empty, clear everything
    if (!query) {
      set({
        data: [],
        loading: false,
        error: null,
        debounceTimer: null,
      });
      return;
    }

    // Don't search if query is too short
    if (query.length < minQueryLength) {
      set({
        data: [],
        loading: false,
        error: null,
      });
      return;
    }

    // Set up debounce timer
    const timer = setTimeout(() => {
      state.performSearch(query, options);
    }, debounceMs);

    set({ debounceTimer: timer });
  },

  // Perform actual search
  performSearch: async (searchQuery, options = {}) => {
    const { endpoint, minQueryLength } = { ...defaultOptions, ...options };
    const state = get();
    if (state.abortController) {
      state.abortController.abort();
    }
    if (searchQuery.length < minQueryLength) {
      set({
        data: [],
        loading: false,
        error: null,
      });
      return;
    }
    const newAbortController = new AbortController();
    set({
      abortController: newAbortController,
      loading: true,
      error: null,
    });

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5047";
      const url = new URL(`${baseUrl}${endpoint}`);
      url.searchParams.append("search", searchQuery);

      const response = await fetch(url.toString(), {
        signal: newAbortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const results = Array.isArray(responseData)
        ? responseData
        : responseData.leads || [];

      set({
        data: results,
        error: null,
        loading: false,
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          console.log("Request aborted");
        } else {
          set({
            error: err.message || "An error occurred while searching",
            data: [],
            loading: false,
          });
        }
      }
    }
  },

  clearSearch: () => {
    const state = get();

    if (state.abortController) {
      state.abortController.abort();
    }
    if (state.debounceTimer) {
      clearTimeout(state.debounceTimer);
    }

    set({
      query: "",
      data: [],
      error: null,
      loading: false,
      abortController: null,
      debounceTimer: null,
    });
  },

  cleanup: () => {
    const state = get();

    if (state.abortController) {
      state.abortController.abort();
    }

    if (state.debounceTimer) {
      clearTimeout(state.debounceTimer);
    }

    set({
      abortController: null,
      debounceTimer: null,
    });
  },
}));
