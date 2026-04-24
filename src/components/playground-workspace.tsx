import { useState, use, useEffect, useRef } from "react";
import { SolutionsController } from "@/services/solutions/controller";
import type { Solution } from "@/services/solutions/types";
import { http } from "@/services/axios";
import {
    Loader2,
    Send,
    Bot,
    User,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ImperativePanelHandle } from "react-resizable-panels";

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
    const [isAssistantOpen, setIsAssistantOpen] = useState(true);

    const assistantPanelRef = useRef<ImperativePanelHandle>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        isSubmitting,
        executionStatus,
        executionResult,
        setIsSubmitting,
        setExecutionStatus,
        setExecutionResult,
        reset,
    } = useExecutionStore();

    // Reset store when unmounting or changing challenge
    useEffect(() => {
        return () => reset();
    }, [challengeId, reset]);

    // Auto-scroll to bottom of Neural Assistant chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [executionStatus, executionResult]);

    const handleCodeChange = (newCode: string | undefined) => {
        setCode(newCode || "");
    };

    const toggleAssistant = () => {
        const panel = assistantPanelRef.current;
        if (panel) {
            if (isAssistantOpen) {
                panel.collapse();
            } else {
                panel.expand();
            }
        }
    };

    const handleSubmit = async () => {
        if (!currentSolution || isSubmitting) return;

        // Ensure assistant is open when running
        assistantPanelRef.current?.expand();

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

                    if (status === "PASSED") {
                        toast.success("Solution passed all test cases!");
                    } else {
                        toast.error(
                            "Solution failed. Check the assistant logs.",
                        );
                    }
                    break;
                }
            }
        } catch (error) {
            console.error("Error submitting solution:", error);
            setExecutionStatus("Error occurred.");
            toast.error("An error occurred during submission.");
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
                {/* Left Panel: Objective & Tests */}
                <ResizablePanel minSize={200} defaultSize={250} maxSize={400}>
                    <ChallengeDetail challenge={challenge} />
                </ResizablePanel>

                <ResizableHandle
                    withHandle={false}
                    className="bg-transparent w-px border-l border-white/5"
                />

                {/* Center Panel: Editor */}
                <ResizablePanel minSize={500}>
                    <section className="flex h-full flex-col bg-[#000000]">
                        <div className="flex items-center justify-between shrink-0 h-10 border-b border-white/5 bg-[#000000]">
                            <div className="h-full flex items-center px-4 bg-[#09090B] border-t-2 border-[#7B8BFF] text-[12px] font-mono text-white/90">
                                solution.
                                {currentSolution.language === "python"
                                    ? "py"
                                    : "js"}
                            </div>

                            <div className="flex items-center pr-4 gap-3">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-3 text-[11px] font-semibold text-[#7B8BFF] hover:text-[#9AA8FF] hover:bg-[#7B8BFF]/10 transition-colors"
                                    onClick={toggleAssistant}
                                >
                                    <StarsIcon className="size-3.5 mr-1.5" />
                                    {isAssistantOpen ? "Hide AI" : "Ask AI"}
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-7 px-4 text-[11px] font-bold tracking-wide uppercase bg-[#27C93F]/10 text-[#27C93F] border border-[#27C93F]/20 hover:bg-[#27C93F]/20 transition-colors"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                                    ) : (
                                        <Play className="size-3.5 mr-1.5 fill-current" />
                                    )}
                                    Run Code
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 py-4 overflow-hidden">
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
                                    cursorBlinking: "smooth",
                                    cursorSmoothCaretAnimation: "on",
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
                <ResizablePanel
                    ref={assistantPanelRef}
                    collapsible={true}
                    minSize={200}
                    defaultSize={250}
                    maxSize={400}
                    collapsedSize={0}
                    onCollapse={() => setIsAssistantOpen(false)}
                    onExpand={() => setIsAssistantOpen(true)}
                >
                    <aside className="flex h-full flex-col bg-[#111113] text-white">
                        <div className="flex items-center justify-between shrink-0 h-10 border-b border-white/5 px-4 bg-[#111113]">
                            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-white/50 uppercase">
                                <div className="size-1.5 rounded-full bg-[#7B8BFF] shadow-[0_0_8px_rgba(123,139,255,0.8)]"></div>
                                Neural Assistant
                            </div>
                            <button
                                onClick={() =>
                                    assistantPanelRef.current?.collapse()
                                }
                                className="p-1 hover:bg-white/5 rounded transition-colors"
                            >
                                <ChevronDown className="size-3.5 text-white/40 hover:text-white cursor-pointer" />
                            </button>
                        </div>

                        <ScrollArea className="flex-1 w-full">
                            <div className="p-4 md:p-5 space-y-6">
                                {/* Intro Message */}
                                <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="size-7 shrink-0 rounded bg-[#2D2E42] flex items-center justify-center border border-white/5">
                                        <Bot className="size-4 text-[#7B8BFF]" />
                                    </div>
                                    <div className="flex-1 bg-[#161618] rounded-xl rounded-tl-none p-4 border border-white/5 text-[13px] text-[#A1A1A9] leading-relaxed shadow-sm">
                                        I am ready to evaluate your solution.
                                        Click the run button when you have
                                        completed the objective.
                                    </div>
                                </div>

                                {/* Execution Flow as Chat */}
                                {executionStatus && (
                                    <>
                                        <div className="flex gap-3 flex-row-reverse animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="size-7 shrink-0 rounded bg-[#7B8BFF] flex items-center justify-center shadow-sm">
                                                <User className="size-4 text-black" />
                                            </div>
                                            <div className="bg-[#2D2E42] rounded-xl rounded-tr-none p-3 px-4 text-[13px] text-white/90 border border-[#7B8BFF]/20 shadow-sm">
                                                Run solution
                                            </div>
                                        </div>

                                        <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="size-7 shrink-0 rounded bg-[#2D2E42] flex items-center justify-center border border-white/5">
                                                <Bot className="size-4 text-[#7B8BFF]" />
                                            </div>
                                            <div className="flex-1 bg-[#161618] rounded-xl rounded-tl-none p-4 border border-white/5 text-[13px] shadow-sm">
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
                                                                  : "text-[#7B8BFF]"
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
                                                        <pre className="text-[11.5px] font-mono text-[#A1A1A9] overflow-x-auto whitespace-pre-wrap break-words">
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
                                <div ref={messagesEndRef} className="h-1" />
                            </div>
                        </ScrollArea>

                        {/* Input Area / Submit Button */}
                        <div className="shrink-0 p-4 bg-[#111113] border-t border-white/5 z-10">
                            <div className="flex items-center gap-2 bg-[#000000] border border-white/5 p-1.5 pl-4 rounded-xl shadow-inner">
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
                                    className="size-8 shrink-0 flex items-center justify-center rounded-lg bg-[#161618] hover:bg-[#2D2E42] text-[#7B8BFF] disabled:opacity-50 transition-colors border border-white/5 shadow-sm"
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
