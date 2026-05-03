import { http } from "../axios";

export class CodeAnalysisController {
    public static async getCodeAnalysis(solutionId: string, attemptId: string) {
        const data = await http.get(
            `/api/v1/code-analysis/reviews/${solutionId}/attempts/${attemptId}`,
        );
        return data.data;
    }
}
