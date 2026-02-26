"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import Note from "@/providers/types";

interface FilterPanelProps {
  notes: Note[];
  onFilter: (filtered: Note[]) => void;
  open: boolean;
  onClose: () => void;
}

interface FilterGroup {
  key: string;
  label: string;
  values: string[];
}

export default function FilterPanel({ notes, onFilter, open, onClose }: FilterPanelProps) {
  const [selected, setSelected] = useState<Record<string, Set<string>>>(Object.create(null));

  const groups: FilterGroup[] = useMemo(() => {
    const fieldMap: Record<string, Set<string>> = {
      type: new Set(),
      status: new Set(),
      priority: new Set(),
      category: new Set(),
      urgency: new Set(),
      sentiment: new Set(),
      tags: new Set(),
      people: new Set(),
      place: new Set(),
      isDone: new Set(),
    };

    for (const note of notes) {
      fieldMap.type.add(note.type);
      note.people.forEach((p) => fieldMap.people.add(p));
      note.place.forEach((p) => fieldMap.place.add(p));
      if (note.priority) fieldMap.priority.add(note.priority);
      note.tags.forEach((t) => fieldMap.tags.add(t));
      if (note.isDone !== null) fieldMap.isDone.add(note.isDone.toString());
      if (note.category) fieldMap.category.add(note.category);
      if (note.urgency) fieldMap.urgency.add(note.urgency);
      if (note.sentiment) fieldMap.sentiment.add(note.sentiment);
      if (note.status) fieldMap.status.add(note.status);
    }

    const labels: Record<string, string> = {
      type: "Type",
      status: "Status",
      priority: "Priority",
      category: "Category",
      urgency: "Urgency",
      sentiment: "Sentiment",
      tags: "Tags",
      people: "People",
      place: "Place",
      isDone: "Task Status",
    };

    return Object.entries(fieldMap)
      .filter(([, set]) => set.size > 0)
      .map(([key, set]) => ({
        key,
        label: labels[key] || key,
        values: [...set].sort(),
      }));
  }, [notes]);

  const toggleValue = (field: string, value: string) => {
    setSelected((prev) => {
      const next = new Set(prev[field] || []);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, [field]: next };
    });
  };

  const activeCount = Object.values(selected).reduce((c, s) => c + s.size, 0);

  const applyFilter = () => {
    const localRaw = localStorage.getItem("notes");
    const allNotes = localRaw ? (JSON.parse(localRaw) as Note[]) : notes;

    const filtered = allNotes.filter((note) => {
      for (const [key, set] of Object.entries(selected)) {
        if (!set.size) continue;
        if (key === "type" && !set.has(note.type)) return false;
        if (key === "priority" && note.priority && !set.has(note.priority)) return false;
        if (key === "people" && !note.people.some((p) => set.has(p))) return false;
        if (key === "place" && !note.place.some((p) => set.has(p))) return false;
        if (key === "tags" && !note.tags.some((t) => set.has(t))) return false;
        if (key === "isDone" && !set.has((note.isDone as boolean)?.toString())) return false;
        if (key === "category" && note.category && !set.has(note.category)) return false;
        if (key === "urgency" && note.urgency && !set.has(note.urgency)) return false;
        if (key === "sentiment" && note.sentiment && !set.has(note.sentiment)) return false;
        if (key === "status" && note.status && !set.has(note.status)) return false;
      }
      return true;
    });

    onFilter(filtered);
    onClose();
  };

  const clearAll = () => {
    setSelected(Object.create(null));
    const localRaw = localStorage.getItem("notes");
    const allNotes = localRaw ? (JSON.parse(localRaw) as Note[]) : [];
    onFilter(allNotes);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 z-50 flex flex-col bg-[#0a0a0a] border-l border-white/[0.06]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Filters</span>
          {activeCount > 0 && (
            <span className="text-[10px] bg-neon/10 text-neon px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Filter groups */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </span>
              {selected[group.key]?.size > 0 && (
                <button
                  onClick={() =>
                    setSelected((prev) => {
                      const next = { ...prev };
                      delete next[group.key];
                      return next;
                    })
                  }
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.values.map((value) => {
                const isActive = selected[group.key]?.has(value);
                return (
                  <button
                    key={value}
                    onClick={() => toggleValue(group.key, value)}
                    className={`px-2.5 py-1 rounded-md text-[11px] border transition-colors capitalize ${
                      isActive
                        ? "bg-neon/10 text-neon border-neon/30"
                        : "bg-transparent text-muted-foreground border-white/[0.06] hover:border-white/[0.12] hover:text-foreground"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 py-4 border-t border-white/[0.06]">
        <button
          onClick={clearAll}
          className="flex-1 px-3 py-2 rounded-lg text-xs text-muted-foreground border border-white/[0.06] hover:border-white/[0.12] hover:text-foreground transition-colors"
        >
          Reset
        </button>
        <button
          onClick={applyFilter}
          className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-neon/10 text-neon border border-neon/20 hover:bg-neon/20 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
