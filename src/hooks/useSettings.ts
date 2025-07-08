import { useState, useEffect } from 'react';
import { ClockSettings, defaultSettings } from '../types/settings';

const STORAGE_KEY = 'flip-clock-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<ClockSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Remove fontSize from saved settings if it exists (migration)
        const { fontSize, ...cleanSettings } = parsed;
        // Add default values for new spherical distortion settings
        const migratedSettings = {
          ...defaultSettings,
          ...cleanSettings,
          crtSphericalDistortion: cleanSettings.crtSphericalDistortion ?? defaultSettings.crtSphericalDistortion,
          crtBulgeEffect: cleanSettings.crtBulgeEffect ?? defaultSettings.crtBulgeEffect,
          crtBarrelDistortion: cleanSettings.crtBarrelDistortion ?? defaultSettings.crtBarrelDistortion,
        };
        setSettings(migratedSettings);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<ClockSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
  };

  return { settings, updateSettings };
};