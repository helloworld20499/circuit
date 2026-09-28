import type { CircuitPreset } from '../types/circuit';

export const CIRCUIT_PRESETS: CircuitPreset[] = [
  {
    id: 'lrc-resonance',
    title: 'Series RLC Resonance',
    category: 'AC & RLC',
    difficulty: 'Intermediate',
    description: 'Demonstrates resonance where inductive reactance cancels capacitive reactance, causing current to peak at resonance frequency.',
    formula: 'f_0 = \\frac{1}{2\\pi \\sqrt{LC}} \\approx 50.33\\text{ Hz}',
    tags: ['Resonance', 'AC', 'Inductor', 'Capacitor', 'Filter'],
    netlist: `$ 1 0.000005 10.200776993897341 50 5 43
v 144 288 144 160 0 1 40 5 0 0 0.5
r 144 160 272 160 0 100
l 272 160 384 160 0 1 0.00001
c 384 160 480 160 0 0.00001 0.0001
w 480 160 480 288 0
w 480 288 144 288 0
g 144 288 144 320 0
o 3 64 0 4099 5 0.1 0 1
o 4 64 0 4099 5 0.1 1 1`,
    defaultScopeChannel: 'Current through RLC loop'
  },
  {
    id: 'ohms-law',
    title: "Ohm's Law & Parallel Resistors",
    category: 'Basics & DC',
    difficulty: 'Beginner',
    description: 'The fundamental law of electronics V = I * R. Current splits inversely proportional to resistance across parallel branches.',
    formula: 'I = \\frac{V}{R}, \\quad I_1 = 10\\text{ mA}, \\, I_2 = 1\\text{ mA}',
    tags: ['DC', 'Resistor', 'Current', 'Ohm', 'Foundational'],
    netlist: `$ 1 0.000005 10.200776993897341 50 5 43
v 128 288 128 144 0 0 40 10 0 0 0.5
w 128 144 240 144 0
w 240 144 352 144 0
r 240 144 240 288 0 1000
r 352 144 352 288 0 10000
w 352 288 240 288 0
w 240 288 128 288 0
g 128 288 128 320 0
o 3 64 0 4099 10 0.05 0 1
o 4 64 0 4099 10 0.05 1 1`,
    defaultScopeChannel: 'Branch Currents'
  },
  {
    id: '555-astable',
    title: '555 Timer Astable Multivibrator',
    category: '555 & Oscillators',
    difficulty: 'Intermediate',
    description: 'Classic square wave pulse generator. The capacitor charges through R1+R2 and discharges through R2 via pin 7 (Discharge).',
    formula: 'f = \\frac{1.44}{(R_1 + 2R_2)C}, \\quad D = \\frac{R_1 + R_2}{R_1 + 2R_2}',
    tags: ['555 Timer', 'Oscillator', 'Square Wave', 'Pulse', 'Clock'],
    netlist: `$ 1 0.000005 5 50 5 43
R 272 112 272 64 0 0 40 5 0 0 0.5
165 304 224 384 224 0 0
r 272 112 272 176 0 10000
r 272 176 272 256 0 47000
c 272 256 272 352 0 0.000001 2.5
w 272 352 272 384 0
g 272 384 272 400 0
w 272 176 304 176 0
w 272 256 304 256 0
w 304 256 304 288 0
w 384 224 464 224 0
r 464 224 464 288 0 330
162 464 288 464 352 2 0 1 0 0 0.01
w 464 352 272 352 0
o 8 64 0 4099 5 0.02 0 1`,
    defaultScopeChannel: 'Output Pin 3'
  },
  {
    id: 'opamp-inverting',
    title: 'Op-Amp Inverting Amplifier',
    category: 'Operational Amplifiers',
    difficulty: 'Intermediate',
    description: 'Closed-loop inverting amplifier with negative feedback. The inverting input is held at virtual ground potential.',
    formula: 'V_{out} = -\\left(\\frac{R_f}{R_{in}}\\right) V_{in} = -3 \\times V_{in}',
    tags: ['Op-Amp', 'Amplifier', 'Analog', 'Negative Feedback'],
    netlist: `$ 1 0.000005 10 50 5 43
a 352 240 448 240 0 15 -15 1000000 0 0 100000
v 144 240 144 336 0 1 100 1 0 0 0.5
r 144 240 272 240 0 10000
w 272 240 352 240 0
r 272 240 272 160 0 30000
w 272 160 448 160 0
w 448 160 448 240 0
w 448 240 512 240 0
g 352 256 352 288 0
g 144 336 144 368 0
o 7 64 0 4099 5 0.01 0 1
o 1 64 0 4099 5 0.01 1 1`,
    defaultScopeChannel: 'Inverting Output vs Input'
  },
  {
    id: 'bridge-rectifier',
    title: 'Full-Wave Bridge Rectifier with Filter',
    category: 'Diodes & Rectifiers',
    difficulty: 'Intermediate',
    description: 'Converts AC sinusoidal voltage into DC. Four diodes form a bridge steering current in one direction, while a filter capacitor reduces ripple voltage.',
    formula: 'V_{peak, DC} = V_{peak, AC} - 2 V_{diode} \\approx 12 - 1.4 = 10.6\\text{ V}',
    tags: ['AC to DC', 'Diodes', 'Power Supply', 'Capacitor Filter', 'Ripple'],
    netlist: `$ 1 0.000005 10 50 5 43
v 128 272 128 176 0 1 60 12 0 0 0.5
w 128 176 224 176 0
w 128 272 224 272 0
d 224 176 288 128 1 0.805904783
d 288 320 224 272 1 0.805904783
d 224 272 288 224 1 0.805904783
d 288 224 224 176 1 0.805904783
w 288 128 368 128 0
w 288 320 368 320 0
c 368 128 368 320 0 0.0001 10
r 448 128 448 320 0 500
w 368 128 448 128 0
w 368 320 448 320 0
g 448 320 448 352 0
o 9 64 0 4099 15 0.02 0 1`,
    defaultScopeChannel: 'Filtered DC Output'
  },
  {
    id: 'bjt-common-emitter',
    title: 'BJT Common-Emitter Audio Amplifier',
    category: 'Transistors & Amplifiers',
    difficulty: 'Advanced',
    description: 'Single-stage bipolar junction transistor (NPN) voltage amplifier with voltage-divider biasing, emitter degeneration, and bypass capacitor.',
    formula: 'A_v \\approx -\\frac{R_C}{r_e}, \\quad r_e = \\frac{26\\text{ mV}}{I_E}',
    tags: ['BJT', 'Transistor', 'Audio', 'Voltage Gain', 'Analog'],
    netlist: `$ 1 0.000005 10 50 5 43
R 336 96 336 48 0 0 40 12 0 0 0.5
r 336 96 336 176 0 3300
t 336 240 384 240 0 1 -0.66 0.04 100
w 336 176 384 224 0
r 384 256 384 336 0 680
c 432 256 432 336 0 0.000047 1.2
w 384 256 432 256 0
w 384 336 432 336 0
g 384 336 384 368 0
r 256 96 256 240 0 33000
w 336 96 256 96 0
r 256 240 256 336 0 6800
w 256 336 384 336 0
w 256 240 336 240 0
c 160 240 224 240 0 0.00001 0
v 112 240 112 336 0 1 1000 0.05 0 0 0.5
w 112 240 160 240 0
g 112 336 112 368 0
w 224 240 256 240 0
c 384 224 464 224 0 0.00001 0
r 464 224 464 336 0 10000
g 464 336 464 368 0
o 18 64 0 4099 2 0.002 0 1`,
    defaultScopeChannel: 'Amplified AC Output'
  },
  {
    id: 'zener-regulator',
    title: 'Zener Diode Voltage Regulator',
    category: 'Diodes & Rectifiers',
    difficulty: 'Beginner',
    description: 'Maintains a constant 5.1V output despite fluctuations in input voltage or varying load current using the reverse breakdown region.',
    formula: 'V_{out} = V_Z = 5.1\\text{ V}, \\quad I_S = \\frac{V_{in} - V_Z}{R_S}',
    tags: ['Zener', 'Voltage Reference', 'Regulation', 'Power'],
    netlist: `$ 1 0.000005 10 50 5 43
v 112 256 112 160 0 0 40 12 0 0 0.5
r 112 160 240 160 0 220
z 240 256 240 160 1 5.1
r 352 160 352 256 0 1000
w 240 160 352 160 0
w 240 256 352 256 0
w 112 256 240 256 0
g 112 256 112 288 0
o 3 64 0 4099 10 0.02 0 1`,
    defaultScopeChannel: 'Regulated 5.1V'
  },
  {
    id: 'rc-lowpass-filter',
    title: 'Passive RC Low-Pass Filter',
    category: 'AC & RLC',
    difficulty: 'Beginner',
    description: 'Passes low frequency signals while attenuating frequencies higher than the cutoff frequency with a -20 dB/decade roll-off.',
    formula: 'f_c = \\frac{1}{2\\pi RC} \\approx 1.59\\text{ kHz}',
    tags: ['Filter', 'Low Pass', 'Audio', 'Frequency Response'],
    netlist: `$ 1 0.000005 10 50 5 43
v 144 272 144 160 0 1 1000 5 0 0 0.5
r 144 160 288 160 0 1000
c 288 160 288 272 0 0.0000001 0
w 144 272 288 272 0
g 144 272 144 304 0
w 288 160 368 160 0
o 0 64 0 4099 5 0.002 0 1
o 5 64 0 4099 5 0.002 1 1`,
    defaultScopeChannel: 'V_in vs V_out'
  },
  {
    id: 'schmitt-trigger',
    title: 'Op-Amp Schmitt Trigger (Comparator with Hysteresis)',
    category: 'Operational Amplifiers',
    difficulty: 'Intermediate',
    description: 'Converts noisy analog input into crisp digital high/low transitions with separate upper and lower trip thresholds, preventing switch bounce.',
    formula: 'V_{th} = \\pm V_{sat} \\left(\\frac{R_1}{R_1 + R_2}\\right)',
    tags: ['Schmitt Trigger', 'Hysteresis', 'Noise Rejection', 'Digital Interface'],
    netlist: `$ 1 0.000005 10 50 5 43
a 320 224 416 224 0 10 -10 1000000 0 0 100000
v 160 208 160 304 0 1 50 4 0 0 0.5
w 160 208 320 208 0
g 160 304 160 336 0
r 320 240 320 320 0 10000
g 320 320 320 352 0
r 320 240 416 240 0 47000
w 416 224 416 240 0
w 416 224 480 224 0
o 1 64 0 4099 10 0.02 0 1
o 7 64 0 4099 10 0.02 1 1`,
    defaultScopeChannel: 'Clean Digital Output'
  },
  {
    id: 'sr-flipflop',
    title: 'SR Latch with NOR Gates',
    category: 'Digital Logic',
    difficulty: 'Intermediate',
    description: 'Fundamental 1-bit bistable multivibrator memory cell capable of storing state via cross-coupled logic feedback.',
    formula: 'Q_{next} = S + \\overline{R} \\cdot Q',
    tags: ['Logic', 'Memory', 'Flip-Flop', 'Digital', 'Sequential'],
    netlist: `$ 1 0.000005 10 50 5 43
153 256 160 336 160 0 2 0 0
153 256 256 336 256 0 2 0 0
w 336 160 384 160 0
w 336 256 384 256 0
w 384 160 384 208 0
w 384 208 224 208 0
w 224 208 224 240 0
w 224 240 256 240 0
w 384 256 384 224 0
w 384 224 240 224 0
w 240 224 240 176 0
w 240 176 256 176 0
s 160 144 256 144 0 1 false
s 160 272 256 272 0 1 false
R 160 144 112 144 0 0 40 5 0 0 0.5
R 160 272 112 272 0 0 40 5 0 0 0.5
o 0 64 0 4099 5 0.02 0 1
o 1 64 0 4099 5 0.02 1 1`,
    defaultScopeChannel: 'Q and Q_bar states'
  }
];

