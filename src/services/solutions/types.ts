export interface Solution {
    solutionId: string;
    challengeId: string;
    authorId: string;
    language: Language;
    code: string;
    status: string;
    maxAttempts: number;
    currentAttempts: number;
    remainingAttempts: number;
    attemptsResetAt: Date | null;
    updatedAt: string;
    createdAt: string;
}

export enum Language {
    PYTHON = "python",
    JAVASCRIPT = "javascript",
}
