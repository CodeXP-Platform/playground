export enum AppRoute {
  Start = "/start",
  Playground = "/playground",
  Fallback = "*",
}

export enum QueryParamKey {
  AccessToken = "access",
}

export enum ApiEndpoint {
  ValidateToken = "/api/auth/validate",
}

export enum TokenValidationStatus {
  Idle = "idle",
  Validating = "validating",
  Valid = "valid",
  Invalid = "invalid",
}

export enum TokenMessage {
  WaitingForToken = "Waiting for an access token from the URL.",
  MissingToken = "Missing access token. Use /start?access=<jwt>.",
  InvalidTokenFormat = "Access token does not match JWT format.",
  InvalidTokenPayload = "Access token payload is malformed.",
  ExpiredToken = "Access token is expired.",
  ValidLocalFallback = "Token structure is valid (local fallback check).",
}

export enum EditorLanguage {
  JavaScript = "javascript",
  TypeScript = "typescript",
}

export enum MonacoTheme {
  Dark = "vs-dark",
}

export enum TokenBadgeVariant {
  Default = "default",
  Secondary = "secondary",
  Outline = "outline",
  Destructive = "destructive",
}

export interface JwtPayload {
  sub?: string
  exp?: number
  [key: string]: unknown
}

export interface TokenValidationResponse {
  valid: boolean
  message: string
  subject?: string
  expiresAt?: number
}

export interface EditorStoreState {
  description: string
  code: string
  language: EditorLanguage
  accessToken: string | null
  tokenStatus: TokenValidationStatus
  tokenMessage: string
  tokenSubject?: string
  setDescription: (nextDescription: string) => void
  setCode: (nextCode: string) => void
  setAccessToken: (nextToken: string | null) => void
  setTokenStatus: (nextStatus: TokenValidationStatus) => void
  setTokenValidation: (
    result: TokenValidationResponse,
    status?: TokenValidationStatus
  ) => void
}
