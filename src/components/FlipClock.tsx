import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import FlipDigit from './FlipDigit';
import FlipDoubleDigit from './FlipDoubleDigit';
import SettingsModal from './SettingsModal';
import { useSettings } from '../hooks/useSettings';
import { separatorColorClasses, fontColorClasses, displayFlavorStyles, materialFontColorClasses, materialSeparatorColorClasses, retro8bitFontColorClasses, retro8bitSeparatorColorClasses, fontFamilyClasses } from '../types/settings';

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
  
  // Get appropriate color classes based on display flavor
  const getSeparatorColorClass = () => {
    switch (settings.displayFlavor) {
      case 'material':
        return materialSeparatorColorClasses[settings.fontColor];
      case 'retro-8bit':
        return retro8bitSeparatorColorClasses[settings.fontColor];
      default:
        return separatorColorClasses[settings.fontColor];
    }
  };

  const getFontColorClass = () => {
    switch (settings.displayFlavor) {
      case 'material':
        return materialFontColorClasses[settings.fontColor];
      case 'retro-8bit':
        return retro8bitFontColorClasses[settings.fontColor];
      default:
        return fontColorClasses[settings.fontColor];
    }
  };

  const separatorColorClass = getSeparatorColorClass();
  const fontColorClass = getFontColorClass();
  const flavorStyles = displayFlavorStyles[settings.displayFlavor];
  
  // Get font family class with font glow support for all modes
  const getFontFamilyClass = () => {
    let baseClass = '';
    
    if (settings.displayFlavor === 'retro-8bit') {
      baseClass = 'pixel-font-enhanced';
      if (settings.fontGlow) {
        baseClass += ' font-glow-8bit';
      }
    } else {
      baseClass = fontFamilyClasses[settings.fontFamily];
      if (settings.fontGlow) {
        if (settings.displayFlavor === 'material') {
          baseClass += ' font-glow-material';
        } else {
          baseClass += ' font-glow-realistic';
        }
      }
    }
    
    return baseClass;
  };
  
  const fontFamilyClass = getFontFamilyClass();

  // 表示要素数を計算して最適なフォントサイズを決定
  const getOptimalFontSize = () => {
    let elementCount = 2; // 時・分は必須
    
    if (settings.showSeconds) elementCount += 1; // 秒
    if (settings.timeFormat === '12h') elementCount += 0.3; // AM/PM（小さいので0.3カウント）
    
    // 画面サイズを考慮
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isMobile = screenWidth < 640;
    const isTablet = screenWidth >= 640 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;
    
    // 要素数に基づいてベースサイズを決定
    let baseSize: 'small' | 'medium' | 'large' | 'extra-large' | 'massive' | 'gigantic';
    
    if (elementCount <= 2.3) {
      // 時・分のみ、またはAM/PMのみ追加
      if (isMobile) {
        baseSize = 'massive';
      } else if (isTablet) {
        baseSize = 'gigantic';
      } else {
        baseSize = 'gigantic';
      }
    } else if (elementCount <= 3) {
      // 秒表示あり、AM/PMなし
      if (isMobile) {
        baseSize = 'extra-large';
      } else if (isTablet) {
        baseSize = 'massive';
      } else {
        baseSize = 'massive';
      }
    } else {
      // 秒表示 + AM/PM両方
      if (isMobile) {
        baseSize = 'large';
      } else if (isTablet) {
        baseSize = 'extra-large';
      } else {
        baseSize = 'massive';
      }
    }
    
    return baseSize;
  };

  const optimalFontSize = getOptimalFontSize();

  // AM/PMフリップコンポーネント
  const AMPMFlip: React.FC<{ ampm: string }> = ({ ampm }) => {
    // フォントサイズに応じてAM/PMコンテナサイズを調整
    const getAMPMSize = () => {
      switch (optimalFontSize) {
        case 'small':
          return 'w-12 h-16 sm:w-16 sm:h-20';
        case 'medium':
          return 'w-16 h-20 sm:w-20 sm:h-24';
        case 'large':
          return 'w-20 h-24 sm:w-24 sm:h-28';
        case 'extra-large':
          return 'w-24 h-28 sm:w-28 sm:h-32';
        case 'massive':
          return 'w-28 h-32 sm:w-32 sm:h-36 lg:w-36 lg:h-40';
        case 'gigantic':
          return 'w-32 h-36 sm:w-36 sm:h-40 lg:w-40 lg:h-44';
        default:
          return 'w-16 h-20 sm:w-20 sm:h-24';
      }
    };

    const getAMPMFontSize = () => {
      switch (optimalFontSize) {
        case 'small':
          return 'text-sm';
        case 'medium':
          return 'text-base';
        case 'large':
          return 'text-lg';
        case 'extra-large':
          return 'text-xl';
        case 'massive':
          return 'text-2xl';
        case 'gigantic':
          return 'text-3xl';
        default:
          return 'text-base';
      }
    };

    const getBorderRadius = () => {
      switch (settings.displayFlavor) {
        case 'material':
          return { top: 'rounded-t-2xl', bottom: 'rounded-b-2xl' };
        case 'retro-8bit':
          return { top: 'rounded-none', bottom: 'rounded-none' };
        default:
          return { top: 'rounded-t-lg', bottom: 'rounded-b-lg' };
      }
    };

    const borderRadius = getBorderRadius();

    // Get digit container class with CRT effects
    const getDigitContainerClass = (isBottom = false) => {
      const baseClass = isBottom ? flavorStyles.digitContainerBottom : flavorStyles.digitContainer;
      const borderClass = isBottom ? borderRadius.bottom : borderRadius.top;
      const crtClass = settings.displayFlavor === 'retro-8bit' && settings.crtEffects ? 'retro-8bit-digit crt-enabled' : '';
      return `${baseClass} ${borderClass} ${crtClass}`;
    };

    return (
      <div className={`relative ${getAMPMSize()} perspective-1000 flex-shrink-0`}>
        <div className="relative w-full h-full">
          {/* Top Half */}
          <div className={`absolute inset-0 bottom-1/2 overflow-hidden ${borderRadius.top}`}>
            <div className={`w-full h-full ${getDigitContainerClass()}`}>
              <div className="flex items-center justify-center w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
                  <span className={`${getAMPMFontSize()} font-bold ${fontColorClass} ${fontFamilyClass} select-none`}>
                    {ampm}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Half */}
          <div className={`absolute inset-0 top-1/2 overflow-hidden ${borderRadius.bottom}`}>
            <div className={`w-full h-full ${getDigitContainerClass(true)}`}>
              <div className="flex items-center justify-center w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%', top: '-100%' }}>
                  <span className={`${getAMPMFontSize()} font-bold ${fontColorClass} ${fontFamilyClass} select-none`}>
                    {ampm}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Center Divider */}
          <div className={`absolute left-0 right-0 top-1/2 h-0.5 ${flavorStyles.dividerColor} transform -translate-y-0.5 z-20`}></div>
        </div>
      </div>
    );
  };

  // セパレーターサイズを最適化
  const getSeparatorSize = () => {
    switch (optimalFontSize) {
      case 'small':
        return 'w-2 h-2';
      case 'medium':
        return 'w-3 h-3';
      case 'large':
        return 'w-4 h-4';
      case 'extra-large':
        return 'w-5 h-5';
      case 'massive':
        return 'w-6 h-6';
      case 'gigantic':
        return 'w-8 h-8';
      default:
        return 'w-3 h-3';
    }
  };

  const separatorSize = getSeparatorSize();

  // セパレーター間隔を最適化
  const getSeparatorSpacing = () => {
    switch (optimalFontSize) {
      case 'small':
        return 'space-y-2 px-2';
      case 'medium':
        return 'space-y-3 px-3';
      case 'large':
        return 'space-y-4 px-4';
      case 'extra-large':
        return 'space-y-5 px-5';
      case 'massive':
        return 'space-y-6 px-6';
      case 'gigantic':
        return 'space-y-8 px-8';
      default:
        return 'space-y-3 px-3';
    }
  };

  const separatorSpacing = getSeparatorSpacing();

  // フリップ間隔を最適化
  const getFlipSpacing = () => {
    switch (optimalFontSize) {
      case 'small':
        return 'space-x-2';
      case 'medium':
        return 'space-x-3';
      case 'large':
        return 'space-x-4';
      case 'extra-large':
        return 'space-x-5';
      case 'massive':
        return 'space-x-6';
      case 'gigantic':
        return 'space-x-8';
      default:
        return 'space-x-3';
    }
  };

  const flipSpacing = getFlipSpacing();

  const renderSingleDigitMode = () => (
    <>
      {/* Hours */}
      <div className={`flex ${flipSpacing} flex-shrink-0`}>
        <FlipDigit digit={hours[0]} fontSize={optimalFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        <FlipDigit digit={hours[1]} fontSize={optimalFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {/* Separator */}
      <div className={`flex flex-col ${separatorSpacing} flex-shrink-0`}>
        <div className={`${separatorSize} ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}></div>
        <div className={`${separatorSize} ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}></div>
      </div>
      
      {/* Minutes */}
      <div className={`flex ${flipSpacing} flex-shrink-0`}>
        <FlipDigit digit={minutes[0]} fontSize={optimalFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        <FlipDigit digit={minutes[1]} fontSize={optimalFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {/* Seconds */}
      {settings.showSeconds && (
        <>
          {/* Separator */}
          <div className={`flex flex-col ${separatorSpacing} flex-shrink-0`}>
            <div className={`${separatorSize} ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}></div>
            <div className={`${separatorSize} ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}></div>
          </div>
          
          {/* Seconds */}
          <div className={`flex ${flipSpacing} flex-shrink-0`}>
            <FlipDigit digit={seconds[0]} fontSize={optimalFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
            <FlipDigit digit={seconds[1]} fontSize={optimalFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
          </div>
        </>
      )}
      
      {/* AM/PM */}
      {settings.timeFormat === '12h' && (
        <>
          <div className={`flex flex-col ${separatorSpacing.replace('px-', 'px-2 ')} flex-shrink-0`}>
            <div className={`w-2 h-2 ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm opacity-50`}></div>
            <div className={`w-2 h-2 ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm opacity-50`}></div>
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
        <FlipDoubleDigit value={hours} fontSize={optimalFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {/* Separator */}
      <div className={`flex flex-col ${separatorSpacing} flex-shrink-0`}>
        <div className={`${separatorSize} ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}></div>
        <div className={`${separatorSize} ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}></div>
      </div>
      
      {/* Minutes */}
      <div className="flex-shrink-0">
        <FlipDoubleDigit value={minutes} fontSize={optimalFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {/* Seconds */}
      {settings.showSeconds && (
        <>
          {/* Separator */}
          <div className={`flex flex-col ${separatorSpacing} flex-shrink-0`}>
            <div className={`${separatorSize} ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}></div>
            <div className={`${separatorSize} ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}></div>
          </div>
          
          {/* Seconds */}
          <div className="flex-shrink-0">
            <FlipDoubleDigit value={seconds} fontSize={optimalFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
          </div>
        </>
      )}
      
      {/* AM/PM */}
      {settings.timeFormat === '12h' && (
        <>
          <div className={`flex flex-col ${separatorSpacing.replace('px-', 'px-2 ')} flex-shrink-0`}>
            <div className={`w-2 h-2 ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm opacity-50`}></div>
            <div className={`w-2 h-2 ${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm opacity-50`}></div>
          </div>
          <AMPMFlip ampm={ampm} />
        </>
      )}
    </>
  );

  // Get settings button color based on display flavor
  const getSettingsButtonColor = () => {
    switch (settings.displayFlavor) {
      case 'material':
        return 'text-blue-600';
      case 'retro-8bit':
        return 'text-green-400';
      default:
        return 'text-amber-400';
    }
  };

  return (
    <div className={`group flex items-center justify-center min-h-screen ${flavorStyles.background} px-2 sm:px-4 py-4 sm:py-8 ${settings.crtEffects ? 'crt-container' : ''}`}>
      {/* CRT Effects */}
      {settings.crtEffects && (
        <>
          <div className="crt-scanlines"></div>
          <div className="crt-flicker"></div>
          <div className="crt-glow"></div>
          <div className="crt-vignette"></div>
        </>
      )}

      {/* Settings Button - Hidden by default, shown on hover */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className={`fixed top-6 right-6 p-3 ${settings.displayFlavor === 'material' ? 'bg-white/80 hover:bg-white/90' : 'bg-gray-800/80 hover:bg-gray-700/80'} backdrop-blur-sm rounded-full ${settings.displayFlavor === 'material' ? 'border border-gray-200' : 'border border-gray-600'} transition-all duration-300 z-40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0`}
        aria-label="設定を開く"
      >
        <Settings className={`w-5 h-5 ${getSettingsButtonColor()}`} />
      </button>

      {/* Full Screen Clock Container - 時計枠を取り払い全画面利用 */}
      <div className={`relative w-full h-full flex flex-col justify-center items-center ${settings.crtEffects ? 'crt-content' : ''}`}>
        {/* Clock Display - 全画面を最大限活用 */}
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className={`flex items-center justify-center ${flipSpacing} min-h-0 flex-1`}>
            {settings.flipMode === 'single' ? renderSingleDigitMode() : renderDoubleDigitMode()}
          </div>
          
          {/* Clock Label - 控えめに表示 */}
          <div className="text-center mt-4 sm:mt-6 lg:mt-8">
            <p className={`${settings.displayFlavor === 'material' ? 'text-gray-600' : 'text-gray-400'} text-xs sm:text-sm lg:text-base font-medium tracking-wider uppercase ${fontFamilyClass} opacity-60`}>
              Digital Flip Clock
            </p>
          </div>
        </div>
        
        {/* Ambient Glow - 全画面に対応 */}
        <div className={`absolute inset-0 ${flavorStyles.ambientGlow} -z-10 scale-110`}></div>
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