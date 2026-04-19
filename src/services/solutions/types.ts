export interface Solution {
    solutionId: string;
    challengeId: string;
    authorId: string;
    language: string;
    code: string;
    status: string;
    maxAttempts: number;
    currentAttempts: number;
    remainingAttempts: number;
    attemptsResetAt: Date | null;
    updatedAt: string;
    createdAt: string;
}
