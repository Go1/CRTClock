export interface ClockSettings {
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  flipMode: 'single' | 'double';
  fontColor: 'amber' | 'blue' | 'green' | 'red' | 'purple' | 'white';
  displayFlavor: 'realistic' | 'material' | 'monochrome' | 'retro-computer' | 'terminal';
  fontFamily: 'mono' | 'sans' | 'serif' | 'pixel' | 'thin' | 'ultra-thin';
  crtEffects: boolean;
  fontGlow: boolean;
  brightness: number; // 0.3 to 1.0 (30% to 100%)
  crtIntensity: number; // 0.0 to 1.0 (0% to 100%)
  fontSizeScale: number; // 0.5 to 1.5 (50% to 150% of calculated size)
  // New CRT settings
  crtMode: 'classic' | 'amber' | 'green' | 'blue' | 'custom';
  crtScanlines: number; // 0.0 to 1.0
  crtFlicker: number; // 0.0 to 1.0
  crtCurvature: number; // 0.0 to 1.0
  crtVignette: number; // 0.0 to 1.0
  crtNoise: number; // 0.0 to 1.0
  crtBloom: number; // 0.0 to 1.0
  crtContrast: number; // 0.5 to 2.0
  crtSaturation: number; // 0.0 to 2.0
  // Spherical distortion settings
  crtSphericalDistortion: number; // 0.0 to 1.0
  crtBulgeEffect: boolean;
  crtBarrelDistortion: number; // 0.0 to 1.0
}

export const defaultSettings: ClockSettings = {
  timeFormat: '12h',
  showSeconds: true,
  flipMode: 'double',
  fontColor: 'amber',
  displayFlavor: 'realistic',
  fontFamily: 'mono',
  crtEffects: true,
  fontGlow: true,
  brightness: 1.0,
  crtIntensity: 0.7,
  fontSizeScale: 1.0,
  // New CRT defaults
  crtMode: 'classic',
  crtScanlines: 0.7,
  crtFlicker: 0.3,
  crtCurvature: 0.5,
  crtVignette: 0.6,
  crtNoise: 0.2,
  crtBloom: 0.4,
  crtContrast: 1.2,
  crtSaturation: 1.1,
  // Spherical distortion defaults
  crtSphericalDistortion: 0.5,
  crtBulgeEffect: true,
  crtBarrelDistortion: 0.3,
};

export const fontColorClasses = {
  amber: 'text-amber-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  red: 'text-red-400',
  purple: 'text-purple-400',
  white: 'text-white',
};

export const glowColorClasses = {
  amber: 'bg-amber-400/5',
  blue: 'bg-blue-400/5',
  green: 'bg-green-400/5',
  red: 'bg-red-400/5',
  purple: 'bg-purple-400/5',
  white: 'bg-white/5',
};

export const separatorColorClasses = {
  amber: 'bg-amber-400',
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  red: 'bg-red-400',
  purple: 'bg-purple-400',
  white: 'bg-white',
};

// Font Family Classes - Enhanced with thin font options
export const fontFamilyClasses = {
  mono: 'font-mono',
  sans: 'font-sans',
  serif: 'font-serif',
  pixel: 'pixel-font-enhanced', // Use enhanced pixel font class with Sixtyfour
  thin: 'font-thin-modern', // Inter thin font
  'ultra-thin': 'font-ultra-thin', // Roboto ultra thin font
};

// CRT Mode Presets
export const crtModePresets = {
  classic: {
    name: 'クラシック',
    description: '標準的なCRTモニター',
    scanlines: 0.7,
    flicker: 0.3,
    curvature: 0.5,
    vignette: 0.6,
    noise: 0.2,
    bloom: 0.4,
    contrast: 1.2,
    saturation: 1.1,
    phosphorColor: '#ffffff',
    sphericalDistortion: 0.5,
    bulgeEffect: true,
    barrelDistortion: 0.3,
  },
  amber: {
    name: 'アンバー',
    description: '古いコンピューター風',
    scanlines: 0.8,
    flicker: 0.4,
    curvature: 0.6,
    vignette: 0.7,
    noise: 0.3,
    bloom: 0.6,
    contrast: 1.4,
    saturation: 0.8,
    phosphorColor: '#ffb000',
    sphericalDistortion: 0.6,
    bulgeEffect: true,
    barrelDistortion: 0.4,
  },
  green: {
    name: 'グリーン',
    description: 'レトロターミナル風',
    scanlines: 0.9,
    flicker: 0.2,
    curvature: 0.4,
    vignette: 0.8,
    noise: 0.1,
    bloom: 0.8,
    contrast: 1.6,
    saturation: 0.6,
    phosphorColor: '#00ff00',
    sphericalDistortion: 0.7,
    bulgeEffect: true,
    barrelDistortion: 0.5,
  },
  blue: {
    name: 'ブルー',
    description: 'IBM風モニター',
    scanlines: 0.6,
    flicker: 0.1,
    curvature: 0.3,
    vignette: 0.5,
    noise: 0.15,
    bloom: 0.3,
    contrast: 1.1,
    saturation: 1.3,
    phosphorColor: '#0080ff',
    sphericalDistortion: 0.4,
    bulgeEffect: true,
    barrelDistortion: 0.2,
  },
  custom: {
    name: 'カスタム',
    description: '手動調整',
    scanlines: 0.7,
    flicker: 0.3,
    curvature: 0.5,
    vignette: 0.6,
    noise: 0.2,
    bloom: 0.4,
    contrast: 1.2,
    saturation: 1.1,
    phosphorColor: '#ffffff',
    sphericalDistortion: 0.5,
    bulgeEffect: true,
    barrelDistortion: 0.3,
  },
};

