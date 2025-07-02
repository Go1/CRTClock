import React, { useState, useEffect } from 'react';
import { fontColorClasses, glowColorClasses, displayFlavorStyles, materialFontColorClasses, retro8bitFontColorClasses, fontFamilyClasses } from '../types/settings';

interface FlipDoubleDigitProps {
  value: string;
  fontSize: number; // Changed to number for pixel-based sizing
  fontColor: keyof typeof fontColorClasses;
  displayFlavor: 'realistic' | 'material' | 'retro-8bit';
  fontFamily: keyof typeof fontFamilyClasses;
  crtEffects: boolean;
  fontGlow: boolean;
}

const FlipDoubleDigit: React.FC<FlipDoubleDigitProps> = ({ value, fontSize, fontColor, displayFlavor, fontFamily, crtEffects, fontGlow }) => {
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
  
  // Get font family class with font glow support for all modes
  const getFontFamilyClass = () => {
    let baseClass = '';
    
    // Apply Sixtyfour font for both 8-bit flavor and pixel font family
    if (displayFlavor === 'retro-8bit' || fontFamily === 'pixel') {
      if (fontGlow) {
        baseClass = 'force-sixtyfour-glow font-glow-8bit';
      } else {
        baseClass = 'force-sixtyfour pixel-font-enhanced';
      }
    } else {
      baseClass = fontFamilyClasses[fontFamily];
      if (fontGlow) {
        // Special handling for thin fonts
        if (fontFamily === 'thin' || fontFamily === 'ultra-thin') {
          if (displayFlavor === 'material') {
            baseClass += ' font-glow-thin-material';
          } else {
            baseClass += ' font-glow-thin-realistic';
          }
        } else {
          if (displayFlavor === 'material') {
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

  // Calculate container size based on font size (wider for double digits) - Adjusted for better fit
  const containerWidth = fontSize * ((displayFlavor === 'retro-8bit' || fontFamily === 'pixel') ? 1.8 : 1.6);
  const containerHeight = fontSize * ((displayFlavor === 'retro-8bit' || fontFamily === 'pixel') ? 1.3 : 1.2);

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

  // Get digit container class with CRT effects
  const getDigitContainerClass = (isBottom = false) => {
    const baseClass = isBottom ? flavorStyles.digitContainerBottom : flavorStyles.digitContainer;
    const borderClass = isBottom ? borderRadiusBottom : borderRadiusTop;
    const crtClass = (displayFlavor === 'retro-8bit' || fontFamily === 'pixel') && crtEffects ? 'retro-8bit-digit crt-enabled' : '';
    return `${baseClass} ${borderClass} ${crtClass}`;
  };

  // Calculate font size for 8-bit mode to prevent overflow
  const getActualFontSize = () => {
    if (displayFlavor === 'retro-8bit' || fontFamily === 'pixel') {
      // Reduce font size slightly for 8-bit mode to ensure it fits within container
      return fontSize * 0.85;
    }
    return fontSize;
  };

  const actualFontSize = getActualFontSize();

  return (
    <div 
      className="relative perspective-1000 flex-shrink-0"
      style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
    >
      <div className="relative w-full h-full">
        {/* Top Half - Current Value */}
        <div className={`absolute inset-0 bottom-1/2 overflow-hidden ${borderRadiusTop}`}>
          <div className={`w-full h-full ${getDigitContainerClass()}`}>
            <div className="flex items-center justify-center w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
                <span 
                  className={`font-bold ${fontColorClass} ${fontFamilyClass} select-none leading-none`}
                  style={{ fontSize: `${actualFontSize}px` }}
                >
                  {flipPhase === 'top' ? currentValue : (flipPhase === 'bottom' ? nextValue : currentValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Half - Current Value */}
        <div className={`absolute inset-0 top-1/2 overflow-hidden ${borderRadiusBottom}`}>
          <div className={`w-full h-full ${getDigitContainerClass(true)}`}>
            <div className="flex items-center justify-center w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%', top: '-100%' }}>
                <span 
                  className={`font-bold ${fontColorClass} ${fontFamilyClass} select-none leading-none`}
                  style={{ fontSize: `${actualFontSize}px` }}
                >
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
            <div className={`w-full h-full ${getDigitContainerClass()}`}>
              <div className="flex items-center justify-center w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
                  <span 
                    className={`font-bold ${fontColorClass} ${fontFamilyClass} select-none leading-none`}
                    style={{ fontSize: `${actualFontSize}px` }}
                  >
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
            <div className={`w-full h-full ${getDigitContainerClass(true)}`}>
              <div className="flex items-center justify-center w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%', top: '-100%' }}>
                  <span 
                    className={`font-bold ${fontColorClass} ${fontFamilyClass} select-none leading-none`}
                    style={{ fontSize: `${actualFontSize}px` }}
                  >
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