import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Zap, 
  BookOpen, 
  Activity, 
  ArrowRight
} from 'lucide-react';
import { CIRCUIT_PRESETS, COMPONENT_CATALOG } from '../data/presets';
import type { CircuitPreset, ThemeMode } from '../types/circuit';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: CircuitPreset) => void;
  onSelectComponent: (componentId: string) => void;
  onToggleRunning: () => void;
  isRunning: boolean;
  onReset: () => void;
  onThemeChange: (theme: ThemeMode) => void;
  onToggleScope: () => void;
  onOpenShare: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  onSelectComponent,
  onToggleRunning,
  isRunning,
  onReset,
  onThemeChange,
  onToggleScope,
  onOpenShare
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  // Build searchable items
  const items: {
    id: string;
    type: 'preset' | 'component' | 'action';
    title: string;
    subtitle: string;
    shortcut?: string;
    action: () => void;
  }[] = [];

  // 1. Actions
  items.push({
    id: 'act-toggle-run',
    type: 'action',
    title: isRunning ? 'Pause Simulation' : 'Run Simulation',
    subtitle: 'Controls real-time transient calculation',
    shortcut: 'Space',
    action: () => { onToggleRunning(); onClose(); }
  });
  items.push({
    id: 'act-reset',
    type: 'action',
    title: 'Reset Circuit State',
    subtitle: 'Discharge capacitors & zero state variables',
    shortcut: 'Ctrl+R',
    action: () => { onReset(); onClose(); }
  });
  items.push({
    id: 'act-scope',
    type: 'action',
    title: 'Toggle Oscilloscope Dock',
    subtitle: 'View real-time multi-channel digital waveforms',
    shortcut: 'O',
    action: () => { onToggleScope(); onClose(); }
  });
  items.push({
    id: 'act-share',
    type: 'action',
    title: 'Cloudflare Share & Export',
    subtitle: 'Generate shortlink or download SVG / PNG / Netlist',
    action: () => { onOpenShare(); onClose(); }
  });

  // Themes
  items.push({
    id: 'theme-obsidian',
    type: 'action',
    title: 'Theme: Obsidian Dark',
    subtitle: 'Charcoal background with emerald & rose traces',
    action: () => { onThemeChange('obsidian'); onClose(); }
  });
  items.push({
    id: 'theme-cyberpunk',
    type: 'action',
    title: 'Theme: Cyberpunk Neon',
    subtitle: 'OLED pitch black with glowing cyan & neon pink',
    action: () => { onThemeChange('cyberpunk'); onClose(); }
  });
  items.push({
    id: 'theme-blueprint',
    type: 'action',
    title: 'Theme: Engineering Blueprint',
    subtitle: 'Deep technical blueprint with coordinate grid',
    action: () => { onThemeChange('blueprint'); onClose(); }
  });

  // 2. Components
  COMPONENT_CATALOG.forEach(c => {
    items.push({
      id: `comp-${c.id}`,
      type: 'component',
      title: `Insert ${c.name}`,
      subtitle: `${c.category} · ${c.description}`,
      shortcut: c.shortcut,
      action: () => { onSelectComponent(c.id); onClose(); }
    });
  });

  // 3. Presets
  CIRCUIT_PRESETS.forEach(p => {
    items.push({
      id: `preset-${p.id}`,
      type: 'preset',
      title: `Load ${p.title}`,
      subtitle: `${p.category} · ${p.difficulty}`,
      action: () => { onSelectPreset(p); onClose(); }
    });
  });

  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    (item.shortcut && item.shortcut.toLowerCase().includes(query.toLowerCase()))
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="palette-backdrop" id="command-palette-backdrop" onClick={onClose}>
      <div className="palette-dialog" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        {/* Search Input Box */}
        <div className="palette-input-wrap">
          <Search size={18} className="palette-search-icon" />
          <input
            id="command-palette-input"
            type="text"
            placeholder="Type a command or search circuits..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="palette-input font-mono"
            autoFocus
          />
          <span className="esc-hint font-mono">ESC</span>
        </div>

        {/* Results List */}
        <div className="palette-results">
          {filtered.length === 0 ? (
            <div className="palette-empty">No matching commands or circuits found</div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                className={`palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="item-icon-col">
                  {item.type === 'action' && <Zap size={14} className="icon-action" />}
                  {item.type === 'component' && <Activity size={14} className="icon-component" />}
                  {item.type === 'preset' && <BookOpen size={14} className="icon-preset" />}
                </div>

                <div className="item-text-col">
                  <span className="item-title">{item.title}</span>
                  <span className="item-subtitle">{item.subtitle}</span>
                </div>

                {item.shortcut && (
                  <span className="item-shortcut font-mono">{item.shortcut}</span>
                )}

                <ArrowRight size={13} className="item-arrow" />
              </div>
            ))
          )}
        </div>

        {/* Palette Footer */}
        <div className="palette-footer">
          <span className="footer-tip">Use <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd> to navigate, <kbd className="font-mono">↵</kbd> to select</span>
        </div>
      </div>
    </div>
  );
};
