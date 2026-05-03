import { create } from "zustand";

export interface ExecutionState {
    isSubmitting: boolean;
    executionStatus: string;
    executionResult: unknown | null;
    codeAnalysisStatus: string;
    codeAnalysisResult: unknown | null;
    setIsSubmitting: (isSubmitting: boolean) => void;
    setExecutionStatus: (status: string) => void;
    setExecutionResult: (result: unknown) => void;
    setCodeAnalysisStatus: (status: string) => void;
    setCodeAnalysisResult: (result: unknown) => void;
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
