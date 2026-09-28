# ⚡ CircuitPulse — Modern Electronic Circuit Simulator

A modernized, high-aesthetic clone and enhancement of the iconic [Falstad Circuit Simulator (CircuitJS1)](https://www.falstad.com/circuit/), optimized for deployment on **Cloudflare Pages** and **Cloudflare Workers**.

---

## ✨ Features & Aesthetic Enhancements

- **4 High-Aesthetic Themes**:
  - 🌑 **Obsidian Dark** (Default): Slate charcoal background with emerald positive voltage, rose negative voltage, and amber current flow.
  - ⚡ **Cyberpunk Neon**: High-contrast OLED pitch black with glowing cyan, hot pink, and neon green traces.
  - 📐 **Engineering Blueprint**: Deep technical blueprint with coordinate grid and JetBrains Mono monospace typography.
  - ☀️ **Studio Clean Light**: Minimalist paper-white canvas with dark slate schematic lines.
- **Precision Simulation Engine**:
  - Solves linear & non-linear circuits using Modified Nodal Analysis (MNA), LU matrix decomposition, and Newton-Raphson iteration.
  - Real-time animated electron current dots whose speed scales dynamically with current ($I$).
- **Integrated Multi-Channel Digital Oscilloscope**:
  - Real-time animated waveforms for Channel 1 (Emerald) and Channel 2 (Cyan).
  - Time-Domain ($Y\text{-}T$), Lissajous ($X\text{-}Y$), and FFT Frequency Spectrum modes.
  - Automated digital measurements: $V_\text{pp}$, $V_\text{rms}$, Frequency ($f$), and Period ($T$).
- **Interactive Component Toolbox**:
  - Quick insertion with single-key shortcuts (`R` for Resistor, `C` for Capacitor, `L` for Inductor, `W` for Wire, `G` for Ground, `V` for Voltage, `D` for Diode).
  - Categorized into Passives, Sources, Semiconductors, ICs & Active, Digital, and Outputs.
- **Parametric Component Inspector**:
  - Live resistance/capacitance tuning sliders with instant unit prefixes ($\text{p}$, $\text{n}$, $\mu$, $\text{m}$, $1$, $\text{k}$, $\text{M}$).
  - Real-time electrical telemetry ($\Delta V$, $I$, $P = I^2 R$, and frequency).
- **Curated Circuit Library (Presets)**:
  - 10+ educational schematics with mathematical explanations and formulas:
    - Series RLC Resonance ($f_0 = \frac{1}{2\pi\sqrt{LC}}$)
    - 555 Timer Astable Multivibrator ($f = \frac{1.44}{(R_1 + 2R_2)C}$)
    - Op-Amp Inverting Amplifier ($V_\text{out} = -\frac{R_f}{R_\text{in}} V_\text{in}$)
    - Full-Wave Bridge Rectifier with smoothing filter
    - BJT Common-Emitter Audio Amplifier
    - Op-Amp Schmitt Trigger with Hysteresis
    - Zener Diode Voltage Clamp
    - Passive RC Low-Pass Filter ($f_c = \frac{1}{2\pi RC}$)
    - SR Latch Memory Cell
- **Command Palette (`⌘K` / `Ctrl+K`)**:
  - Instant fuzzy search across circuits, components, and simulator actions.
- **Cloudflare Edge Sharing & Exports**:
  - Generates compressed, shareable web links with zero egress cost.
  - 100% interoperable with Falstad URLs (`ctz` LZ-String compression).
  - High-resolution SVG vector schematic export.
  - Standard Falstad `.txt` netlist export.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build
```

The application will be live at `http://localhost:5174/`.

---

## ☁️ Deploying to Cloudflare

### Method 1: Cloudflare Pages Git Integration (Recommended)
1. Push this repository to GitHub or GitLab.
2. In the **Cloudflare Dashboard**, navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Set the build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**. Cloudflare will automatically build and distribute the app across 300+ edge locations worldwide.

### Method 2: Deploying via Wrangler CLI
```bash
# Login to Cloudflare
npx wrangler login

# Deploy the production dist folder directly
npx wrangler pages deploy dist --project-name circuitpulse
```

---

## 📄 License & Attribution
- Based on the open-source circuit simulation engine by **Paul Falstad** and **Iain Sharp** ([CircuitJS1](https://github.com/pfalstad/circuitjs1)), licensed under the **GNU General Public License (GPL-2.0 or later)**.
- Modern interface, styling, and Cloudflare architecture crafted for CircuitPulse.
