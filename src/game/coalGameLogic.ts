export type CoalGameTab = 'carving' | 'polishing';
export type CoalGameStatus = 'carving' | 'readyToPolish' | 'complete';

export type CoalGameState = {
  activeTab: CoalGameTab;
  status: CoalGameStatus;
  carvingProgress: number;
  structuralStress: number;
  shineProgress: number;
  polishingUnlocked: boolean;
  log: string[];
};

const CARVE_INCREMENT = 12;
const STRESS_INCREMENT = 7;
const POLISH_INCREMENT = 14;
const CARVING_DONE = 60;
const MAX_PERCENT = 100;

export function createInitialCoalGameState(): CoalGameState {
  return {
    activeTab: 'carving',
    status: 'carving',
    carvingProgress: 0,
    structuralStress: 0,
    shineProgress: 0,
    polishingUnlocked: false,
    log: ['Selected raw anthracite coal.']
  };
}

export function carveCoal(state: CoalGameState): CoalGameState {
  if (state.status !== 'carving') {
    return state;
  }

  const carvingProgress = clampPercent(state.carvingProgress + CARVE_INCREMENT);
  const structuralStress = clampPercent(state.structuralStress + STRESS_INCREMENT);

  if (carvingProgress >= CARVING_DONE) {
    return {
      ...state,
      activeTab: 'polishing',
      status: 'readyToPolish',
      carvingProgress: CARVING_DONE,
      structuralStress,
      polishingUnlocked: true,
      log: [...state.log, 'Raw piece has taken shape. Switching to polishing.']
    };
  }

  return {
    ...state,
    carvingProgress,
    structuralStress,
    log: [...state.log, 'Removed some excess coal.']
  };
}

export function polishCoal(state: CoalGameState): CoalGameState {
  if (!state.polishingUnlocked || state.status === 'complete') {
    return state;
  }

  const shineProgress = clampPercent(state.shineProgress + POLISH_INCREMENT);

  if (shineProgress >= MAX_PERCENT) {
    return {
      ...state,
      activeTab: 'polishing',
      status: 'complete',
      shineProgress: MAX_PERCENT,
      log: [...state.log, 'Surface has reached a mirror finish.']
    };
  }

  return {
    ...state,
    activeTab: 'polishing',
    shineProgress,
    log: [...state.log, 'Continuing to polish the surface.']
  };
}

export function setCoalGameTab(state: CoalGameState, tab: CoalGameTab): CoalGameState {
  if (tab === 'polishing' && !state.polishingUnlocked) {
    return state;
  }

  return {
    ...state,
    activeTab: tab
  };
}

export function resetCoalGame(): CoalGameState {
  return createInitialCoalGameState();
}

function clampPercent(value: number): number {
  return Math.min(MAX_PERCENT, Math.max(0, value));
}
