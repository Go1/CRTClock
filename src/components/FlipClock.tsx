import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import FlipDigit from './FlipDigit';
import FlipDoubleDigit from './FlipDoubleDigit';
import SettingsModal from './SettingsModal';
import { useSettings } from '../hooks/useSettings';
import { separatorColorClasses, fontColorClasses } from '../types/settings';

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
  const fontColorClass = fontColorClasses[settings.fontColor];

  // 表示要素数と画面サイズに基づいてフォントサイズを動的調整
  const getAdjustedFontSize = () => {
    const baseSize = settings.fontSize;
    let elementCount = 2; // 時・分は必須
    
    if (settings.showSeconds) elementCount += 1; // 秒
    if (settings.timeFormat === '12h') elementCount += 0.5; // AM/PM（小さいので0.5カウント）
    
    // 画面サイズも考慮（モバイルでは更に小さく）
    const isMobile = window.innerWidth < 640;
    
    // 要素数と画面サイズに応じてフォントサイズを調整
    if (elementCount >= 3.5) {
      // 秒 + AM/PM両方表示の場合
      if (isMobile) {
        switch (baseSize) {
          case 'extra-large': return 'medium';
          case 'large': return 'small';
          case 'medium': return 'small';
          default: return baseSize;
        }
      } else {
        switch (baseSize) {
          case 'extra-large': return 'large';
          case 'large': return 'medium';
          default: return baseSize;
        }
      }
    } else if (elementCount >= 3) {
      // 秒のみ表示の場合
      if (isMobile) {
        switch (baseSize) {
          case 'extra-large': return 'large';
          case 'large': return 'medium';
          default: return baseSize;
        }
      } else {
        switch (baseSize) {
          case 'extra-large': return 'large';
          default: return baseSize;
        }
      }
    } else if (isMobile && elementCount >= 2.5) {
      // モバイルでAM/PMのみの場合
      switch (baseSize) {
        case 'extra-large': return 'large';
        default: return baseSize;
      }
    }
    
    return baseSize;
  };

  const adjustedFontSize = getAdjustedFontSize();

  // AM/PMフリップコンポーネント
  const AMPMFlip: React.FC<{ ampm: string }> = ({ ampm }) => {
    // フォントサイズに応じてAM/PMコンテナサイズを調整
    const getAMPMSize = () => {
      switch (adjustedFontSize) {
        case 'small':
          return 'w-8 h-12 sm:w-10 sm:h-14';
        case 'medium':
          return 'w-10 h-14 sm:w-12 sm:h-16';
        case 'large':
          return 'w-12 h-16 sm:w-14 sm:h-18';
        case 'extra-large':
          return 'w-14 h-18 sm:w-16 sm:h-20';
        default:
          return 'w-10 h-14 sm:w-12 sm:h-16';
      }
    };

    const getAMPMFontSize = () => {
      switch (adjustedFontSize) {
        case 'small':
          return 'text-xs';
        case 'medium':
          return 'text-sm';
        case 'large':
          return 'text-base';
        case 'extra-large':
          return 'text-lg';
        default:
          return 'text-sm';
      }
    };

    return (
      <div className={`relative ${getAMPMSize()} perspective-1000 flex-shrink-0`}>
        <div className="relative w-full h-full">
          {/* Top Half */}
          <div className="absolute inset-0 bottom-1/2 overflow-hidden rounded-t-lg">
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-700 border border-gray-600 rounded-t-lg shadow-inner">
              <div className="flex items-center justify-center w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
                  <span className={`${getAMPMFontSize()} font-bold ${fontColorClass} font-mono select-none`}>
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
                  <span className={`${getAMPMFontSize()} font-bold ${fontColorClass} font-mono select-none`}>
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
  };

  // セパレーターサイズを調整
  const getSeparatorSize = () => {
    switch (adjustedFontSize) {
      case 'small':
        return 'w-1.5 h-1.5';
      case 'medium':
        return 'w-2 h-2';
      case 'large':
        return 'w-2.5 h-2.5';
      case 'extra-large':
        return 'w-3 h-3';
      default:
        return 'w-2 h-2';
    }
  };

  const separatorSize = getSeparatorSize();

  const renderSingleDigitMode = () => (
    <>
      {/* Hours */}
      <div className="flex space-x-1 flex-shrink-0">
        <FlipDigit digit={hours[0]} fontSize={adjustedFontSize} fontColor={settings.fontColor} />
        <FlipDigit digit={hours[1]} fontSize={adjustedFontSize} fontColor={settings.fontColor} />
      </div>
      
      {/* Separator */}
      <div className="flex flex-col space-y-2 px-1 sm:px-2 flex-shrink-0">
        <div className={`${separatorSize} ${separatorColorClass} rounded-full shadow-sm`}></div>
        <div className={`${separatorSize} ${separatorColorClass} rounded-full shadow-sm`}></div>
      </div>
      
      {/* Minutes */}
      <div className="flex space-x-1 flex-shrink-0">
        <FlipDigit digit={minutes[0]} fontSize={adjustedFontSize} fontColor={settings.fontColor} />
        <FlipDigit digit={minutes[1]} fontSize={adjustedFontSize} fontColor={settings.fontColor} />
      </div>
      
      {/* Seconds */}
      {settings.showSeconds && (
        <>
          {/* Separator */}
          <div className="flex flex-col space-y-2 px-1 sm:px-2 flex-shrink-0">
            <div className={`${separatorSize} ${separatorColorClass} rounded-full shadow-sm`}></div>
            <div className={`${separatorSize} ${separatorColorClass} rounded-full shadow-sm`}></div>
          </div>
          
          {/* Seconds */}
          <div className="flex space-x-1 flex-shrink-0">
            <FlipDigit digit={seconds[0]} fontSize={adjustedFontSize} fontColor={settings.fontColor} />
            <FlipDigit digit={seconds[1]} fontSize={adjustedFontSize} fontColor={settings.fontColor} />
          </div>
        </>
      )}
      
      {/* AM/PM */}
      {settings.timeFormat === '12h' && (
        <>
          <div className="flex flex-col space-y-2 px-1 flex-shrink-0">
            <div className={`w-1 h-1 ${separatorColorClass} rounded-full shadow-sm opacity-50`}></div>
            <div className={`w-1 h-1 ${separatorColorClass} rounded-full shadow-sm opacity-50`}></div>
          </div>
          <AMPMFlip ampm={ampm} />
        </>
      )}
    </>
  );

  const renderDoubleDigitMode = () => (
    <>
      {/* Hours */}
      <div className="flex-shrink-0">
        <FlipDoubleDigit value={hours} fontSize={adjustedFontSize} fontColor={settings.fontColor} />
      </div>
      
      {/* Separator */}
      <div className="flex flex-col space-y-2 px-1 sm:px-2 flex-shrink-0">
        <div className={`${separatorSize} ${separatorColorClass} rounded-full shadow-sm`}></div>
        <div className={`${separatorSize} ${separatorColorClass} rounded-full shadow-sm`}></div>
      </div>
      
      {/* Minutes */}
      <div className="flex-shrink-0">
        <FlipDoubleDigit value={minutes} fontSize={adjustedFontSize} fontColor={settings.fontColor} />
      </div>
      
      {/* Seconds */}
      {settings.showSeconds && (
        <>
          {/* Separator */}
          <div className="flex flex-col space-y-2 px-1 sm:px-2 flex-shrink-0">
            <div className={`${separatorSize} ${separatorColorClass} rounded-full shadow-sm`}></div>
            <div className={`${separatorSize} ${separatorColorClass} rounded-full shadow-sm`}></div>
          </div>
          
          {/* Seconds */}
          <div className="flex-shrink-0">
            <FlipDoubleDigit value={seconds} fontSize={adjustedFontSize} fontColor={settings.fontColor} />
          </div>
        </>
      )}
      
      {/* AM/PM */}
      {settings.timeFormat === '12h' && (
        <>
          <div className="flex flex-col space-y-2 px-1 flex-shrink-0">
            <div className={`w-1 h-1 ${separatorColorClass} rounded-full shadow-sm opacity-50`}></div>
            <div className={`w-1 h-1 ${separatorColorClass} rounded-full shadow-sm opacity-50`}></div>
          </div>
          <AMPMFlip ampm={ampm} />
        </>
      )}
    </>
  );

  return (
    <div className="group flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-2 sm:px-4">
      {/* Settings Button - Hidden by default, shown on hover */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-6 right-6 p-3 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm rounded-full border border-gray-600 transition-all duration-300 z-40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        aria-label="設定を開く"
      >
        <Settings className="w-5 h-5 text-amber-400" />
      </button>

      <div className="relative w-full max-w-6xl">
        {/* Clock Container */}
        <div className="bg-gray-900 rounded-2xl p-3 sm:p-6 lg:p-8 shadow-2xl border border-gray-700 w-full">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 lg:space-x-4 min-h-0">
            {settings.flipMode === 'single' ? renderSingleDigitMode() : renderDoubleDigitMode()}
          </div>
          
          {/* Clock Label */}
          <div className="text-center mt-4 sm:mt-6 lg:mt-8">
            <p className="text-gray-400 text-xs sm:text-sm font-medium tracking-wider uppercase">
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