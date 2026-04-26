import { create } from "zustand";

interface SearchState {
  searchQuery: string;
  search: (query: string) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: "",
  search: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: "" }),
}));
