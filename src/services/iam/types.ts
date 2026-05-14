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

export enum AuthProvider {
    EMAIL = "EMAIL",
}

export interface ExchangeTemporalTokenResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    user: {
        id: string;
        email: string;
        nickname: string;
        picture: string;
        role: Role;
        authProvider: AuthProvider;
        createdAt: string;
    };
}
