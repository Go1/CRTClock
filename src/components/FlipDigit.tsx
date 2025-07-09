import React, { useState, useEffect } from 'react';
import { fontColorClasses, glowColorClasses, displayFlavorStyles, materialFontColorClasses, monochromeFontColorClasses, retroComputerFontColorClasses, terminalFontColorClasses, fontFamilyClasses } from '../types/settings';

interface FlipDigitProps {
  digit: string;
  fontSize: number; // Changed to number for pixel-based sizing
  fontColor: keyof typeof fontColorClasses;
  displayFlavor: 'realistic' | 'material' | 'monochrome' | 'retro-computer' | 'terminal';
  fontFamily: keyof typeof fontFamilyClasses;
  crtEffects: boolean;
  fontGlow: boolean;
}

const FlipDigit: React.FC<FlipDigitProps> = ({ digit, fontSize, fontColor, displayFlavor, fontFamily, crtEffects, fontGlow }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [nextDigit, setNextDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipPhase, setFlipPhase] = useState<'none' | 'top' | 'bottom'>('none');

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit);
      setIsFlipping(true);
      setFlipPhase('top');
      
      // Phase 1: Top half flips down (0-150ms)
      const topTimer = setTimeout(() => {
        setFlipPhase('bottom');
      }, 150);
      
      // Phase 2: Bottom half appears (150-300ms)
      const bottomTimer = setTimeout(() => {
        setCurrentDigit(digit);
        setIsFlipping(false);
        setFlipPhase('none');
      }, 300);
      
      return () => {
        clearTimeout(topTimer);
        clearTimeout(bottomTimer);
      };
    }
  }, [digit, currentDigit]);

  // Get appropriate font color based on display flavor
  const getFontColorClass = () => {
    switch (displayFlavor) {
      case 'material':
        return materialFontColorClasses[fontColor];
      case 'monochrome':
        return monochromeFontColorClasses[fontColor];
      case 'retro-computer':
        return retroComputerFontColorClasses[fontColor];
      case 'terminal':
        return terminalFontColorClasses[fontColor];
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
    
    // Apply specific fonts for new flavors
    if (displayFlavor === 'monochrome') {
      if (fontGlow) {
        baseClass = 'font-monochrome font-glow-monochrome';
      } else {
        baseClass = 'font-monochrome';
      }
    } else if (displayFlavor === 'retro-computer') {
      if (fontGlow) {
        baseClass = 'font-retro-computer font-glow-retro-computer';
      } else {
        baseClass = 'font-retro-computer';
      }
    } else if (displayFlavor === 'terminal') {
      if (fontGlow) {
        baseClass = 'font-terminal font-glow-terminal';
      } else {
        baseClass = 'font-terminal';
      }
    } else if (fontFamily === 'pixel') {
      if (fontGlow) {
        baseClass = 'pixel-font-enhanced font-glow-realistic';
      } else {
        baseClass = 'pixel-font-enhanced';
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

  // Calculate container size based on font size - Adjusted for better fit
  const getContainerSize = () => {
    if (displayFlavor === 'retro-computer') {
      return { width: fontSize * 1.0, height: fontSize * 1.4 };
    } else if (displayFlavor === 'monochrome' || displayFlavor === 'terminal') {
      return { width: fontSize * 0.85, height: fontSize * 1.25 };
    } else if (fontFamily === 'pixel') {
      return { width: fontSize * 0.9, height: fontSize * 1.3 };
    }
    return { width: fontSize * 0.8, height: fontSize * 1.2 };
  };

  const { width: containerWidth, height: containerHeight } = getContainerSize();

  // Get border radius based on display flavor
  const getBorderRadius = () => {
    switch (displayFlavor) {
      case 'material':
        return 'rounded-t-2xl';
      case 'monochrome':
      case 'retro-computer':
      case 'terminal':
        return 'rounded-none';
      default:
        return 'rounded-t-lg';
    }
  };

  const getBorderRadiusBottom = () => {
    switch (displayFlavor) {
      case 'material':
        return 'rounded-b-2xl';
      case 'monochrome':
      case 'retro-computer':
      case 'terminal':
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
    const crtClass = getCRTClass();
    return `${baseClass} ${borderClass} ${crtClass}`;
  };

  const getCRTClass = () => {
    if (!crtEffects) return '';
    switch (displayFlavor) {
      case 'monochrome':
        return 'monochrome-digit';
      case 'retro-computer':
        return 'retro-computer-digit';
      case 'terminal':
        return 'terminal-digit';
      default:
        return fontFamily === 'pixel' ? 'retro-computer-digit' : '';
    }
  };

  // Calculate font size for 8-bit mode to prevent overflow
  const getActualFontSize = () => {
    if (displayFlavor === 'retro-computer' || fontFamily === 'pixel') {
      // Reduce font size slightly for 8-bit mode to ensure it fits within container
      return fontSize * 0.85;
    } else if (displayFlavor === 'monochrome' || displayFlavor === 'terminal') {
      return fontSize * 0.9;
    }
    return fontSize;
  };

  const actualFontSize = getActualFontSize();

  return (
    <div 
      className="relative perspective-1000 flex-shrink-0"
      style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
    >
      {/* Digit Container */}
      <div className="relative w-full h-full">
        {/* Top Half - Current Digit */}
        <div className={`absolute inset-0 bottom-1/2 overflow-hidden ${borderRadiusTop}`}>
          <div className={`w-full h-full ${getDigitContainerClass()}`}>
            <div className="flex items-center justify-center w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
                <span 
                  className={`font-bold ${fontColorClass} ${fontFamilyClass} select-none leading-none`}
                  style={{ fontSize: `${actualFontSize}px` }}
                >
                  {flipPhase === 'top' ? currentDigit : (flipPhase === 'bottom' ? nextDigit : currentDigit)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Half - Current Digit */}
        <div className={`absolute inset-0 top-1/2 overflow-hidden ${borderRadiusBottom}`}>
          <div className={`w-full h-full ${getDigitContainerClass(true)}`}>
            <div className="flex items-center justify-center w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%', top: '-100%' }}>
                <span 
                  className={`font-bold ${fontColorClass} ${fontFamilyClass} select-none leading-none`}
                  style={{ fontSize: `${actualFontSize}px` }}
                >
                  {flipPhase === 'bottom' ? nextDigit : currentDigit}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Flip Animation - Top Half (Phase 1: Current digit flips down) */}
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
                    {currentDigit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Flip Animation - Bottom Half (Phase 2: New digit appears from top) */}
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
                    {nextDigit}
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

export default FlipDigit;