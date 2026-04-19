import { Suspense } from "react";
import { useLoaderData } from "react-router-dom";
import { PlaygroundWorkspace } from "@/components/playground-workspace";
import type { PlaygroundLoaderData } from "./loader";

export default function PlaygroundRoute() {
    const { challengeId, challengePromise, solutionsPromise } =
        useLoaderData() as PlaygroundLoaderData;

    if (!challengeId || !challengePromise || !solutionsPromise) {
        return null;
    }

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-[radial-gradient(90%_130%_at_0%_0%,#121528_0%,transparent_50%),radial-gradient(110%_120%_at_100%_100%,#0f1f2d_0%,transparent_40%),#06070a] text-foreground">
            <main className="mx-auto min-h-0 w-full flex-1">
                <Suspense
                    fallback={
                        <div className="flex h-full items-center justify-center text-white/50">
                            Loading Workspace...
                        </div>
                    }
                >
                    <PlaygroundWorkspace
                        challengeId={challengeId}
                        challengePromise={challengePromise}
                        solutionsPromise={solutionsPromise}
                    />
                </Suspense>
            </main>
        </div>
    );
}
