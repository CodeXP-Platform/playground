import { http } from "../axios";
import type { ExchangeTemporalTokenResponse } from "./types";

const tokens = {
    STUDENT_TOKEN:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODYyYjZmMC1kMTU1LTRmMTEtOGE2My1hYjM2OWI2MDZjNzQiLCJuaWNrbmFtZSI6IlJPTEVfU1RVREVOVCIsImVtYWlsIjoicm9sZV9zdHVkZW50QGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc3ODY0MTU5OSwiZXhwIjoxNzc5MjQ2Mzk5fQ.b5rkb6kz1vVDfaEs0LTBqMgTgSBAZwXsj735UoqCSWg",
    TEACHER_TOKEN:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODYyYjZmMC1kMTU1LTRmMTEtOGE2My1hYjM2OWI2MDZjNzQiLCJuaWNrbmFtZSI6IlJPTEVfVEVBQ0hFUiIsImVtYWlsIjoicm9sZV90ZWFjaGVyQGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfVEVBQ0hFUiIsImlhdCI6MTc3ODY0MTU5OSwiZXhwIjoxNzc5MjQ2Mzk5fQ.W6qZnvH2MjZabX9jDwPck-yBv_CVqo_otd5ksnDjnKU",
    ADMIN_TOKEN:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODYyYjZmMC1kMTU1LTRmMTEtOGE2My1hYjM2OWI2MDZjNzQiLCJuaWNrbmFtZSI6IlJPTEVfQURNSU4iLCJlbWFpbCI6InJvbGVfYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiUk9MRV9BRE1JTiIsImlhdCI6MTc3ODY0MTU5OSwiZXhwIjoxNzc5MjQ2Mzk5fQ.1hanFvNs6uw1AJnfu1QfrsgHYcEzEkZN__X2wcMCAZ4",
};

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
