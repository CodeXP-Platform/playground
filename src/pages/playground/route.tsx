import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { UserMenu } from "@/components/user-menu";
import { Suspense } from "react";
import { useLoaderData } from "react-router-dom";
import { EditorPane } from "@/components/editor-pane";
import { DetailsPane } from "@/components/details-pane";
import type { PlaygroundLoaderData } from "./loader";

export default function PlaygroundRoute() {
    const { challengeId, challengePromise, solutionsPromise } =
        useLoaderData() as PlaygroundLoaderData;

    if (!challengeId || !challengePromise || !solutionsPromise) {
        return null;
    }

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-[radial-gradient(90%_130%_at_0%_0%,#121528_0%,transparent_50%),radial-gradient(110%_120%_at_100%_100%,#0f1f2d_0%,transparent_40%),#06070a] text-foreground">
            <header className="z-20 h-14 shrink-0 border-b border-white/10 bg-[#05060a]/90 backdrop-blur-sm">
                <div className="mx-auto flex h-full w-full items-center justify-between px-3 sm:px-4 lg:px-6">
                    <nav className="flex items-center gap-1">CodeXP</nav>

                    <UserMenu />
                </div>
            </header>

            <main className="mx-auto min-h-0 w-full flex-1">
                {/*<div className="flex h-full min-h-0 flex-col lg:hidden">
                    <div className="min-h-0 basis-[44%] border-b border-white/10">
                        <DetailsPane description={description} />
                    </div>
                    <div className="min-h-0 flex-1">
                        <EditorPane
                            language={language}
                            code={code}
                            onCodeChange={setCode}
                        />
                    </div>
                </div>*/}

                <ResizablePanelGroup>
                    <ResizablePanel minSize={400} maxSize={500}>
                        <Suspense fallback={"Loading Challenge"}>
                            <DetailsPane
                                challengeId={challengeId}
                                challengePromise={challengePromise}
                            />
                        </Suspense>
                    </ResizablePanel>
                    <ResizableHandle
                        withHandle
                        className="bg-white/10 hover:bg-[#8f94ff]/35 data-[separator=active]:bg-[#8f94ff]/50"
                    />
                    <ResizablePanel minSize={400}>
                        <Suspense fallback={"Loading Solutions"}>
                            <EditorPane solutionsPromise={solutionsPromise} />
                        </Suspense>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </main>
        </div>
    );
}
