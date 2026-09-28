import React, { useState } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Tag, 
  ArrowRight
} from 'lucide-react';
import { CIRCUIT_PRESETS } from '../data/presets';
import type { CircuitPreset } from '../types/circuit';

interface ExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: CircuitPreset) => void;
}

export const ExamplesModal: React.FC<ExamplesModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories: (string)[] = [
    'All',
    'Basics & DC',
    'AC & RLC',
    'Diodes & Rectifiers',
    'Transistors & Amplifiers',
    'Operational Amplifiers',
    '555 & Oscillators',
    'Digital Logic'
  ];

  const filtered = CIRCUIT_PRESETS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="modal-backdrop" id="examples-modal-backdrop" onClick={onClose}>
      <div className="modal-dialog examples-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <BookOpen size={20} className="modal-icon" />
            <div>
              <h2 className="modal-title">Interactive Circuit Examples</h2>
              <p className="modal-sub">Battle-tested educational schematics with real-time differential equation solving</p>
            </div>
          </div>
          <button 
            id="btn-close-examples"
            className="modal-close-btn" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="modal-filter-bar">
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              id="examples-search-input"
              type="text"
              placeholder="Search by topic, component, or formula (e.g. 555, RLC, Op-Amp)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="examples-search-input"
              autoFocus
            />
          </div>

          <div className="modal-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Circuit Cards Grid */}
        <div className="examples-grid">
          {filtered.map((preset) => {
            const difficultyColor = 
              preset.difficulty === 'Beginner' ? 'green' : 
              preset.difficulty === 'Intermediate' ? 'amber' : 'purple';

            return (
              <div 
                key={preset.id} 
                id={`preset-card-${preset.id}`}
                className="preset-card"
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
              >
                <div className="card-top-row">
                  <span className="card-cat-badge">{preset.category}</span>
                  <span className={`difficulty-pill ${difficultyColor}`}>
                    {preset.difficulty}
                  </span>
                </div>

                <h3 className="card-title">{preset.title}</h3>
                <p className="card-desc">{preset.description}</p>

                {preset.formula && (
                  <div className="formula-box font-mono">
                    <code>{preset.formula}</code>
                  </div>
                )}

                <div className="card-footer-row">
                  <div className="tag-chips">
                    {preset.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag-chip">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>

                  <button className="load-circuit-btn">
                    <span>Load</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
