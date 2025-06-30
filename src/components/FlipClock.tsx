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
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const clockContainerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const calculationTimeoutRef = useRef<NodeJS.Timeout>();
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ウィンドウサイズの追跡（改善版）
  useEffect(() => {
    const updateWindowSize = () => {
      const newSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setWindowSize(newSize);
      
      // コンテナサイズも同時に更新
      if (clockContainerRef.current) {
        const rect = clockContainerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // 初回設定
    updateWindowSize();

    // リサイズイベントリスナー（デバウンス付き）
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(updateWindowSize, 50);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // 動的フォントサイズ計算関数（安定性向上版）
  const calculateAndSetFontSize = useCallback(() => {
    // 計算の重複実行を防ぐ
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current);
    }

    calculationTimeoutRef.current = setTimeout(() => {
      // ウィンドウサイズが取得できていない場合は処理を延期
      if (windowSize.width === 0 || windowSize.height === 0) {
        console.log('Window size not ready, retrying...');
        setTimeout(calculateAndSetFontSize, 100);
        return;
      }

      // 実際の利用可能領域を計算（ウィンドウサイズから直接計算）
      const availableWidth = windowSize.width * 0.95; // 95%を使用
      const availableHeight = windowSize.height * 0.80; // 80%を使用（ラベル分を考慮）

      console.log('=== Font Size Calculation ===');
      console.log('Window size:', windowSize);
      console.log('Available space:', { availableWidth, availableHeight });
      
      // 表示要素数を計算
      let elementCount = 2; // 時・分は必須
      if (settings.showSeconds) elementCount += 1; // 秒
      if (settings.timeFormat === '12h') elementCount += 0.4; // AM/PM

      // セパレーター数を計算
      let separatorCount = 1; // 時:分の間
      if (settings.showSeconds) separatorCount += 1; // 分:秒の間
      if (settings.timeFormat === '12h') separatorCount += 0.3; // AM/PM前

      console.log('Elements:', { elementCount, separatorCount });

      // フリップモードによる幅の調整
      const flipWidthMultiplier = settings.flipMode === 'double' ? 1.6 : 0.8;

      // 各要素の推定幅比率
      const digitWidthRatio = flipWidthMultiplier;
      const separatorWidthRatio = 0.15;
      const ampmWidthRatio = 0.7;

      // 総幅比率の計算
      let totalWidthRatio = elementCount * digitWidthRatio + separatorCount * separatorWidthRatio;
      if (settings.timeFormat === '12h') {
        totalWidthRatio += ampmWidthRatio;
      }

      console.log('Width calculation:', { 
        flipWidthMultiplier, 
        digitWidthRatio, 
        totalWidthRatio 
      });

      // 幅ベースのフォントサイズ計算
      const fontSizeFromWidth = availableWidth / totalWidthRatio;

      // 高さベースのフォントサイズ計算
      const fontSizeFromHeight = availableHeight / 1.3; // フリップの高さ比率

      console.log('Font size from dimensions:', { 
        fontSizeFromWidth, 
        fontSizeFromHeight 
      });

      // 小さい方を採用
      let baseFontSize = Math.min(fontSizeFromWidth, fontSizeFromHeight);

      // ユーザー設定による調整係数
      const fontSizeMultipliers = {
        small: 0.6,
        medium: 0.75,
        large: 0.9,
        'extra-large': 1.0,
        massive: 1.15,
        gigantic: 1.3,
      };

      const multiplier = fontSizeMultipliers[settings.fontSize] || 1.0;
      baseFontSize *= multiplier;

      console.log('After user multiplier:', { baseFontSize, multiplier });

      // 最小・最大値の制限
      const minFontSize = 24;
      const maxFontSize = Math.min(availableWidth * 0.8, availableHeight * 0.9);
      
      const finalFontSize = Math.max(minFontSize, Math.min(maxFontSize, baseFontSize));
      
      console.log('Final calculation:', { 
        minFontSize, 
        maxFontSize, 
        finalFontSize: Math.round(finalFontSize)
      });
      console.log('=== End Calculation ===');
      
      setCalculatedFontSize(Math.round(finalFontSize));
    }, 10); // 10msの遅延で重複実行を防ぐ
  }, [
    windowSize.width, 
    windowSize.height, 
    settings.showSeconds, 
    settings.timeFormat, 
    settings.flipMode, 
    settings.fontSize
  ]);

  // 初回計算とリサイズ時の再計算
  useEffect(() => {
    calculateAndSetFontSize();
  }, [calculateAndSetFontSize]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
    };
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
      const crtClass = settings.displayFlavor === 'retro-8bit' && settings.crtEffects ? 'retro-8bit-digit crt-enabled' : '';
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

  // セパレーターサイズを動的計算
  const separatorSize = Math.max(4, calculatedFontSize * 0.06);
  const separatorSpacing = Math.max(8, calculatedFontSize * 0.1);
  const flipSpacing = Math.max(6, calculatedFontSize * 0.08);

  const renderSingleDigitMode = () => (
    <>
      <div className="flex flex-shrink-0" style={{ gap: `${flipSpacing * 0.3}px` }}>
        <FlipDigit digit={hours[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        <FlipDigit digit={hours[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
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
      
      <div className="flex flex-shrink-0" style={{ gap: `${flipSpacing * 0.3}px` }}>
        <FlipDigit digit={minutes[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        <FlipDigit digit={minutes[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {settings.showSeconds && (
        <>
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
          
          <div className="flex flex-shrink-0" style={{ gap: `${flipSpacing * 0.3}px` }}>
            <FlipDigit digit={seconds[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
            <FlipDigit digit={seconds[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
          </div>
        </>
      )}
      
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
      <div className="flex-shrink-0">
        <FlipDoubleDigit value={hours} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
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
      
      <div className="flex-shrink-0">
        <FlipDoubleDigit value={minutes} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {settings.showSeconds && (
        <>
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
          
          <div className="flex-shrink-0">
            <FlipDoubleDigit value={seconds} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
          </div>
        </>
      )}
      
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
    <div className={`group flex items-center justify-center min-h-screen ${flavorStyles.background} px-1 py-2 ${settings.crtEffects ? 'crt-container' : ''}`}>
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
        className={`relative w-full h-full flex flex-col justify-center items-center ${settings.crtEffects ? 'crt-content' : ''}`}
      >
        {/* Debug Info */}
        <div className="fixed top-2 left-2 text-xs text-gray-500 bg-black/50 p-2 rounded z-50 font-mono">
          <div>Font: {calculatedFontSize}px</div>
          <div>Window: {windowSize.width}×{windowSize.height}</div>
          <div>Container: {containerSize.width}×{containerSize.height}</div>
          <div>Elements: {settings.showSeconds ? 3 : 2}{settings.timeFormat === '12h' ? '+AM/PM' : ''}</div>
        </div>

        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="flex items-center justify-center min-h-0 flex-1" style={{ gap: `${flipSpacing}px` }}>
            {settings.flipMode === 'single' ? renderSingleDigitMode() : renderDoubleDigitMode()}
          </div>
          
          <div className="text-center mt-2 sm:mt-4">
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