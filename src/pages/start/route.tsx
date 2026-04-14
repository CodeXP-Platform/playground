import { useCallback, useEffect } from "react"
import { ArrowRight, KeyRound, LoaderCircle, ShieldCheck, ShieldX } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { validateAccessToken } from "@/lib/auth"
import { getAccessTokenFromSearch } from "@/lib/utils"
import { useEditorStore } from "@/store/editor-store"
import {
    AppRoute,
    TokenBadgeVariant,
    TokenMessage,
    TokenValidationStatus,
} from "@/types"

const statusLabelMap: Record<TokenValidationStatus, string> = {
    [TokenValidationStatus.Idle]: "Idle",
    [TokenValidationStatus.Validating]: "Validating",
    [TokenValidationStatus.Valid]: "Valid",
    [TokenValidationStatus.Invalid]: "Invalid",
}

const statusVariantMap: Record<TokenValidationStatus, TokenBadgeVariant> = {
    [TokenValidationStatus.Idle]: TokenBadgeVariant.Secondary,
    [TokenValidationStatus.Validating]: TokenBadgeVariant.Outline,
    [TokenValidationStatus.Valid]: TokenBadgeVariant.Default,
    [TokenValidationStatus.Invalid]: TokenBadgeVariant.Destructive,
}

const isJwtValidationEnabled = import.meta.env.VITE_ENABLE_JWT_VALIDATION === "true"

export default function StartRoute() {
    const location = useLocation()
    const navigate = useNavigate()

    const {
        accessToken,
        tokenStatus,
        tokenMessage,
        tokenSubject,
        setAccessToken,
        setTokenStatus,
        setTokenValidation,
    } = useEditorStore((state) => state)

    const validateAndContinue = useCallback(
        async (nextToken: string) => {
            setTokenStatus(TokenValidationStatus.Validating)

            const validationResult = await validateAccessToken(nextToken)
            const validationStatus = validationResult.valid
                ? TokenValidationStatus.Valid
                : TokenValidationStatus.Invalid

            setTokenValidation(validationResult, validationStatus)

            if (validationResult.valid) {
                navigate(AppRoute.Playground, { replace: true })
            }
        },
        [navigate, setTokenStatus, setTokenValidation]
    )

    useEffect(() => {
        if (!isJwtValidationEnabled) {
            setTokenValidation(
                {
                    valid: true,
                    message: "JWT validation is disabled for development.",
                },
                TokenValidationStatus.Idle
            )
            navigate(AppRoute.Playground, { replace: true })
            return
        }

        const tokenFromSearch = getAccessTokenFromSearch(location.search)
        setAccessToken(tokenFromSearch)

        if (!tokenFromSearch) {
            setTokenValidation(
                {
                    valid: false,
                    message: TokenMessage.MissingToken,
                },
                TokenValidationStatus.Invalid
            )
            return
        }

        void validateAndContinue(tokenFromSearch)
    }, [
        location.search,
        navigate,
        setAccessToken,
        setTokenValidation,
        validateAndContinue,
    ])

    const handleRetryValidation = useCallback(() => {
        if (!isJwtValidationEnabled) {
            navigate(AppRoute.Playground)
            return
        }

        if (!accessToken) {
            setTokenValidation(
                {
                    valid: false,
                    message: TokenMessage.MissingToken,
                },
                TokenValidationStatus.Invalid
            )
            return
        }

        void validateAndContinue(accessToken)
    }, [accessToken, navigate, setTokenValidation, validateAndContinue])

    const isValidatingToken = tokenStatus === TokenValidationStatus.Validating
    const isTokenValid = tokenStatus === TokenValidationStatus.Valid

    return (
        <div className="flex h-dvh items-center justify-center overflow-hidden bg-[radial-gradient(130%_120%_at_10%_5%,rgba(68,94,255,0.24),transparent_45%),radial-gradient(120%_100%_at_90%_95%,rgba(0,191,165,0.18),transparent_50%),#06070a] p-4 text-foreground">
            <Card className="w-full max-w-md border-white/10 bg-black/45 shadow-2xl backdrop-blur-xl">
                <CardHeader>
                    <div className="mb-1 inline-flex w-fit items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-zinc-300">
                        <KeyRound className="size-3.5 text-[#8f94ff]" />
                        Access Gate
                    </div>
                    <CardTitle className="text-xl text-zinc-100">
                        {isJwtValidationEnabled
                            ? "Validate JWT Before Entering Playground"
                            : "Development Mode: JWT Validation Skipped"}
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        {isJwtValidationEnabled
                            ? "This page validates the token from /start?access=jwt and redirects to the playground when it is valid."
                            : "JWT validation is currently optional. Set VITE_ENABLE_JWT_VALIDATION=true to enforce it."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <Badge
                            variant={statusVariantMap[tokenStatus]}
                            className="px-2 py-0.5 text-[0.65rem]"
                        >
                            {isValidatingToken ? (
                                <LoaderCircle className="mr-1 size-3 animate-spin" />
                            ) : tokenStatus === TokenValidationStatus.Valid ? (
                                <ShieldCheck className="mr-1 size-3" />
                            ) : (
                                <ShieldX className="mr-1 size-3" />
                            )}
                            {statusLabelMap[tokenStatus]}
                        </Badge>

                        {isTokenValid ? (
                            <span className="text-xs text-emerald-300">Redirecting...</span>
                        ) : null}
                    </div>

                    <p className="text-sm leading-relaxed text-zinc-300">
                        {tokenMessage}
                        {tokenSubject ? ` (sub: ${tokenSubject})` : ""}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            onClick={handleRetryValidation}
                            disabled={isValidatingToken}
                            className="bg-[#6f73ff] text-white hover:bg-[#868aff]"
                        >
                            {isValidatingToken ? (
                                <LoaderCircle className="size-4 animate-spin" />
                            ) : null}
                            Revalidate Token
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(AppRoute.Playground)}
                            disabled={isJwtValidationEnabled && !isTokenValid}
                            className="border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10"
                        >
                            Open Playground
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
