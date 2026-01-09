import { ColorInfo, GoalType, GameGoal, Difficulty } from './types';

export const COLOR_WHEEL: ColorInfo[] = [
  { id: 0, name: 'Red', hex: '#FF0000' },
  { id: 1, name: 'Red-Orange', hex: '#FF4000' },
  { id: 2, name: 'Orange', hex: '#FF8000' },
  { id: 3, name: 'Yellow-Orange', hex: '#FFC000' },
  { id: 4, name: 'Yellow', hex: '#FFFF00' },
  { id: 5, name: 'Yellow-Green', hex: '#99CC33' },
  { id: 6, name: 'Green', hex: '#009933' },
  { id: 7, name: 'Blue-Green', hex: '#009999' },
  { id: 8, name: 'Blue', hex: '#0066FF' },
  { id: 9, name: 'Blue-Violet', hex: '#3333CC' },
  { id: 10, name: 'Violet', hex: '#660099' },
  { id: 11, name: 'Red-Violet', hex: '#CC0099' },
];

export const GAME_GOALS: GameGoal[] = [
  { 
    type: GoalType.COMPLEMENTARY, 
    label: 'Complementary Pair', 
    description: 'Find two colors exactly opposite (6 steps apart).', 
    basePoints: 12 
  },
  { 
    type: GoalType.ANALOGOUS, 
    label: 'Analogous Trio', 
    description: 'Find three sequential neighbors.', 
    basePoints: 18 
  },
  { 
    type: GoalType.TRIADIC, 
    label: 'Triadic Trio', 
    description: 'Find three colors equidistant (4 steps apart).', 
    basePoints: 25 
  },
  { 
    type: GoalType.SPLIT_COMPLEMENTARY, 
    label: 'Split Complementary', 
    description: 'Find a base plus the two colors adjacent to its complement.', 
    basePoints: 31 
  },
  { 
    type: GoalType.TETRADIC, 
    label: 'Tetradic Four', 
    description: 'Find four colors forming a square (3 steps apart each).', 
    basePoints: 50 
  },
];

export const DIFFICULTIES: Difficulty[] = [
  { name: 'Easy Deal', time: 60, multiplier: 0.75, colorClass: 'from-emerald-400 to-emerald-700' },
  { name: 'Real Deal', time: 45, multiplier: 1.0, colorClass: 'from-sky-400 to-sky-700' },
  { name: 'Color Pro', time: 30, multiplier: 1.5, colorClass: 'from-rose-500 to-rose-800' },
];