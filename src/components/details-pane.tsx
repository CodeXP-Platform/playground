import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { use } from "react";
import type { Challenge } from "@/services/challenges/types";
export function DetailsPane({
    challengeId,
    challengePromise,
}: {
    challengeId: string;
    challengePromise: Promise<Challenge>;
}) {
    const challenge = use(challengePromise);
    return (
        <aside className={"flex h-full min-h-0 flex-col bg-[#0a0c13]"}>
            <div className="flex-1">
                <p>{challenge.description}</p>
            </div>
            <div className="shrink-0 border-t border-white/10 p-3 sm:p-4">
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
    );
}
