import type { Solution } from "@/services/solutions/types";
import { MonacoTheme } from "@/types";
import { Editor } from "@monaco-editor/react";
import { use } from "react";
import LanguageButton from "./language-button";

interface EditorPaneProps {
    solutionsPromise: Promise<Solution[]>;
}

export function EditorPane({ solutionsPromise }: EditorPaneProps) {
    const solutions = use(solutionsPromise);

    const current = solutions[0];

    return (
        <section className="flex h-full min-h-0 flex-col bg-[#090b11] overflow-x-hidden overflow-y-hidden">
            <div className="shrink-0 border-b border-white/10 bg-black/35 px-3 py-2 sm:px-4">
                {solutions.map((s) => (
                    <LanguageButton
                        language={s.language}
                        key={s.solutionId + s.language}
                    />
                ))}
            </div>

            <div className="min-h-0 flex-1 p-4">
                <Editor
                    theme={MonacoTheme.Dark}
                    language={current.language}
                    value={current.code}
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
    );
}
