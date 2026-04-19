export interface JwtPayload {
    sub: string;
    email: string;
    nickname: string;
    role: string;
    iat: number;
    exp: number;
}

export enum Role {
    ADMIN = "ROLE_ADMIN",
    STUDENT = "ROLE_STUDENT",
    TEACHER = "ROLE_TEACHER",
}
