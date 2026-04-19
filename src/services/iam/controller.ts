const STUDENT_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NTk4ZTI3OC02NWI2LTRkMTgtODg5NC01ZGU4ODAyOTBjNTMiLCJuaWNrbmFtZSI6IlJPTEVfU1RVREVOVCIsImVtYWlsIjoicm9sZV9zdHVkZW50QGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc3NjUzOTIzNiwiZXhwIjoxNzc2NjI1NjM2fQ.LrfcNRPCymm6sOQ3OWFdrPC_Xl0YpSKVgDtTdRUTI0k";

export class IamController {
    public static async login(accessToken: string) {
        return { jwt: STUDENT_TOKEN };
    }
}
