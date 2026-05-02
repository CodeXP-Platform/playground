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

export interface CodeTemplate {
    codeTemplateId: string;
    challengeId: string;
    entryFunctionName: string;
    language: string;
    templateCode: string;
    updatedAt: string;
    createdAt: string;
}

export interface TestCase {
    testCaseId: string;
    challengeId: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    updatedAt: string;
    createdAt: string;
}
