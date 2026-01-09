import React, { useState, useEffect, useCallback, useRef } from 'react';
import { COLOR_WHEEL, GAME_GOALS, DIFFICULTIES } from './constants';
import { GoalType, CardInstance, Difficulty, GameGoal } from './types';
import { validateSelection } from './services/gameLogic';
import { Card } from './components/Card';
import { ColorWheel } from './components/ColorWheel';

export default function App() {
  const [score, setScore] = useState(300);
  const [currentGoal, setCurrentGoal] = useState<GameGoal>(GAME_GOALS[0]);
  const [hand, setHand] = useState<CardInstance[]>([]);
  const [feedback, setFeedback] = useState<{ isValid: boolean; message: string } | null>(null);
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING' | 'FINISHED'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentDiff, setCurrentDiff] = useState<Difficulty>(DIFFICULTIES[1]);
  // Fixed: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateHand = useCallback((goal: GameGoal) => {
    const randomId = Math.floor(Math.random() * 12);
    let ids: number[] = [];
    
    // Ensure at least one solution exists in the hand
    if (goal.type === GoalType.COMPLEMENTARY) ids = [randomId, (randomId + 6) % 12];
    else if (goal.type === GoalType.ANALOGOUS) ids = [randomId, (randomId + 1) % 12, (randomId + 2) % 12];
    else if (goal.type === GoalType.TRIADIC) ids = [randomId, (randomId + 4) % 12, (randomId + 8) % 12];
    else if (goal.type === GoalType.SPLIT_COMPLEMENTARY) {
        const comp = (randomId + 6) % 12;
        ids = [randomId, (comp + 11) % 12, (comp + 1) % 12];
    }
    else ids = [randomId, (randomId + 3) % 12, (randomId + 6) % 12, (randomId + 9) % 12];

    const newHand: CardInstance[] = ids.map((id, i) => ({ 
      ...COLOR_WHEEL[id], 
      instanceId: `sol-${i}-${Date.now()}`, 
      isSelected: false, 
      patternIndex: i 
    }));

    while (newHand.length < 7) {
      const rId = Math.floor(Math.random() * 12);
      newHand.push({ 
        ...COLOR_WHEEL[rId], 
        instanceId: `fill-${newHand.length}-${Date.now()}`, 
        isSelected: false, 
        patternIndex: Math.floor(Math.random() * 4) 
      });
    }
    setHand(newHand.sort(() => Math.random() - 0.5));
  }, []);

  const dealHand = (difficulty: Difficulty) => {
    setFeedback(null);
    setCurrentDiff(difficulty);
    setTimeLeft(difficulty.time);
    const randomGoal = GAME_GOALS[Math.floor(Math.random() * GAME_GOALS.length)];
    setCurrentGoal(randomGoal);
    generateHand(randomGoal);
    setGameStatus('PLAYING');
  };

  useEffect(() => {
    if (gameStatus === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => { 
          if (t <= 1) { 
            if (timerRef.current) clearInterval(timerRef.current); 
            setGameStatus('FINISHED'); 
            setFeedback({ isValid: false, message: "TIME UP! Bust." }); 
            return 0; 
          } 
          return t - 1; 
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameStatus]);

  const handleSubmit = () => {
    const selected = hand.filter(c => c.isSelected).map(c => c.id);
    const result = validateSelection(currentGoal.type, selected);
    
    if (result.isValid) {
      const gain = Math.round((currentGoal.basePoints + timeLeft) * currentDiff.multiplier);
      setScore(s => s + gain);
      setFeedback({ ...result, message: `WIN! +$${gain}. ${result.message}` });
    } else {
      const penalty = Math.round(50 * currentDiff.multiplier);
      setScore(s => Math.max(0, s - penalty));
      setFeedback({ ...result, message: `BUST! -$${penalty}. ${result.message}` });
    }
    setGameStatus('FINISHED');
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-between p-4 bg-transparent relative overflow-hidden">
      <header className="w-full max-w-4xl flex flex-col items-center gap-2">
        <h1 className="vegas-title text-3xl md:text-5xl font-bold italic text-yellow-500 text-center">COLORWAY <span className="text-white">POKER</span></h1>
        <div className="flex w-full justify-between items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="text-center flex-1">
            <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Bankroll</div>
            <div className="text-2xl font-black tabular-nums">${score}</div>
          </div>
          <ColorWheel />
          <div className="text-center flex-1">
            <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Timer</div>
            <div className={`text-2xl font-black tabular-nums ${timeLeft <= 10 && gameStatus === 'PLAYING' ? 'text-red-500 animate-pulse' : ''}`}>
              :{timeLeft < 10 ? '0'+timeLeft : timeLeft}
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-lg text-center">
        <div className="text-[10px] bg-yellow-500 text-zinc-900 rounded-full px-2 py-0.5 font-bold uppercase mb-1 inline-block">Objective</div>
        <h2 className="text-xl font-black uppercase tracking-tight">{gameStatus === 'IDLE' ? 'Ready to Bet?' : currentGoal.label}</h2>
        <p className="text-xs text-zinc-400 italic">"{gameStatus === 'IDLE' ? 'Select a difficulty to deal.' : currentGoal.description}"</p>
      </div>

      <main className="w-full max-w-5xl flex-1 flex items-center justify-center py-[10px] min-h-0">
        {gameStatus === 'IDLE' ? (
          <div className="text-zinc-500 uppercase font-black animate-pulse tracking-widest">Choose your level...</div>
        ) : (
          <div className="flex gap-2 w-full justify-center h-full max-h-[220px]">
            {hand.map(c => (
              <Card 
                key={c.instanceId} 
                card={c} 
                onToggle={(id) => setHand(h => h.map(card => card.instanceId === id ? {...card, isSelected: !card.isSelected} : card))} 
                disabled={gameStatus !== 'PLAYING'} 
              />
            ))}
          </div>
        )}
      </main>

      <footer className="w-full max-w-2xl flex flex-col gap-3 pb-4">
        <div className={`p-2 rounded-xl border-2 text-center text-sm font-bold transition-all min-h-[44px] flex items-center justify-center ${feedback ? (feedback.isValid ? 'bg-green-600/20 border-green-500 text-green-300' : 'bg-red-600/20 border-red-500 text-red-300') : 'bg-black/20 border-zinc-700 text-zinc-500'}`}>
          {feedback ? feedback.message : gameStatus === 'IDLE' ? "Pick a level to begin." : "Select your cards and submit."}
        </div>
        
        {gameStatus === 'PLAYING' ? (
          <button 
            onClick={handleSubmit} 
            disabled={hand.filter(c => c.isSelected).length === 0} 
            className="w-full py-4 bg-gradient-to-b from-yellow-400 to-orange-600 rounded-2xl text-zinc-950 font-black text-xl shadow-xl active:scale-95 disabled:opacity-50 transition-all uppercase tracking-widest"
          >
            PLAY HAND
          </button>
        ) : (
          <div className="flex gap-2">
            {DIFFICULTIES.map(d => (
              <button 
                key={d.name} 
                onClick={() => dealHand(d)} 
                className={`flex-1 py-4 rounded-xl font-black text-xs bg-gradient-to-b ${d.colorClass} shadow-lg active:translate-y-1 transition-all uppercase text-white`}
              >
                {d.name} 
                <span className="opacity-70 block text-[9px]">x{d.multiplier} Pay</span>
              </button>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
}
