import { ChallengesController } from "@/services/challenges/controller";
import type { Challenge } from "@/services/challenges/types";
import { SolutionsController } from "@/services/solutions/controller";
import type { Solution } from "@/services/solutions/types";

export function playgroundLoaderData({
    request,
}: {
    request: Request;
}): PlaygroundLoaderData {
    const url = new URL(request.url);
    const challengeId = url.searchParams.get("challenge_id");

    if (!challengeId) {
        return {
            challengeId: null,
            challengePromise: null,
            solutionsPromise: null,
        };
    }

    return {
        challengeId,
        challengePromise: ChallengesController.getChallengeById(challengeId),
        solutionsPromise: SolutionsController.getSolutions(challengeId),
    };
}

export interface PlaygroundLoaderData {
    challengeId: string | null;
    challengePromise: Promise<Challenge> | null;
    solutionsPromise: Promise<Solution[]> | null;
}
