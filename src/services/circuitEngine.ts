import LZString from 'lz-string';
import type { ThemeMode } from '../types/circuit';

export interface ThemeColors {
  bg: string;
  positive: string;
  negative: string;
  wire: string;
  currentDots: string;
}

export const THEME_PALETTES: Record<ThemeMode, ThemeColors> = {
  obsidian: {
    bg: '#0a0d14',
    positive: '#10b981', // Emerald
    negative: '#f43f5e', // Rose
    wire: '#64748b',     // Slate
    currentDots: '#fbbf24' // Amber
  },
  cyberpunk: {
    bg: '#05050a',
    positive: '#39ff14', // Neon Green
    negative: '#ff007f', // Hot Pink
    wire: '#00f0ff',     // Cyan
    currentDots: '#ffff00' // Yellow Neon
  },
  blueprint: {
    bg: '#081c33',
    positive: '#38bdf8', // Sky Blue
    negative: '#f87171', // Red
    wire: '#94a3b8',     // Technical White-Gray
    currentDots: '#ffffff'
  },
  studio: {
    bg: '#ffffff',
    positive: '#059669', // Dark Green
    negative: '#dc2626', // Dark Red
    wire: '#1e293b',     // Dark Slate
    currentDots: '#d97706' // Dark Amber
  }
};

export class CircuitEngineService {
  /**
   * Compresses a raw Falstad netlist text string to LZ-String URL safe format (ctz parameter).
   */
  static compressNetlist(netlist: string): string {
    try {
      return LZString.compressToEncodedURIComponent(netlist.trim());
    } catch (e) {
      console.error('Error compressing netlist:', e);
      return '';
    }
  }

  /**
   * Decompresses an LZ-String ctz parameter into the plain Falstad netlist.
   */
  static decompressNetlist(ctz: string): string {
    try {
      const result = LZString.decompressFromEncodedURIComponent(ctz);
      return result || '';
    } catch (e) {
      console.error('Error decompressing ctz:', e);
      return '';
    }
  }

  /**
   * Builds the fully configured iframe URL for CircuitJS with the specified aesthetic theme,
   * hiding the legacy menus and applying theme parameters.
   */
  static buildSimulatorUrl(options: {
    netlist?: string;
    ctz?: string;
    theme: ThemeMode;
    editable?: boolean;
    simRunning?: boolean;
  }): string {
    const { netlist, ctz, theme, editable = true, simRunning = true } = options;
    const colors = THEME_PALETTES[theme];

    const baseUrl = 'https://www.falstad.com/circuit/circuitjs.html';
    const params = new URLSearchParams();

    // Aesthetic & UI cleanliness params
    params.set('hideMenu', 'true');
    params.set('hideSidebar', 'true');
    params.set('editable', editable ? 'true' : 'false');
    params.set('whiteBackground', theme === 'studio' ? 'true' : 'false');

    // Color customization (hex format without hash)
    params.set('positiveColor', colors.positive.replace('#', ''));
    params.set('negativeColor', colors.negative.replace('#', ''));

    if (ctz) {
      params.set('ctz', ctz);
    } else if (netlist) {
      const compressed = this.compressNetlist(netlist);
      if (compressed) {
        params.set('ctz', compressed);
      }
    }

    if (!simRunning) {
      params.set('running', 'false');
    }

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generates a modern SVG export schematic representing the circuit.
   */
  static generateSvgPreview(title: string, theme: ThemeMode): string {
    const colors = THEME_PALETTES[theme];
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <rect width="800" height="500" fill="${colors.bg}" rx="12"/>
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="${colors.wire}" opacity="0.25"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#grid)"/>
  
  <!-- Schematic Lines -->
  <g stroke="${colors.positive}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M 160 250 L 280 250 L 280 180 L 380 180 L 400 160 L 420 200 L 440 160 L 460 200 L 480 180 L 560 180 L 560 250"/>
  </g>
  <g stroke="${colors.wire}" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M 160 250 L 160 340 L 560 340 L 560 250"/>
    <line x1="360" y1="340" x2="360" y2="370"/>
    <line x1="340" y1="370" x2="380" y2="370"/>
    <line x1="348" y1="376" x2="372" y2="376"/>
    <line x1="354" y1="382" x2="366" y2="382"/>
  </g>

  <!-- Labels -->
  <text x="40" y="50" font-family="'JetBrains Mono', monospace" font-size="20" font-weight="bold" fill="${colors.positive}">⚡ ${title}</text>
  <text x="40" y="75" font-family="'Inter', sans-serif" font-size="12" fill="${colors.wire}">Exported from CircuitPulse (Cloudflare Edge Edition)</text>
</svg>`;
  }
}
