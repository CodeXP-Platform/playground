export interface CodeReview {
    solutionId: string;
    userId: string;
    id: string;
    status: CodeReviewStatus;
    aiScore: number;
    feedback: string;
    suggestions: any;
    createdAt: Date;
}

export enum CodeReviewStatus {
    QUEUED = "QUEUED",
    GENERATING = "GENERATING",
    COMPLETED = "COMPLETED",
}
