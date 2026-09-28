import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCw, 
  Copy, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Cpu, 
  ShieldCheck
} from 'lucide-react';
import type { InspectorData } from '../types/circuit';

interface InspectorProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedData: InspectorData | null;
  onUpdateValue?: (newValue: number, unit: string) => void;
  onDeleteElement?: () => void;
}

export const Inspector: React.FC<InspectorProps> = ({
  isOpen,
  onToggle,
  selectedData,
  onUpdateValue: _onUpdateValue,
  onDeleteElement: _onDeleteElement
}) => {
  const [val, setVal] = useState<number>(selectedData?.value || 1000);
  const [activePrefix, setActivePrefix] = useState<string>('k');

  const prefixes = [
    { label: 'p', multiplier: 1e-12 },
    { label: 'n', multiplier: 1e-9 },
    { label: 'µ', multiplier: 1e-6 },
    { label: 'm', multiplier: 1e-3 },
    { label: '1', multiplier: 1 },
    { label: 'k', multiplier: 1e3 },
    { label: 'M', multiplier: 1e6 }
  ];

  return (
    <aside className={`inspector-sidebar ${isOpen ? 'open' : 'collapsed'}`} id="inspector-sidebar">
      {/* Toggle button */}
      <button 
        id="btn-toggle-inspector"
        className="inspector-toggle-tab"
        onClick={onToggle}
        title={isOpen ? "Collapse Inspector" : "Expand Inspector"}
      >
        {isOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {isOpen && (
        <div className="inspector-inner">
          <div className="inspector-header">
            <div className="header-title-box">
              <Sliders size={16} className="inspector-icon" />
              <span className="inspector-title">
                {selectedData ? 'Component Inspector' : 'Circuit Telemetry'}
              </span>
            </div>
            {selectedData && (
              <span className="element-badge font-mono">{selectedData.type}</span>
            )}
          </div>

          {selectedData ? (
            <div className="inspector-content">
              {/* Component Info Card */}
              <div className="card-box component-identity">
                <div className="identity-header">
                  <span className="element-name">{selectedData.name}</span>
                  <span className="element-status font-mono">ACTIVE</span>
                </div>
                <div className="identity-sub">
                  Connected between nodes {selectedData.nodes?.join(' ↔ ') || 'Node 1 ↔ Node 2'}
                </div>
              </div>

              {/* Value Tuning & Presets */}
              <div className="card-box value-editor">
                <label className="section-label">Parametric Value</label>
                <div className="value-input-row">
                  <input
                    id="inspector-value-input"
                    type="number"
                    value={val}
                    onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
                    className="val-number-input font-mono"
                  />
                  <span className="unit-indicator font-mono">
                    {activePrefix}{selectedData.unit}
                  </span>
                </div>

                {/* Prefix Selector Pills */}
                <div className="prefix-pills-row">
                  {prefixes.map((p) => (
                    <button
                      key={p.label}
                      className={`prefix-pill font-mono ${activePrefix === p.label ? 'active' : ''}`}
                      onClick={() => setActivePrefix(p.label)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Fine Tuning Slider */}
                <div className="slider-row">
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    value={val}
                    onChange={(e) => setVal(parseFloat(e.target.value))}
                    className="val-slider"
                  />
                </div>
              </div>

              {/* Real-Time Electrical Telemetry */}
              <div className="card-box telemetry-box">
                <label className="section-label">Real-Time Measurements</label>
                <div className="telemetry-grid">
                  <div className="telem-item">
                    <span className="telem-label">Voltage (ΔV)</span>
                    <span className="telem-value green font-mono">
                      {selectedData.voltageDrop.toFixed(3)} V
                    </span>
                  </div>
                  <div className="telem-item">
                    <span className="telem-label">Current (I)</span>
                    <span className="telem-value amber font-mono">
                      {(selectedData.current * 1000).toFixed(2)} mA
                    </span>
                  </div>
                  <div className="telem-item">
                    <span className="telem-label">Power (P)</span>
                    <span className="telem-value cyan font-mono">
                      {(selectedData.power * 1000).toFixed(2)} mW
                    </span>
                  </div>
                  <div className="telem-item">
                    <span className="telem-label">Frequency</span>
                    <span className="telem-value purple font-mono">
                      {selectedData.frequency ? `${selectedData.frequency} Hz` : 'DC'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="card-box actions-box">
                <button className="action-button-tile" title="Rotate Component 90°">
                  <RotateCw size={14} />
                  <span>Rotate</span>
                </button>
                <button className="action-button-tile" title="Duplicate Component">
                  <Copy size={14} />
                  <span>Duplicate</span>
                </button>
                <button className="action-button-tile danger" title="Delete Component">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ) : (
            /* Global Circuit Solver Analytics when nothing is selected */
            <div className="inspector-content">
              <div className="card-box solver-info">
                <div className="solver-badge">
                  <Cpu size={14} className="badge-icon" />
                  <span>Matrix Engine Active</span>
                </div>
                <div className="solver-detail-text">
                  Solving dynamic Modified Nodal Analysis (MNA) matrix in real time with LU decomposition.
                </div>
              </div>

              <div className="card-box telemetry-box">
                <label className="section-label">Simulation State</label>
                <div className="telemetry-grid">
                  <div className="telem-item">
                    <span className="telem-label">Timestep (Δt)</span>
                    <span className="telem-value font-mono">5.00 µs</span>
                  </div>
                  <div className="telem-item">
                    <span className="telem-label">Matrix Size</span>
                    <span className="telem-value font-mono">18 × 18</span>
                  </div>
                  <div className="telem-item">
                    <span className="telem-label">Iteration Step</span>
                    <span className="telem-value green font-mono">Newton-Raphson</span>
                  </div>
                  <div className="telem-item">
                    <span className="telem-label">Convergence</span>
                    <span className="telem-value green font-mono">Stable</span>
                  </div>
                </div>
              </div>

              <div className="card-box hints-box">
                <label className="section-label">Keyboard Shortcuts</label>
                <ul className="shortcuts-list font-mono">
                  <li><span>W</span> <span className="k-desc">Add Wire</span></li>
                  <li><span>R</span> <span className="k-desc">Add Resistor</span></li>
                  <li><span>C</span> <span className="k-desc">Add Capacitor</span></li>
                  <li><span>L</span> <span className="k-desc">Add Inductor</span></li>
                  <li><span>G</span> <span className="k-desc">Add Ground</span></li>
                  <li><span>V</span> <span className="k-desc">Voltage Source</span></li>
                  <li><span>D</span> <span className="k-desc">Add Diode</span></li>
                  <li><span>Space</span> <span className="k-desc">Run / Pause</span></li>
                </ul>
              </div>

              <div className="card-box cloudflare-edge-card">
                <div className="edge-title-row">
                  <ShieldCheck size={14} className="edge-icon" />
                  <span>Cloudflare Edge Deployment</span>
                </div>
                <p className="edge-text">
                  Static assets cached at 300+ global edge cities. Shareable links resolved with zero egress fees.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
