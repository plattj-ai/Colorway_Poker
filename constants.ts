
import { ColorInfo, GameGoal, GoalType } from './types';

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
    description: 'Find two colors exactly opposite on the wheel (6 steps apart).',
    basePoints: 12,
  },
  {
    type: GoalType.ANALOGOUS,
    label: 'Analogous Trio',
    description: 'Find three sequential neighbors on the wheel.',
    basePoints: 18,
  },
  {
    type: GoalType.TRIADIC,
    label: 'Triadic Trio',
    description: 'Find three colors equidistant (4 steps apart).',
    basePoints: 25,
  },
  {
    type: GoalType.SPLIT_COMPLEMENTARY,
    label: 'Split Complementary Trio',
    description: 'Find one color plus the two colors adjacent to its complement.',
    basePoints: 31,
  },
  {
    type: GoalType.TETRADIC,
    label: 'Tetradic Four',
    description: 'Find four colors forming a square (3 steps apart each).',
    basePoints: 50,
  },
];
