
import React from 'react';
import { COLOR_WHEEL } from '../constants';

const ColorWheel: React.FC = () => {
  // Center is (50, 50), Radius is 50.
  // Each slice is 360 / 12 = 30 degrees.
  // We want Yellow (index 4) to be at 12 o'clock (top).
  // In SVG circle math, 0 degrees is 3 o'clock. 270 degrees is 12 o'clock.
  // If we start drawing from index 4 at 270 degrees:
  // Rotation for each index i = 270 + (i - 4) * 30
  
  return (
    <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-zinc-900 shadow-2xl overflow-hidden bg-zinc-900 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {COLOR_WHEEL.map((color, index) => {
          // Calculate start and end angles for the wedge
          // Offset by 120 degrees because index 4 is Yellow and should be at 0 degrees (top)
          // Since SVG rotates clockwise from 3 o'clock, we rotate the whole SVG -90 so 0 is top.
          // Then index 4 is at 0 degrees.
          const startAngle = (index - 4) * 30;
          const endAngle = startAngle + 30;
          
          const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
          const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
          
          const d = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
          
          return (
            <path
              key={color.id}
              d={d}
              fill={color.hex}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="0.5"
            >
              <title>{color.name}</title>
            </path>
          );
        })}
      </svg>
      
      {/* Center Pin */}
      <div className="absolute w-4 h-4 rounded-full bg-zinc-900 border border-yellow-500 z-10 flex items-center justify-center shadow-md">
        <div className="w-1 h-1 rounded-full bg-yellow-500" />
      </div>
    </div>
  );
};

export default ColorWheel;
