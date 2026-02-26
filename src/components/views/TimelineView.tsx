"use client";

import Note from "@/providers/types";
import NoteCardRouter from "@/components/cards/NoteCardRouter";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface TimelineViewProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onTaskToggle: (id: number, state: boolean) => void;
}

function isPastDue(date: string): boolean {
  return new Date(date).getTime() < Date.now();
}

export default function TimelineView({ notes, onEdit, onDelete, onTaskToggle }: TimelineViewProps) {
  const tasksWithDeadline = notes
    .filter((n) => n.type === "task" && n.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  const otherNotes = notes
    .filter((n) => !(n.type === "task" && n.dueDate))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const otherGroups: Record<string, Note[]> = {};
  for (const note of otherNotes) {
    const key = new Date(note.createdAt).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    if (!otherGroups[key]) otherGroups[key] = [];
    otherGroups[key].push(note);
  }

  if (!notes.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        No notes to display on the timeline.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-10">
      {tasksWithDeadline.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-neon" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Task Deadlines
            </span>
          </div>
          <div className="flex flex-col">
            {tasksWithDeadline.map((task) => {
              const pastDue = !task.isDone && isPastDue(task.dueDate!);
              const dueDate = new Date(task.dueDate!);
              return (
                <div key={task.id} className="relative flex gap-6">
                  <div className="flex flex-col items-center shrink-0 w-4">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                        task.isDone
                          ? "bg-emerald-400"
                          : pastDue
                          ? "bg-red-400"
                          : "bg-neon/60"
                      }`}
                    />
                    <div className="flex-1 w-px bg-white/[0.06]" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        {dueDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {pastDue && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                          <AlertTriangle size={9} />
                          Past due
                        </span>
                      )}
                      {task.isDone && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                          <CheckCircle2 size={9} />
                          Done
                        </span>
                      )}
                    </div>
                    <NoteCardRouter
                      note={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onTaskToggle={onTaskToggle}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {Object.keys(otherGroups).length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              All Notes
            </span>
          </div>
          <div className="flex flex-col">
            {Object.entries(otherGroups).map(([date, items]) => (
              <div key={date} className="relative flex gap-6">
                <div className="flex flex-col items-center shrink-0 w-4">
                  <div className="w-2 h-2 rounded-full bg-neon/40 mt-1.5 shrink-0" />
                  <div className="flex-1 w-px bg-white/[0.06]" />
                </div>
                <div className="flex-1 pb-6">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {date}
                  </span>
                  <div className="flex flex-col gap-2 mt-3">
                    {items.map((note) => (
                      <NoteCardRouter
                        key={note.id}
                        note={note}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onTaskToggle={onTaskToggle}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
