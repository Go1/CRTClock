import React, { useState, useEffect } from 'react';
import { fontSizeClasses, fontColorClasses, glowColorClasses, displayFlavorStyles, materialFontColorClasses, retro8bitFontColorClasses, fontFamilyClasses } from '../types/settings';

interface FlipDoubleDigitProps {
  value: string;
  fontSize: keyof typeof fontSizeClasses;
  fontColor: keyof typeof fontColorClasses;
  displayFlavor: 'realistic' | 'material' | 'retro-8bit';
  fontFamily: keyof typeof fontFamilyClasses;
}

const FlipDoubleDigit: React.FC<FlipDoubleDigitProps> = ({ value, fontSize, fontColor, displayFlavor, fontFamily }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [nextValue, setNextValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipPhase, setFlipPhase] = useState<'none' | 'top' | 'bottom'>('none');

  useEffect(() => {
    if (value !== currentValue) {
      setNextValue(value);
      setIsFlipping(true);
      setFlipPhase('top');
      
      // Phase 1: Top half flips down (0-150ms)
      const topTimer = setTimeout(() => {
        setFlipPhase('bottom');
      }, 150);
      
      // Phase 2: Bottom half appears (150-300ms)
      const bottomTimer = setTimeout(() => {
        setCurrentValue(value);
        setIsFlipping(false);
        setFlipPhase('none');
      }, 300);
      
      return () => {
        clearTimeout(topTimer);
        clearTimeout(bottomTimer);
      };
    }
  }, [value, currentValue]);

  const fontSizeClass = fontSizeClasses[fontSize];
  
  // Get appropriate font color based on display flavor
  const getFontColorClass = () => {
    switch (displayFlavor) {
      case 'material':
        return materialFontColorClasses[fontColor];
      case 'retro-8bit':
        return retro8bitFontColorClasses[fontColor];
      default:
        return fontColorClasses[fontColor];
    }
  };

  const fontColorClass = getFontColorClass();
  const glowColorClass = glowColorClasses[fontColor];
  const flavorStyles = displayFlavorStyles[displayFlavor];
  
  // Get font family class - for 8-bit mode, always use enhanced pixel font
  const getFontFamilyClass = () => {
    if (displayFlavor === 'retro-8bit') {
      return 'pixel-font-enhanced';
    }
    return fontFamilyClasses[fontFamily];
  };
  
  const fontFamilyClass = getFontFamilyClass();

  // フォントサイズに応じてコンテナサイズを調整（レスポンシブ対応）
  const getContainerSize = () => {
    switch (fontSize) {
      case 'small':
        return 'w-16 h-14 sm:w-20 sm:h-16 lg:w-22 lg:h-18';
      case 'medium':
        return 'w-20 h-16 sm:w-24 sm:h-20 lg:w-28 lg:h-24';
      case 'large':
        return 'w-24 h-20 sm:w-28 sm:h-24 lg:w-32 lg:h-28';
      case 'extra-large':
        return 'w-28 h-24 sm:w-32 sm:h-28 lg:w-36 lg:h-32';
      default:
        return 'w-20 h-16 sm:w-24 sm:h-20 lg:w-28 lg:h-24';
    }
  };

  // Get border radius based on display flavor
  const getBorderRadius = () => {
    switch (displayFlavor) {
      case 'material':
        return 'rounded-t-2xl';
      case 'retro-8bit':
        return 'rounded-none';
      default:
        return 'rounded-t-lg';
    }
  };

  const getBorderRadiusBottom = () => {
    switch (displayFlavor) {
      case 'material':
        return 'rounded-b-2xl';
      case 'retro-8bit':
        return 'rounded-none';
      default:
        return 'rounded-b-lg';
    }
  };

  const borderRadiusTop = getBorderRadius();
  const borderRadiusBottom = getBorderRadiusBottom();

  return (
    <div className={`relative ${getContainerSize()} perspective-1000 flex-shrink-0`}>
      <div className="relative w-full h-full">
        {/* Top Half - Current Value */}
        <div className={`absolute inset-0 bottom-1/2 overflow-hidden ${borderRadiusTop}`}>
          <div className={`w-full h-full ${flavorStyles.digitContainer} ${borderRadiusTop}`}>
            <div className="flex items-center justify-center w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
                <span className={`${fontSizeClass} font-bold ${fontColorClass} ${fontFamilyClass} select-none`}>
                  {flipPhase === 'top' ? currentValue : (flipPhase === 'bottom' ? nextValue : currentValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Half - Current Value */}
        <div className={`absolute inset-0 top-1/2 overflow-hidden ${borderRadiusBottom}`}>
          <div className={`w-full h-full ${flavorStyles.digitContainerBottom} ${borderRadiusBottom}`}>
            <div className="flex items-center justify-center w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%', top: '-100%' }}>
                <span className={`${fontSizeClass} font-bold ${fontColorClass} ${fontFamilyClass} select-none`}>
                  {flipPhase === 'bottom' ? nextValue : currentValue}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Flip Animation - Top Half (Phase 1: Current value flips down) */}
        {isFlipping && flipPhase === 'top' && (
          <div 
            className={`absolute inset-0 bottom-1/2 overflow-hidden ${borderRadiusTop} origin-bottom transform-gpu`}
            style={{
              animation: 'realisticFlipTop 0.15s ease-in forwards',
              zIndex: 15
            }}
          >
            <div className={`w-full h-full ${flavorStyles.digitContainer} ${borderRadiusTop}`}>
              <div className="flex items-center justify-center w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
                  <span className={`${fontSizeClass} font-bold ${fontColorClass} ${fontFamilyClass} select-none`}>
                    {currentValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Flip Animation - Bottom Half (Phase 2: New value appears from top) */}
        {isFlipping && flipPhase === 'bottom' && (
          <div 
            className={`absolute inset-0 top-1/2 overflow-hidden ${borderRadiusBottom} origin-top transform-gpu`}
            style={{
              animation: 'realisticFlipBottom 0.15s ease-out forwards',
              zIndex: 15
            }}
          >
            <div className={`w-full h-full ${flavorStyles.digitContainerBottom} ${borderRadiusBottom}`}>
              <div className="flex items-center justify-center w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%', top: '-100%' }}>
                  <span className={`${fontSizeClass} font-bold ${fontColorClass} ${fontFamilyClass} select-none`}>
                    {nextValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Center Divider */}
        <div className={`absolute left-0 right-0 top-1/2 h-0.5 ${flavorStyles.dividerColor} transform -translate-y-0.5 z-20`}></div>
      </div>
      
      {/* Digit Glow - Only for realistic mode */}
      {displayFlavor === 'realistic' && (
        <div className={`absolute inset-0 ${glowColorClass} rounded-lg blur-sm -z-10`}></div>
      )}
    </div>
  );
};

export default FlipDoubleDigit;