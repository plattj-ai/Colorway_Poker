
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { COLOR_WHEEL, GAME_GOALS } from './constants';
import { CardState, GameGoal, GoalType, ValidationResult } from './types';
import { validateSelection, findSolutionInHand } from './services/gameLogic';
import Card from './components/Card';
import ColorWheel from './components/ColorWheel';

type GameStatus = 'IDLE' | 'PLAYING' | 'FINISHED';

interface Difficulty {
  name: string;
  time: number;
  multiplier: number;
  colorClass: string;
}

const DIFFICULTIES: Difficulty[] = [
  { name: 'Easy Deal', time: 60, multiplier: 0.75, colorClass: 'from-emerald-400 to-emerald-700' },
  { name: 'Real Deal', time: 45, multiplier: 1.0, colorClass: 'from-sky-400 to-sky-700' },
  { name: 'Color Pro', time: 30, multiplier: 1.5, colorClass: 'from-rose-500 to-rose-800' },
];

const App: React.FC = () => {
  const [score, setScore] = useState(300);
  const [currentGoal, setCurrentGoal] = useState<GameGoal>(GAME_GOALS[0]);
  const [hand, setHand] = useState<CardState[]>([]);
  const [feedback, setFeedback] = useState<ValidationResult | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('IDLE');
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(DIFFICULTIES[1]);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateHand = useCallback((goal: GameGoal) => {
    const randomColorId = Math.floor(Math.random() * 12);
    let solutionIds: number[] = [];

    switch (goal.type) {
      case GoalType.COMPLEMENTARY:
        solutionIds = [randomColorId, (randomColorId + 6) % 12];
        break;
      case GoalType.ANALOGOUS:
        solutionIds = [randomColorId, (randomColorId + 1) % 12, (randomColorId + 2) % 12];
        break;
      case GoalType.TRIADIC:
        solutionIds = [randomColorId, (randomColorId + 4) % 12, (randomColorId + 8) % 12];
        break;
      case GoalType.SPLIT_COMPLEMENTARY:
        const comp = (randomColorId + 6) % 12;
        solutionIds = [randomColorId, (comp + 11) % 12, (comp + 1) % 12];
        break;
      case GoalType.TETRADIC:
        solutionIds = [randomColorId, (randomColorId + 3) % 12, (randomColorId + 6) % 12, (randomColorId + 9) % 12];
        break;
    }

    const newHand: CardState[] = [];
    solutionIds.forEach((id, i) => {
      const color = COLOR_WHEEL[id];
      newHand.push({
        ...color,
        instanceId: `card-sol-${i}-${Date.now()}-${Math.random()}`,
        isSelected: false,
        patternIndex: Math.floor(Math.random() * 4), // 0, 1, 2, or 3
      });
    });

    while (newHand.length < 7) {
      const randId = Math.floor(Math.random() * 12);
      const color = COLOR_WHEEL[randId];
      newHand.push({
        ...color,
        instanceId: `card-fill-${newHand.length}-${Date.now()}-${Math.random()}`,
        isSelected: false,
        patternIndex: Math.floor(Math.random() * 4),
      });
    }

    setHand(newHand.sort(() => Math.random() - 0.5));
  }, []);

  const dealHand = (difficulty: Difficulty) => {
    setFeedback(null);
    setTimeLeft(difficulty.time);
    setCurrentDifficulty(difficulty);
    
    const possibleGoals = GAME_GOALS.filter(g => g.type !== currentGoal.type);
    const randomGoal = possibleGoals[Math.floor(Math.random() * possibleGoals.length)];
    
    setCurrentGoal(randomGoal);
    generateHand(randomGoal);
    setGameStatus('PLAYING');
  };

  useEffect(() => {
    if (gameStatus !== 'PLAYING') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameStatus]);

  const handleTimeout = () => {
    const solution = findSolutionInHand(currentGoal.type, hand.map(c => c.id));
    const solutionNames = solution ? solution.map(id => COLOR_WHEEL[id].name).join(', ') : "Error";
    const penalty = Math.round(100 * currentDifficulty.multiplier);
    setScore(prev => Math.max(0, prev - penalty));
    setFeedback({ isValid: false, message: `TIMEOUT! -${penalty}. Correct: ${solutionNames}` });
    setGameStatus('FINISHED');
  };

  const handleToggleCard = (instanceId: string) => {
    if (gameStatus !== 'PLAYING') return;
    setHand(prev => prev.map(card => card.instanceId === instanceId ? { ...card, isSelected: !card.isSelected } : card));
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (gameStatus !== 'PLAYING') return;
    const selectedIndices = hand.filter(c => c.isSelected).map(c => c.id);
    const result = validateSelection(currentGoal.type, selectedIndices);

    if (result.isValid) {
      const speedBonus = timeLeft * 1.25;
      const rawGain = Math.round((currentGoal.basePoints + speedBonus) * currentDifficulty.multiplier);
      // HARD CAP AT $100
      const totalGain = Math.min(rawGain, 100);
      
      setScore(prev => prev + totalGain);
      setFeedback({ ...result, message: `JACKPOT! +${totalGain}. ${result.message}` });
      setGameStatus('FINISHED');
    } else {
      const solution = findSolutionInHand(currentGoal.type, hand.map(c => c.id));
      const solutionNames = solution ? solution.map(id => COLOR_WHEEL[id].name).join(', ') : "None";
      const penalty = Math.round(100 * currentDifficulty.multiplier);
      setScore(prev => Math.max(0, prev - penalty));
      setFeedback({ isValid: false, message: `BUST! -${penalty}. Right choice: ${solutionNames}` });
      setGameStatus('FINISHED');
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-between p-2 md:p-6 overflow-hidden relative">
      <div className="absolute inset-2 md:inset-4 border-[8px] md:border-[12px] border-zinc-900/40 pointer-events-none rounded-[32px] md:rounded-[48px]" />

      <header className="w-full max-w-5xl z-10 flex flex-col items-center gap-1 shrink-0">
        <h1 className="vegas-title text-2xl md:text-5xl font-bold italic tracking-tighter text-yellow-500 drop-shadow-md leading-none">
          COLORWAY <span className="text-zinc-100">POKER</span>
        </h1>
        
        <div className="flex items-center justify-between w-full mt-2 gap-4 max-w-3xl">
          <div className="flex-1 text-center bg-black/30 p-2 rounded-xl border border-zinc-800/50">
            <div className="text-yellow-500/80 text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none mb-1">Bankroll</div>
            <div className="text-xl md:text-3xl font-black text-white tabular-nums leading-none">
              ${score.toLocaleString()}
            </div>
          </div>
          
          <div className="shrink-0 scale-75 md:scale-100">
            <ColorWheel />
          </div>

          <div className="flex-1 text-center bg-black/30 p-2 rounded-xl border border-zinc-800/50">
            <div className="text-yellow-500/80 text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none mb-1">Timer</div>
            <div className={`text-xl md:text-3xl font-black tabular-nums leading-none ${timeLeft <= 10 && gameStatus === 'PLAYING' ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              :{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-xl z-10 bg-black/60 backdrop-blur-md px-4 py-2 md:py-3 rounded-2xl border border-yellow-500/30 shadow-xl flex flex-col items-center text-center mt-2 shrink-0 overflow-hidden relative">
        {gameStatus === 'PLAYING' && (
          <div className="absolute bottom-0 left-0 h-0.5 bg-yellow-500 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / currentDifficulty.time) * 100}%` }} />
        )}
        <div className="px-2 py-0.5 bg-yellow-500 text-zinc-900 rounded-full text-[8px] font-bold uppercase tracking-wider mb-1">
          {gameStatus === 'IDLE' ? 'CHOOSE DIFFICULTY' : 'Objective'}
        </div>
        <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight leading-tight">
          {gameStatus === 'IDLE' ? 'Ready to Bet?' : currentGoal.label}
        </h2>
        {gameStatus !== 'IDLE' && (
          <p className="text-zinc-400 text-[10px] md:text-xs italic truncate w-full">"{currentGoal.description}"</p>
        )}
      </div>

      <main className="w-full max-w-4xl z-10 flex-1 min-h-0 flex items-center justify-center my-2 px-1">
        {gameStatus === 'IDLE' ? (
          <div className="text-zinc-600 uppercase tracking-widest font-black text-sm md:text-lg animate-pulse text-center">
            Pick a level to see your hand...
          </div>
        ) : (
          <div className="flex w-full justify-between items-center gap-1 md:gap-2 h-full max-h-[260px]">
            {hand.map((card) => (
              <Card key={card.instanceId} card={card} onToggle={handleToggleCard} disabled={gameStatus === 'FINISHED'} />
            ))}
          </div>
        )}
      </main>

      <footer className="w-full max-w-2xl z-10 flex flex-col items-center gap-2 shrink-0 pb-2">
        <div className={`min-h-[40px] md:min-h-[50px] w-full flex items-center justify-center px-4 py-1 rounded-xl border-2 transition-all duration-300
          ${feedback ? (feedback.isValid ? 'bg-green-600/20 border-green-500 text-green-300' : 'bg-red-600/20 border-red-500 text-red-300') : 'bg-black/40 border-zinc-700/50 text-zinc-500'}`}>
          <p className="text-center font-bold tracking-tight text-[11px] md:text-sm italic leading-tight">
            {feedback ? feedback.message : gameStatus === 'IDLE' ? "Select a difficulty to deal cards." : "Select your colors..."}
          </p>
        </div>

        {gameStatus === 'PLAYING' ? (
          <button onClick={handleSubmit} disabled={hand.filter(c => c.isSelected).length === 0}
            className={`w-full py-3 md:py-4 rounded-2xl text-lg md:text-xl font-black tracking-widest transition-all relative overflow-hidden
              ${hand.filter(c => c.isSelected).length === 0 ? 'bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed' : 'bg-gradient-to-b from-yellow-400 via-yellow-500 to-orange-600 text-zinc-950 shadow-lg border-t border-white/40 hover:scale-[1.02] active:scale-95'}`}>
            <span className="relative z-10 uppercase">PLAY HAND</span>
          </button>
        ) : (
          <div className="flex gap-2 w-full">
            {DIFFICULTIES.map((diff) => (
              <button 
                key={diff.name}
                onClick={() => dealHand(diff)} 
                className={`flex-1 py-3 md:py-4 rounded-xl text-[10px] md:text-xs lg:text-sm font-black tracking-widest bg-gradient-to-b ${diff.colorClass} text-white border-b-4 border-black/30 shadow-lg hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all uppercase flex flex-col items-center justify-center leading-none gap-1`}
              >
                <span>{diff.name}</span>
                <span className="opacity-70 text-[8px] md:text-[10px]">x{diff.multiplier} Pay</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-1 p-1 bg-black/40 rounded-full border border-zinc-800/50 scale-90">
           {COLOR_WHEEL.map(c => <div key={c.id} className="w-2 h-2 rounded-full border border-white/5" style={{backgroundColor: c.hex}} title={c.name} />)}
        </div>
      </footer>
    </div>
  );
};

export default App;
