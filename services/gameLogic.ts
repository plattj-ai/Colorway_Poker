
import { GoalType, ValidationResult } from '../types';
import { COLOR_WHEEL } from '../constants';

/**
 * Validates selected indices against a goal.
 */
export const validateSelection = (
  goalType: GoalType,
  selectedIndices: number[]
): ValidationResult => {
  const count = selectedIndices.length;
  const sorted = [...selectedIndices].sort((a, b) => a - b);

  switch (goalType) {
    case GoalType.COMPLEMENTARY:
      if (count !== 2) return { isValid: false, message: "A complementary pair requires exactly 2 cards." };
      return Math.abs(sorted[0] - sorted[1]) === 6 
        ? { isValid: true, message: "Success! Perfect opposites." }
        : { isValid: false, message: "Incorrect. These colors are not opposite." };

    case GoalType.ANALOGOUS:
      if (count !== 3) return { isValid: false, message: "An analogous trio requires exactly 3 cards." };
      return checkIsAnalogous(sorted)
        ? { isValid: true, message: "Success! A sequential harmony." }
        : { isValid: false, message: "Incorrect. These colors are not neighbors." };

    case GoalType.TRIADIC:
      if (count !== 3) return { isValid: false, message: "A triadic set requires exactly 3 cards." };
      return (sorted[1] === sorted[0] + 4 && sorted[2] === sorted[1] + 4)
        ? { isValid: true, message: "Success! A perfectly balanced triad." }
        : { isValid: false, message: "Incorrect. These must be 4 steps apart." };

    case GoalType.SPLIT_COMPLEMENTARY:
      if (count !== 3) return { isValid: false, message: "Split Complementary requires exactly 3 cards." };
      return checkIsSplitComp(sorted)
        ? { isValid: true, message: "Success! A dynamic split harmony." }
        : { isValid: false, message: "Incorrect. Must be a base and neighbors of its complement." };

    case GoalType.TETRADIC:
      if (count !== 4) return { isValid: false, message: "A tetradic scheme requires exactly 4 cards." };
      return (sorted[1] === sorted[0] + 3 && sorted[2] === sorted[1] + 3 && sorted[3] === sorted[2] + 3)
        ? { isValid: true, message: "Success! A perfectly square tetrad." }
        : { isValid: false, message: "Incorrect. These must be 3 steps apart (Square)." };

    default:
      return { isValid: false, message: "Unknown goal type." };
  }
};

const checkIsAnalogous = (s: number[]) => {
  if (s[1] === s[0] + 1 && s[2] === s[1] + 1) return true;
  if (s[0] === 0 && s[1] === 10 && s[2] === 11) return true; // Wrap: 10, 11, 0
  if (s[0] === 0 && s[1] === 1 && s[2] === 11) return true;  // Wrap: 11, 0, 1
  return false;
};

const checkIsSplitComp = (s: number[]) => {
  // Try each card as the 'base'
  for (let i = 0; i < 3; i++) {
    const base = s[i];
    const others = s.filter((_, idx) => idx !== i);
    const complement = (base + 6) % 12;
    const split1 = (complement + 11) % 12; // -1
    const split2 = (complement + 1) % 12;  // +1
    
    if (others.includes(split1) && others.includes(split2)) return true;
  }
  return false;
};

/**
 * Finds a valid solution for the goal type in a given list of color IDs.
 */
export const findSolutionInHand = (goalType: GoalType, handIds: number[]): number[] | null => {
  const uniqueIds = Array.from(new Set(handIds));
  
  if (goalType === GoalType.COMPLEMENTARY) {
    for (let i = 0; i < uniqueIds.length; i++) {
      for (let j = i + 1; j < uniqueIds.length; j++) {
        const sorted = [uniqueIds[i], uniqueIds[j]].sort((a, b) => a - b);
        if (Math.abs(sorted[0] - sorted[1]) === 6) return sorted;
      }
    }
  } else if (goalType === GoalType.ANALOGOUS) {
    for (let i = 0; i < uniqueIds.length; i++) {
      for (let j = i + 1; j < uniqueIds.length; j++) {
        for (let k = j + 1; k < uniqueIds.length; k++) {
          const sorted = [uniqueIds[i], uniqueIds[j], uniqueIds[k]].sort((a, b) => a - b);
          if (checkIsAnalogous(sorted)) return sorted;
        }
      }
    }
  } else if (goalType === GoalType.TRIADIC) {
    for (let i = 0; i < uniqueIds.length; i++) {
      for (let j = i + 1; j < uniqueIds.length; j++) {
        for (let k = j + 1; k < uniqueIds.length; k++) {
          const sorted = [uniqueIds[i], uniqueIds[j], uniqueIds[k]].sort((a, b) => a - b);
          if (sorted[1] === sorted[0] + 4 && sorted[2] === sorted[1] + 4) return sorted;
        }
      }
    }
  } else if (goalType === GoalType.SPLIT_COMPLEMENTARY) {
    for (let i = 0; i < uniqueIds.length; i++) {
      for (let j = i + 1; j < uniqueIds.length; j++) {
        for (let k = j + 1; k < uniqueIds.length; k++) {
          const sorted = [uniqueIds[i], uniqueIds[j], uniqueIds[k]].sort((a, b) => a - b);
          if (checkIsSplitComp(sorted)) return sorted;
        }
      }
    }
  } else if (goalType === GoalType.TETRADIC) {
    for (let i = 0; i < uniqueIds.length; i++) {
      for (let j = i + 1; j < uniqueIds.length; j++) {
        for (let k = j + 1; k < uniqueIds.length; k++) {
          for (let l = k + 1; l < uniqueIds.length; l++) {
            const sorted = [uniqueIds[i], uniqueIds[j], uniqueIds[k], uniqueIds[l]].sort((a, b) => a - b);
            if (sorted[1] === sorted[0] + 3 && sorted[2] === sorted[1] + 3 && sorted[3] === sorted[2] + 3) return sorted;
          }
        }
      }
    }
  }
  return null;
};
