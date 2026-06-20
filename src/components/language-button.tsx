import type { Language } from "@/services/solutions/types";
import { Button } from "./ui/button";

export default function LanguageButton({ language }: { language: Language }) {
    return <Button variant={"outline"}>{language}</Button>;
}
