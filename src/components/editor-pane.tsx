import { MonacoTheme, type EditorLanguage } from "@/types";
import { Editor } from "@monaco-editor/react";
import { Code2 } from "lucide-react";
import { use } from "react";

interface EditorPaneProps {
    solutionsPromise: Promise<any>;
}

export function EditorPane({ solutionsPromise }: EditorPaneProps) {
    const solutions = use(solutionsPromise);

    return (
        <section className="flex h-full min-h-0 flex-col bg-[#090b11] overflow-x-hidden overflow-y-hidden">
            <div className="shrink-0 border-b border-white/10 bg-black/35 px-3 py-2 sm:px-4">
                <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0c0f17] px-2.5 py-1 text-[0.7rem] font-medium text-zinc-300">
                    <Code2 className="size-3.5 text-[#8f94ff]" />
                    solution.js
                </div>
            </div>

            <div className="min-h-0 flex-1">
                {/*<Editor
                    theme={MonacoTheme.Dark}
                    language={language}
                    value={code}
                    onChange={(value) => onCodeChange(value ?? "")}
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
                />*/}
                {solutions.map((s) => (
                    <p>{JSON.stringify(s)}</p>
                ))}
            </div>
        </section>
    );
}
