import { createStore } from 'zustand/vanilla'

export const useStore = createStore((set) => ({
  attractions: [],
  wildlife: [],
  trails: [],
  isWildlifeVisible: false,
  activeItem: null,

  setAttractions: (attractions) => set({ attractions }),
  setWildlife: (wildlife) => set({ wildlife }),
  setTrails: (trails) => set({ trails }),
  toggleWildlifeVisibility: () => set((state) => ({ isWildlifeVisible: !state.isWildlifeVisible })),
  setActiveItem: (item) => set({ activeItem: item }),
  clearActiveItem: () => set({ activeItem: null })
}))
