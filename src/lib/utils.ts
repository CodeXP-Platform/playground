import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

import { AppRoute, QueryParamKey, type JwtPayload } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const accessTokenSchema = z.string().trim().min(1)

const jwtPatternSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)

export function getAccessTokenFromSearch(search: string): string | null {
  const searchParams = new URLSearchParams(search)
  const accessToken = searchParams.get(QueryParamKey.AccessToken)
  const parsedAccessToken = accessTokenSchema.safeParse(accessToken)

  return parsedAccessToken.success ? parsedAccessToken.data : null
}

export function isJwtToken(accessToken: string): boolean {
  return jwtPatternSchema.safeParse(accessToken).success
}

export function decodeJwtPayload(accessToken: string): JwtPayload | null {
  if (!isJwtToken(accessToken)) {
    return null
  }

  const tokenParts = accessToken.split(".")
  const payloadPart = tokenParts[1]
  const normalizedPayload = payloadPart.replace(/-/g, "+").replace(/_/g, "/")
  const paddingLength = (4 - (normalizedPayload.length % 4)) % 4
  const paddedPayload = `${normalizedPayload}${"=".repeat(paddingLength)}`

  try {
    const decodedPayload = atob(paddedPayload)
    return JSON.parse(decodedPayload) as JwtPayload
  } catch {
    return null
  }
}

export function isTokenExpired(expiresAt?: number): boolean {
  if (!expiresAt) {
    return false
  }

  const nowInSeconds = Math.floor(Date.now() / 1_000)
  return expiresAt <= nowInSeconds
}

export function buildStartUrl(accessToken?: string): string {
  const baseRoute = AppRoute.Start

  if (!accessToken) {
    return baseRoute
  }

  const searchParams = new URLSearchParams({
    [QueryParamKey.AccessToken]: accessToken,
  })

  return `${baseRoute}?${searchParams.toString()}`
}
