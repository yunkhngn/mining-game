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
