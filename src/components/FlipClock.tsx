import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings } from 'lucide-react';
import FlipDigit from './FlipDigit';
import FlipDoubleDigit from './FlipDoubleDigit';
import SettingsModal from './SettingsModal';
import { useSettings } from '../hooks/useSettings';
import { separatorColorClasses, fontColorClasses, displayFlavorStyles, materialFontColorClasses, materialSeparatorColorClasses, classicMacFontColorClasses, classicMacSeparatorColorClasses, retroComputerFontColorClasses, retroComputerSeparatorColorClasses, terminalFontColorClasses, terminalSeparatorColorClasses, fontFamilyClasses, crtModePresets } from '../types/settings';

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

  // 動的フォントサイズ計算（スケール調整機能を追加）
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
      fontSizeScale: settings.fontSizeScale
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

    // 要素数が少ない場合のボーナススケーリング
    const minElements = settings.flipMode === 'single' ? 4 : 2; // 最小要素数（時・分のみ）
    const maxElements = settings.flipMode === 'single' ? 6 : 3; // 最大要素数（時・分・秒）
    const currentElements = totalElements;
    
    // 要素数が少ないほど大きくするスケーリング係数
    const elementScaling = 1 + (maxElements - currentElements) * 0.15; // 要素が1つ減るごとに15%大きく
    
    // AM/PMがない場合の追加ボーナス
    const ampmBonus = settings.timeFormat === '24h' ? 1.1 : 1.0;
    
    // 基本的な倍率計算（従来のfontSize設定は削除）
    let multiplier = 0.95 * elementScaling * ampmBonus;

    console.log('Scaling factors:', { 
      elementScaling,
      ampmBonus,
      finalMultiplier: multiplier.toFixed(2)
    });

    baseFontSize *= multiplier;

    // ユーザー指定のスケール調整を適用
    baseFontSize *= settings.fontSizeScale;

    console.log('After scaling:', { 
      adjustedSize: Math.round(baseFontSize),
      userScale: settings.fontSizeScale,
      finalScaledSize: Math.round(baseFontSize)
    });

    // 最小・最大制限（要素数に応じて最大値を調整）
    const minSize = 16;
    // 要素数が少ない場合は最大サイズ制限を緩和
    const maxSizeBase = Math.min(availableWidth * 0.2, availableHeight * 0.8);
    const maxSize = maxSizeBase * (1 + (maxElements - currentElements) * 0.1) * settings.fontSizeScale;
    
    const finalSize = Math.max(minSize, Math.min(maxSize, baseFontSize));

    console.log('Final size calculation:', { 
      minSize, 
      maxSizeBase: Math.round(maxSizeBase),
      maxSize: Math.round(maxSize), 
      finalSize: Math.round(finalSize),
      utilizationRatio: (finalSize / maxSize * 100).toFixed(1) + '%',
      scaleRatio: (settings.fontSizeScale * 100).toFixed(0) + '%'
    });

    setCalculatedFontSize(Math.round(finalSize));
  }, [
    windowSize.width,
    windowSize.height,
    settings.flipMode,
    settings.showSeconds,
    settings.timeFormat,
    settings.fontSizeScale
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
      case 'classic-mac':
        return classicMacSeparatorColorClasses[settings.fontColor];
      case 'retro-computer':
        return retroComputerSeparatorColorClasses[settings.fontColor];
      case 'terminal':
        return terminalSeparatorColorClasses[settings.fontColor];
      default:
        return separatorColorClasses[settings.fontColor];
    }
  };

  const getFontColorClass = () => {
    switch (settings.displayFlavor) {
      case 'material':
        return materialFontColorClasses[settings.fontColor];
      case 'classic-mac':
        return classicMacFontColorClasses[settings.fontColor];
      case 'retro-computer':
        return retroComputerFontColorClasses[settings.fontColor];
      case 'terminal':
        return terminalFontColorClasses[settings.fontColor];
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
    
    // Apply specific fonts for new flavors
    if (settings.displayFlavor === 'classic-mac') {
      if (settings.fontGlow) {
        baseClass = 'font-classic-mac font-glow-classic-mac';
      } else {
        baseClass = 'font-classic-mac';
      }
    } else if (settings.displayFlavor === 'retro-computer') {
      if (settings.fontGlow) {
        baseClass = 'font-retro-computer font-glow-retro-computer';
      } else {
        baseClass = 'font-retro-computer';
      }
    } else if (settings.displayFlavor === 'terminal') {
      if (settings.fontGlow) {
        baseClass = 'font-terminal font-glow-terminal';
      } else {
        baseClass = 'font-terminal';
      }
    } else if (settings.fontFamily === 'pixel') {
      if (settings.fontGlow) {
        baseClass = 'pixel-font-enhanced font-glow-realistic';
      } else {
        baseClass = 'pixel-font-enhanced';
      }
    } else {
      baseClass = fontFamilyClasses[settings.fontFamily];
      if (settings.fontGlow) {
        // Special handling for thin fonts
        if (settings.fontFamily === 'thin' || settings.fontFamily === 'ultra-thin') {
          if (settings.displayFlavor === 'material') {
            baseClass += ' font-glow-thin-material';
          } else {
            baseClass += ' font-glow-thin-realistic';
          }
        } else {
          if (settings.displayFlavor === 'material') {
            baseClass += ' font-glow-material';
          } else {
            baseClass += ' font-glow-realistic';
          }
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

  // CRT球面効果の動的スタイル生成
  const getCRTSphericalStyles = () => {
    if (!settings.crtEffects) return {};

    const preset = settings.crtMode === 'custom' ? {
      sphericalDistortion: settings.crtSphericalDistortion,
      bulgeEffect: settings.crtBulgeEffect,
      barrelDistortion: settings.crtBarrelDistortion,
    } : {
      sphericalDistortion: crtModePresets[settings.crtMode].sphericalDistortion,
      bulgeEffect: crtModePresets[settings.crtMode].bulgeEffect,
      barrelDistortion: crtModePresets[settings.crtMode].barrelDistortion,
    };

    return {
      '--crt-spherical-x': preset.sphericalDistortion,
      '--crt-spherical-y': preset.sphericalDistortion * 0.5,
      '--crt-spherical-z': preset.sphericalDistortion,
      '--crt-bulge-intensity': preset.bulgeEffect ? preset.sphericalDistortion : 0,
      '--crt-barrel': preset.barrelDistortion,
    } as React.CSSProperties;
  };

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
        <div className={settings.crtEffects && settings.crtBulgeEffect ? 'crt-digit-bulge' : ''}>
          <FlipDigit digit={hours[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        </div>
        <div className={settings.crtEffects && settings.crtBulgeEffect ? 'crt-digit-bulge center' : ''}>
          <FlipDigit digit={hours[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        </div>
      </div>
      
      {/* セパレーター空間（非表示） */}
      <SeparatorSpace />
      
      <div className="flex flex-shrink-0" style={{ gap: `${flipSpacing * 0.3}px` }}>
        <div className={settings.crtEffects && settings.crtBulgeEffect ? 'crt-digit-bulge center' : ''}>
          <FlipDigit digit={minutes[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        </div>
        <div className={settings.crtEffects && settings.crtBulgeEffect ? 'crt-digit-bulge center' : ''}>
          <FlipDigit digit={minutes[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
        </div>
      </div>
      
      {settings.showSeconds && (
        <>
          {/* セパレーター空間（非表示） */}
          <SeparatorSpace />
          
          <div className="flex flex-shrink-0" style={{ gap: `${flipSpacing * 0.3}px` }}>
            <div className={settings.crtEffects && settings.crtBulgeEffect ? 'crt-digit-bulge' : ''}>
              <FlipDigit digit={seconds[0]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
            </div>
            <div className={settings.crtEffects && settings.crtBulgeEffect ? 'crt-digit-bulge' : ''}>
              <FlipDigit digit={seconds[1]} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
            </div>
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
      <div className={`flex-shrink-0 ${settings.crtEffects && settings.crtBulgeEffect ? 'crt-digit-bulge' : ''}`}>
        <FlipDoubleDigit value={hours} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {/* セパレーター空間（非表示） */}
      <SeparatorSpace />
      
      <div className={`flex-shrink-0 ${settings.crtEffects && settings.crtBulgeEffect ? 'crt-digit-bulge center' : ''}`}>
        <FlipDoubleDigit value={minutes} fontSize={calculatedFontSize} fontColor={settings.fontColor} displayFlavor={settings.displayFlavor} fontFamily={settings.fontFamily} crtEffects={settings.crtEffects} fontGlow={settings.fontGlow} />
      </div>
      
      {settings.showSeconds && (
        <>
          {/* セパレーター空間（非表示） */}
          <SeparatorSpace />
          
          <div className={`flex-shrink-0 ${settings.crtEffects && settings.crtBulgeEffect ? 'crt-digit-bulge' : ''}`}>
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
      case 'classic-mac':
        return 'text-black';
      case 'retro-computer':
        return 'text-blue-200';
      case 'terminal':
        return 'text-green-400';
      default:
        return 'text-amber-400';
    }
  };

  // 明るさとCRTエフェクトのスタイルを動的に生成
  const getDynamicStyles = () => {
    const brightnessFilter = `brightness(${settings.brightness})`;
    
    if (!settings.crtEffects) {
      return { filter: brightnessFilter } as React.CSSProperties;
    }

    // Get current CRT preset or use custom values
    const preset = settings.crtMode === 'custom' ? {
      scanlines: settings.crtScanlines,
      flicker: settings.crtFlicker,
      curvature: settings.crtCurvature,
      vignette: settings.crtVignette,
      noise: settings.crtNoise,
      bloom: settings.crtBloom,
      contrast: settings.crtContrast,
      saturation: settings.crtSaturation,
      sphericalDistortion: settings.crtSphericalDistortion,
      bulgeEffect: settings.crtBulgeEffect,
      barrelDistortion: settings.crtBarrelDistortion,
      phosphorColor: crtModePresets.custom.phosphorColor,
    } : crtModePresets[settings.crtMode];

    const sphericalStyles = getCRTSphericalStyles();

    return {
      filter: `${brightnessFilter} contrast(${preset.contrast}) saturate(${preset.saturation})`,
      '--crt-scanlines': preset.scanlines,
      '--crt-flicker': preset.flicker,
      '--crt-curvature': preset.curvature,
      '--crt-vignette': preset.vignette,
      '--crt-noise': preset.noise,
      '--crt-bloom': preset.bloom,
      '--crt-phosphor-color': preset.phosphorColor,
      ...sphericalStyles,
    } as React.CSSProperties;
  };

  return (
    <div 
      className={`group flex items-center justify-center min-h-screen ${flavorStyles.background} px-2 py-2 ${settings.crtEffects ? `crt-container crt-spherical-container crt-mode-${settings.crtMode}` : ''} overflow-hidden`}
      style={getDynamicStyles()}
    >
      {settings.crtEffects && (
        <>
          <div className="crt-scanlines"></div>
          <div className="crt-flicker"></div>
          <div className="crt-glow"></div>
          <div className="crt-vignette"></div>
          <div className="crt-noise"></div>
          <div className="crt-curvature"></div>
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
        className={`relative w-full h-full flex flex-col justify-center items-center ${settings.crtEffects ? `crt-content ${settings.crtSphericalDistortion > 0 ? 'crt-spherical-distortion' : ''} ${settings.crtBarrelDistortion > 0 ? 'crt-barrel-distortion' : ''}` : ''} max-w-full max-h-full`}
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