import { Clock3, Settings2, Trophy } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function UserMenu() {
    return (
        <div className="flex items-center gap-1.5 sm:gap-2">
            <Badge
                variant="outline"
                className="h-8 gap-1.5 border-white/15 bg-white/5 px-2.5 text-[0.65rem] tracking-wide text-zinc-300"
            >
                <Trophy className="size-3 text-[#9ea2ff]" />
                LEVEL 24
            </Badge>
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                aria-label="History"
            >
                <Clock3 className="size-3.5" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                aria-label="Settings"
            >
                <Settings2 className="size-3.5" />
            </Button>
            <Button
                type="button"
                size="sm"
                className="h-8 bg-[#7274ff] px-3 text-[0.72rem] font-semibold text-white hover:bg-[#8789ff]"
            >
                Run Code
            </Button>
        </div>
    );
}
