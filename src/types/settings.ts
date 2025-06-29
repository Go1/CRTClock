export interface ClockSettings {
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  flipMode: 'single' | 'double';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontColor: 'amber' | 'blue' | 'green' | 'red' | 'purple' | 'white';
}

export const defaultSettings: ClockSettings = {
  timeFormat: '24h',
  showSeconds: true,
  flipMode: 'single',
  fontSize: 'medium',
  fontColor: 'amber',
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