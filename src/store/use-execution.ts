import type { SolutionSubmittedResponse } from "@/services/solutions/types";
import { create } from "zustand";

export interface ExecutionState {
    isSubmitting: boolean;
    executionStatus: string;
    executionResult: SolutionSubmittedResponse | null;
    setIsSubmitting: (isSubmitting: boolean) => void;
    setExecutionStatus: (status: string) => void;
    setExecutionResult: (result: SolutionSubmittedResponse) => void;
    reset: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
    isSubmitting: false,
    executionStatus: "",
    executionResult: null,
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setExecutionStatus: (executionStatus) => set({ executionStatus }),
    setExecutionResult: (executionResult) => set({ executionResult }),
    reset: () =>
        set({
            isSubmitting: false,
            executionStatus: "",
            executionResult: null,
        }),
}));
