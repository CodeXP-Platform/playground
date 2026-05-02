import { ChallengesController } from "@/services/challenges/controller";
import type { Challenge, TestCase } from "@/services/challenges/types";
import { SolutionsController } from "@/services/solutions/controller";
import type { Solution } from "@/services/solutions/types";

export function playgroundLoaderData({
    request,
}: {
    request: Request;
}): PlaygroundLoaderData {
    const url = new URL(request.url);
    const challengeId = url.searchParams.get("challenge");
    const codeTemplateId = url.searchParams.get("code_template");

    if (!challengeId || !codeTemplateId) {
        return {
            challengeId: null,
            codeTemplateId: null,
            challengePromise: null,
            solutionsPromise: null,
            testsPromise: null,
        };
    }

    return {
        challengeId,
        codeTemplateId,
        challengePromise: ChallengesController.getChallengeById(challengeId),
        solutionsPromise: SolutionsController.getSolutions(challengeId),
        testsPromise: ChallengesController.getTestsByCodeTemplateId(
            challengeId,
            codeTemplateId,
        ),
    };
}

export interface PlaygroundLoaderData {
    challengeId: string | null;
    codedbTemplateId: string | null;
    challengePromise: Promise<Challenge> | null;
    solutionsPromise: Promise<Solution[]> | null;
    testsPromise: Promise<TestCase[]> | null;
}
