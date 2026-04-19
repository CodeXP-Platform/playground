import { useState, use } from "react";
import { SolutionsController } from "@/services/solutions/controller";
import type { Solution } from "@/services/solutions/types";
import { http } from "@/services/axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Editor } from "@monaco-editor/react";
import { MonacoTheme } from "@/types";
import LanguageButton from "./language-button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "./ui/resizable";

interface PlaygroundWorkspaceProps {
    challengeId: string;
    challengePromise: Promise<any>;
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

    const [currentSolution, setCurrentSolution] = useState<Solution>(solutions[0]);
    const [code, setCode] = useState(currentSolution?.code || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [executionStatus, setExecutionStatus] = useState<string>("");
    const [executionResult, setExecutionResult] = useState<any>(null);

    const handleCodeChange = (newCode: string | undefined) => {
        setCode(newCode || "");
    };

    const handleSubmit = async () => {
        if (!currentSolution || isSubmitting) return;

        setIsSubmitting(true);
        setExecutionResult(null);
        setExecutionStatus("Updating code...");

        try {
            await SolutionsController.updateSolution(currentSolution.solutionId, code);

            setExecutionStatus("Submitting...");
            await SolutionsController.submitSolution(currentSolution.solutionId, code);

            setExecutionStatus("Queued...");
            let status = "QUEUED";
            let attempts = 0;

            while (
                (status === "QUEUED" || status === "EXECUTING" || status === "DRAFT") &&
                attempts < 100
            ) {
                await delay(2000);
                const statusRes = await http.get(`/solutions/${currentSolution.solutionId}`);
                status = statusRes.data.status;
                setExecutionStatus(status === "EXECUTING" ? "Executing..." : "Queued...");
                attempts++;

                if (status === "PASSED" || status === "FAILED") {
                    setExecutionResult(statusRes.data);
                    setExecutionStatus(status);
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
        <ResizablePanelGroup>
            <ResizablePanel minSize={400} maxSize={500}>
                <aside className="flex h-full min-h-0 flex-col bg-[#0a0c13]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                        <h2 className="text-xl font-bold">{challenge.title}</h2>
                        <p className="text-white/70">{challenge.description}</p>

                        {executionStatus && (
                            <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4">
                                <h3 className="font-semibold text-white mb-2">Execution Status</h3>
                                <div className="flex items-center gap-2 text-white/80">
                                    {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                                    <span>{executionStatus}</span>
                                </div>
                                {executionResult && (
                                    <pre className="mt-2 text-xs bg-black/50 p-2 rounded overflow-x-auto">
                                        {JSON.stringify(executionResult, null, 2)}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="shrink-0 border-t border-white/10 p-3 sm:p-4">
                        <Button
                            type="button"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="h-10 w-full justify-center bg-[#6f73ff] text-xs font-semibold tracking-[0.12em] text-white uppercase hover:bg-[#868aff] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Processing..." : "Submit Code"}
                            {!isSubmitting && <ArrowRight className="ml-2 size-4" />}
                        </Button>
                    </div>
                </aside>
            </ResizablePanel>
            <ResizableHandle
                withHandle
                className="bg-white/10 hover:bg-[#8f94ff]/35 data-[separator=active]:bg-[#8f94ff]/50"
            />
            <ResizablePanel minSize={400}>
                <section className="flex h-full min-h-0 flex-col bg-[#090b11] overflow-hidden">
                    <div className="shrink-0 border-b border-white/10 bg-black/35 px-3 py-2 sm:px-4">
                        <LanguageButton
                            language={currentSolution.language}
                        />
                    </div>
                    <div className="min-h-0 flex-1 p-4">
                        <Editor
                            theme={MonacoTheme.Dark}
                            language={currentSolution.language}
                            value={code}
                            onChange={handleCodeChange}
                            options={{
                                automaticLayout: true,
                                minimap: { enabled: false },
                                smoothScrolling: true,
                                fontSize: 15,
                                lineHeight: 24,
                                scrollBeyondLastLine: false,
                                padding: { top: 18, bottom: 18 },
                                tabSize: 4,
                            }}
                        />
                    </div>
                </section>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
