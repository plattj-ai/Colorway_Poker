
import React from 'react';
import { CardState } from '../types';

interface CardProps {
  card: CardState;
  onToggle: (instanceId: string) => void;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({ card, onToggle, disabled }) => {
  // Define exactly 4 distinct patterns as CSS background images
  const patterns = [
    // 0: Concentric Rings (Topographic Harmony)
    'repeating-radial-gradient(circle at center, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 12px)',
    // 1: Floating Bubbles (Effervescence)
    'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 15%, transparent 16%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.15) 15%, transparent 16%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 8%, transparent 9%)',
    // 2: Retro Diagonal Stripes (Speed)
    'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.12) 10px, rgba(255,255,255,0.12) 12px)',
    // 3: Technical Grid (Blueprint)
    'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)'
  ];

  const backgroundSizes = [
    'auto',        // Concentric
    '32px 32px',   // Bubbles (increased spacing)
    'auto',        // Stripes
    '16px 16px'    // Grid (slightly larger mesh)
  ];

  // Ensure pattern index is always 0-3
  const safePatternIndex = Math.abs(card.patternIndex ?? 0) % 4;

  return (
    <div
      onClick={() => !disabled && onToggle(card.instanceId)}
      className={`
        relative flex flex-col items-center p-0.5 rounded-lg transition-all duration-300 cursor-pointer
        flex-1 min-w-0 max-w-[110px] h-full max-h-[220px]
        ${disabled ? 'opacity-80 grayscale-[0.2]' : 'hover:-translate-y-1 hover:brightness-110 active:scale-95'}
        ${card.isSelected ? 'z-20 -translate-y-[20px]' : 'z-0'}
      `}
    >
      {/* The Physical Card Body */}
      <div className={`
        w-full h-full rounded-lg border flex flex-col items-center justify-between p-1 shadow-xl overflow-hidden
        transition-all duration-300
        ${card.isSelected 
          ? 'bg-zinc-100 border-yellow-400 shadow-[0_10px_25px_rgba(250,204,21,0.5)]' 
          : 'bg-zinc-100 border-zinc-400 shadow-black/50'}
      `}>
        {/* Card Corners Decorations */}
        <div className={`absolute top-0.5 left-1 text-[8px] font-bold ${card.isSelected ? 'text-zinc-900' : 'text-zinc-500'}`}>
          {card.id}
        </div>
        <div className={`absolute bottom-0.5 right-1 text-[8px] font-bold ${card.isSelected ? 'text-zinc-900' : 'text-zinc-500'} rotate-180`}>
          {card.id}
        </div>

        {/* Inner Border/Pattern area */}
        <div className={`
          w-full h-full border border-zinc-200 rounded flex flex-col items-center p-0.5 relative
          ${card.isSelected ? 'border-yellow-200 bg-yellow-50/50' : ''}
        `}>
          {/* Main Color Swatch with Pattern Overlay */}
          <div
            className="w-full flex-grow rounded shadow-inner relative group min-h-0 overflow-hidden"
            style={{ 
              backgroundColor: card.hex,
              boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.25)'
            }}
          >
            {/* Pattern Layer - Ensuring every card has one of the 4 patterns */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: patterns[safePatternIndex],
                backgroundSize: backgroundSizes[safePatternIndex],
                opacity: 0.9
              }}
            />
            
            {/* Subtle Gradient Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/10 pointer-events-none" />
          </div>

          {/* Label Area */}
          <div className="w-full pt-1 text-center flex flex-col justify-center min-h-[28px] overflow-hidden">
            <span className={`
              text-[7px] md:text-[9px] font-black uppercase tracking-tighter leading-none truncate
              ${card.isSelected ? 'text-zinc-900' : 'text-zinc-600'}
            `}>
              {card.name}
            </span>
          </div>
        </div>
      </div>

      {/* Selection Seal */}
      {card.isSelected && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="w-6 h-6 rounded-full bg-yellow-500 border border-white flex items-center justify-center text-zinc-900 font-bold text-[10px] shadow-lg animate-bounce">
            ★
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
