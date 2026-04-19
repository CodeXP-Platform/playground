import { http } from "../axios";
import type { Challenge } from "./types";

export class ChallengesController {
    public static async getChallengeById(
        challengeId: string,
    ): Promise<Challenge> {
        const response = await http.get<Challenge>(
            `/challenges/${challengeId}`,
        );
        console.log("Response", response.data);
        return response.data;
    }
}
