"use client";

import Note from "@/providers/types";
import { Calendar, MapPin } from "lucide-react";

interface EventCardProps {
  note: Note;
  onClick: () => void;
}

export default function EventCard({ note, onClick }: EventCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex flex-col gap-3 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-blue-500/30 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-blue-400 shrink-0" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-blue-400/70">Event</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{note.note}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {note.timeRef && (
          <span className="inline-flex items-center gap-1 text-[10px] text-blue-400/70">
            <Calendar size={9} />
            {new Date(note.timeRef).toLocaleDateString()}
          </span>
        )}
        {note.place?.map((p) => (
          <span key={p} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin size={9} />
            {p}
          </span>
        ))}
        {note.people?.slice(0, 2).map((person) => (
          <span key={person} className="text-[10px] text-neon-bright/70 bg-neon/5 px-1.5 py-0.5 rounded">
            {person}
          </span>
        ))}
      </div>
    </button>
  );
}
