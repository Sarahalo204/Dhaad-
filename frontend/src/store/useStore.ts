import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  xp: number;
  level: number;
  streak: number;
  wordsLearned: number;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  addWord: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      xp: 0,
      level: 1,
      streak: 1,
      wordsLearned: 0,
      addXP: (amount) => set((state) => {
        const newXP = state.xp + amount;
        const newLevel = Math.floor(newXP / 1000) + 1;
        return { xp: newXP, level: newLevel };
      }),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      addWord: () => set((state) => ({ wordsLearned: state.wordsLearned + 1 })),
    }),
    {
      name: 'dhaad-ai-storage', // unique name for localStorage key
    }
  )
);
