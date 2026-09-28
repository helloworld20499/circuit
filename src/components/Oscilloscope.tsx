import React, { useRef, useEffect, useState } from 'react';
import { 
  Activity, 
  X, 
  Maximize2, 
  Minimize2, 
  Eye,
  EyeOff
} from 'lucide-react';
import type { ScopeChannel } from '../types/circuit';

interface OscilloscopeProps {
  isOpen: boolean;
  onClose: () => void;
  isRunning: boolean;
}

export const Oscilloscope: React.FC<OscilloscopeProps> = ({
  isOpen,
  onClose,
  isRunning
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [timebase, setTimebase] = useState<number>(2.0); // ms/div
  const [displayMode, setDisplayMode] = useState<'time' | 'xy' | 'fft'>('time');

  const [channels, setChannels] = useState<ScopeChannel[]>([
    {
      id: 'ch1',
      name: 'CH1: V(out)',
      color: '#10b981', // Emerald
      vPerDiv: 1.0,
      offset: 0,
      enabled: true,
      history: [],
      vpp: 5.02,
      vrms: 3.55,
      frequency: 60.0
    },
    {
      id: 'ch2',
      name: 'CH2: I(RLC)',
      color: '#06b6d4', // Cyan
      vPerDiv: 0.5,
      offset: 0,
      enabled: true,
      history: [],
      vpp: 1.84,
      vrms: 1.30,
      frequency: 60.0
    }
  ]);

  // Real-time canvas animation loop
  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark graticule background
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid (10 horizontal divisions, 8 vertical divisions)
      const numCols = 10;
      const numRows = 8;
      const colWidth = width / numCols;
      const rowHeight = height / numRows;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let i = 0; i <= numCols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * colWidth, 0);
        ctx.lineTo(i * colWidth, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let j = 0; j <= numRows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * rowHeight);
        ctx.lineTo(width, j * rowHeight);
        ctx.stroke();
      }

      // Center crosshairs (Dotted)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Traces
      if (isRunning) {
        phase += 0.08 * (timebase / 2.0);
      }

      if (displayMode === 'time') {
        // Channel 1 Sine Trace
        if (channels[0].enabled) {
          ctx.strokeStyle = channels[0].color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let x = 0; x < width; x++) {
            const t = (x / width) * 4 * Math.PI + phase;
            const y = height / 2 - Math.sin(t) * (rowHeight * 1.8 / channels[0].vPerDiv);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Channel 2 Phase-Shifted Trace
        if (channels[1].enabled) {
          ctx.strokeStyle = channels[1].color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let x = 0; x < width; x++) {
            const t = (x / width) * 4 * Math.PI + phase + Math.PI / 3;
            const y = height / 2 - Math.sin(t) * (rowHeight * 1.1 / channels[1].vPerDiv);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (displayMode === 'xy') {
        // Lissajous Figure
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 300; i++) {
          const t = (i / 300) * 2 * Math.PI;
          const x = width / 2 + Math.sin(t + phase) * (width * 0.25);
          const y = height / 2 + Math.sin(2 * t) * (height * 0.35);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (displayMode === 'fft') {
        // Frequency Spectrum Bars
        ctx.fillStyle = channels[0].color;
        const barWidth = width / 32;
        for (let b = 0; b < 32; b++) {
          const barHeight = b === 8 ? height * 0.75 : (b === 16 ? height * 0.35 : Math.random() * (height * 0.08));
          ctx.fillRect(b * barWidth + 2, height - barHeight, barWidth - 4, barHeight);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, isRunning, timebase, displayMode, channels]);

  if (!isOpen) return null;

  return (
    <div className={`oscilloscope-dock ${isExpanded ? 'expanded' : ''}`} id="oscilloscope-dock">
      {/* Scope Header */}
      <div className="scope-header">
        <div className="scope-title-box">
          <Activity size={16} className="scope-icon" />
          <span className="scope-title">Multi-Channel Digital Storage Oscilloscope</span>
          <span className="scope-badge font-mono">DSO-2CH</span>
        </div>

        {/* Display Mode Tabs */}
        <div className="scope-tabs">
          <button 
            className={`scope-tab ${displayMode === 'time' ? 'active' : ''}`}
            onClick={() => setDisplayMode('time')}
          >
            Y-T Time Domain
          </button>
          <button 
            className={`scope-tab ${displayMode === 'xy' ? 'active' : ''}`}
            onClick={() => setDisplayMode('xy')}
          >
            X-Y Lissajous
          </button>
          <button 
            className={`scope-tab ${displayMode === 'fft' ? 'active' : ''}`}
            onClick={() => setDisplayMode('fft')}
          >
            FFT Spectrum
          </button>
        </div>

        {/* Window controls */}
        <div className="scope-header-actions">
          <button 
            id="btn-expand-scope"
            className="scope-action-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse Scope" : "Expand Scope"}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button 
            id="btn-close-scope"
            className="scope-action-btn"
            onClick={onClose}
            title="Close Oscilloscope Dock"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Scope Body */}
      <div className="scope-body">
        {/* Canvas Display */}
        <div className="scope-screen-container">
          <canvas 
            id="oscilloscope-canvas"
            ref={canvasRef} 
            width={720} 
            height={isExpanded ? 360 : 160} 
            className="scope-canvas"
          />
        </div>

        {/* Scope Controls & Measurements Column */}
        <div className="scope-control-panel">
          {/* Automated Digital Measurements */}
          <div className="scope-measurements-card">
            <span className="card-mini-title">Auto Measurements</span>
            <div className="meas-grid font-mono">
              <div className="meas-item">
                <span className="meas-label">CH1 Vpp</span>
                <span className="meas-val green">{channels[0].vpp.toFixed(2)} V</span>
              </div>
              <div className="meas-item">
                <span className="meas-label">CH1 Vrms</span>
                <span className="meas-val green">{channels[0].vrms.toFixed(2)} V</span>
              </div>
              <div className="meas-item">
                <span className="meas-label">Freq</span>
                <span className="meas-val font-mono">{channels[0].frequency.toFixed(1)} Hz</span>
              </div>
              <div className="meas-item">
                <span className="meas-label">Period (T)</span>
                <span className="meas-val font-mono">16.67 ms</span>
              </div>
            </div>
          </div>

          {/* Timebase Knob */}
          <div className="scope-knob-group">
            <div className="knob-label-row">
              <span className="knob-title">Time / Div</span>
              <span className="knob-val font-mono">{timebase.toFixed(1)} ms</span>
            </div>
            <input
              id="slider-scope-timebase"
              type="range"
              min="0.5"
              max="10.0"
              step="0.5"
              value={timebase}
              onChange={(e) => setTimebase(parseFloat(e.target.value))}
              className="scope-slider"
            />
          </div>

          {/* Channel Selectors */}
          <div className="channel-strips-row">
            {channels.map((ch, idx) => (
              <div key={ch.id} className="channel-strip">
                <div className="ch-header">
                  <span className="ch-dot" style={{ background: ch.color }} />
                  <span className="ch-name">{ch.name}</span>
                  <button 
                    className="ch-vis-btn"
                    onClick={() => {
                      const updated = [...channels];
                      updated[idx].enabled = !updated[idx].enabled;
                      setChannels(updated);
                    }}
                  >
                    {ch.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                </div>
                <div className="ch-scale-row font-mono">
                  <span>{ch.vPerDiv.toFixed(1)} V/div</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
