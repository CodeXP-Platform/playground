import { useState, use, useEffect } from "react";
import { SolutionsController } from "@/services/solutions/controller";
import type { Solution } from "@/services/solutions/types";
import { http } from "@/services/axios";
import {
    Loader2,
    Send,
    Bot,
    User,
    CheckCircle2,
    ChevronDown,
    Play,
    StarsIcon,
} from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { MonacoTheme } from "@/types";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "./ui/resizable";
import { useExecutionStore } from "@/store/use-execution";
import type { Challenge } from "@/services/challenges/types";
import { PlaygroundHeader } from "./playground-header";
import { ChallengeDetail } from "./challenge-detail";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface PlaygroundWorkspaceProps {
    challengeId: string;
    challengePromise: Promise<Challenge>;
    solutionsPromise: Promise<Solution[]>;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function PlaygroundWorkspace({
    challengeId,
    challengePromise,
    solutionsPromise,
}: PlaygroundWorkspaceProps) {
    const challenge = use(challengePromise);
    const solutions = use(solutionsPromise);

    const [currentSolution, setCurrentSolution] = useState<Solution>(
        solutions[0],
    );
    const [code, setCode] = useState(currentSolution?.code || "");

    const {
        isSubmitting,
        executionStatus,
        executionResult,
        setIsSubmitting,
        setExecutionStatus,
        setExecutionResult,
        reset,
    } = useExecutionStore();

    useEffect(() => {
        return () => reset();
    }, [challengeId, reset]);

    const handleCodeChange = (newCode: string | undefined) => {
        setCode(newCode || "");
    };

    const handleSubmit = async () => {
        if (!currentSolution || isSubmitting) return;

        setIsSubmitting(true);
        setExecutionResult(null);
        setExecutionStatus("Updating code...");

        try {
            await SolutionsController.updateSolution(
                currentSolution.solutionId,
                code,
            );

            setExecutionStatus("Submitting...");
            await SolutionsController.submitSolution(
                currentSolution.solutionId,
                code,
            );

            setExecutionStatus("Queued...");
            let status = "QUEUED";
            let attempts = 0;

            while (
                (status === "QUEUED" ||
                    status === "EXECUTING" ||
                    status === "DRAFT") &&
                attempts < 100
            ) {
                await delay(2000);
                const statusRes = await http.get(
                    `/solutions/${currentSolution.solutionId}`,
                );
                status = statusRes.data.status;
                setExecutionStatus(
                    status === "EXECUTING" ? "Executing..." : "Queued...",
                );
                attempts++;

                if (status === "PASSED" || status === "FAILED") {
                    setExecutionResult(statusRes.data);
                    setExecutionStatus(status);

                    toast(statusRes.data.result);
                    break;
                }
            }
        } catch (error) {
            console.error("Error submitting solution:", error);
            setExecutionStatus("Error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#111113] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <PlaygroundHeader
                solutions={solutions}
                currentSolution={currentSolution}
                setCurrentSolution={setCurrentSolution}
            />
            {/* Main Workspace */}
            <ResizablePanelGroup className="flex-1 min-h-0">
                {/* Left Panel: Objective */}
                <ResizablePanel minSize={200} maxSize={400}>
                    <ChallengeDetail challenge={challenge} />
                </ResizablePanel>

                <ResizableHandle
                    withHandle={false}
                    className="bg-transparent w-px border-l border-white/5"
                />

                {/* Center Panel: Editor */}
                <ResizablePanel minSize={30} defaultSize={50}>
                    <section className="flex h-full flex-col">
                        <div className="flex items-center justify-between shrink-0 h-10 border-b border-white/5">
                            <div className="h-full flex items-center px-4 border-t-2 border-[#7B8BFF] text-xs font-mono text-white/90">
                                solution.
                                {currentSolution.language === "python"
                                    ? "py"
                                    : "js"}
                            </div>

                            <div className="pr-4 space-x-1">
                                <Button
                                    className="bg-green-500 text-black hover:bg-green-400"
                                    onClick={handleSubmit}
                                >
                                    <Play /> Run
                                </Button>
                                <Button>
                                    <StarsIcon /> Ask AI
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <Editor
                                theme={MonacoTheme.Dark}
                                language={currentSolution.language}
                                value={code}
                                onChange={handleCodeChange}
                                options={{
                                    automaticLayout: true,
                                    minimap: { enabled: false },
                                    smoothScrolling: true,
                                    fontSize: 14,
                                    fontFamily:
                                        "'JetBrains Mono', 'Fira Code', monospace",
                                    lineHeight: 24,
                                    scrollBeyondLastLine: false,
                                    padding: { top: 16, bottom: 16 },
                                    tabSize: 4,
                                    formatOnPaste: true,
                                    renderLineHighlight: "none",
                                }}
                            />
                        </div>
                    </section>
                </ResizablePanel>

                <ResizableHandle
                    withHandle={false}
                    className="bg-transparent w-px border-l border-white/5"
                />

                {/* Right Panel: Neural Assistant / Execution */}
                <ResizablePanel minSize={200} maxSize={400}>
                    <aside className="flex h-full flex-col bg-[#111113] text-white">
                        <div className="flex items-center justify-between shrink-0 h-10 border-b border-white/5 px-4 bg-[#111113]">
                            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-white/50 uppercase">
                                <div className="size-1.5 rounded-full bg-[#7B8BFF]"></div>
                                Neural Assistant
                            </div>
                            <ChevronDown className="size-3 text-white/40" />
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Intro Message */}
                            <div className="flex gap-3">
                                <div className="size-7 shrink-0 rounded bg-[#2D2E42] flex items-center justify-center border border-white/5">
                                    <Bot className="size-4 text-[#7B8BFF]" />
                                </div>
                                <div className="flex-1 bg-[#161618] rounded-xl rounded-tl-none p-4 border border-white/5 text-[13px] text-[#A1A1A9] leading-relaxed">
                                    I am ready to evaluate your solution. Click
                                    the run button below when you have completed
                                    the objective.
                                </div>
                            </div>

                            {/* Execution Flow as Chat */}
                            {executionStatus && (
                                <>
                                    <div className="flex gap-3 flex-row-reverse">
                                        <div className="size-7 shrink-0 rounded bg-[#7B8BFF] flex items-center justify-center">
                                            <User className="size-4 text-black" />
                                        </div>
                                        <div className="bg-[#2D2E42] rounded-xl rounded-tr-none p-3 px-4 text-[13px] text-white/90 border border-[#7B8BFF]/20">
                                            Run solution
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="size-7 shrink-0 rounded bg-[#2D2E42] flex items-center justify-center border border-white/5">
                                            <Bot className="size-4 text-[#7B8BFF]" />
                                        </div>
                                        <div className="flex-1 bg-[#161618] rounded-xl rounded-tl-none p-4 border border-white/5 text-[13px]">
                                            <div className="flex items-center gap-2 text-[#A1A1A9]">
                                                {isSubmitting && (
                                                    <Loader2 className="size-3.5 animate-spin text-[#7B8BFF]" />
                                                )}
                                                <span
                                                    className={
                                                        executionStatus ===
                                                        "PASSED"
                                                            ? "text-emerald-400 font-medium"
                                                            : executionStatus ===
                                                                "FAILED"
                                                              ? "text-rose-400 font-medium"
                                                              : ""
                                                    }
                                                >
                                                    {executionStatus ===
                                                    "QUEUED"
                                                        ? "Queued for execution..."
                                                        : executionStatus ===
                                                            "EXECUTING"
                                                          ? "Running tests..."
                                                          : `Execution finished: ${executionStatus}`}
                                                </span>
                                            </div>

                                            {executionResult && (
                                                <div className="mt-3 pt-3 border-t border-white/5">
                                                    <pre className="text-[11px] font-mono text-[#7B8BFF] overflow-x-auto">
                                                        {JSON.stringify(
                                                            executionResult,
                                                            null,
                                                            2,
                                                        )}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Input Area / Submit Button */}
                        <div className="shrink-0 p-4 bg-[#111113]">
                            <div className="flex items-center gap-2 bg-[#000000] border border-white/5 p-1.5 pl-4 rounded-xl">
                                <input
                                    type="text"
                                    disabled
                                    placeholder={
                                        isSubmitting
                                            ? "Processing..."
                                            : "Ask Lumina or run code..."
                                    }
                                    className="flex-1 bg-transparent border-none outline-none text-[13px] text-white/50 cursor-not-allowed"
                                />
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="size-8 shrink-0 flex items-center justify-center rounded-lg bg-[#161618] hover:bg-[#2D2E42] text-[#7B8BFF] disabled:opacity-50 transition-colors border border-white/5"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Send className="size-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </aside>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
