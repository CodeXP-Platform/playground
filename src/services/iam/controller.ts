const STUDENT_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZTBmZjA1Zi0yYjJlLTRkOTItYmQwOS04MGRlMGY1Nzc5NzMiLCJuaWNrbmFtZSI6IlJPTEVfU1RVREVOVCIsImVtYWlsIjoicm9sZV9zdHVkZW50QGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc3NzUxNDQ1MSwiZXhwIjoxNzc3NTE4MDUxfQ.DGeIFgkaO5nXmgmCP41bcdIhZDsdnY5e0C3NzwjXxgI";

export class IamController {
    public static async login(accessToken: string) {
        return { jwt: STUDENT_TOKEN };
    }
}
