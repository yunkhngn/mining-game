import { describe, expect, it } from 'vitest';
import {
  carveCoal,
  createInitialCoalGameState,
  polishCoal,
  resetCoalGame
} from './coalGameLogic';

describe('coal game logic', () => {
  it('starts on the carving tab with polishing locked', () => {
    const state = createInitialCoalGameState();

    expect(state.activeTab).toBe('carving');
    expect(state.polishingUnlocked).toBe(false);
    expect(state.carvingProgress).toBe(0);
    expect(state.structuralStress).toBe(0);
    expect(state.shineProgress).toBe(0);
  });

  it('unlocks polishing and switches tabs after five strikes', () => {
    let state = createInitialCoalGameState();

    for (let index = 0; index < 5; index += 1) {
      state = carveCoal(state);
    }

    expect(state.activeTab).toBe('polishing');
    expect(state.polishingUnlocked).toBe(true);
    expect(state.carvingProgress).toBe(60);
    expect(state.structuralStress).toBe(35);
    expect(state.status).toBe('readyToPolish');
  });

  it('does not carve after polishing is unlocked', () => {
    let state = createInitialCoalGameState();

    for (let index = 0; index < 5; index += 1) {
      state = carveCoal(state);
    }

    expect(carveCoal(state)).toBe(state);
  });

  it('completes the product after eight polishing passes', () => {
    let state = createInitialCoalGameState();

    for (let index = 0; index < 5; index += 1) {
      state = carveCoal(state);
    }

    for (let index = 0; index < 8; index += 1) {
      state = polishCoal(state);
    }

    expect(state.status).toBe('complete');
    expect(state.activeTab).toBe('polishing');
    expect(state.shineProgress).toBe(100);
  });

  it('resets all progress', () => {
    let state = createInitialCoalGameState();

    state = carveCoal(state);
    state = carveCoal(state);

    expect(resetCoalGame()).toEqual(createInitialCoalGameState());
  });
});
