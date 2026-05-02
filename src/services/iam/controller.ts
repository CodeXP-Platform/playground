const STUDENT_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OWNmMGIyNC0xZDE2LTQ2NmEtYmIwOC1kY2VlMmI1NmIyNDUiLCJuaWNrbmFtZSI6IlJPTEVfU1RVREVOVCIsImVtYWlsIjoicm9sZV9zdHVkZW50QGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc3NzczODU4MCwiZXhwIjoxNzc3NzQyMTgwfQ.t0iPDrF19O2SROPzeW127pcmxRu2oWUcypXfQGUYKLk";

export class IamController {
    public static async login(accessToken: string) {
        return { jwt: STUDENT_TOKEN };
    }
}
