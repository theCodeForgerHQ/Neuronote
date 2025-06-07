"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { BackgroundGradient } from "../ui/background-gradient";

export default function InputBox({
  input,
  setInput,
  onKeyDown,
}: {
  input: string;
  setInput: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  const { user } = useUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey && !e.altKey && textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto h-fit">
      <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-center text-foreground mb-4 drop-shadow-lg tracking-wide">
        {(() => {
          const hour = new Date().getHours();
          const name = user?.firstName || "there";
          if (hour < 12) return `Good morning, ${name}.`;
          if (hour < 16) return `Good afternoon, ${name}.`;
          if (hour < 20) return `Good evening, ${name}.`;
          return `Welcome back, ${name}.`;
        })()}
      </h1>
      <BackgroundGradient className="w-5xl max-w-[90vw] bg-background rounded-3xl p-3">
        <textarea
          ref={textareaRef}
          className="no-scrollbar w-full border-0 bg-background  focus-visible:border-0 focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none min-h-[120px]"
          placeholder="Search by keyword, sentence, or concept..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </BackgroundGradient>
    </section>
  );
}
