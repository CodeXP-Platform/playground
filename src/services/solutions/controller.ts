import { http } from "../axios";
import type { Solution, SolutionSubmittedResponse } from "./types";

export class SolutionsController {
    public static async getSolutions(challengeId: string) {
        const data = await http.get<Solution[]>(
            `/solutions/challenge/${challengeId}`,
        );
        return data.data;
    }

    public static async updateSolution(solutionId: string, code: string) {
        const data = await http.put(`/solutions/${solutionId}`, { code });
        return data.data;
    }

    public static async submitSolution(solutionId: string, code: string) {
        const data = await http.post<SolutionSubmittedResponse>(
            `/solutions/${solutionId}/submit`,
            {
                code,
            },
        );
        return data.data;
    }

    public static async getAttempt() {}
}