export const COMPONENT_CATALOG = [
  { id: 'w', name: 'Wire', shortcut: 'W', category: 'Passives', description: 'Zero-resistance electrical connector', iconName: 'Minus' },
  { id: 'r', name: 'Resistor', shortcut: 'R', category: 'Passives', defaultVal: '1k', unit: 'Ω', description: 'Current-limiting resistive component', iconName: 'Activity' },
  { id: 'c', name: 'Capacitor', shortcut: 'C', category: 'Passives', defaultVal: '100nF', unit: 'F', description: 'Electric field energy storage element', iconName: 'Pause' },
  { id: 'l', name: 'Inductor', shortcut: 'L', category: 'Passives', defaultVal: '10mH', unit: 'H', description: 'Magnetic field energy storage coil', iconName: 'Spline' },
  { id: 'g', name: 'Ground (0V)', shortcut: 'G', category: 'Passives', description: 'Reference potential node for simulation', iconName: 'Download' },
  { id: 's', name: 'Switch (SPST)', shortcut: 'S', category: 'Passives', description: 'Clickable toggle or momentary contact switch', iconName: 'ToggleLeft' },
  { id: 'v_dc', name: 'DC Voltage Source', shortcut: 'V', category: 'Sources', defaultVal: '5V', unit: 'V', description: 'Constant DC potential source', iconName: 'Battery' },
  { id: 'v_ac', name: 'AC Voltage Source', shortcut: 'A', category: 'Sources', defaultVal: '10V 60Hz', unit: 'V', description: 'Sinusoidal alternating current source', iconName: 'Waves' },
  { id: 'd', name: 'Diode', shortcut: 'D', category: 'Semiconductors', description: 'One-way semiconductor P-N junction', iconName: 'ArrowRight' },
  { id: 'z', name: 'Zener Diode', shortcut: 'Z', category: 'Semiconductors', defaultVal: '5.1V', unit: 'V', description: 'Stable reverse-breakdown voltage clamp', iconName: 'ShieldAlert' },
  { id: 'led', name: 'LED (Light Emitting)', shortcut: 'E', category: 'Semiconductors', description: 'Illuminates when forward current flows', iconName: 'Sun' },
  { id: 'npn', name: 'NPN BJT Transistor', shortcut: 'T', category: 'Semiconductors', description: 'Current-controlled bipolar transistor', iconName: 'GitBranch' },
  { id: 'mosfet', name: 'N-Channel MOSFET', shortcut: 'M', category: 'Semiconductors', description: 'Voltage-controlled high-impedance field effect transistor', iconName: 'Cpu' },
  { id: 'opamp', name: 'Operational Amplifier', shortcut: 'O', category: 'ICs & Active', description: 'High-gain differential analog amplifier', iconName: 'Zap' },
  { id: '555', name: '555 Precision Timer', shortcut: '5', category: 'ICs & Active', description: 'Versatile timer/oscillator IC with comparator flip-flop', iconName: 'Clock' },
  { id: 'and_gate', name: 'AND Logic Gate', shortcut: 'Shift+A', category: 'Digital', description: 'Outputs 1 when all inputs are 1', iconName: 'Grid' },
  { id: 'not_gate', name: 'NOT Inverter', shortcut: 'Shift+N', category: 'Digital', description: 'Logical inversion (0 -> 1, 1 -> 0)', iconName: 'CornerDownRight' },
  { id: 'probe', name: 'Analog Scope Probe', shortcut: 'P', category: 'Outputs', description: 'Plots voltage waveform on the oscilloscope dock', iconName: 'Radio' }
];
