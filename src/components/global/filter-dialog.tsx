// File: components/global/filter-dialog.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import Note from "@/providers/types";

type FilterDialogProps = {
  notes: Note[];
  onFilter: (filtered: Note[]) => void;
};

export default function FilterDialog({ notes, onFilter }: FilterDialogProps) {
  const [selected, setSelected] = useState<Record<string, Set<string>>>(
    Object.create(null)
  );
  const [open, setOpen] = useState(false);

  const fields = useMemo(() => {
    const fieldMap: Record<string, Set<string>> = {
      type: new Set(),
      people: new Set(),
      place: new Set(),
      priority: new Set(),
      timeRef: new Set(),
      tags: new Set(),
      isDone: new Set(),
    };

    for (const note of notes) {
      fieldMap.type.add(note.type);
      note.people.forEach((p) => fieldMap.people.add(p));
      note.place.forEach((p) => fieldMap.place.add(p));
      if (note.priority) fieldMap.priority.add(note.priority);
      if (note.timeRef) fieldMap.timeRef.add(note.timeRef);
      note.tags.forEach((t) => fieldMap.tags.add(t));
      if (note.isDone !== null) fieldMap.isDone.add(note.isDone.toString());
    }

    return fieldMap;
  }, [notes]);

  const toggleValue = (field: string, value: string) => {
    setSelected((prev) => {
      const next = new Set(prev[field] || []);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [field]: next };
    });
  };

  const clearAll = () => {
    setSelected(Object.create(null));
    const localRaw = localStorage.getItem("notes");
    const allNotes = localRaw ? (JSON.parse(localRaw) as Note[]) : [];
    onFilter(allNotes);
  };

  const applyFilter = () => {
    const filtered = notes.filter((note) => {
      for (const [key, set] of Object.entries(selected)) {
        if (!set.size) continue;
        if (key === "type" && !set.has(note.type)) return false;
        if (key === "priority" && note.priority && !set.has(note.priority))
          return false;
        if (key === "timeRef" && note.timeRef && !set.has(note.timeRef))
          return false;
        if (key === "people" && !note.people.some((p) => set.has(p)))
          return false;
        if (key === "place" && !note.place.some((p) => set.has(p)))
          return false;
        if (key === "tags" && !note.tags.some((t) => set.has(t))) return false;
        if (key === "isDone" && !set.has((note.isDone as boolean)?.toString()))
          return false;
      }
      return true;
    });

    onFilter(filtered);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-foreground text-background border font-bold tracking-wide flex flex-row gap-2 ml-3 items-center px-4 py-2 rounded-xl">
          <Filter size={15} />
          <span>Filter</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Filter Notes</DialogTitle>
          <DialogDescription>
            Select values for each field to filter notes.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="type">
          <TabsList className="overflow-x-auto w-full">
            {Object.keys(fields).map((key) => (
              <TabsTrigger key={key} value={key} className="capitalize">
                {key === "isDone" ? "Task Status" : key}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(fields).map(([key, values]) => (
            <TabsContent
              key={key}
              value={key}
              className="grid grid-cols-2 gap-2 p-2 max-h-[200px] overflow-auto no-scrollbar"
            >
              {[...values].map((value) => (
                <label key={value} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selected[key]?.has(value) || false}
                    onCheckedChange={() => toggleValue(key, value)}
                  />
                  <span className="capitalize text-sm">{value}</span>
                </label>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={clearAll}>
            Reset Filter
          </Button>
          <Button
            onClick={applyFilter}
            className="bg-foreground text-background hover:bg-foreground hover:text-background"
          >
            Apply Filter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
