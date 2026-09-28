import React, { useState } from 'react';
import { 
  Search, 
  Minus, 
  Activity, 
  Pause, 
  Spline, 
  Download, 
  ToggleLeft, 
  Battery, 
  Waves, 
  ArrowRight, 
  ShieldAlert, 
  Sun, 
  GitBranch, 
  Cpu, 
  Zap, 
  Clock, 
  Grid, 
  CornerDownRight, 
  Radio, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { COMPONENT_CATALOG } from '../data/presets';

interface ComponentDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectComponent: (componentId: string) => void;
  selectedComponent: string | null;
}

export const ComponentDrawer: React.FC<ComponentDrawerProps> = ({
  isOpen,
  onToggle,
  onSelectComponent,
  selectedComponent
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Passives', 'Sources', 'Semiconductors', 'ICs & Active', 'Digital', 'Outputs'];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Minus': return <Minus size={15} />;
      case 'Activity': return <Activity size={15} />;
      case 'Pause': return <Pause size={15} />;
      case 'Spline': return <Spline size={15} />;
      case 'Download': return <Download size={15} />;
      case 'ToggleLeft': return <ToggleLeft size={15} />;
      case 'Battery': return <Battery size={15} />;
      case 'Waves': return <Waves size={15} />;
      case 'ArrowRight': return <ArrowRight size={15} />;
      case 'ShieldAlert': return <ShieldAlert size={15} />;
      case 'Sun': return <Sun size={15} />;
      case 'GitBranch': return <GitBranch size={15} />;
      case 'Cpu': return <Cpu size={15} />;
      case 'Zap': return <Zap size={15} />;
      case 'Clock': return <Clock size={15} />;
      case 'Grid': return <Grid size={15} />;
      case 'CornerDownRight': return <CornerDownRight size={15} />;
      case 'Radio': return <Radio size={15} />;
      default: return <Activity size={15} />;
    }
  };

  const filteredComponents = COMPONENT_CATALOG.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.shortcut.toLowerCase().includes(search.toLowerCase()) ||
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <aside className={`component-drawer ${isOpen ? 'open' : 'collapsed'}`} id="component-drawer">
      {/* Toggle Tab */}
      <button 
        id="btn-toggle-component-drawer"
        className="drawer-toggle-tab"
        onClick={onToggle}
        title={isOpen ? "Collapse Toolbox" : "Expand Toolbox"}
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {isOpen && (
        <div className="drawer-inner">
          <div className="drawer-header">
            <span className="drawer-title">Components</span>
            <span className="drawer-badge font-mono">{filteredComponents.length}</span>
          </div>

          {/* Search Box */}
          <div className="drawer-search-wrap">
            <Search size={14} className="search-icon" />
            <input
              id="component-search-input"
              type="text"
              placeholder="Search (e.g. Resistor, 555)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="drawer-search-input"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="category-scroll-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Components Grid */}
          <div className="components-list-container">
            {filteredComponents.map((comp) => {
              const isSelected = selectedComponent === comp.id;
              return (
                <div
                  key={comp.id}
                  id={`comp-tile-${comp.id}`}
                  className={`component-tile ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectComponent(comp.id)}
                  title={comp.description}
                >
                  <div className="tile-icon-box">
                    {getIcon(comp.iconName)}
                  </div>
                  <div className="tile-details">
                    <span className="tile-name">{comp.name}</span>
                    <span className="tile-category">{comp.category}</span>
                  </div>
                  <div className="tile-shortcut font-mono" title={`Hotkey: ${comp.shortcut}`}>
                    {comp.shortcut}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Keyboard Placement Tip */}
          <div className="toolbox-tip">
            <Sparkles size={13} className="tip-icon" />
            <span>Press keys <strong>R</strong>, <strong>C</strong>, <strong>L</strong>, <strong>W</strong> directly on canvas to draw.</span>
          </div>
        </div>
      )}
    </aside>
  );
};
