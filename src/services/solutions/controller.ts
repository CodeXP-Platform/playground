import { http } from "../axios";

export class SolutionsController {
    public static async getSolutions(challengeId: string) {
        const data = await http.get(`/solutions/challenge/${challengeId}`);
        return data.data;
    }

    public static async updateSolution(solutionId: string, code: string) {
        const data = await http.put(`/solutions/${solutionId}`, { code });
        return data.data;
    }

    public static async submitSolution(solutionId: string, code: string) {
        const data = await http.post(`/solutions/${solutionId}/submit`, {
            code,
        });
        return data.data;
    }
}
