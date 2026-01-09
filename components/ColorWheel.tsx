import React from 'react';
import { COLOR_WHEEL } from '../constants';

export const ColorWheel: React.FC = () => {
  return (
    <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-zinc-900 shadow-2xl overflow-hidden bg-zinc-900 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {COLOR_WHEEL.map((color, index) => {
          const startAngle = (index - 4) * 30;
          const endAngle = startAngle + 30;
          const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
          const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
          return (
            <path 
              key={color.id} 
              d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`} 
              fill={color.hex} 
              stroke="rgba(0,0,0,0.1)" 
              strokeWidth="0.5" 
            />
          );
        })}
      </svg>
      <div className="absolute w-4 h-4 rounded-full bg-zinc-900 border border-yellow-500 z-10 flex items-center justify-center shadow-md">
        <div className="w-1 h-1 rounded-full bg-yellow-500" />
      </div>
    </div>
  );
};