import type { Solution } from "@/services/solutions/types";
import { create } from "zustand";

type PlaygroundState = {
    solutions: Solution[];
    currentSolution: Solution | null;
    setSolutions: (solutions: Solution[]) => void;
    setCurrentSolution: (solution: Solution | null) => void;
};

export const usePlayground = create<PlaygroundState>((set) => ({
    solutions: [],
    setSolutions: (solutions: Solution[]) => set({ solutions }),
    currentSolution: null,
    setCurrentSolution: (solution: Solution | null) =>
        set({ currentSolution: solution }),
}));
