import type { Solution } from "@/services/solutions/types";
import { Search, Settings, TerminalSquare } from "lucide-react";

export function PlaygroundHeader({
    solutions,
    currentSolution,
    setCurrentSolution,
}: {
    solutions: Solution[];
    currentSolution: Solution;
    setCurrentSolution: (solution: Solution) => void;
}) {
    return (
        <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-white/5 bg-[#111113]">
            <div className="flex items-center justify-center w-1/3">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1A1E] border border-white/5 text-[11px] font-mono text-white/50">
                    <TerminalSquare className="size-3" />
                    <span>
                        solution.
                        {currentSolution.language === "python" ? "py" : "js"} —
                        CodeXP
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 w-1/3 text-white/40">
                <Search className="size-4 hover:text-white transition-colors cursor-pointer" />
                <Settings className="size-4 hover:text-white transition-colors cursor-pointer" />
            </div>
        </header>
    );
}
