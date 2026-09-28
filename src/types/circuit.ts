export type ThemeMode = 'obsidian' | 'cyberpunk' | 'blueprint' | 'studio';

export type CircuitCategory = 
  | 'Basics & DC'
  | 'AC & RLC'
  | 'Diodes & Rectifiers'
  | 'Transistors & Amplifiers'
  | 'Operational Amplifiers'
  | '555 & Oscillators'
  | 'Digital Logic';

export interface CircuitPreset {
  id: string;
  title: string;
  category: CircuitCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  formula?: string;
  tags: string[];
  netlist: string;
  defaultScopeChannel?: string;
}

export interface ComponentItem {
  id: string;
  name: string;
  shortcut: string;
  category: 'Passives' | 'Sources' | 'Semiconductors' | 'ICs & Active' | 'Digital' | 'Outputs';
  description: string;
  defaultVal?: string;
  unit?: string;
  iconName: string;
}

export interface InspectorData {
  id: string;
  type: string;
  name: string;
  value: number;
  unit: string;
  prefix: string;
  voltageDrop: number;
  current: number;
  power: number;
  frequency?: number;
  nodes?: string[];
}

export interface ScopeChannel {
  id: string;
  name: string;
  color: string;
  vPerDiv: number;
  offset: number;
  enabled: boolean;
  history: number[];
  vpp: number;
  vrms: number;
  frequency: number;
}
