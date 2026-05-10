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
    log: ['Chọn than antraxit thô.']
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
      log: [...state.log, 'Sản phẩm thô đã thành hình. Chuyển sang đánh bóng.']
    };
  }

  return {
    ...state,
    carvingProgress,
    structuralStress,
    log: [...state.log, 'Đã loại bỏ một phần than thừa.']
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
      log: [...state.log, 'Bề mặt đã đạt độ bóng gương.']
    };
  }

  return {
    ...state,
    activeTab: 'polishing',
    shineProgress,
    log: [...state.log, 'Tiếp tục đánh bóng bề mặt.']
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
