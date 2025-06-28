import React, { useState, useEffect } from 'react';
import FlipDigit from './FlipDigit';

const FlipClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="relative">
        {/* Clock Container */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="flex items-center justify-center space-x-4">
            {/* Hours */}
            <div className="flex space-x-1">
              <FlipDigit digit={hours[0]} />
              <FlipDigit digit={hours[1]} />
            </div>
            
            {/* Separator */}
            <div className="flex flex-col space-y-2 px-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full shadow-sm"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full shadow-sm"></div>
            </div>
            
            {/* Minutes */}
            <div className="flex space-x-1">
              <FlipDigit digit={minutes[0]} />
              <FlipDigit digit={minutes[1]} />
            </div>
            
            {/* Separator */}
            <div className="flex flex-col space-y-2 px-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full shadow-sm"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full shadow-sm"></div>
            </div>
            
            {/* Seconds */}
            <div className="flex space-x-1">
              <FlipDigit digit={seconds[0]} />
              <FlipDigit digit={seconds[1]} />
            </div>
          </div>
          
          {/* Clock Label */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm font-medium tracking-wider uppercase">
              Digital Flip Clock
            </p>
          </div>
        </div>
        
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-amber-500/10 rounded-2xl blur-xl -z-10 scale-110"></div>
      </div>
    </div>
  );
};

export default FlipClock;