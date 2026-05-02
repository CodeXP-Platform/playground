import type { Challenge } from "@/services/challenges/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Utility function to unindent template literals
function dedent(str: string) {
    if (!str) return "";

    // Convert literal "\n" strings to actual newlines if they exist
    const normalizedStr = str.replace(/\\n/g, "\n");

    // Trim every line individually to remove any leading/trailing whitespace
    // that might cause markdown to treat headings as code blocks or text
    return normalizedStr
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
}

export function ChallengeDetail({ challenge }: { challenge: Challenge }) {
    return (
        <Tabs
            defaultValue="instructions"
            className="flex flex-col h-full w-full"
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
                        <div className="text-sm leading-relaxed prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-none prose-a:text-[#7B8BFF] hover:prose-a:text-[#9AA8FF]">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    code({ className, children, ...rest }) {
                                        const match = /language-(\w+)/.exec(
                                            className || "",
                                        );
                                        return match ? (
                                            <SyntaxHighlighter
                                                PreTag="div"
                                                language={match[1]}
                                                style={vscDarkPlus}
                                                customStyle={{
                                                    margin: "1.5em 0",
                                                    borderRadius: "0.75rem",
                                                    fontSize: "13px",
                                                    border: "1px solid rgba(255,255,255,0.05)",
                                                    backgroundColor: "#09090B",
                                                }}
                                                {...rest}
                                            >
                                                {String(children).replace(
                                                    /\n$/,
                                                    "",
                                                )}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code
                                                className="bg-[#1A1A1E] text-[#A1A1A9] px-1.5 py-0.5 rounded-md border border-white/5 text-[12px] font-mono"
                                                {...rest}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
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
                                {dedent(challenge.description)}
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
