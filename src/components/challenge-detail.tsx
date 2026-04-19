import type { Challenge } from "@/services/challenges/types";
import { ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function ChallengeDetail({ challenge }: { challenge: Challenge }) {
    return (
        <div>
            <div className="flex items-center justify-between shrink-0 h-10 border-b border-white/5 px-4">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-white/50 uppercase flex-1 justify-center">
                    Instructions
                </div>
                <div className="h-full w-px bg-white/5"></div>
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-white/50 uppercase flex-1 justify-center">
                    Tests
                </div>
            </div>

            <article className="p-4">
                <div>
                    <h2>{challenge.title}</h2>
                </div>
                <ReactMarkdown>{challenge.description}</ReactMarkdown>
            </article>
        </div>
    );
}
