# Coal Carving Mini Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one simple Vite React mini-game with two tabs: `Đập than` for repeatedly carving the coal block, and `Đánh bóng` for polishing the finished product.

**Architecture:** Keep the game as one focused experience instead of separate story sections. Game rules live in a pure TypeScript module, while `CoalGame.tsx` renders a two-tab interface, shared coal visual, progress meters, action buttons, locked polishing state, completion state, and restart.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, plain CSS.

---

## File Structure

- `package.json` - scripts and dependencies for Vite, React, TypeScript, Vitest.
- `index.html` - Vite entry.
- `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts` - TypeScript and Vite config.
- `src/main.tsx` - React mount point.
- `src/App.tsx` - renders only the mini-game.
- `src/game/coalGameLogic.ts` - pure state transitions.
- `src/game/coalGameLogic.test.ts` - unit tests for carving, unlocking polishing, polishing completion, restart.
- `src/components/CoalGame.tsx` - one mini-game component with 2 tabs.
- `src/components/CoalGame.test.tsx` - UI test for switching tabs and completing the flow.
- `src/test/setup.ts` - test-dom setup.
- `src/styles.css` - responsive two-tab game layout.

## Game Rules

- The whole mini-game is one screen.
- The UI has exactly two tabs:
  - `Đập than`
  - `Đánh bóng`
- Player starts on `Đập than`.
- `Đánh bóng` tab is visible from the start but disabled until carving progress reaches `60`.
- In `Đập than`, each `Đập` click increases carving progress by `12` and stress by `7`.
- At `60` carving progress, `Đánh bóng` unlocks and the game auto-switches to that tab.
- In `Đánh bóng`, each `Đánh bóng` click increases shine by `14`.
- At `100` shine, the product is complete and shows a mirror shine animation.
- `Làm lại` resets tab, carving, stress, shine, status, and log.

---

### Task 1: Scaffold Vite React App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Initialize Git repository if needed**

Run:

```bash
git status --short || git init
```

Expected:

```text
Current git status is printed, or a new empty Git repository is initialized.
```

- [ ] **Step 2: Create `package.json`**

Create `package.json` with:

```json
{
  "name": "coal-carving-mini-game",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 3: Create config files**

Create `tsconfig.json` with:

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.node.json" }],
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

Create `tsconfig.node.json` with:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

Create `vite.config.ts` with:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true
  }
});
```

- [ ] **Step 4: Create app entry**

Create `index.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Coal Carving Mini Game</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/main.tsx` with:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Create `src/App.tsx` with:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <section className="placeholder" aria-label="Coal mini game placeholder">
        Coal mini game
      </section>
    </main>
  );
}
```

Create `src/styles.css` with:

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #f6f0e8;
  background: #111;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #111;
}

.placeholder {
  color: #f6f0e8;
}
```

- [ ] **Step 5: Install dependencies**

Run:

```bash
npm install
```

Expected:

```text
Dependencies are installed and package-lock.json is created.
```

- [ ] **Step 6: Verify scaffold**

Run:

```bash
npm run build
```

Expected:

```text
Build completes without TypeScript errors.
```

- [ ] **Step 7: Commit scaffold**

Run:

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts src/main.tsx src/App.tsx src/styles.css
git commit -m "chore: scaffold coal mini game"
```

Expected:

```text
Initial Vite scaffold is committed.
```

---

### Task 2: Add Pure Game Logic

**Files:**
- Create: `src/test/setup.ts`
- Create: `src/game/coalGameLogic.ts`
- Create: `src/game/coalGameLogic.test.ts`

- [ ] **Step 1: Create failing tests**

Create `src/test/setup.ts` with:

```ts
import '@testing-library/jest-dom/vitest';
```

Create `src/game/coalGameLogic.test.ts` with:

```ts
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
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- src/game/coalGameLogic.test.ts
```

Expected:

```text
FAIL src/game/coalGameLogic.test.ts
Cannot find module './coalGameLogic'
```

- [ ] **Step 3: Implement game logic**

Create `src/game/coalGameLogic.ts` with:

```ts
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
```

- [ ] **Step 4: Run logic tests**

Run:

```bash
npm test -- src/game/coalGameLogic.test.ts
```

Expected:

```text
PASS src/game/coalGameLogic.test.ts
5 tests pass.
```

- [ ] **Step 5: Commit game logic**

Run:

```bash
git add src/test/setup.ts src/game/coalGameLogic.ts src/game/coalGameLogic.test.ts vite.config.ts
git commit -m "feat: add two-tab coal game logic"
```

Expected:

```text
Tested game logic is committed.
```

---

### Task 3: Build One Mini-Game Component With Two Tabs

**Files:**
- Create: `src/components/CoalGame.tsx`
- Modify: `src/App.tsx`
- Replace: `src/styles.css`

- [ ] **Step 1: Create `CoalGame.tsx`**

Create `src/components/CoalGame.tsx` with:

```tsx
import { useMemo, useState } from 'react';
import {
  carveCoal,
  createInitialCoalGameState,
  polishCoal,
  resetCoalGame,
  setCoalGameTab,
  type CoalGameTab
} from '../game/coalGameLogic';

