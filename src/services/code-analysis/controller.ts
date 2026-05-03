import { http } from "../axios";
import type { CodeReview } from "./types";

export class CodeAnalysisController {
    public static async getCodeAnalysis(solutionId: string, attemptId: string) {
        const data = await http.get<CodeReview>(
            `/code-analysis/reviews/${solutionId}/attempts/${attemptId}`,
        );
        return data.data;
    }
}
