"use client";

import { useRef, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Send } from "lucide-react";
import { toast } from "sonner";

const DEMO_DUMP = `Okay so here's what's going on. I just got off the call with the Series B leads and they want us to close by March 15th which is insane but doable if we hit the metrics. Revenue needs to be at 2.3M ARR minimum. Right now we're at 1.8M so we need to close those three enterprise deals — Acme Corp, Meridian Health, and that fintech startup from the YC batch, I think they're called NovaPay.

I need to tell Marcus to prioritize the API redesign because Acme specifically asked about webhook support and our current implementation is embarrassing honestly. The latency on the event pipeline is over 400ms which is unacceptable for real-time use cases. We need to get that under 50ms.

Also reminder to myself — schedule the team offsite for next month, probably somewhere in Austin. Budget is around 15k. Need to book flights for the remote team members: Sarah in London, Kenji in Tokyo, and Priya in Bangalore.

The product roadmap needs updating. We're deprioritizing the mobile app and going all-in on the desktop experience and API-first approach. The mobile team — that's four engineers — should shift to the platform team starting next sprint. I need to have that conversation with Elena because she's been leading mobile and she's not going to be happy about it.

On the hiring front we desperately need a senior DevOps engineer. The infrastructure is held together with duct tape. Our AWS bill last month was $47k which is absurd for our scale. I bet we can cut that by 40% with proper optimization. Also need to post the Staff Engineer role — someone who can own the data pipeline end to end.

Personal note: don't forget Mom's birthday is March 3rd. Need to order that ceramic vase she mentioned from that shop in Portland. Also my annual physical is next Tuesday at 10am with Dr. Patterson.

Back to work stuff — the competitor analysis from last week showed that Dataweave just raised $50M and they're hiring aggressively in our space. We need to differentiate on developer experience. Our docs are terrible and the onboarding flow has a 60% drop-off rate. I want to assign a dedicated DX engineer to this. Maybe we can poach someone from Stripe or Vercel, they have the best docs in the industry.

Key decisions to make this week: 1) Do we build or buy the analytics module? 2) Should we open-source the SDK? 3) Which pricing tier do we kill — the starter plan is cannibalizing pro signups.`;

interface JotSpaceViewProps {
  onCreateNote: (text: string) => void;
  isCreating: boolean;
}

export default function JotSpaceView({
  onCreateNote,
  isCreating,
}: JotSpaceViewProps) {
  const { user } = useUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey && !e.altKey && textareaRef.current) {
        textareaRef.current.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const greeting = (() => {
    const hour = new Date().getHours();
    const name = user?.firstName || "there";
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 16) return `Good afternoon, ${name}`;
    if (hour < 20) return `Good evening, ${name}`;
    return `Welcome back, ${name}`;
  })();

  const handleSubmit = () => {
    if (!text.trim()) {
      toast.error("Nothing to extract");
      return;
    }
    onCreateNote(text);
    setText("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
        {greeting}
      </h1>

      {/* Main input for jotting */}
      <div className="relative rounded-xl border border-white/[0.06] bg-surface focus-within:border-neon/30 focus-within:neon-glow transition-all duration-300">
        <textarea
          ref={textareaRef}
          className="no-scrollbar w-full bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none resize-none min-h-[140px]"
          placeholder="Dump your thoughts, meeting notes, ideas, anything..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="flex items-center justify-between px-3 pb-3">
          <span className="text-[10px] text-muted-foreground/50">
            {"\u2318"}+Enter to extract
          </span>
          <button
            onClick={handleSubmit}
            disabled={isCreating}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-neon/10 text-neon border border-neon/20 hover:bg-neon/20 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Send size={12} />
            {isCreating ? "Extracting..." : "Extract & Save"}
          </button>
        </div>
      </div>

      {/* Demo section — clean, no label/reset */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-neon-bright transition-colors w-fit"
        >
          <span className="w-4 h-px bg-current" />
          {showDemo ? "Hide" : "Try"} demo input
          <span className="w-4 h-px bg-current" />
        </button>

        {showDemo && (
          <div className="flex flex-col gap-3 rounded-xl border border-neon/10 bg-surface p-4">
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {DEMO_DUMP}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  onCreateNote(DEMO_DUMP);
                }}
                disabled={isCreating}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-neon/10 text-neon border border-neon/20 hover:bg-neon/20 disabled:opacity-50 transition-colors"
              >
                {isCreating ? "Extracting..." : "Extract this demo"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
