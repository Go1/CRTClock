import React, { useState, useEffect, useRef } from 'react';
import { Settings } from 'lucide-react';
import FlipDigit from './FlipDigit';
import FlipDoubleDigit from './FlipDoubleDigit';
import SettingsModal from './SettingsModal';
import { useSettings } from '../hooks/useSettings';
import { separatorColorClasses, fontColorClasses, displayFlavorStyles, materialFontColorClasses, materialSeparatorColorClasses, retro8bitFontColorClasses, retro8bitSeparatorColorClasses, fontFamilyClasses } from '../types/settings';

const FlipClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [calculatedFontSize, setCalculatedFontSize] = useState(80);
  const clockContainerRef = useRef<HTMLDivElement>(null);
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 動的フォントサイズ計算関数
  const calculateAndSetFontSize = () => {
    if (!clockContainerRef.current) return;

    const containerWidth = clockContainerRef.current.clientWidth;
    const containerHeight = clockContainerRef.current.clientHeight;
    
    // 表示要素数を計算
    let elementCount = 2; // 時・分は必須
    if (settings.showSeconds) elementCount += 1; // 秒
    if (settings.timeFormat === '12h') elementCount += 0.4; // AM/PM（小さいので0.4カウント）

    // セパレーター数を計算
    let separatorCount = 1; // 時:分の間
    if (settings.showSeconds) separatorCount += 1; // 分:秒の間
    if (settings.timeFormat === '12h') separatorCount += 0.3; // AM/PM前の小さなセパレーター

    // フリップモードによる幅の調整
    const flipWidthMultiplier = settings.flipMode === 'double' ? 1.8 : 1.0; // 二桁フリップは幅が広い

    // 各要素の推定幅比率
    const digitWidth = flipWidthMultiplier;
    const separatorWidth = 0.3;
    const ampmWidth = 0.6;

    // 総幅の計算
    let totalWidthRatio = elementCount * digitWidth + separatorCount * separatorWidth;
    if (settings.timeFormat === '12h') {
      totalWidthRatio += ampmWidth;
    }

    // 利用可能な幅の90%を使用（マージンを考慮）
    const availableWidth = containerWidth * 0.9;
    const availableHeight = containerHeight * 0.7; // 高さの70%を使用

    // 幅ベースのフォントサイズ計算
    const fontSizeFromWidth = availableWidth / (totalWidthRatio * 0.8); // 0.8は文字幅の調整係数

    // 高さベースのフォントサイズ計算（フリップの高さ比率を考慮）
    const fontSizeFromHeight = availableHeight * 0.8; // フリップの高さは約フォントサイズの1.2倍

    // 小さい方を採用（画面に収まるように）
    let baseFontSize = Math.min(fontSizeFromWidth, fontSizeFromHeight);

    // ユーザー設定による調整係数
    const fontSizeMultipliers = {
      small: 0.6,
      medium: 0.8,
      large: 1.0,
      'extra-large': 1.2,
      massive: 1.4,
      gigantic: 1.6,
    };

    const multiplier = fontSizeMultipliers[settings.fontSize] || 1.0;
    baseFontSize *= multiplier;

    // 最小・最大値の制限
    const minFontSize = 20;
    const maxFontSize = Math.min(containerWidth * 0.3, containerHeight * 0.4);
    
    const finalFontSize = Math.max(minFontSize, Math.min(maxFontSize, baseFontSize));
    
    setCalculatedFontSize(Math.round(finalFontSize));
  };

  // 初回計算とリサイズ時の再計算
  useEffect(() => {
    calculateAndSetFontSize();
    
    const handleResize = () => {
      calculateAndSetFontSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [settings.showSeconds, settings.timeFormat, settings.flipMode, settings.fontSize]);

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

  // AM/PMフリップコンポーネント
  const AMPMFlip: React.FC<{ ampm: string }> = ({ ampm }) => {
    const ampmFontSize = calculatedFontSize * 0.4; // AM/PMは40%のサイズ
    const ampmWidth = calculatedFontSize * 0.8;
    const ampmHeight = calculatedFontSize * 1.0;

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
      <div 
        className="relative perspective-1000 flex-shrink-0"
        style={{ width: `${ampmWidth}px`, height: `${ampmHeight}px` }}
      >
        <div className="relative w-full h-full">
          {/* Top Half */}
          <div className={`absolute inset-0 bottom-1/2 overflow-hidden ${borderRadius.top}`}>
            <div className={`w-full h-full ${getDigitContainerClass()}`}>
              <div className="flex items-center justify-center w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
                  <span 
                    className={`font-bold ${fontColorClass} ${fontFamilyClass} select-none`}
                    style={{ fontSize: `${ampmFontSize}px` }}
                  >
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
                  <span 
                    className={`font-bold ${fontColorClass} ${fontFamilyClass} select-none`}
                    style={{ fontSize: `${ampmFontSize}px` }}
                  >
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

  // セパレーターサイズを動的計算
  const separatorSize = Math.max(8, calculatedFontSize * 0.08);
  const separatorSpacing = Math.max(8, calculatedFontSize * 0.1);
  const flipSpacing = Math.max(8, calculatedFontSize * 0.08);

  const renderSingleDigitMode = () => (
    <>
      {/* Hours */}
      <div className="flex flex-shrink-0" style={{ gap: `${flipSpacing * 0.3}px` }}>
        <FlipDigit digit={hours[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        <FlipDigit digit={hours[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {/* Separator */}
      <div className="flex flex-col justify-center flex-shrink-0" style={{ gap: `${separatorSpacing * 0.5}px`, padding: `0 ${separatorSpacing}px` }}>
        <div 
          className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}
          style={{ width: `${separatorSize}px`, height: `${separatorSize}px` }}
        ></div>
        <div 
          className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}
          style={{ width: `${separatorSize}px`, height: `${separatorSize}px` }}
        ></div>
      </div>
      
      {/* Minutes */}
      <div className="flex flex-shrink-0" style={{ gap: `${flipSpacing * 0.3}px` }}>
        <FlipDigit digit={minutes[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        <FlipDigit digit={minutes[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {/* Seconds */}
      {settings.showSeconds && (
        <>
          {/* Separator */}
          <div className="flex flex-col justify-center flex-shrink-0" style={{ gap: `${separatorSpacing * 0.5}px`, padding: `0 ${separatorSpacing}px` }}>
            <div 
              className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}
              style={{ width: `${separatorSize}px`, height: `${separatorSize}px` }}
            ></div>
            <div 
              className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}
              style={{ width: `${separatorSize}px`, height: `${separatorSize}px` }}
            ></div>
          </div>
          
          {/* Seconds */}
          <div className="flex flex-shrink-0" style={{ gap: `${flipSpacing * 0.3}px` }}>
            <FlipDigit digit={seconds[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
            <FlipDigit digit={seconds[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
          </div>
        </>
      )}
      
      {/* AM/PM */}
      {settings.timeFormat === '12h' && (
        <>
          <div className="flex flex-col justify-center flex-shrink-0" style={{ gap: `${separatorSpacing * 0.3}px`, padding: `0 ${separatorSpacing * 0.5}px` }}>
            <div 
              className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm opacity-50`}
              style={{ width: `${separatorSize * 0.6}px`, height: `${separatorSize * 0.6}px` }}
            ></div>
            <div 
              className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm opacity-50`}
              style={{ width: `${separatorSize * 0.6}px`, height: `${separatorSize * 0.6}px` }}
            ></div>
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
        <FlipDoubleDigit value={hours} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {/* Separator */}
      <div className="flex flex-col justify-center flex-shrink-0" style={{ gap: `${separatorSpacing * 0.5}px`, padding: `0 ${separatorSpacing}px` }}>
        <div 
          className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}
          style={{ width: `${separatorSize}px`, height: `${separatorSize}px` }}
        ></div>
        <div 
          className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}
          style={{ width: `${separatorSize}px`, height: `${separatorSize}px` }}
        ></div>
      </div>
      
      {/* Minutes */}
      <div className="flex-shrink-0">
        <FlipDoubleDigit value={minutes} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {/* Seconds */}
      {settings.showSeconds && (
        <>
          {/* Separator */}
          <div className="flex flex-col justify-center flex-shrink-0" style={{ gap: `${separatorSpacing * 0.5}px`, padding: `0 ${separatorSpacing}px` }}>
            <div 
              className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}
              style={{ width: `${separatorSize}px`, height: `${separatorSize}px` }}
            ></div>
            <div 
              className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm`}
              style={{ width: `${separatorSize}px`, height: `${separatorSize}px` }}
            ></div>
          </div>
          
          {/* Seconds */}
          <div className="flex-shrink-0">
            <FlipDoubleDigit value={seconds} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
          </div>
        </>
      )}
      
      {/* AM/PM */}
      {settings.timeFormat === '12h' && (
        <>
          <div className="flex flex-col justify-center flex-shrink-0" style={{ gap: `${separatorSpacing * 0.3}px`, padding: `0 ${separatorSpacing * 0.5}px` }}>
            <div 
              className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm opacity-50`}
              style={{ width: `${separatorSize * 0.6}px`, height: `${separatorSize * 0.6}px` }}
            ></div>
            <div 
              className={`${separatorColorClass} ${settings.displayFlavor === 'retro-8bit' ? 'rounded-none' : 'rounded-full'} shadow-sm opacity-50`}
              style={{ width: `${separatorSize * 0.6}px`, height: `${separatorSize * 0.6}px` }}
            ></div>
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

      {/* Full Screen Clock Container */}
      <div 
        ref={clockContainerRef}
        className={`relative w-full h-full flex flex-col justify-center items-center ${settings.crtEffects ? 'crt-content' : ''}`}
      >
        {/* Clock Display */}
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="flex items-center justify-center min-h-0 flex-1" style={{ gap: `${flipSpacing}px` }}>
            {settings.flipMode === 'single' ? renderSingleDigitMode() : renderDoubleDigitMode()}
          </div>
          
          {/* Clock Label */}
          <div className="text-center mt-4 sm:mt-6 lg:mt-8">
            <p className={`${settings.displayFlavor === 'material' ? 'text-gray-600' : 'text-gray-400'} text-xs sm:text-sm lg:text-base font-medium tracking-wider uppercase ${fontFamilyClass} opacity-60`}>
              Digital Flip Clock
            </p>
          </div>
        </div>
        
        {/* Ambient Glow */}
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