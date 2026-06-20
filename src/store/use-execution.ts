import { create } from "zustand";
import type { CodeReview } from "@/services/code-analysis/types";

export interface ExecutionState {
    isSubmitting: boolean;
    executionStatus: string;
    executionResult: unknown | null;
    codeAnalysisStatus: string;
    codeAnalysisResult: CodeReview | null;
    setIsSubmitting: (isSubmitting: boolean) => void;
    setExecutionStatus: (status: string) => void;
    setExecutionResult: (result: unknown) => void;
    setCodeAnalysisStatus: (status: string) => void;
    setCodeAnalysisResult: (result: CodeReview | null) => void;
    reset: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
    isSubmitting: false,
    executionStatus: "",
    executionResult: null,
    codeAnalysisStatus: "",
    codeAnalysisResult: null,
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setExecutionStatus: (executionStatus) => set({ executionStatus }),
    setExecutionResult: (executionResult) => set({ executionResult }),
    setCodeAnalysisStatus: (codeAnalysisStatus) => set({ codeAnalysisStatus }),
    setCodeAnalysisResult: (codeAnalysisResult) => set({ codeAnalysisResult }),
    reset: () =>
        set({
            isSubmitting: false,
            executionStatus: "",
            executionResult: null,
            codeAnalysisStatus: "",
            codeAnalysisResult: null,
        }),
}));
