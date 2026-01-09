// Fixed: Removed COLOR_WHEEL from types import as it is unused and located in constants
import { GoalType } from '../types';

export const checkIsAnalogous = (s: number[]) => {
  const sorted = [...s].sort((a, b) => a - b);
  // Standard consecutive
  if (sorted[1] === sorted[0] + 1 && sorted[2] === sorted[1] + 1) return true;
  // Wraparound cases: 11-0-1 or 10-11-0
  if (sorted[0] === 0 && sorted[1] === 10 && sorted[2] === 11) return true;
  if (sorted[0] === 0 && sorted[1] === 1 && sorted[2] === 11) return true;
  return false;
};

export const checkIsSplitComp = (s: number[]) => {
  for (let i = 0; i < 3; i++) {
    const base = s[i];
    const others = s.filter((_, idx) => idx !== i);
    const complement = (base + 6) % 12;
    const split1 = (complement + 11) % 12;
    const split2 = (complement + 1) % 12;
    if (others.includes(split1) && others.includes(split2)) return true;
  }
  return false;
};

export const validateSelection = (goalType: GoalType, selectedIndices: number[]) => {
  const count = selectedIndices.length;
  const sorted = [...selectedIndices].sort((a, b) => a - b);

  switch (goalType) {
    case GoalType.COMPLEMENTARY:
      return count === 2 && Math.abs(sorted[0] - sorted[1]) === 6 
        ? { isValid: true, message: "Perfect opposites!" } 
        : { isValid: false, message: "Not a complementary pair." };
    
    case GoalType.ANALOGOUS:
      return count === 3 && checkIsAnalogous(sorted)
        ? { isValid: true, message: "Harmonious neighbors!" } 
        : { isValid: false, message: "Not an analogous trio." };
    
    case GoalType.TRIADIC:
      return count === 3 && (sorted[1] === sorted[0] + 4 && sorted[2] === sorted[1] + 4)
        ? { isValid: true, message: "Balanced triad!" } 
        : { isValid: false, message: "Not a triadic set." };
    
    case GoalType.SPLIT_COMPLEMENTARY:
      return count === 3 && checkIsSplitComp(sorted)
        ? { isValid: true, message: "Split-harmony found!" } 
        : { isValid: false, message: "Not split complementary." };
    
    case GoalType.TETRADIC:
      return count === 4 && (sorted[1] === sorted[0] + 3 && sorted[2] === sorted[1] + 3 && sorted[3] === sorted[2] + 3)
        ? { isValid: true, message: "Perfect square tetrad!" } 
        : { isValid: false, message: "Not a tetradic set." };
        
    default:
      return { isValid: false, message: "Unknown harmony type." };
  }
};