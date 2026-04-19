import { http } from "../axios";

export class SolutionsController {
    public static async getSolutions(challengeId: string) {
        const data = await http.get(`/solutions/challenge/${challengeId}`);
        return data.data;
    }
}
