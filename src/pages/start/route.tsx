import { useCallback, useEffect } from "react"
import Editor from "@monaco-editor/react"
import {
    ArrowRight,
    Clock3,
    Code2,
    LoaderCircle,
    Settings2,
    Target,
    Trophy,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { validateAccessToken } from "@/lib/auth"
import { cn, getAccessTokenFromSearch } from "@/lib/utils"
import { useEditorStore } from "@/store/editor-store"
import {
    MonacoTheme,
    TokenBadgeVariant,
    TokenMessage,
    TokenValidationStatus,
} from "@/types"
import { useLocation } from "react-router-dom"

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

const navigationItems = [
    { label: "Editor", isActive: true },
    { label: "Dashboard", isActive: false },
    { label: "Challenges", isActive: false },
    { label: "Paths", isActive: false },
]

const objectiveItems = [
    "Create a recursive function buildFractal(depth).",
    "Return an array containing nested instances of itself.",
    "Base case must handle depth === 0 by returning a single integer.",
]

const exampleOutput = `buildFractal(2)
// [1, [1, 1], 1]`

export default function StartRoute() {
    const location = useLocation()

    const {
        description,
        code,
        language,
        accessToken,
        tokenStatus,
        tokenMessage,
        tokenSubject,
        setCode,
        setAccessToken,
        setTokenStatus,
        setTokenValidation,
    } = useEditorStore((state) => state)

    const executeTokenValidation = useCallback(
        async (nextToken: string) => {
            setTokenStatus(TokenValidationStatus.Validating)

            const validationResult = await validateAccessToken(nextToken)
            setTokenValidation(
                validationResult,
                validationResult.valid
                    ? TokenValidationStatus.Valid
                    : TokenValidationStatus.Invalid
            )
        },
        [setTokenStatus, setTokenValidation]
    )

    useEffect(() => {
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

        void executeTokenValidation(tokenFromSearch)
    }, [location.search, executeTokenValidation, setAccessToken, setTokenValidation])

    const handleRevalidateToken = useCallback(() => {
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

        void executeTokenValidation(accessToken)
    }, [accessToken, executeTokenValidation, setTokenValidation])

    const isValidatingToken = tokenStatus === TokenValidationStatus.Validating

    return (
        <div className="min-h-dvh bg-[radial-gradient(90%_130%_at_0%_0%,#121528_0%,transparent_50%),radial-gradient(110%_120%_at_100%_100%,#0f1f2d_0%,transparent_40%),#06070a] text-foreground">
            <header className="sticky top-0 z-20 border-b border-white/10 bg-[#05060a]/90 backdrop-blur-sm">
                <div className="mx-auto flex h-14 w-full max-w-[1700px] items-center justify-between px-3 sm:px-4 lg:px-6">
                    <nav className="flex items-center gap-1">
                        {navigationItems.map((item) => (
                            <Button
                                key={item.label}
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "h-8 rounded-md px-2.5 text-xs font-medium",
                                    item.isActive
                                        ? "bg-[#1b1e2f] text-[#9ea2ff] hover:bg-[#22263a] hover:text-[#b7baff]"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                )}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <Badge
                            variant="outline"
                            className="h-8 gap-1.5 border-white/15 bg-white/5 px-2.5 text-[0.65rem] tracking-wide text-zinc-300"
                        >
                            <Trophy className="size-3 text-[#9ea2ff]" />
                            LEVEL 24
                        </Badge>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                            aria-label="History"
                        >
                            <Clock3 className="size-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                            aria-label="Settings"
                        >
                            <Settings2 className="size-3.5" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            className="h-8 bg-[#7274ff] px-3 text-[0.72rem] font-semibold text-white hover:bg-[#8789ff]"
                        >
                            Run Code
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid w-full max-w-[1700px] lg:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="flex min-h-[calc(100dvh-3.5rem)] flex-col border-b border-white/10 bg-[#0a0c13] lg:border-r lg:border-b-0">
                    <div className="flex-1 space-y-5 px-4 py-5 sm:px-5">
                        <section className="space-y-3">
                            <p className="text-[0.6rem] font-semibold tracking-[0.28em] text-[#7e84b8]">
                                CURRENT CHALLENGE
                            </p>
                            <h1 className="text-3xl font-semibold leading-tight text-zinc-100">
                                Recursive Pattern Architect
                            </h1>
                            <div className="flex flex-wrap gap-1.5">
                                <Badge className="rounded-sm bg-[#2f3273] px-2 py-0.5 text-[0.62rem] tracking-wider text-[#d1d4ff]">
                                    MEDIUM
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="rounded-sm border-[#483661] bg-[#2a2036] px-2 py-0.5 text-[0.62rem] tracking-wider text-[#d9b2ff]"
                                >
                                    300 XP
                                </Badge>
                            </div>
                            <p className="max-w-[28ch] text-sm leading-relaxed text-zinc-400">
                                {description}
                            </p>
                        </section>

                        <Card className="border-white/10 bg-black/35">
                            <CardHeader className="border-white/10 pb-2">
                                <CardTitle className="text-xs uppercase tracking-[0.18em] text-zinc-200">
                                    Objective
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2.5 pt-3">
                                {objectiveItems.map((objectiveItem) => (
                                    <p
                                        key={objectiveItem}
                                        className="flex items-start gap-2 text-xs leading-relaxed text-zinc-300"
                                    >
                                        <Target className="mt-0.5 size-3 shrink-0 text-[#8f94ff]" />
                                        {objectiveItem}
                                    </p>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-black/35">
                            <CardHeader className="border-white/10 pb-2">
                                <CardTitle className="text-xs uppercase tracking-[0.18em] text-zinc-200">
                                    Example Output
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-3">
                                <pre className="overflow-x-auto rounded-md border border-white/10 bg-[#090b11] p-3 text-[0.72rem] leading-relaxed text-[#9da1ff]">
                                    {exampleOutput}
                                </pre>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-black/25">
                            <CardContent className="space-y-2 pt-3">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[0.67rem] font-semibold tracking-[0.12em] text-zinc-300 uppercase">
                                        Token Status
                                    </span>
                                    <Badge
                                        variant={statusVariantMap[tokenStatus]}
                                        className="text-[0.62rem]"
                                    >
                                        {isValidatingToken ? (
                                            <LoaderCircle className="mr-1 size-3 animate-spin" />
                                        ) : null}
                                        {statusLabelMap[tokenStatus]}
                                    </Badge>
                                </div>
                                <p className="text-xs leading-relaxed text-zinc-400">
                                    {tokenMessage}
                                    {tokenSubject ? ` (sub: ${tokenSubject})` : ""}
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRevalidateToken}
                                    disabled={isValidatingToken}
                                    className="w-full border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10"
                                >
                                    Revalidate Token
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="border-t border-white/10 p-3 sm:p-4">
                        <Button
                            type="button"
                            size="lg"
                            className="h-10 w-full justify-center bg-[#6f73ff] text-xs font-semibold tracking-[0.12em] text-white uppercase hover:bg-[#868aff]"
                        >
                            Submit Code
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                </aside>

                <section className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-[#090b11]">
                    <div className="border-b border-white/10 bg-black/35 px-3 py-2 sm:px-4">
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0c0f17] px-2.5 py-1 text-[0.7rem] font-medium text-zinc-300">
                            <Code2 className="size-3.5 text-[#8f94ff]" />
                            solution.js
                        </div>
                    </div>

                    <div className="flex-1">
                        <Editor
                            theme={MonacoTheme.Dark}
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value ?? "")}
                            options={{
                                automaticLayout: true,
                                minimap: { enabled: false },
                                smoothScrolling: true,
                                fontSize: 15,
                                lineHeight: 24,
                                scrollBeyondLastLine: false,
                                padding: { top: 18, bottom: 18 },
                                tabSize: 2,
                                wordWrap: "off",
                            }}
                        />
                    </div>
                </section>
            </main>
        </div>
    )
}