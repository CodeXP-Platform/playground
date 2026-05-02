export interface Solution {
    solutionId: string;
    challengeId: string;
    codeTemplateId: string;
    authorId: string;
    language: Language;
    code: string;
    status: ExecutionStatus;
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

export enum ExecutionStatus {
    DRAFT = "draft",
    PENDING = "pending",
    PASSED = "passed",
    FAILED = "failed",
}
