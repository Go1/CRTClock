import React, { useState, useEffect } from 'react';
import { fontSizeClasses, fontColorClasses, glowColorClasses } from '../types/settings';

interface FlipDigitProps {
  digit: string;
  fontSize: keyof typeof fontSizeClasses;
  fontColor: keyof typeof fontColorClasses;
}

const FlipDigit: React.FC<FlipDigitProps> = ({ digit, fontSize, fontColor }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [nextDigit, setNextDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit);
      setIsFlipping(true);
      
      // Complete the flip animation
      const timer = setTimeout(() => {
        setCurrentDigit(digit);
        setIsFlipping(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [digit, currentDigit]);

  const fontSizeClass = fontSizeClasses[fontSize];
  const fontColorClass = fontColorClasses[fontColor];
  const glowColorClass = glowColorClasses[fontColor];

  return (
    <div className="relative w-16 h-20 sm:w-20 sm:h-24 perspective-1000">
      {/* Digit Container */}
      <div className="relative w-full h-full">
        {/* Top Half - Current Digit */}
        <div className="absolute inset-0 bottom-1/2 overflow-hidden rounded-t-lg">
          <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-700 border border-gray-600 rounded-t-lg shadow-inner">
            <div className="flex items-center justify-center w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
                <span className={`${fontSizeClass} font-bold ${fontColorClass} font-mono select-none`}>
                  {currentDigit}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Half - Current Digit */}
        <div className="absolute inset-0 top-1/2 overflow-hidden rounded-b-lg">
          <div className="w-full h-full bg-gradient-to-t from-gray-900 to-gray-800 border border-gray-600 rounded-b-lg shadow-inner">
            <div className="flex items-center justify-center w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%', top: '-100%' }}>
                <span className={`${fontSizeClass} font-bold ${fontColorClass} font-mono select-none`}>
                  {currentDigit}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Flip Animation - Top Half */}
        {isFlipping && (
          <div 
            className="absolute inset-0 bottom-1/2 overflow-hidden rounded-t-lg origin-bottom transform-gpu"
            style={{
              animation: 'flipTop 0.3s ease-in-out forwards',
              zIndex: 10
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-700 border border-gray-600 rounded-t-lg shadow-inner">
              <div className="flex items-center justify-center w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
                  <span className={`${fontSizeClass} font-bold ${fontColorClass} font-mono select-none`}>
                    {currentDigit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Flip Animation - Bottom Half */}
        {isFlipping && (
          <div 
            className="absolute inset-0 top-1/2 overflow-hidden rounded-b-lg origin-top transform-gpu"
            style={{
              animation: 'flipBottom 0.3s ease-in-out forwards',
              zIndex: 5
            }}
          >
            <div className="w-full h-full bg-gradient-to-t from-gray-900 to-gray-800 border border-gray-600 rounded-b-lg shadow-inner">
              <div className="flex items-center justify-center w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%', top: '-100%' }}>
                  <span className={`${fontSizeClass} font-bold ${fontColorClass} font-mono select-none`}>
                    {nextDigit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Center Divider */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-900 transform -translate-y-0.5 z-20"></div>
      </div>
      
      {/* Digit Glow */}
      <div className={`absolute inset-0 ${glowColorClass} rounded-lg blur-sm -z-10`}></div>
    </div>
  );
};

export default FlipDigit;