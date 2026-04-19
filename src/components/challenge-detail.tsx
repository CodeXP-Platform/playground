import type { Challenge } from "@/services/challenges/types";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2 } from "lucide-react";

export function ChallengeDetail({ challenge }: { challenge: Challenge }) {
    return (
        <Tabs
            defaultValue="instructions"
            className="flex flex-col h-full w-full bg-[#111113] text-white"
        >
            <div className="shrink-0 h-10 border-b border-white/5 flex">
                <TabsList className="flex w-full h-full bg-transparent p-0 gap-0">
                    <TabsTrigger
                        value="instructions"
                        className="flex-1 rounded-none h-full data-active:bg-[#1A1A1E] data-active:text-white text-white/50 text-[10px] font-bold tracking-[0.15em] uppercase border-b-2 border-transparent data-active:border-[#7B8BFF] transition-none after:hidden"
                    >
                        Instructions
                    </TabsTrigger>
                    <div className="h-full w-px bg-white/5 shrink-0"></div>
                    <TabsTrigger
                        value="tests"
                        className="flex-1 rounded-none h-full data-active:bg-[#1A1A1E] data-active:text-white text-white/50 text-[10px] font-bold tracking-[0.15em] uppercase border-b-2 border-transparent data-active:border-[#7B8BFF] transition-none after:hidden"
                    >
                        Tests
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent
                value="instructions"
                className="flex-1 min-h-0 outline-none m-0 data-active:flex flex-col"
            >
                <ScrollArea className="h-full w-full">
                    <div className="p-6 md:p-8 space-y-6">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7B8BFF] uppercase">
                                Objective
                            </span>
                            <h2 className="text-xl font-bold mt-2 text-white/90 leading-tight">
                                {challenge.title}
                            </h2>
                        </div>

                        <div className="text-[13px] text-[#A1A1A9] leading-relaxed prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-[#09090B] prose-pre:border prose-pre:border-white/5">
                            <ReactMarkdown>
                                {challenge.description}
                            </ReactMarkdown>
                        </div>

                        <div className="bg-[#09090B] rounded-xl p-5 border border-white/5 space-y-4">
                            <div className="flex items-start gap-3 text-[13px] text-[#A1A1A9]">
                                <CheckCircle2 className="size-4 text-[#7B8BFF] shrink-0 mt-0.5" />
                                <span>
                                    Implement the required logic for{" "}
                                    {challenge.title}
                                </span>
                            </div>
                            <div className="flex items-start gap-3 text-[13px] text-[#A1A1A9]">
                                <CheckCircle2 className="size-4 text-[#7B8BFF] shrink-0 mt-0.5" />
                                <span>Return the expected output format</span>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </TabsContent>

            <TabsContent
                value="tests"
                className="flex-1 min-h-0 outline-none m-0 data-active:flex flex-col"
            >
                <ScrollArea className="h-full w-full">
                    <div className="p-6 md:p-8 text-[13px] text-[#A1A1A9] flex flex-col items-center justify-center h-full mt-10 text-center opacity-50">
                        <p>Test cases will be displayed here.</p>
                    </div>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    );
}
