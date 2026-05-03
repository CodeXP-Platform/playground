import type { Challenge, TestCase } from "@/services/challenges/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, EyeOff } from "lucide-react";

interface ChallengeDetailProps {
    challenge: Challenge;
    tests: TestCase[];
    executionResult: unknown | null;
}

function dedent(str: string) {
    if (!str) return "";

    const normalizedStr = str.replace(/\\n/g, "\n");

    return normalizedStr
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
}

export function ChallengeDetail({ challenge, tests, executionResult }: ChallengeDetailProps) {
    // Extract test results from executionResult to map pass/fail status
    // We assume the result might contain an array of individual test results
    // linked by testCaseId or some index
    const getTestResult = (testCaseId: string, index: number): Record<string, unknown> | null => {
        if (!executionResult) return null;

        const result = executionResult as Record<string, unknown>;
        const testResults = (result.testResults || result.results || []) as Array<Record<string, unknown>>;
        
        if (testResults.length > 0) {
            return testResults.find(
                (tr) => tr.testCaseId === testCaseId || tr.id === testCaseId || tr.index === index
            ) || null;
        }

        return null;
    };
    return (
        <Tabs
            defaultValue="instructions"
            className="flex flex-col h-full w-full"
        >
            <div className="shrink-0 border-b border-white/5 flex p-2">
                <TabsList className="flex w-full h-full bg-transparent p-0 gap-0">
                    <TabsTrigger value="instructions">Instructions</TabsTrigger>
                    <TabsTrigger value="tests">Tests</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent
                value="instructions"
                className="flex-1 min-h-0 outline-none m-0 data-active:flex flex-col"
            >
                <ScrollArea className="h-full w-full">
                    <div className="p-4">
                        <div className="text-sm leading-relaxed prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-none prose-a:text-[#7B8BFF] hover:prose-a:text-[#9AA8FF]">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    code({ className, children, ...rest }) {
                                        const match = /language-(\w+)/.exec(
                                            className || "",
                                        );
                                        return match ? (
                                            <SyntaxHighlighter
                                                PreTag="div"
                                                language={match[1]}
                                                style={vscDarkPlus}
                                                customStyle={{
                                                    margin: "1.5em 0",
                                                    borderRadius: "0.75rem",
                                                    fontSize: "13px",
                                                    border: "1px solid rgba(255,255,255,0.05)",
                                                    backgroundColor: "#09090B",
                                                }}
                                                {...rest}
                                            >
                                                {String(children).replace(
                                                    /\n$/,
                                                    "",
                                                )}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code
                                                className="bg-[#1A1A1E] text-[#A1A1A9] px-1.5 py-0.5 rounded-md border border-white/5 text-[12px] font-mono"
                                                {...rest}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                    a: ({ href, children, ...props }) => {
                                        if (href?.startsWith("/")) {
                                            return (
                                                <Link to={href} {...props}>
                                                    {children}
                                                </Link>
                                            );
                                        }
                                        return (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                {...props}
                                            >
                                                {children}
                                            </a>
                                        );
                                    },
                                }}
                            >
                                {dedent(challenge.description)}
                            </ReactMarkdown>
                        </div>
                    </div>
                </ScrollArea>
            </TabsContent>

            <TabsContent
                value="tests"
                className="flex-1 min-h-0 outline-none m-0 data-active:flex flex-col"
            >
                <ScrollArea className="h-full w-full">
                    <div className="p-4 space-y-3">
                        {tests.length === 0 ? (
                            <div className="p-6 text-[13px] text-[#A1A1A9] flex flex-col items-center justify-center h-full mt-10 text-center opacity-50">
                                <p>Test cases will be displayed here.</p>
                            </div>
                        ) : (
                            tests.map((test, index) => {
                                const testResult = getTestResult(test.testCaseId, index);
                                const isPassed = testResult ? (testResult.passed as boolean) || (testResult.status as string) === "PASSED" : false;
                                const isFailed = testResult ? (testResult.failed as boolean) || (testResult.status as string) === "FAILED" : false;

                                return (
                                    <div
                                        key={test.testCaseId}
                                        className={`
                                            rounded-xl border p-3 transition-colors
                                            ${isPassed ? "border-[#27C93F]/30 bg-[#27C93F]/5" : 
                                              isFailed ? "border-destructive/30 bg-destructive/5" : 
                                              "border-white/5 bg-[#161618]"}
                                        `}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 text-[12px] font-semibold text-white/80">
                                                <span className="text-white/40">Test</span>
                                                <span>{index + 1}</span>
                                                {test.isHidden && (
                                                    <span className="flex items-center gap-1 text-[10px] text-[#7B8BFF] px-1.5 py-0.5 bg-[#7B8BFF]/10 rounded-sm">
                                                        <EyeOff className="size-3" />
                                                        Hidden
                                                    </span>
                                                )}
                                            </div>
                                            {executionResult !== null && (
                                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                                                    {isPassed ? (
                                                        <span className="flex items-center gap-1 text-[#27C93F]">
                                                            <Check className="size-3" />
                                                            Passed
                                                        </span>
                                                    ) : isFailed ? (
                                                        <span className="flex items-center gap-1 text-destructive">
                                                            <X className="size-3" />
                                                            Failed
                                                        </span>
                                                    ) : (
                                                        <span className="text-[#A1A1A9] opacity-50">Pending</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {test.isHidden ? (
                                            <div className="text-[11px] text-[#A1A1A9] opacity-50 italic">
                                                Test case details are hidden.
                                            </div>
                                        ) : (
                                            <div className="space-y-2 text-[12px]">
                                                <div>
                                                    <span className="text-[10px] font-semibold text-[#A1A1A9] uppercase tracking-wider mb-1 block">Input</span>
                                                    <div className="bg-[#09090B] border border-white/5 rounded-lg p-2 font-mono text-[#A1A1A9] break-all">
                                                        {test.input || "N/A"}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-semibold text-[#A1A1A9] uppercase tracking-wider mb-1 block">Expected Output</span>
                                                    <div className="bg-[#09090B] border border-white/5 rounded-lg p-2 font-mono text-[#A1A1A9] break-all">
                                                        {test.expectedOutput || "N/A"}
                                                    </div>
                                                </div>
                                                {isFailed && testResult?.actualOutput !== undefined && testResult?.actualOutput !== null && (
                                                    <div>
                                                        <span className="text-[10px] font-semibold text-destructive uppercase tracking-wider mb-1 block">Actual Output</span>
                                                        <div className="bg-[#09090B] border border-destructive/20 rounded-lg p-2 font-mono text-destructive break-all">
                                                            {String(testResult.actualOutput)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    );
}
