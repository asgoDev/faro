import { create } from 'zustand';

export const useMissingStore = create((set) => ({
  search: '',
  page: 1,
  activeTab: 'inicio',
  
  setSearch: (search) => set({ search, page: 1 }), // Reset to page 1 on new search
  setPage: (page) => set({ page }),
  setActiveTab: (activeTab) => set((state) => {
    // If returning to inicio, clear search
    const extra = activeTab === 'inicio' ? { search: '', page: 1 } : {};
    return { activeTab, ...extra };
  }),
  resetFilters: () => set({ search: '', page: 1, activeTab: 'inicio' }),
}));
