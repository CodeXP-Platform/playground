import type { Challenge } from "@/services/challenges/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChallengeDetail({ challenge }: { challenge: Challenge }) {
    return (
        <Tabs
            defaultValue="instructions"
            className="flex flex-col h-full w-full bg-[#111113] text-white"
        >
            <div className="shrink-0 border-b border-white/5 flex p-2">
                <TabsList className="flex w-full h-full bg-transparent p-0 gap-0">
                    <TabsTrigger value="instructions">Instructions</TabsTrigger>
                    <TabsTrigger value="tests">Tests</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent
                value="instructions"
                className="flex-1 min-h-0 outline-none m-0 data-active:flex flex-col"
            >
                <ScrollArea className="h-full w-full">
                    <div className="p-4">
                        <div>
                            <h2 className="text-xl font-bold text-white/90 leading-tight">
                                {challenge.title}
                            </h2>
                        </div>

                        <div className="text-[13px] text-[#A1A1A9] leading-relaxed prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-[#09090B] prose-pre:border prose-pre:border-white/5 prose-a:text-[#7B8BFF] hover:prose-a:text-[#9AA8FF]">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    a: ({ href, children, ...props }) => {
                                        if (href?.startsWith("/")) {
                                            return (
                                                <Link to={href} {...props}>
                                                    {children}
                                                </Link>
                                            );
                                        }
                                        return (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                {...props}
                                            >
                                                {children}
                                            </a>
                                        );
                                    },
                                }}
                            >
                                {challenge.description}
                            </ReactMarkdown>
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
