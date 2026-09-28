import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Trash2, 
  BookOpen, 
  Activity, 
  Share2, 
  Search, 
  Palette, 
  Maximize2,
  Sparkles,
  Zap
} from 'lucide-react';
import type { ThemeMode } from '../types/circuit';

interface HeaderProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onClear: () => void;
  simSpeed: number;
  onSpeedChange: (speed: number) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenExamples: () => void;
  onOpenCommandPalette: () => void;
  onOpenShare: () => void;
  isScopeOpen: boolean;
  onToggleScope: () => void;
  exampleCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onTitleChange,
  isRunning,
  onToggleRunning,
  onStepForward,
  onReset,
  onClear,
  simSpeed,
  onSpeedChange,
  theme,
  onThemeChange,
  onOpenExamples,
  onOpenCommandPalette,
  onOpenShare,
  isScopeOpen,
  onToggleScope,
  exampleCount
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempTitle.trim()) {
      onTitleChange(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const themes: { id: ThemeMode; label: string; icon: string; desc: string }[] = [
    { id: 'obsidian', label: 'Obsidian Dark', icon: '🌑', desc: 'Charcoal & Emerald' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', icon: '⚡', desc: 'OLED Neon Pink & Cyan' },
    { id: 'blueprint', label: 'Engineering Blueprint', icon: '📐', desc: 'Technical Grid Blue' },
    { id: 'studio', label: 'Studio Clean Light', icon: '☀️', desc: 'Paper Minimalist' },
  ];

  return (
    <header className="app-header" id="app-header">
      {/* Left: Branding & Circuit Title */}
      <div className="header-left">
        <div className="brand-logo" title="CircuitPulse - Modernized Falstad Simulator">
          <div className={`logo-icon-wrap ${isRunning ? 'pulse' : ''}`}>
            <Zap className="logo-icon" size={18} />
          </div>
          <span className="brand-text">
            Circuit<span className="brand-accent">Pulse</span>
          </span>
          <span className="edge-badge" title="Edge-Accelerated on Cloudflare">
            <Sparkles size={11} /> Cloudflare Edge
          </span>
        </div>

        <div className="circuit-title-container">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="title-form">
              <input
                id="circuit-title-input"
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                autoFocus
                className="title-input"
              />
            </form>
          ) : (
            <div 
              className="title-display" 
              onClick={() => { setTempTitle(title); setIsEditingTitle(true); }}
              title="Click to rename circuit"
            >
              <span className="title-text">{title}</span>
              <span className="edit-hint">rename</span>
            </div>
          )}
        </div>
      </div>

      {/* Center: Primary Simulation Controls Pill */}
      <div className="header-center">
        <div className="sim-control-pill" id="sim-control-pill">
          {/* Run/Pause Button */}
          <button 
            id="btn-run-pause"
            className={`control-btn play-btn ${isRunning ? 'running' : 'paused'}`}
            onClick={onToggleRunning}
            title={isRunning ? "Pause Simulation (Space)" : "Run Simulation (Space)"}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            <span className="btn-label">{isRunning ? "RUNNING" : "PAUSED"}</span>
          </button>

          {/* Single Step Forward */}
          <button 
            id="btn-step-forward"
            className="control-btn icon-only" 
            onClick={onStepForward}
            title="Step Forward (Single Timestep)"
          >
            <FastForward size={15} />
          </button>

          {/* Speed Multiplier Slider */}
          <div className="speed-control-group" title="Simulation Speed Multiplier">
            <span className="speed-label font-mono">{simSpeed.toFixed(1)}x</span>
            <input 
              id="slider-sim-speed"
              type="range" 
              min="0.1" 
              max="3.0" 
              step="0.1"
              value={simSpeed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="speed-slider"
            />
          </div>

          <div className="pill-divider" />

          {/* Reset */}
          <button 
            id="btn-reset-sim"
            className="control-btn icon-only" 
            onClick={onReset}
            title="Reset Simulation State"
          >
            <RotateCcw size={15} />
          </button>

          {/* Clear */}
          <button 
            id="btn-clear-canvas"
            className="control-btn icon-only danger" 
            onClick={onClear}
            title="Clear Schematic Canvas"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Right: Tools, Drawers, Themes, & Cloudflare Share */}
      <div className="header-right">
        {/* Command Palette Trigger */}
        <button 
          id="btn-command-palette"
          className="header-action-btn search-trigger"
          onClick={onOpenCommandPalette}
          title="Search Components & Circuits (Cmd + K)"
        >
          <Search size={14} />
          <span className="kbd-shortcut font-mono">⌘K</span>
        </button>

        {/* Examples Library */}
        <button 
          id="btn-examples-library"
          className="header-action-btn"
          onClick={onOpenExamples}
          title="Browse 25+ Interactive Circuit Examples"
        >
          <BookOpen size={15} />
          <span>Presets</span>
          <span className="count-badge">{exampleCount}</span>
        </button>

        {/* Oscilloscope Toggle */}
        <button 
          id="btn-toggle-oscilloscope"
          className={`header-action-btn ${isScopeOpen ? 'active' : ''}`}
          onClick={onToggleScope}
          title="Toggle Multi-Channel Oscilloscope Dock"
        >
          <Activity size={15} />
          <span>Scope</span>
        </button>

        {/* Theme Dropdown */}
        <div className="theme-dropdown-wrap">
          <button 
            id="btn-theme-selector"
            className="header-action-btn icon-only"
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            title="Switch Aesthetic Theme"
          >
            <Palette size={15} />
          </button>

          {themeDropdownOpen && (
            <div className="theme-popover" onMouseLeave={() => setThemeDropdownOpen(false)}>
              <div className="popover-header">Aesthetic Theme</div>
              {themes.map((t) => (
                <button
                  key={t.id}
                  className={`theme-option ${theme === t.id ? 'active' : ''}`}
                  onClick={() => {
                    onThemeChange(t.id);
                    setThemeDropdownOpen(false);
                  }}
                >
                  <span className="theme-icon">{t.icon}</span>
                  <div className="theme-text">
                    <span className="theme-name">{t.label}</span>
                    <span className="theme-desc">{t.desc}</span>
                  </div>
                  {theme === t.id && <div className="theme-indicator" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cloudflare Share */}
        <button 
          id="btn-open-share"
          className="header-action-btn share-btn"
          onClick={onOpenShare}
          title="Share via Cloudflare & Export Files"
        >
          <Share2 size={15} />
          <span>Share</span>
        </button>

        {/* Fullscreen */}
        <button 
          id="btn-toggle-fullscreen"
          className="header-action-btn icon-only" 
          onClick={handleFullscreen}
          title="Toggle Fullscreen"
        >
          <Maximize2 size={15} />
        </button>
      </div>
    </header>
  );
};
