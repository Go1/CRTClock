export interface ClockSettings {
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  flipMode: 'single' | 'double';
}

export const defaultSettings: ClockSettings = {
  timeFormat: '24h',
  showSeconds: true,
  flipMode: 'single',
};