import axios from "axios"
import { z } from "zod"

import {
  ApiEndpoint,
  TokenMessage,
  type TokenValidationResponse,
} from "@/types"
import { decodeJwtPayload, isJwtToken, isTokenExpired } from "@/lib/utils"

const tokenValidationResponseSchema = z.object({
  valid: z.boolean(),
  message: z.string(),
  subject: z.string().optional(),
  expiresAt: z.number().optional(),
})

const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  timeout: 4_000,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function validateAccessToken(
  accessToken: string
): Promise<TokenValidationResponse> {
  if (!isJwtToken(accessToken)) {
    return {
      valid: false,
      message: TokenMessage.InvalidTokenFormat,
    }
  }

  try {
    const response = await authClient.post(ApiEndpoint.ValidateToken, {
      accessToken,
    })
    const parsedResponse = tokenValidationResponseSchema.safeParse(response.data)

    if (parsedResponse.success) {
      return parsedResponse.data
    }
  } catch {
    // Fall back to local validation when no backend endpoint is available.
  }

  const jwtPayload = decodeJwtPayload(accessToken)

  if (!jwtPayload) {
    return {
      valid: false,
      message: TokenMessage.InvalidTokenPayload,
    }
  }

  if (isTokenExpired(jwtPayload.exp)) {
    return {
      valid: false,
      message: TokenMessage.ExpiredToken,
      subject: jwtPayload.sub,
      expiresAt: jwtPayload.exp,
    }
  }

  return {
    valid: true,
    message: TokenMessage.ValidLocalFallback,
    subject: jwtPayload.sub,
    expiresAt: jwtPayload.exp,
  }
}
