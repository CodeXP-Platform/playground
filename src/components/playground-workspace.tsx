import { useState, use, useEffect, useRef } from "react";
import { SolutionsController } from "@/services/solutions/controller";
import type { Solution } from "@/services/solutions/types";
import { http } from "@/services/axios";
import { CodeAnalysisController } from "@/services/code-analysis/controller";
import {
    Loader2,
    Bot,
    ChevronDown,
    Play,
    StarsIcon,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { MonacoTheme } from "@/types";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "./ui/resizable";
import { useExecutionStore } from "@/store/use-execution";
import type { Challenge, TestCase } from "@/services/challenges/types";
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
    codeTemplateId: string;
    testsPromise: Promise<TestCase[]>;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function PlaygroundWorkspace({
    challengeId,
    challengePromise,
    solutionsPromise,
    codeTemplateId,
    testsPromise,
}: PlaygroundWorkspaceProps) {
    const challenge = use(challengePromise);
    const solutions = use(solutionsPromise);
    const tests = use(testsPromise);

    const [currentSolution, setCurrentSolution] = useState<
        Solution | undefined
    >(solutions.find((s) => s.codeTemplateId === codeTemplateId));

    const [code, setCode] = useState(currentSolution?.code || "");
    const [isAssistantOpen, setIsAssistantOpen] = useState(true);

    const assistantPanelRef = useRef<ImperativePanelHandle>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        isSubmitting,
        executionStatus,
        executionResult,
        codeAnalysisStatus,
        codeAnalysisResult,
        setIsSubmitting,
        setExecutionStatus,
        setExecutionResult,
        setCodeAnalysisStatus,
        setCodeAnalysisResult,
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
    }, [executionStatus, executionResult, codeAnalysisStatus, codeAnalysisResult]);

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
        setCodeAnalysisResult(null);
        setCodeAnalysisStatus("");
        setExecutionStatus("Updating code...");

        try {
            await SolutionsController.updateSolution(
                currentSolution.solutionId,
                code,
            );

            setExecutionStatus("Submitting...");
            const submitResponse = await SolutionsController.submitSolution(
                currentSolution.solutionId,
                code,
            );
            
            const attemptId = submitResponse.attemptId;

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
                    
                    // Start polling code analysis
                    if (attemptId) {
                        setCodeAnalysisStatus("QUEUED");
                        let analysisStatus = "QUEUED";
                        let analysisAttempts = 0;
                        
                        while(
                            (analysisStatus === "QUEUED" || analysisStatus === "GENERATING") &&
                            analysisAttempts < 60
                        ) {
                            await delay(3000);
                            try {
                                const analysis = await CodeAnalysisController.getCodeAnalysis(
                                    currentSolution.solutionId,
                                    attemptId
                                );
                                analysisStatus = analysis.status;
                                setCodeAnalysisStatus(analysisStatus);
                                
                                if (analysisStatus === "COMPLETED") {
                                    setCodeAnalysisResult(analysis);
                                    break;
                                }
                            } catch (error) {
                                console.error("Error polling code analysis:", error);
                            }
                            analysisAttempts++;
                        }
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

    if (!currentSolution) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#111113] rounded-xl shadow-2xl text-white/50 text-sm">
                No solutions found for this challenge. Please make sure the
                student token has initialized a solution.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-[#111113] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <PlaygroundHeader
                solutions={solutions}
                currentSolution={currentSolution}
                setCurrentSolution={setCurrentSolution}
                challenge={challenge}
            />

            {/* Main Workspace */}
            <ResizablePanelGroup className="flex-1 min-h-0">
                {/* Left Panel: Objective & Tests */}
                <ResizablePanel minSize={250} defaultSize={300} maxSize={400}>
                    <ChallengeDetail 
                        challenge={challenge} 
                        tests={tests}
                        executionResult={executionResult}
                    />
                </ResizablePanel>

                <ResizableHandle
                    withHandle={false}
                    className="bg-transparent w-px border-l border-white/5"
                />

                {/* Center Panel: Editor */}
                <ResizablePanel minSize={500}>
                    <section className="flex h-full flex-col">
                        <div className="flex items-center justify-between shrink-0 border-white/5 ">
                            <div className="h-full flex items-center p-4 border-t border-[#7B8BFF] text-xs font-mono">
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
                                    {isAssistantOpen ? "Hide Analysis" : "Show Analysis"}
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
                    minSize={250}
                    defaultSize={300}
                    maxSize={400}
                    collapsedSize={0}
                    onCollapse={() => setIsAssistantOpen(false)}
                    onExpand={() => setIsAssistantOpen(true)}
                >
                    <aside className="flex h-full flex-col">
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
                                {/* Intro Message — hidden once a run starts */}
                                {!executionStatus && (
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
                                )}

                                {/* Execution Flow as Chat */}
                                {executionStatus && (
                                    <>
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

                                                {executionResult !== null && !codeAnalysisStatus && (() => {
                                                    const result = executionResult as Record<string, unknown>;
                                                    const testResults = (result.testResults || result.results || []) as Array<Record<string, unknown>>;
                                                    const total = testResults.length;
                                                    const passedCount = testResults.filter(
                                                        (tr) => tr.passed === true || tr.status === "PASSED"
                                                    ).length;
                                                    const isPassed = executionStatus === "PASSED";
                                                    return (
                                                        <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                {isPassed ? (
                                                                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                                                                ) : (
                                                                    <XCircle className="size-4 text-rose-400 shrink-0" />
                                                                )}
                                                                <span className={`text-[12px] font-semibold ${isPassed ? "text-emerald-400" : "text-rose-400"}`}>
                                                                    {isPassed ? "All tests passed" : "Some tests failed"}
                                                                </span>
                                                            </div>
                                                            {total > 0 && (
                                                                <div className="flex items-center gap-1.5 text-[11px] text-[#A1A1A9]">
                                                                    <span className="font-semibold text-white/70">{passedCount}</span>
                                                                    <span>/</span>
                                                                    <span className="font-semibold text-white/70">{total}</span>
                                                                    <span>tests passed</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        
                                        {/* Code Analysis Feedback */}
                                        {codeAnalysisStatus && (
                                            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
                                                <div className="size-7 shrink-0 rounded bg-[#2D2E42] flex items-center justify-center border border-white/5">
                                                    <Bot className="size-4 text-[#7B8BFF]" />
                                                </div>
                                                <div className="flex-1 bg-[#161618] rounded-xl rounded-tl-none p-4 border border-white/5 text-[13px] shadow-sm">
                                                    <div className="flex items-center gap-2 text-[#A1A1A9]">
                                                        {(codeAnalysisStatus === "QUEUED" || codeAnalysisStatus === "GENERATING") && (
                                                            <Loader2 className="size-3.5 animate-spin text-[#7B8BFF]" />
                                                        )}
                                                        <span className="text-[#7B8BFF]">
                                                            {codeAnalysisStatus === "QUEUED" ? "Code analysis queued..." :
                                                             codeAnalysisStatus === "GENERATING" ? "Analyzing code..." :
                                                             "Code analysis complete"}
                                                        </span>
                                                    </div>

                                                    {codeAnalysisResult !== null && (
                                                        <div className="mt-4 space-y-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex flex-col items-center justify-center size-14 rounded-xl bg-[#09090B] border border-white/10">
                                                                    <span className="text-[18px] font-bold text-white">
                                                                        {codeAnalysisResult.aiScore}
                                                                    </span>
                                                                    <span className="text-[9px] font-semibold text-[#A1A1A9] uppercase tracking-wider -mt-0.5">
                                                                        Score
                                                                    </span>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="text-[12px] font-semibold text-white/90">
                                                                        Code Analysis Complete
                                                                    </h4>
                                                                    <p className="text-[11px] text-[#A1A1A9] mt-0.5">
                                                                        {codeAnalysisResult.feedback}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {codeAnalysisResult.suggestions && codeAnalysisResult.suggestions.length > 0 && (
                                                                <div className="pt-3 border-t border-white/5">
                                                                    <h4 className="text-[11px] font-semibold text-[#7B8BFF] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                                        <StarsIcon className="size-3" />
                                                                        Suggestions
                                                                    </h4>
                                                                    <ul className="space-y-2">
                                                                        {codeAnalysisResult.suggestions.map((suggestion, i) => (
                                                                            <li
                                                                                key={i}
                                                                                className="text-[12px] text-[#A1A1A9] leading-relaxed pl-3 border-l-2 border-[#7B8BFF]/20"
                                                                            >
                                                                                {suggestion}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div ref={messagesEndRef} className="h-1" />
                            </div>
                        </ScrollArea>

                    </aside>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
