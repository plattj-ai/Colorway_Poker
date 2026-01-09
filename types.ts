export enum GoalType {
  COMPLEMENTARY = 'COMPLEMENTARY',
  ANALOGOUS = 'ANALOGOUS',
  TRIADIC = 'TRIADIC',
  TETRADIC = 'TETRADIC',
  SPLIT_COMPLEMENTARY = 'SPLIT_COMPLEMENTARY',
}

export interface ColorInfo {
  id: number;
  name: string;
  hex: string;
}

export interface CardInstance extends ColorInfo {
  instanceId: string;
  isSelected: boolean;
  patternIndex: number;
}

export interface GameGoal {
  type: GoalType;
  label: string;
  description: string;
  basePoints: number;
}

export interface Difficulty {
  name: string;
  time: number;
  multiplier: number;
  colorClass: string;
}