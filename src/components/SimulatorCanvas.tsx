import React, { useRef, useState, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  MousePointer, 
  Move, 
  Radio, 
  Sparkles,
  Info
} from 'lucide-react';
import type { ThemeMode } from '../types/circuit';
import { CircuitEngineService } from '../services/circuitEngine';

interface SimulatorCanvasProps {
  currentNetlist: string;
  theme: ThemeMode;
  isRunning: boolean;
  onProbeElement?: (info: { name: string; v: number; i: number; p: number }) => void;
  selectedComponent: string | null;
}

export const SimulatorCanvas: React.FC<SimulatorCanvasProps> = ({
  currentNetlist,
  theme,
  isRunning,
  onProbeElement: _onProbeElement,
  selectedComponent
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'pan' | 'probe'>('select');
  const [showGlowOverlay, setShowGlowOverlay] = useState(true);
  const [hudStats, setHudStats] = useState({ fps: 60, timestep: '5.0 µs', nodes: 14 });
  const [probeTooltip, setProbeTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    voltage: number;
    current: number;
    name: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    voltage: 3.28,
    current: 12.4,
    name: 'Node V(out)'
  });

  // Build simulator URL
  const iframeUrl = CircuitEngineService.buildSimulatorUrl({
    netlist: currentNetlist,
    theme: theme,
    simRunning: isRunning
  });

  // Handle subtle periodic telemetry simulation for HUD
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        setHudStats(prev => ({
          ...prev,
          fps: Math.floor(59 + Math.random() * 2),
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="simulator-canvas-viewport" id="simulator-canvas-viewport">
      {/* Simulation Iframe */}
      <iframe
        id="circuitjs-iframe"
        ref={iframeRef}
        src={iframeUrl}
        className="simulator-iframe"
        title="Electronic Circuit Simulator Core"
        allow="fullscreen"
      />

      {/* Modern Floating Top Canvas HUD */}
      <div className="canvas-hud top-hud">
        {/* Interaction Mode Selector */}
        <div className="hud-pill mode-selector">
          <button 
            id="tool-select"
            className={`hud-btn ${activeTool === 'select' ? 'active' : ''}`}
            onClick={() => setActiveTool('select')}
            title="Selection & Edit Mode (Pointer)"
          >
            <MousePointer size={14} />
            <span>Select</span>
          </button>
          <button 
            id="tool-pan"
            className={`hud-btn ${activeTool === 'pan' ? 'active' : ''}`}
            onClick={() => setActiveTool('pan')}
            title="Pan Viewport Mode"
          >
            <Move size={14} />
            <span>Pan</span>
          </button>
          <button 
            id="tool-probe"
            className={`hud-btn ${activeTool === 'probe' ? 'active' : ''}`}
            onClick={() => {
              setActiveTool('probe');
              setProbeTooltip(p => ({ ...p, visible: !p.visible, x: 380, y: 220 }));
            }}
            title="Interactive Live Probe"
          >
            <Radio size={14} />
            <span>Probe</span>
          </button>
        </div>

        {/* Selected Component Quick Indicator */}
        {selectedComponent && (
          <div className="hud-pill selected-indicator animate-fade-in">
            <span className="indicator-dot" />
            <span>Placing: <strong>{selectedComponent.toUpperCase()}</strong></span>
            <span className="hint font-mono">(Click canvas)</span>
          </div>
        )}

        {/* Telemetry Badge */}
        <div className="hud-pill telemetry-badge font-mono">
          <span className="status-dot green" />
          <span className="metric">{hudStats.fps} FPS</span>
          <span className="divider">·</span>
          <span className="metric">Δt {hudStats.timestep}</span>
          <span className="divider">·</span>
          <span className="metric">{hudStats.nodes} Nodes</span>
        </div>
      </div>

      {/* Floating Bottom Canvas Controls (Zoom & Effects) */}
      <div className="canvas-hud bottom-hud">
        <div className="hud-pill zoom-controls">
          <button 
            id="btn-zoom-in"
            className="hud-btn icon-only" 
            title="Zoom In (+)"
            onClick={() => {
              // Trigger reload or postMessage if supported
            }}
          >
            <ZoomIn size={14} />
          </button>
          <button 
            id="btn-zoom-out"
            className="hud-btn icon-only" 
            title="Zoom Out (-)"
          >
            <ZoomOut size={14} />
          </button>
          <button 
            id="btn-zoom-reset"
            className="hud-btn icon-only" 
            title="Reset Zoom & Center View"
          >
            <RefreshCw size={13} />
          </button>
          <div className="pill-divider" />
          <button
            id="btn-toggle-glow"
            className={`hud-btn ${showGlowOverlay ? 'active' : ''}`}
            onClick={() => setShowGlowOverlay(!showGlowOverlay)}
            title="Toggle Particle Glow & Aesthetics"
          >
            <Sparkles size={13} />
            <span>Aesthetic Glow</span>
          </button>
        </div>

        {/* Shortcuts reminder */}
        <div className="hud-pill helper-pill">
          <Info size={13} />
          <span>Right-click or Ctrl-click any wire/component to Edit parameters</span>
        </div>
      </div>

      {/* Dynamic Electron Glow Overlay (Enhancement) */}
      {showGlowOverlay && (
        <div className="electron-glow-ambient-layer" pointer-events="none" />
      )}

      {/* Live Probe Floating Badge (When Probe Tool is active) */}
      {probeTooltip.visible && (
        <div 
          className="probe-floating-badge font-mono"
          style={{ left: `${probeTooltip.x}px`, top: `${probeTooltip.y}px` }}
        >
          <div className="probe-badge-header">
            <Radio size={12} className="probe-icon" />
            <span>{probeTooltip.name}</span>
          </div>
          <div className="probe-metrics-grid">
            <div className="metric-row">
              <span className="metric-label">Potential:</span>
              <span className="metric-val green">+{probeTooltip.voltage.toFixed(2)} V</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Current:</span>
              <span className="metric-val amber">{probeTooltip.current.toFixed(1)} mA</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Power:</span>
              <span className="metric-val cyan">{(probeTooltip.voltage * probeTooltip.current).toFixed(1)} mW</span>
            </div>
          </div>
          <div className="probe-tail" />
        </div>
      )}
    </div>
  );
};
