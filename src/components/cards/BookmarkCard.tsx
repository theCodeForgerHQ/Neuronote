"use client";

import Note from "@/providers/types";
import { Bookmark, ExternalLink } from "lucide-react";

interface BookmarkCardProps {
  note: Note;
  onClick: () => void;
}

export default function BookmarkCard({ note, onClick }: BookmarkCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex flex-col gap-3 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-orange-500/30 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <Bookmark size={14} className="text-orange-400 shrink-0" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-orange-400/70">Bookmark</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{note.note}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {note.source && (
          <span className="inline-flex items-center gap-1 text-[10px] text-orange-400/70">
            <ExternalLink size={9} />
            {note.source}
          </span>
        )}
        {note.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[10px] text-neon-bright/70 bg-neon/5 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
