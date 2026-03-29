import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';

describe('Zustand Global Store', () => {
  // Reset store before each test
  beforeEach(() => {
    useStore.setState({
      attractions: [],
      wildlife: [],
      trails: [],
      isWildlifeVisible: false,
      activeItem: null
    });
  });

  it('has initial default state', () => {
    const state = useStore.getState();
    expect(state.attractions).toEqual([]);
    expect(state.wildlife).toEqual([]);
    expect(state.trails).toEqual([]);
    expect(state.isWildlifeVisible).toBe(false);
    expect(state.activeItem).toBe(null);
  });

  it('updates attractions', () => {
    const mockAttractions = [{ id: 1, name: 'Danum Valley' }];
    useStore.getState().setAttractions(mockAttractions);
    expect(useStore.getState().attractions).toEqual(mockAttractions);
  });

  it('updates wildlife', () => {
    const mockWildlife = [{ id: 1, name: 'Orangutan' }];
    useStore.getState().setWildlife(mockWildlife);
    expect(useStore.getState().wildlife).toEqual(mockWildlife);
  });

  it('updates trails', () => {
    const mockTrails = [{ id: 1, name: 'Kinabatangan Trail' }];
    useStore.getState().setTrails(mockTrails);
    expect(useStore.getState().trails).toEqual(mockTrails);
  });

  it('toggles wildlife visibility', () => {
    expect(useStore.getState().isWildlifeVisible).toBe(false);
    useStore.getState().toggleWildlifeVisibility();
    expect(useStore.getState().isWildlifeVisible).toBe(true);
    useStore.getState().toggleWildlifeVisibility();
    expect(useStore.getState().isWildlifeVisible).toBe(false);
  });

  it('sets and clears active item', () => {
    const mockItem = { id: 1, name: 'Danum Valley' };

    useStore.getState().setActiveItem(mockItem);
    expect(useStore.getState().activeItem).toEqual(mockItem);

    useStore.getState().clearActiveItem();
    expect(useStore.getState().activeItem).toBe(null);
  });
});
