"use client";

import Note from "@/providers/types";
import { Brain } from "lucide-react";

interface InsightCardProps {
  note: Note;
  onClick: () => void;
}

const sentimentColor: Record<string, string> = {
  positive: "text-emerald-400 bg-emerald-400/10",
  negative: "text-red-400 bg-red-400/10",
  neutral: "text-gray-400 bg-gray-400/10",
  mixed: "text-yellow-400 bg-yellow-400/10",
};

export default function InsightCard({ note, onClick }: InsightCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex flex-col gap-3 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-neon/30 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <Brain size={14} className="text-neon shrink-0" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-neon/70">Insight</span>
        {note.sentiment && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded ml-auto ${sentimentColor[note.sentiment] || ""}`}>
            {note.sentiment}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{note.note}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {note.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] text-neon-bright/70 bg-neon/5 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
