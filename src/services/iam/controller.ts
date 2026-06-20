import { http } from "../axios";
import type { ExchangeTemporalTokenResponse } from "./types";

export class IamController {
    public static async login(accessToken: string) {
        const data = await http.post<ExchangeTemporalTokenResponse>(
            "/iam/auth/exchange-temporal-token",
            {
                temporalToken: accessToken,
            },
        );

        console.log("data", data.data);
        return { jwt: data.data.accessToken };
    }
}