const tabLabels: Record<CoalGameTab, string> = {
  carving: 'Đập than',
  polishing: 'Đánh bóng'
};

export function CoalGame() {
  const [state, setState] = useState(createInitialCoalGameState);

  const statusText = useMemo(() => {
    if (state.status === 'complete') {
      return 'Sản phẩm đã hoàn thiện với bề mặt bóng gương.';
    }

    if (state.status === 'readyToPolish') {
      return 'Phôi than đã thành hình. Tiếp tục đánh bóng để hoàn thiện.';
    }

    return 'Đập nhiều lần để loại bỏ than thừa và tạo hình sản phẩm.';
  }, [state.status]);

  const selectTab = (tab: CoalGameTab) => {
    setState((currentState) => setCoalGameTab(currentState, tab));
  };

  const handleCarve = () => {
    setState((currentState) => carveCoal(currentState));
  };

  const handlePolish = () => {
    setState((currentState) => polishCoal(currentState));
  };

  const handleReset = () => {
    setState(resetCoalGame());
  };

  return (
    <section className="coal-game" aria-labelledby="coal-game-title">
      <header className="game-header">
        <p className="eyebrow">Mini game</p>
        <h1 id="coal-game-title">Đập than và đánh bóng</h1>
        <p>{statusText}</p>
      </header>

      <div className={`workbench workbench--${state.status}`}>
        <div className="coal-scene" aria-hidden="true">
          <div className="coal-shadow" />
          <div className="coal-piece">
            <span className="coal-chip coal-chip--one" />
            <span className="coal-chip coal-chip--two" />
            <span className="coal-chip coal-chip--three" />
            <span className="shine-sweep" />
          </div>
        </div>

        <div className="control-panel">
          <div className="tab-list" role="tablist" aria-label="Coal game actions">
            <button
              aria-controls="carving-panel"
              aria-selected={state.activeTab === 'carving'}
              className="tab-button"
              id="carving-tab"
              role="tab"
              type="button"
              onClick={() => selectTab('carving')}
            >
              {tabLabels.carving}
            </button>
            <button
              aria-controls="polishing-panel"
              aria-disabled={!state.polishingUnlocked}
              aria-selected={state.activeTab === 'polishing'}
              className="tab-button"
              disabled={!state.polishingUnlocked}
              id="polishing-tab"
              role="tab"
              type="button"
              onClick={() => selectTab('polishing')}
            >
              {tabLabels.polishing}
            </button>
          </div>

          <div
            aria-labelledby="carving-tab"
            className="tab-panel"
            hidden={state.activeTab !== 'carving'}
            id="carving-panel"
            role="tabpanel"
          >
            <Meter label="Tạo hình" value={state.carvingProgress} />
            <Meter label="Áp lực vật liệu" value={state.structuralStress} tone={state.structuralStress >= 35 ? 'warning' : 'default'} />
            <button className="game-action" type="button" onClick={handleCarve} disabled={state.status !== 'carving'}>
              Đập
            </button>
          </div>

          <div
            aria-labelledby="polishing-tab"
            className="tab-panel"
            hidden={state.activeTab !== 'polishing'}
            id="polishing-panel"
            role="tabpanel"
          >
            <Meter label="Độ bóng" value={state.shineProgress} tone="shine" />
            <button className="game-action" type="button" onClick={handlePolish} disabled={!state.polishingUnlocked || state.status === 'complete'}>
              Đánh bóng
            </button>
          </div>

          <button className="reset-action" type="button" onClick={handleReset}>
            Làm lại
          </button>

          <ol className="game-log" aria-label="Game log">
            {state.log.slice(-4).map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

type MeterProps = {
  label: string;
  value: number;
  tone?: 'default' | 'warning' | 'shine';
};

function Meter({ label, value, tone = 'default' }: MeterProps) {
  return (
    <label className={`meter meter--${tone}`}>
      <span>
        {label}
        <strong>{value}%</strong>
      </span>
      <progress value={value} max={100}>
        {value}%
      </progress>
    </label>
  );
}
```

- [ ] **Step 2: Render the game**

Replace `src/App.tsx` with:

```tsx
import { CoalGame } from './components/CoalGame';

export default function App() {
  return (
    <main className="app-shell">
      <CoalGame />
    </main>
  );
}
```

- [ ] **Step 3: Replace CSS**

Replace `src/styles.css` with:

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #f6f0e8;
  background: #111;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  --surface: #1c1c1c;
  --panel: #25211d;
  --text-muted: #c8bdad;
  --amber: #d7a64f;
  --steel: #7f9aa3;
  --danger: #d76657;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background:
    radial-gradient(circle at 20% 10%, rgba(215, 166, 79, 0.16), transparent 28rem),
    linear-gradient(135deg, #0d0d0d, #1c1915);
}

button {
  font: inherit;
}

.app-shell {
  width: min(980px, calc(100% - 32px));
  min-height: 100vh;
  margin: 0 auto;
  padding: 48px 0;
  display: grid;
  align-content: center;
}

.coal-game {
  display: grid;
  gap: 24px;
}

.game-header {
  display: grid;
  gap: 12px;
}

.eyebrow {
  margin: 0;
  color: var(--amber);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.game-header h1 {
  margin: 0;
  font-size: clamp(2.4rem, 7vw, 5.4rem);
  line-height: 0.95;
  letter-spacing: 0;
}

.game-header p:last-child {
  max-width: 680px;
  margin: 0;
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.65;
}

.workbench {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(280px, 390px);
  gap: 24px;
  padding: 28px;
  border: 1px solid rgba(215, 166, 79, 0.34);
  background:
    linear-gradient(135deg, rgba(215, 166, 79, 0.12), transparent 36%),
    rgba(20, 20, 20, 0.78);
}

.coal-scene {
  min-height: 360px;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(120deg, rgba(127, 154, 163, 0.18), transparent),
    #0f0f0f;
  border: 1px solid rgba(246, 240, 232, 0.12);
}

.coal-shadow {
  position: absolute;
  width: 220px;
  height: 34px;
  bottom: 58px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  filter: blur(10px);
}

.coal-piece {
  position: relative;
  width: 220px;
  height: 250px;
  clip-path: polygon(20% 8%, 73% 0, 92% 28%, 84% 78%, 49% 100%, 12% 74%, 0 32%);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent 22%),
    linear-gradient(230deg, #050505 0%, #222 42%, #090909 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset -28px -32px 44px rgba(0, 0, 0, 0.65);
  transition: clip-path 220ms ease, border-radius 220ms ease, transform 220ms ease;
}

.workbench--readyToPolish .coal-piece,
.workbench--complete .coal-piece {
  clip-path: polygon(44% 0, 68% 12%, 76% 38%, 90% 62%, 70% 100%, 30% 100%, 10% 62%, 24% 38%, 32% 12%);
  border-radius: 42% 42% 18% 18%;
}

.coal-chip {
  position: absolute;
  width: 34px;
  height: 28px;
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.coal-chip--one {
  top: 48px;
  left: 28px;
  transform: rotate(18deg);
}

.coal-chip--two {
  right: 24px;
  top: 92px;
  transform: rotate(-20deg);
}

.coal-chip--three {
  left: 76px;
  bottom: 34px;
  transform: rotate(8deg);
}

.workbench--readyToPolish .coal-chip,
.workbench--complete .coal-chip {
  display: none;
}

.shine-sweep {
  position: absolute;
  inset: 0;
  transform: translateX(-120%);
  background: linear-gradient(100deg, transparent 20%, rgba(255, 255, 255, 0.44), transparent 48%);
}

.workbench--complete .shine-sweep {
  animation: shine-sweep 1.8s ease-in-out infinite;
}

.control-panel {
  display: grid;
  gap: 16px;
  align-content: start;
  padding: 24px;
  background: rgba(246, 240, 232, 0.06);
  border: 1px solid rgba(246, 240, 232, 0.12);
}

.tab-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.tab-button {
  min-height: 44px;
  border: 1px solid rgba(246, 240, 232, 0.16);
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
}

.tab-button[aria-selected="true"] {
  color: #111;
  background: var(--amber);
  border-color: var(--amber);
  font-weight: 800;
}

.tab-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.tab-panel {
  display: grid;
  gap: 16px;
}

.tab-panel[hidden] {
  display: none;
}

.meter {
  display: grid;
  gap: 8px;
}

.meter span {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.meter strong {
  color: #fff;
}

.meter progress {
  width: 100%;
  height: 12px;
  overflow: hidden;
  border: 0;
  background: rgba(255, 255, 255, 0.1);
}

.meter progress::-webkit-progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.meter progress::-webkit-progress-value {
  background: var(--steel);
}

.meter--warning progress::-webkit-progress-value {
  background: var(--danger);
}

.meter--shine progress::-webkit-progress-value {
  background: var(--amber);
}

.game-action,
.reset-action {
  min-height: 48px;
  border: 0;
  font-weight: 800;
  cursor: pointer;
}

.game-action {
  color: #121212;
  background: var(--amber);
}

.game-action:hover {
  background: #e8bd68;
}

.game-action:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.reset-action {
  color: #f6f0e8;
  background: transparent;
  border: 1px solid rgba(246, 240, 232, 0.18);
}

.game-log {
  display: grid;
  gap: 8px;
  margin: 4px 0 0;
  padding-left: 18px;
  color: var(--text-muted);
  line-height: 1.45;
}

@keyframes shine-sweep {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(120%);
  }
}

@media (max-width: 760px) {
  .app-shell {
    width: min(100% - 24px, 980px);
    padding: 24px 0;
  }

  .workbench {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .coal-scene {
    min-height: 300px;
  }
}
```

- [ ] **Step 4: Run tests and build**

Run:

```bash
npm test && npm run build
```

Expected:

```text
Logic tests pass and app builds successfully.
```

- [ ] **Step 5: Commit UI**

Run:

```bash
git add src/components/CoalGame.tsx src/App.tsx src/styles.css
git commit -m "feat: build two-tab coal mini game"
```

Expected:

```text
Two-tab mini-game UI is committed.
```

---

### Task 4: Add UI Interaction Test

**Files:**
- Create: `src/components/CoalGame.test.tsx`

- [ ] **Step 1: Create interaction test**

Create `src/components/CoalGame.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CoalGame } from './CoalGame';

describe('CoalGame', () => {
  it('keeps everything in one game and unlocks the polishing tab after carving', async () => {
    const user = userEvent.setup();

    render(<CoalGame />);

    expect(screen.getByRole('tab', { name: 'Đập than' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).toBeDisabled();

    const carveButton = screen.getByRole('button', { name: 'Đập' });

    for (let index = 0; index < 5; index += 1) {
      await user.click(carveButton);
    }

    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).not.toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).toHaveAttribute('aria-selected', 'true');

    const polishButton = screen.getByRole('button', { name: 'Đánh bóng' });

    for (let index = 0; index < 8; index += 1) {
      await user.click(polishButton);
    }

    expect(screen.getByText('Sản phẩm đã hoàn thiện với bề mặt bóng gương.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Làm lại' }));

    expect(screen.getByRole('tab', { name: 'Đập than' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run component test**

Run:

```bash
npm test -- src/components/CoalGame.test.tsx
```

Expected:

```text
PASS src/components/CoalGame.test.tsx
1 test passes.
```

- [ ] **Step 3: Run full verification**

Run:

```bash
npm test && npm run build
```

Expected:

```text
All tests pass and production build succeeds.
```

- [ ] **Step 4: Commit test**

Run:

```bash
git add src/components/CoalGame.test.tsx
git commit -m "test: cover two-tab coal mini game"
```

Expected:

```text
UI interaction test is committed.
```

---

### Task 5: Local QA

**Files:**
- Modify only files with confirmed QA issues.

- [ ] **Step 1: Start dev server**

Run:

```bash
npm run dev -- --host 0.0.0.0
```

Expected:

```text
Vite prints a local URL such as http://localhost:5173/
```

- [ ] **Step 2: Manual QA checklist**

Open the local URL and verify:

```text
Only one mini-game is visible.
There are exactly two tabs: "Đập than" and "Đánh bóng".
"Đập than" is selected on load.
"Đánh bóng" is visible but disabled on load.
Clicking "Đập" five times unlocks and auto-selects "Đánh bóng".
Clicking "Đánh bóng" eight times completes the product.
The finished state shows shine animation on the coal product.
Clicking "Làm lại" resets the game and locks "Đánh bóng" again.
At mobile width around 390px, the coal visual and control panel stack cleanly without text overflow.
```

- [ ] **Step 3: Commit QA fixes if needed**

If QA changed files, run:

```bash
git status --short
git add src
git commit -m "fix: polish two-tab coal mini game"
```

Expected:

```text
QA fixes are committed. If no files changed, no commit is needed.
```

---

## Self-Review

- Spec coverage:
  - One combined mini-game: covered by `CoalGame.tsx`.
  - Two tabs: covered by `Đập than` and `Đánh bóng` tab buttons.
  - Repeated coal striking: covered by `Đập` action and carving progress.
  - Polishing product: covered by `Đánh bóng` action and shine progress.
  - Vite runtime: covered by scaffold and verification tasks.
- Placeholder scan: no deferred implementation markers, and every code-producing step contains complete file content.
- Type consistency: `CoalGameTab`, `CoalGameStatus`, `carveCoal`, `polishCoal`, `setCoalGameTab`, and `resetCoalGame` are used consistently across logic, UI, and tests.
