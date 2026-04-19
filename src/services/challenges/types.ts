export interface Challenge {
    challengeId: string;
    title: string;
    description: string;
    authorId: string;
    difficulty: number;
    rewardPoints: number;
    isPublished: boolean;
    updatedAt: string;
    createdAt: string;
}
