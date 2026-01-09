import React from 'react';
import { CardInstance } from '../types';

interface CardProps {
  card: CardInstance;
  onToggle: (id: string) => void;
  disabled: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onToggle, disabled }) => {
  const patterns = [
    'repeating-radial-gradient(circle at center, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 12px)',
    'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 15%, transparent 16%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 15%, transparent 16%)',
    'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 12px)',
    'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)'
  ];
  const safePatternIndex = Math.abs(card.patternIndex || 0) % 4;

  return (
    <div 
      onClick={() => !disabled && onToggle(card.instanceId)}
      className={`relative flex flex-col items-center p-0.5 rounded-lg transition-all duration-300 cursor-pointer flex-1 min-w-0 max-w-[110px] h-full max-h-[200px] ${disabled ? 'opacity-80' : 'hover:-translate-y-1 active:scale-95'} ${card.isSelected ? 'z-20 -translate-y-4' : 'z-0'}`}
    >
      <div className={`w-full h-full rounded-lg border flex flex-col items-center justify-between p-1 shadow-xl overflow-hidden transition-all duration-300 ${card.isSelected ? 'bg-white border-yellow-400 shadow-[0_10px_20px_rgba(250,204,21,0.4)]' : 'bg-zinc-100 border-zinc-400'}`}>
        <div className="w-full flex-grow rounded shadow-inner relative overflow-hidden" style={{ backgroundColor: card.hex }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: patterns[safePatternIndex], backgroundSize: '32px 32px' }} />
        </div>
        <div className="w-full pt-1 text-center min-h-[20px]">
          <span className={`text-[8px] md:text-[9px] font-black uppercase truncate block ${card.isSelected ? 'text-zinc-900' : 'text-zinc-600'}`}>{card.name}</span>
        </div>
      </div>
      {card.isSelected && (
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-yellow-500 border border-white flex items-center justify-center text-[10px] shadow-lg animate-bounce text-zinc-900 font-bold">
          ★
        </div>
      )}
    </div>
  );
};