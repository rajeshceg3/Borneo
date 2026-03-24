import { createStore } from 'zustand/vanilla';
import { attractions } from '../data/attractions';

export const navigationStore = createStore((set) => ({
  selectedAttractionId: attractions[0]?.id ?? null,
  setSelectedAttraction: (id) => set({ selectedAttractionId: id }),
}));
