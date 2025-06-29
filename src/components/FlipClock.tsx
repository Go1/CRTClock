import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import FlipDigit from './FlipDigit';
import FlipDoubleDigit from './FlipDoubleDigit';
import SettingsModal from './SettingsModal';
import { useSettings } from '../hooks/useSettings';
import { separatorColorClasses, fontSizeClasses, fontColorClasses } from '../types/settings';

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
  const fontSizeClass = fontSizeClasses[settings.fontSize];
  const fontColorClass = fontColorClasses[settings.fontColor];

  // AM/PMフリップコンポーネント
  const AMPMFlip: React.FC<{ ampm: string }> = ({ ampm }) => (
    <div className="relative w-12 h-16 sm:w-14 sm:h-18 perspective-1000">
      <div className="relative w-full h-full">
        {/* Top Half */}
        <div className="absolute inset-0 bottom-1/2 overflow-hidden rounded-t-lg">
          <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-700 border border-gray-600 rounded-t-lg shadow-inner">
            <div className="flex items-center justify-center w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
                <span className={`text-xs font-bold ${fontColorClass} font-mono select-none`}>
                  {ampm}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Half */}
        <div className="absolute inset-0 top-1/2 overflow-hidden rounded-b-lg">
          <div className="w-full h-full bg-gradient-to-t from-gray-900 to-gray-800 border border-gray-600 rounded-b-lg shadow-inner">
            <div className="flex items-center justify-center w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%', top: '-100%' }}>
                <span className={`text-xs font-bold ${fontColorClass} font-mono select-none`}>
                  {ampm}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Center Divider */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-900 transform -translate-y-0.5 z-20"></div>
      </div>
    </div>
  );

  const renderSingleDigitMode = () => (
    <div className="flex items-center justify-center" style={{ minWidth: '400px' }}>
      {/* Hours */}
      <div className="flex space-x-1">
        <FlipDigit digit={hours[0]} fontSize={settings.fontSize} fontColor={settings.fontColor} />
        <FlipDigit digit={hours[1]} fontSize={settings.fontSize} fontColor={settings.fontColor} />
      </div>
      
      {/* Separator */}
      <div className="flex flex-col space-y-2 px-2">
        <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
        <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
      </div>
      
      {/* Minutes */}
      <div className="flex space-x-1">
        <FlipDigit digit={minutes[0]} fontSize={settings.fontSize} fontColor={settings.fontColor} />
        <FlipDigit digit={minutes[1]} fontSize={settings.fontSize} fontColor={settings.fontColor} />
      </div>
      
      {/* Seconds or Spacer */}
      {settings.showSeconds ? (
        <>
          {/* Separator */}
          <div className="flex flex-col space-y-2 px-2">
            <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
            <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
          </div>
          
          {/* Seconds */}
          <div className="flex space-x-1">
            <FlipDigit digit={seconds[0]} fontSize={settings.fontSize} fontColor={settings.fontColor} />
            <FlipDigit digit={seconds[1]} fontSize={settings.fontSize} fontColor={settings.fontColor} />
          </div>
        </>
      ) : (
        // 秒表示がない場合のスペーサー（幅を一定に保つため）
        <div className="flex space-x-1 px-6">
          <div className="w-16 h-20 sm:w-20 sm:h-24"></div>
          <div className="w-16 h-20 sm:w-20 sm:h-24"></div>
        </div>
      )}
      
      {/* AM/PM */}
      {settings.timeFormat === '12h' && (
        <>
          <div className="flex flex-col space-y-2 px-2">
            <div className={`w-1 h-1 ${separatorColorClass} rounded-full shadow-sm opacity-50`}></div>
            <div className={`w-1 h-1 ${separatorColorClass} rounded-full shadow-sm opacity-50`}></div>
          </div>
          <AMPMFlip ampm={ampm} />
        </>
      )}
    </div>
  );

  const renderDoubleDigitMode = () => (
    <div className="flex items-center justify-center" style={{ minWidth: '400px' }}>
      {/* Hours */}
      <FlipDoubleDigit value={hours} fontSize={settings.fontSize} fontColor={settings.fontColor} />
      
      {/* Separator */}
      <div className="flex flex-col space-y-2 px-2">
        <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
        <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
      </div>
      
      {/* Minutes */}
      <FlipDoubleDigit value={minutes} fontSize={settings.fontSize} fontColor={settings.fontColor} />
      
      {/* Seconds or Spacer */}
      {settings.showSeconds ? (
        <>
          {/* Separator */}
          <div className="flex flex-col space-y-2 px-2">
            <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
            <div className={`w-2 h-2 ${separatorColorClass} rounded-full shadow-sm`}></div>
          </div>
          
          {/* Seconds */}
          <FlipDoubleDigit value={seconds} fontSize={settings.fontSize} fontColor={settings.fontColor} />
        </>
      ) : (
        // 秒表示がない場合のスペーサー（幅を一定に保つため）
        <div className="flex space-x-1 px-6">
          <div className="w-24 h-20 sm:w-28 sm:h-24"></div>
        </div>
      )}
      
      {/* AM/PM */}
      {settings.timeFormat === '12h' && (
        <>
          <div className="flex flex-col space-y-2 px-2">
            <div className={`w-1 h-1 ${separatorColorClass} rounded-full shadow-sm opacity-50`}></div>
            <div className={`w-1 h-1 ${separatorColorClass} rounded-full shadow-sm opacity-50`}></div>
          </div>
          <AMPMFlip ampm={ampm} />
        </>
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