// Display Flavor specific styles - Enhanced 8-bit styling
export const displayFlavorStyles = {
  realistic: {
    background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
    clockContainer: 'bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl',
    digitContainer: 'bg-gradient-to-b from-gray-800 to-gray-700 border border-gray-600 rounded-t-lg shadow-inner',
    digitContainerBottom: 'bg-gradient-to-t from-gray-900 to-gray-800 border border-gray-600 rounded-b-lg shadow-inner',
    ambientGlow: 'bg-amber-500/10 rounded-2xl blur-xl',
    dividerColor: 'bg-gray-900',
  },
  material: {
    background: 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300',
    clockContainer: 'bg-white rounded-3xl border-0 shadow-xl',
    digitContainer: 'bg-gradient-to-b from-slate-50 to-slate-100 border-0 rounded-t-2xl shadow-lg',
    digitContainerBottom: 'bg-gradient-to-t from-slate-200 to-slate-100 border-0 rounded-b-2xl shadow-lg',
    ambientGlow: 'bg-blue-500/5 rounded-3xl blur-2xl',
    dividerColor: 'bg-slate-300',
  },
  'monochrome': {
    background: 'bg-gray-100',
    clockContainer: 'bg-white border-2 border-black shadow-none monochrome-container',
    digitContainer: 'bg-white border border-black rounded-none shadow-none monochrome-digit',
    digitContainerBottom: 'bg-white border border-black rounded-none shadow-none monochrome-digit',
    ambientGlow: 'bg-transparent',
    dividerColor: 'bg-black',
  },
  'retro-computer': {
    background: 'bg-blue-900',
    clockContainer: 'bg-blue-800 border-4 border-blue-300 shadow-none retro-computer-container',
    digitContainer: 'bg-blue-700 border-2 border-blue-200 rounded-none shadow-none retro-computer-digit',
    digitContainerBottom: 'bg-blue-700 border-2 border-blue-200 rounded-none shadow-none retro-computer-digit',
    ambientGlow: 'bg-blue-400/20 blur-sm',
    dividerColor: 'bg-blue-200',
  },
  'terminal': {
    background: 'bg-gray-900',
    clockContainer: 'bg-black border border-gray-600 shadow-none terminal-container',
    digitContainer: 'bg-gray-900 border-0 rounded-none shadow-none terminal-digit',
    digitContainerBottom: 'bg-gray-900 border-0 rounded-none shadow-none terminal-digit',
    ambientGlow: 'bg-green-400/5 blur-lg',
    dividerColor: 'bg-gray-600',
  },
};

// Material Design specific font colors
export const materialFontColorClasses = {
  amber: 'text-orange-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
  red: 'text-red-600',
  purple: 'text-purple-600',
  white: 'text-gray-800',
};

export const materialSeparatorColorClasses = {
  amber: 'bg-orange-600',
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  red: 'bg-red-600',
  purple: 'bg-purple-600',
  white: 'bg-gray-800',
};

// Monochrome specific font colors (monochrome black)
export const monochromeFontColorClasses = {
  amber: 'text-black',
  blue: 'text-black',
  green: 'text-black',
  red: 'text-black',
  purple: 'text-black',
  white: 'text-black',
};

export const monochromeSeparatorColorClasses = {
  amber: 'bg-black',
  blue: 'bg-black',
  green: 'bg-black',
  red: 'bg-black',
  purple: 'bg-black',
  white: 'bg-black',
};

// Retro Computer specific font colors (limited palette)
export const retroComputerFontColorClasses = {
  amber: 'text-yellow-200',
  blue: 'text-blue-200',
  green: 'text-green-200',
  red: 'text-red-200',
  purple: 'text-purple-200',
  white: 'text-white',
};

export const retroComputerSeparatorColorClasses = {
  amber: 'bg-yellow-200',
  blue: 'bg-blue-200',
  green: 'bg-green-200',
  red: 'bg-red-200',
  purple: 'bg-purple-200',
  white: 'bg-white',
};

// Terminal specific font colors (CLI style with limited colors)
export const terminalFontColorClasses = {
  amber: 'text-yellow-300',
  blue: 'text-cyan-300',
  green: 'text-green-400',
  red: 'text-red-300',
  purple: 'text-magenta-300',
  white: 'text-gray-300',
};

export const terminalSeparatorColorClasses = {
  amber: 'bg-yellow-300',
  blue: 'bg-cyan-300',
  green: 'bg-green-400',
  red: 'bg-red-300',
  purple: 'bg-magenta-300',
  white: 'bg-gray-300',
};