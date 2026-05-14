import type { Solution } from "@/services/solutions/types";
import { LayoutDashboard, Search, Settings, User } from "lucide-react";
import { Javascript } from "./ui/svgs/javascript";
import { Python } from "./ui/svgs/python";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import type { Challenge } from "@/services/challenges/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/store/use-auth";

export function PlaygroundHeader({
    solutions,
    currentSolution,
    setCurrentSolution,
    challenge,
}: {
    solutions: Solution[];
    currentSolution: Solution;
    setCurrentSolution: (solution: Solution) => void;
    challenge: Challenge;
}) {
    const user = useAuth((s) => s.user);
    const CurrentIcon =
        currentSolution.language === "python" ? Python : Javascript;

    const initials = user?.nickname
        ? user.nickname.slice(0, 2).toUpperCase()
        : (user?.email?.slice(0, 2).toUpperCase() ?? "??");

    return (
        <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b">
            {/* Language Selector (Left) */}
            <div className="flex items-center gap-2">
                <div>
                    <h2 className="text-sm">{challenge.title}</h2>
                </div>

                <Select
                    value={currentSolution.language}
                    onValueChange={(value) => {
                        const selected = solutions.find(
                            (s) => s.solutionId === value,
                        );
                        if (selected) {
                            setCurrentSolution(selected);
                        }
                    }}
                >
                    <SelectTrigger>
                        <div className="flex items-center gap-2">
                            <CurrentIcon className="size-4" />
                            <SelectValue
                                placeholder="Select Language"
                                className="capitalize"
                            />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {solutions.map((solution) => {
                            const Icon =
                                solution.language === "python"
                                    ? Python
                                    : Javascript;

                            return (
                                <SelectItem
                                    key={solution.solutionId}
                                    value={solution.solutionId}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="size-4" />
                                        <span className="capitalize">
                                            {solution.language}
                                        </span>
                                    </div>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* Actions (Right) */}
            <div className="flex items-center gap-1">
                <Button size={"icon"} variant={"ghost"}>
                    <Search className="size-4 cursor-pointer" />
                </Button>
                <Button size={"icon"} variant={"ghost"}>
                    <Settings className="size-4 cursor-pointer" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="size-8 cursor-pointer">
                            <AvatarFallback className="text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-40">
                        <DropdownMenuItem>
                            <User className="size-4" />
                            <a href="http://localhost:3000/dashboard/profile">
                                View Profile
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <LayoutDashboard className="size-4" />
                            <a href="http://localhost:3000/dashboard">
                                Go to Dashboard
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
