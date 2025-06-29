import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import FlipDigit from './FlipDigit';
import FlipDoubleDigit from './FlipDoubleDigit';
import SettingsModal from './SettingsModal';
import { useSettings } from '../hooks/useSettings';
import { separatorColorClasses } from '../types/settings';

const FlipClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    let ampm = '';

    if (settings.timeFormat === '12h') {
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0時は12時として表示
    }

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    return { 
      hours: hoursStr, 
      minutes: minutesStr, 
      seconds: secondsStr,
      ampm 
    };
  };

  const { hours, minutes, seconds, ampm } = formatTime(time);
  const separatorColorClass = separatorColorClasses[settings.fontColor];

  // サイズクラスを秒表示の有無に応じて調整
  const getDigitSize = () => {
    if (!settings.showSeconds) {
      // 秒表示がない場合は一段階大きくする
      switch (settings.fontSize) {
        case 'small': return 'medium';
        case 'medium': return 'large';
        case 'large': return 'extra-large';
        case 'extra-large': return 'extra-large'; // 最大サイズは維持
        default: return settings.fontSize;
      }
    }
    return settings.fontSize;
  };

  const effectiveFontSize = getDigitSize();

  const renderSingleDigitMode = () => (
    <div className="relative">
      <div className="flex items-center space-x-4">
        {/* Hours */}
        <div className="flex space-x-1">
          <FlipDigit digit={hours[0]} fontSize={effectiveFontSize} fontColor={settings.fontColor} />
          <FlipDigit digit={hours[1]} fontSize={effectiveFontSize} fontColor={settings.fontColor} />
        </div>
        
        {/* Separator */}
        <div className="flex flex-col space-y-2 px-2">
          <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
          <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
        </div>
        
        {/* Minutes */}
        <div className="flex space-x-1">
          <FlipDigit digit={minutes[0]} fontSize={effectiveFontSize} fontColor={settings.fontColor} />
          <FlipDigit digit={minutes[1]} fontSize={effectiveFontSize} fontColor={settings.fontColor} />
        </div>
        
        {settings.showSeconds && (
          <>
            {/* Separator */}
            <div className="flex flex-col space-y-2 px-2">
              <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
              <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
            </div>
            
            {/* Seconds */}
            <div className="flex space-x-1">
              <FlipDigit digit={seconds[0]} fontSize={effectiveFontSize} fontColor={settings.fontColor} />
              <FlipDigit digit={seconds[1]} fontSize={effectiveFontSize} fontColor={settings.fontColor} />
            </div>
          </>
        )}
      </div>
      
      {/* AM/PM Indicator positioned at bottom left of time display */}
      {settings.timeFormat === '12h' && (
        <div className="absolute bottom-0 left-0 transform translate-y-2">
          <span className={`${separatorColorClasses[settings.fontColor]} text-xs font-bold tracking-wider opacity-80`}>
            {ampm}
          </span>
        </div>
      )}
    </div>
  );

  const renderDoubleDigitMode = () => (
    <div className="relative">
      <div className="flex items-center space-x-4">
        {/* Hours */}
        <FlipDoubleDigit value={hours} fontSize={effectiveFontSize} fontColor={settings.fontColor} />
        
        {/* Separator */}
        <div className="flex flex-col space-y-2 px-2">
          <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
          <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
        </div>
        
        {/* Minutes */}
        <FlipDoubleDigit value={minutes} fontSize={effectiveFontSize} fontColor={settings.fontColor} />
        
        {settings.showSeconds && (
          <>
            {/* Separator */}
            <div className="flex flex-col space-y-2 px-2">
              <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
              <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
            </div>
            
            {/* Seconds */}
            <FlipDoubleDigit value={seconds} fontSize={effectiveFontSize} fontColor={settings.fontColor} />
          </>
        )}
      </div>
      
      {/* AM/PM Indicator positioned at bottom left of time display */}
      {settings.timeFormat === '12h' && (
        <div className="absolute bottom-0 left-0 transform translate-y-2">
          <span className={`${separatorColorClasses[settings.fontColor]} text-xs font-bold tracking-wider opacity-80`}>
            {ampm}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="group flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Settings Button - Hidden by default, shown on hover */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-6 right-6 p-3 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm rounded-full border border-gray-600 transition-all duration-300 z-40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        aria-label="設定を開く"
      >
        <Settings className="w-5 h-5 text-amber-400" />
      </button>

      <div className="relative">
        {/* Clock Container */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="flex items-center justify-center">
            {settings.flipMode === 'single' ? renderSingleDigitMode() : renderDoubleDigitMode()}
          </div>
          
          {/* Clock Label */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm font-medium tracking-wider uppercase">
              Digital Flip Clock
            </p>
          </div>
        </div>
        
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-amber-500/10 rounded-2xl blur-xl -z-10 scale-110"></div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={updateSettings}
      />
    </div>
  );
};

export default FlipClock;