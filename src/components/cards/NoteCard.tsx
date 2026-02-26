"use client";

import Note from "@/providers/types";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex flex-col gap-2.5 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-neon/20 transition-all duration-200"
    >
      <p className="text-sm leading-relaxed text-foreground">{note.note}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {note.category && (
          <span className="text-[10px] text-muted-foreground bg-white/[0.03] px-1.5 py-0.5 rounded capitalize">
            {note.category}
          </span>
        )}
        {note.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] text-neon-bright/70 bg-neon/5 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
        <span className="text-[10px] text-muted-foreground ml-auto">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}
