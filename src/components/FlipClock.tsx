import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const clockContainerRef = useRef<HTMLDivElement>(null);
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ウィンドウサイズの追跡
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // 動的フォントサイズ計算（要素数に応じた最大サイズ活用を改善）
  const calculateFontSize = useCallback(() => {
    if (windowSize.width === 0 || windowSize.height === 0) return;

    // 利用可能領域
    const availableWidth = windowSize.width * 0.9;
    const availableHeight = windowSize.height * 0.65;

    console.log('=== Font Size Calculation ===');
    console.log('Available space:', { availableWidth, availableHeight });
    console.log('Settings:', { 
      flipMode: settings.flipMode, 
      showSeconds: settings.showSeconds, 
      timeFormat: settings.timeFormat,
      fontSize: settings.fontSize 
    });

    // 要素数の計算
    let totalElements = 0;
    
    if (settings.flipMode === 'single') {
      // 一桁フリップ: 各桁を個別カウント
      totalElements = 4; // 時・分の4桁
      if (settings.showSeconds) totalElements += 2; // 秒の2桁
    } else {
      // 二桁フリップ: グループ単位でカウント
      totalElements = 2; // 時・分
      if (settings.showSeconds) totalElements += 1; // 秒
    }

    // セパレーター数（非表示だが空間は必要）
    let separators = 1; // 時:分
    if (settings.showSeconds) separators += 1; // 分:秒
    if (settings.timeFormat === '12h') separators += 0.5; // AM/PM前

    console.log('Elements:', { totalElements, separators });

    // 幅の計算
    const digitWidthRatio = settings.flipMode === 'single' ? 0.8 : 1.6;
    const separatorWidthRatio = 0.15; // セパレーターは非表示だが空間は保持
    let totalWidthRatio = totalElements * digitWidthRatio + separators * separatorWidthRatio;
    
    // AM/PM要素
    if (settings.timeFormat === '12h') {
      totalWidthRatio += 0.7;
    }

    // 基本フォントサイズの計算
    const fontSizeFromWidth = availableWidth / totalWidthRatio;
    const fontSizeFromHeight = availableHeight / 1.2;
    let baseFontSize = Math.min(fontSizeFromWidth, fontSizeFromHeight);

    console.log('Base calculations:', { 
      totalWidthRatio, 
      fontSizeFromWidth: Math.round(fontSizeFromWidth), 
      fontSizeFromHeight: Math.round(fontSizeFromHeight),
      baseFontSize: Math.round(baseFontSize)
    });

    // ユーザー設定による調整 - 要素数に応じてスケーリングを調整
    const sizeMultipliers = {
      small: 0.5,
      medium: 0.65,
      large: 0.8,
      'extra-large': 0.95,
    };

    let multiplier = sizeMultipliers[settings.fontSize] || 0.95;

    // 要素数が少ない場合のボーナススケーリング
    const minElements = settings.flipMode === 'single' ? 4 : 2; // 最小要素数（時・分のみ）
    const maxElements = settings.flipMode === 'single' ? 6 : 3; // 最大要素数（時・分・秒）
    const currentElements = totalElements;
    
    // 要素数が少ないほど大きくするスケーリング係数
    const elementScaling = 1 + (maxElements - currentElements) * 0.15; // 要素が1つ減るごとに15%大きく
    
    // AM/PMがない場合の追加ボーナス
    const ampmBonus = settings.timeFormat === '24h' ? 1.1 : 1.0;
    
    // 最終的な倍率計算
    multiplier = multiplier * elementScaling * ampmBonus;

    console.log('Scaling factors:', { 
      baseMultiplier: sizeMultipliers[settings.fontSize],
      elementScaling,
      ampmBonus,
      finalMultiplier: multiplier.toFixed(2)
    });

    baseFontSize *= multiplier;

    console.log('After scaling:', { 
      adjustedSize: Math.round(baseFontSize) 
    });

    // 最小・最大制限（要素数に応じて最大値を調整）
    const minSize = 16;
    // 要素数が少ない場合は最大サイズ制限を緩和
    const maxSizeBase = Math.min(availableWidth * 0.2, availableHeight * 0.8);
    const maxSize = maxSizeBase * (1 + (maxElements - currentElements) * 0.1);
    
    const finalSize = Math.max(minSize, Math.min(maxSize, baseFontSize));

    console.log('Final size calculation:', { 
      minSize, 
      maxSizeBase: Math.round(maxSizeBase),
      maxSize: Math.round(maxSize), 
      finalSize: Math.round(finalSize),
      utilizationRatio: (finalSize / maxSize * 100).toFixed(1) + '%'
    });

    setCalculatedFontSize(Math.round(finalSize));
  }, [
    windowSize.width,
    windowSize.height,
    settings.flipMode,
    settings.showSeconds,
    settings.timeFormat,
    settings.fontSize
  ]);

  // 設定変更時とウィンドウリサイズ時に再計算
  useEffect(() => {
    calculateFontSize();
  }, [calculateFontSize]);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    let ampm = '';

    if (settings.timeFormat === '12h') {
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
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
    
    // Apply Sixtyfour font for both 8-bit flavor and pixel font family
    if (settings.displayFlavor === 'retro-8bit' || settings.fontFamily === 'pixel') {
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
    const ampmFontSize = calculatedFontSize * 0.35;
    const ampmWidth = calculatedFontSize * 0.7;
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

    const getDigitContainerClass = (isBottom = false) => {
      const baseClass = isBottom ? flavorStyles.digitContainerBottom : flavorStyles.digitContainer;
      const borderClass = isBottom ? borderRadius.bottom : borderRadius.top;
      const crtClass = (settings.displayFlavor === 'retro-8bit' || settings.fontFamily === 'pixel') && settings.crtEffects ? 'retro-8bit-digit crt-enabled' : '';
      return `${baseClass} ${borderClass} ${crtClass}`;
    };

    return (
      <div 
        className="relative perspective-1000 flex-shrink-0"
        style={{ width: `${ampmWidth}px`, height: `${ampmHeight}px` }}
      >
        <div className="relative w-full h-full">
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
          
          <div className={`absolute left-0 right-0 top-1/2 h-0.5 ${flavorStyles.dividerColor} transform -translate-y-0.5 z-20`}></div>
        </div>
      </div>
    );
  };

  // 動的サイズ計算
  const separatorSpacing = Math.max(8, calculatedFontSize * 0.08);
  const flipSpacing = Math.max(6, calculatedFontSize * 0.06);

  // セパレーター空間コンポーネント（非表示だが空間を保持）
  const SeparatorSpace: React.FC<{ isSmall?: boolean }> = ({ isSmall = false }) => (
    <div 
      className="flex flex-col justify-center flex-shrink-0"
      style={{ 
        padding: `0 ${separatorSpacing}px`,
        width: `${separatorSpacing * (isSmall ? 1 : 2)}px`
      }}
    >
      {/* 空のスペース - セパレーターは非表示だが空間は保持 */}
    </div>
  );

  const renderSingleDigitMode = () => (
    <>
      <div className="flex flex-shrink-0" style={{ gap: `${flipSpacing * 0.3}px` }}>
        <FlipDigit digit={hours[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        <FlipDigit digit={hours[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {/* セパレーター空間（非表示） */}
      <SeparatorSpace />
      
      <div className="flex flex-shrink-0" style={{ gap: `${flipSpacing * 0.3}px` }}>
        <FlipDigit digit={minutes[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        <FlipDigit digit={minutes[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {settings.showSeconds && (
        <>
          {/* セパレーター空間（非表示） */}
          <SeparatorSpace />
          
          <div className="flex flex-shrink-0" style={{ gap: `${flipSpacing * 0.3}px` }}>
            <FlipDigit digit={seconds[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
            <FlipDigit digit={seconds[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
          </div>
        </>
      )}
      
      {settings.timeFormat === '12h' && (
        <>
          {/* AM/PM前の小さな空間 */}
          <SeparatorSpace isSmall />
          <AMPMFlip ampm={ampm} />
        </>
      )}
    </>
  );

  const renderDoubleDigitMode = () => (
    <>
      <div className="flex-shrink-0">
        <FlipDoubleDigit value={hours} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {/* セパレーター空間（非表示） */}
      <SeparatorSpace />
      
      <div className="flex-shrink-0">
        <FlipDoubleDigit value={minutes} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {settings.showSeconds && (
        <>
          {/* セパレーター空間（非表示） */}
          <SeparatorSpace />
          
          <div className="flex-shrink-0">
            <FlipDoubleDigit value={seconds} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
          </div>
        </>
      )}
      
      {settings.timeFormat === '12h' && (
        <>
          {/* AM/PM前の小さな空間 */}
          <SeparatorSpace isSmall />
          <AMPMFlip ampm={ampm} />
        </>
      )}
    </>
  );

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
    <div className={`group flex items-center justify-center min-h-screen ${flavorStyles.background} px-2 py-2 ${settings.crtEffects ? 'crt-container' : ''} overflow-hidden`}>
      {settings.crtEffects && (
        <>
          <div className="crt-scanlines"></div>
          <div className="crt-flicker"></div>
          <div className="crt-glow"></div>
          <div className="crt-vignette"></div>
        </>
      )}

      <button
        onClick={() => setIsSettingsOpen(true)}
        className={`fixed top-4 right-4 p-2 ${settings.displayFlavor === 'material' ? 'bg-white/80 hover:bg-white/90' : 'bg-gray-800/80 hover:bg-gray-700/80'} backdrop-blur-sm rounded-full ${settings.displayFlavor === 'material' ? 'border border-gray-200' : 'border border-gray-600'} transition-all duration-300 z-40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0`}
        aria-label="設定を開く"
      >
        <Settings className={`w-4 h-4 ${getSettingsButtonColor()}`} />
      </button>

      <div 
        ref={clockContainerRef}
        className={`relative w-full h-full flex flex-col justify-center items-center ${settings.crtEffects ? 'crt-content' : ''} max-w-full max-h-full`}
      >
        <div className="w-full h-full flex flex-col justify-center items-center overflow-hidden">
          <div className="flex items-center justify-center min-h-0 flex-1 max-w-full" style={{ gap: `${flipSpacing}px` }}>
            {settings.flipMode === 'single' ? renderSingleDigitMode() : renderDoubleDigitMode()}
          </div>
          
          <div className="text-center mt-4 flex-shrink-0">
            <p 
              className={`${settings.displayFlavor === 'material' ? 'text-gray-600' : 'text-gray-400'} font-medium tracking-wider uppercase ${fontFamilyClass} opacity-50`}
              style={{ fontSize: `${Math.max(10, calculatedFontSize * 0.08)}px` }}
            >
              Digital Flip Clock
            </p>
          </div>
        </div>
        
        <div className={`absolute inset-0 ${flavorStyles.ambientGlow} -z-10 scale-110`}></div>
      </div>

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