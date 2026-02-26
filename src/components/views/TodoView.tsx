"use client";

import Note from "@/providers/types";
import { CheckCircle2, Circle, Flag, Clock } from "lucide-react";

interface TodoViewProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onTaskToggle: (id: number, state: boolean) => void;
}

const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
const priorityColor: Record<string, string> = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-emerald-400",
};

export default function TodoView({ notes, onEdit, onDelete, onTaskToggle }: TodoViewProps) {
  const tasks = notes.filter((n) => n.type === "task");
  const pending = tasks
    .filter((t) => !t.isDone)
    .sort((a, b) => (priorityOrder[a.priority || "low"] ?? 2) - (priorityOrder[b.priority || "low"] ?? 2));
  const completed = tasks.filter((t) => t.isDone);

  if (!tasks.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        No tasks found. Tasks are auto-extracted from your brain dumps.
      </div>
    );
  }

  const TaskRow = ({ task }: { task: Note }) => (
    <div className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/[0.02] transition-colors">
      <button
        onClick={() => onTaskToggle(task.id, !task.isDone)}
        className="shrink-0"
      >
        {task.isDone ? (
          <CheckCircle2 size={18} className="text-neon" />
        ) : (
          <Circle size={18} className="text-muted-foreground hover:text-neon transition-colors" />
        )}
      </button>
      <button onClick={() => onEdit(task)} className="flex-1 text-left min-w-0">
        <p className={`text-sm ${task.isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.note}
        </p>
      </button>
      <div className="flex items-center gap-2 shrink-0">
        {task.priority && (
          <Flag size={12} className={priorityColor[task.priority] || "text-muted-foreground"} />
        )}
        {task.dueDate && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock size={9} />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400 text-xs px-1"
        >
          &times;
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      {pending.length > 0 && (
        <section>
          <div className="flex items-center gap-2 px-4 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              To Do
            </span>
            <span className="text-[10px] text-muted-foreground bg-white/[0.03] px-1.5 py-0.5 rounded">
              {pending.length}
            </span>
          </div>
          <div className="flex flex-col rounded-xl border border-white/[0.04] bg-surface divide-y divide-white/[0.03]">
            {pending.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}
      {completed.length > 0 && (
        <section>
          <div className="flex items-center gap-2 px-4 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Done
            </span>
            <span className="text-[10px] text-muted-foreground bg-white/[0.03] px-1.5 py-0.5 rounded">
              {completed.length}
            </span>
          </div>
          <div className="flex flex-col rounded-xl border border-white/[0.04] bg-surface/50 divide-y divide-white/[0.03]">
            {completed.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
