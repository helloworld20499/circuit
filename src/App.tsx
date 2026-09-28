import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

import type { ThemeMode, CircuitPreset, InspectorData } from './types/circuit';
import { CIRCUIT_PRESETS } from './data/presets';
import { CircuitEngineService } from './services/circuitEngine';

import { Header } from './components/Header';
import { ComponentDrawer } from './components/ComponentDrawer';
import { SimulatorCanvas } from './components/SimulatorCanvas';
import { Inspector } from './components/Inspector';
import { Oscilloscope } from './components/Oscilloscope';
import { ExamplesModal } from './components/ExamplesModal';
import { CommandPalette } from './components/CommandPalette';
import { ShareModal } from './components/ShareModal';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('circuitpulse_theme');
    return (saved as ThemeMode) || 'obsidian';
  });

  // Circuit state
  const [circuitTitle, setCircuitTitle] = useState<string>('Series RLC Resonance');
  const [netlist, setNetlist] = useState<string>(CIRCUIT_PRESETS[0].netlist);

  // Simulation run state
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);

  // Layout & Dock toggles
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [isScopeOpen, setIsScopeOpen] = useState<boolean>(true);

  // Modals state
  const [isExamplesOpen, setIsExamplesOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Interactive selection state
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [inspectorData, setInspectorData] = useState<InspectorData | null>({
    id: 'res_1',
    type: 'Resistor',
    name: 'R1 (Current Limiter)',
    value: 100,
    unit: 'Ω',
    prefix: '',
    voltageDrop: 2.14,
    current: 0.0214,
    power: 0.0458,
    frequency: 60,
    nodes: ['Node A', 'Node B']
  });

  // Sync theme attribute to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('circuitpulse_theme', theme);
  }, [theme]);

  // Load circuit from URL hash if present (#ctz=...)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('ctz=')) {
      const ctz = hash.split('ctz=')[1]?.split('&')[0];
      if (ctz) {
        const decompressed = CircuitEngineService.decompressNetlist(ctz);
        if (decompressed) {
          setNetlist(decompressed);
          setCircuitTitle('Custom Shared Circuit');
        }
      }
    }
  }, []);

  // Global Keyboard Shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore keyboard shortcuts if user is typing in an input
    const activeEl = document.activeElement;
    const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setIsCommandPaletteOpen(prev => !prev);
      return;
    }

    if (e.key === 'Escape') {
      setIsExamplesOpen(false);
      setIsCommandPaletteOpen(false);
      setIsShareOpen(false);
      setSelectedComponent(null);
      return;
    }

    if (isTyping) return;

    if (e.code === 'Space') {
      e.preventDefault();
      setIsRunning(prev => !prev);
    } else if (e.key.toLowerCase() === 'o') {
      setIsScopeOpen(prev => !prev);
    } else if (e.key.toLowerCase() === 'p') {
      setIsExamplesOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelectPreset = (preset: CircuitPreset) => {
    setCircuitTitle(preset.title);
    setNetlist(preset.netlist);
    setIsRunning(true);
  };

  const handleResetSimulation = () => {
    // Reload schematic to reset initial node voltages & currents
    const current = netlist;
    setNetlist('');
    setTimeout(() => setNetlist(current), 50);
  };

  const handleClearCircuit = () => {
    if (window.confirm('Clear current circuit canvas?')) {
      setCircuitTitle('Blank Circuit');
      setNetlist('$ 1 0.000005 10 50 5 43\n');
      setInspectorData(null);
    }
  };

  return (
    <div className="circuit-app-container" id="circuit-app-container">
      {/* 1. Global Header Navigation & Controls */}
      <Header
        title={circuitTitle}
        onTitleChange={setCircuitTitle}
        isRunning={isRunning}
        onToggleRunning={() => setIsRunning(!isRunning)}
        onStepForward={() => {}}
        onReset={handleResetSimulation}
        onClear={handleClearCircuit}
        simSpeed={simSpeed}
        onSpeedChange={setSimSpeed}
        theme={theme}
        onThemeChange={setTheme}
        onOpenExamples={() => setIsExamplesOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        isScopeOpen={isScopeOpen}
        onToggleScope={() => setIsScopeOpen(!isScopeOpen)}
        exampleCount={CIRCUIT_PRESETS.length}
      />

      {/* 2. Workspace Body */}
      <div className="workspace-main">
        {/* Left Component Drawer */}
        <ComponentDrawer
          isOpen={isDrawerOpen}
          onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
          onSelectComponent={(id) => setSelectedComponent(id)}
          selectedComponent={selectedComponent}
        />

        {/* Center Main Stage + Oscilloscope Dock */}
        <div className="canvas-and-dock-column">
          <SimulatorCanvas
            currentNetlist={netlist}
            theme={theme}
            isRunning={isRunning}
            selectedComponent={selectedComponent}
          />

          <Oscilloscope
            isOpen={isScopeOpen}
            onClose={() => setIsScopeOpen(false)}
            isRunning={isRunning}
          />
        </div>

        {/* Right Parametric Inspector & Telemetry */}
        <Inspector
          isOpen={isInspectorOpen}
          onToggle={() => setIsInspectorOpen(!isInspectorOpen)}
          selectedData={inspectorData}
        />
      </div>

      {/* 3. Modals */}
      <ExamplesModal
        isOpen={isExamplesOpen}
        onClose={() => setIsExamplesOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectPreset={handleSelectPreset}
        onSelectComponent={(id) => setSelectedComponent(id)}
        onToggleRunning={() => setIsRunning(!isRunning)}
        isRunning={isRunning}
        onReset={handleResetSimulation}
        onThemeChange={setTheme}
        onToggleScope={() => setIsScopeOpen(!isScopeOpen)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        circuitTitle={circuitTitle}
        netlist={netlist}
        theme={theme}
      />
    </div>
  );
};

export default App;
