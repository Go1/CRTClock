export interface ClockSettings {
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  flipMode: 'single' | 'double';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontColor: 'amber' | 'blue' | 'green' | 'red' | 'purple' | 'white';
  displayFlavor: 'realistic' | 'material' | 'retro-8bit';
  fontFamily: 'mono' | 'sans' | 'serif' | 'pixel';
  crtEffects: boolean;
}

export const defaultSettings: ClockSettings = {
  timeFormat: '24h',
  showSeconds: true,
  flipMode: 'single',
  fontSize: 'medium',
  fontColor: 'amber',
  displayFlavor: 'realistic',
  fontFamily: 'mono',
  crtEffects: false,
};

export const fontSizeClasses = {
  small: 'text-lg sm:text-xl',
  medium: 'text-2xl sm:text-3xl',
  large: 'text-3xl sm:text-4xl',
  'extra-large': 'text-4xl sm:text-5xl',
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

// Font Family Classes - Enhanced for 8-bit mode
export const fontFamilyClasses = {
  mono: 'font-mono',
  sans: 'font-sans',
  serif: 'font-serif',
  pixel: 'pixel-font-enhanced', // Use enhanced pixel font class
};

// Display Flavor specific styles
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
  'retro-8bit': {
    background: 'bg-black',
    clockContainer: 'bg-gray-900 border-2 border-green-400 shadow-none retro-8bit-glow',
    digitContainer: 'bg-black border-2 border-green-400 rounded-none shadow-none',
    digitContainerBottom: 'bg-black border-2 border-green-400 rounded-none shadow-none',
    ambientGlow: 'bg-green-400/20 blur-sm',
    dividerColor: 'bg-green-400',
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

// 8-bit specific font colors (monochrome green)
export const retro8bitFontColorClasses = {
  amber: 'text-green-400',
  blue: 'text-green-400',
  green: 'text-green-400',
  red: 'text-green-400',
  purple: 'text-green-400',
  white: 'text-green-400',
};

export const retro8bitSeparatorColorClasses = {
  amber: 'bg-green-400',
  blue: 'bg-green-400',
  green: 'bg-green-400',
  red: 'bg-green-400',
  purple: 'bg-green-400',
  white: 'bg-green-400',
};