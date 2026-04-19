import { useState, useRef, useEffect } from "react";
import type { Solution } from "@/services/solutions/types";
import { Search, Settings, TerminalSquare, ChevronDown } from "lucide-react";
import { Javascript } from "./ui/svgs/javascript";
import { Python } from "./ui/svgs/python";

export function PlaygroundHeader({
    solutions,
    currentSolution,
    setCurrentSolution,
}: {
    solutions: Solution[];
    currentSolution: Solution;
    setCurrentSolution: (solution: Solution) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const CurrentIcon =
        currentSolution.language === "python" ? Python : Javascript;

    return (
        <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-white/5 bg-[#111113]">
            {/* Language Selector (Left) */}
            <div className="flex items-center w-1/3 relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-[13px] font-medium text-white/90 border border-transparent hover:border-white/5"
                >
                    <CurrentIcon className="size-4" />
                    <span className="capitalize">
                        {currentSolution.language}
                    </span>
                    <ChevronDown
                        className={`size-3 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#161618] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
                        {solutions.map((solution) => {
                            const Icon =
                                solution.language === "python"
                                    ? Python
                                    : Javascript;
                            const isActive =
                                currentSolution.solutionId ===
                                solution.solutionId;

                            return (
                                <button
                                    key={solution.solutionId}
                                    onClick={() => {
                                        setCurrentSolution(solution);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center gap-3 w-full px-3 py-2 text-[13px] font-medium transition-colors ${
                                        isActive
                                            ? "bg-white/10 text-white"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <Icon className="size-4" />
                                    <span className="capitalize">
                                        {solution.language}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* File indicator (Center) */}
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

            {/* Actions (Right) */}
            <div className="flex items-center justify-end gap-4 w-1/3 text-white/40">
                <Search className="size-4 hover:text-white transition-colors cursor-pointer" />
                <Settings className="size-4 hover:text-white transition-colors cursor-pointer" />
            </div>
        </header>
    );
}
