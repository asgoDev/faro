import { create } from 'zustand';

export const useMissingStore = create((set) => ({
  search: '',
  page: 1,
  activeTab: 'inicio',
  estado: 'DESAPARECIDO', // Por defecto casos activos (Desaparecidos)
  sexo: '', // Todos los sexos por defecto
  
  setSearch: (search) => set({ search, page: 1 }), // Reiniciar a pág 1 en búsqueda
  setPage: (page) => set({ page }),
  setEstado: (estado) => set({ estado, page: 1 }), // Reiniciar a pág 1 al filtrar por estado
  setSexo: (sexo) => set({ sexo, page: 1 }), // Reiniciar a pág 1 al filtrar por sexo
  setActiveTab: (activeTab) => set((state) => {
    // Si vuelve a inicio, limpiar filtros y búsquedas
    const extra = activeTab === 'inicio' ? { search: '', page: 1, estado: 'DESAPARECIDO', sexo: '' } : {};
    return { activeTab, ...extra };
  }),
  resetFilters: () => set({ search: '', page: 1, activeTab: 'inicio', estado: 'DESAPARECIDO', sexo: '' }),
}));
