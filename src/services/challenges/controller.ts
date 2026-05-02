import { http } from "../axios";
import type { Challenge, CodeTemplate, TestCase } from "./types";

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

    public static async getCodeTemplates(
        challengeId: string,
    ): Promise<CodeTemplate[]> {
        const response = await http.get<CodeTemplate[]>(
            `/challenges/${challengeId}/code-templates`,
        );
        console.log("Response", response.data);
        return response.data;
    }

    public static async getTestsByCodeTemplateId(
        challengeId: string,
        codeTemplateId: string,
    ): Promise<TestCase[]> {
        const response = await http.get<TestCase[]>(
            `/challenges/${challengeId}/code-templates/${codeTemplateId}/test-cases`,
        );
        console.log("Response", response.data);
        return response.data;
    }
}
