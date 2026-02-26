"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Note from "@/providers/types";
import Image from "next/image";

import Sidebar, { type ViewType } from "@/components/global/sidebar";
import Loader from "@/components/global/loader";
import FilterPanel from "@/components/global/filter-panel";
import NoteEditorModal from "@/components/global/note-editor-modal";
import SearchBar from "@/components/global/search-bar";

import JotSpaceView from "@/components/views/JotSpaceView";
import BoardView from "@/components/views/BoardView";
import TodoView from "@/components/views/TodoView";
import TimelineView from "@/components/views/TimelineView";
import SummariesView from "@/components/views/SummariesView";

import {
  PenLine,
  LayoutGrid,
  CheckSquare,
  Clock,
  Filter,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  const [notes, setNotes] = useState<Note[]>([]);
  const [ready, setReady] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearchFiltered, setIsSearchFiltered] = useState(false);

  const [activeView, setActiveView] = useState<ViewType>("jot");
  const [filterOpen, setFilterOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [editNote, setEditNote] = useState<Note | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const [triggerSummarize, setTriggerSummarize] = useState(false);
  // Store the query at trigger time so it survives state changes
  const summarizeQueryRef = useRef("");

  useEffect(() => {
    const run = async () => {
      const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
      const localRaw = localStorage.getItem("notes");
      const local: Note[] | null = localRaw ? JSON.parse(localRaw) : null;

      if (isOffline) {
        if (local && local.length) {
          setNotes(local);
          setReady(true);
        } else {
          router.replace("/sign-in");
        }
        return;
      }

      if (isLoaded && !isSignedIn) {
        router.replace("/sign-in");
        return;
      }

      if (!isLoaded) return;

      try {
        const res = await fetch("/api/notes");
        if (!res.ok) throw new Error("Fetch failed");
        const serverNotes: { success: boolean; data: Note[] } = await res.json();
        if (!serverNotes.success) throw new Error("Invalid response");

        localStorage.setItem("notes", JSON.stringify(serverNotes.data));
        setNotes(serverNotes.data);
        setReady(true);
      } catch (err) {
        if (local && local.length) {
          setNotes(local);
        } else {
          router.replace("/sign-in");
        }
        console.error(err);
        setReady(true);
      }
    };

    run();
  }, [isLoaded, isSignedIn]);

  const handleSearch = async (threshold: number = 0.15) => {
    if (!searchInput.trim()) {
      // Empty search = show all
      const localRaw = localStorage.getItem("notes");
      const all = localRaw ? (JSON.parse(localRaw) as Note[]) : [];
      setNotes(all);
      setIsSearchFiltered(false);
      return;
    }

    const res = await fetch("/api/query-embedding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: searchInput }),
    });

    if (!res.ok) return;
    const { embedding } = await res.json();
    const localRaw = localStorage.getItem("notes");
    const allNotes = localRaw ? (JSON.parse(localRaw) as Note[]) : [];

    function cosineSimilarity(vecA: number[], vecB: number[]): number {
      const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
      const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
      const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
      return magA && magB ? dot / (magA * magB) : 0;
    }

    function keywordBoost(note: Note, tokens: string[]): number {
      let boost = 0;
      const text = note.note.toLowerCase();
      for (const t of tokens) {
        if (text.includes(t)) boost += 0.15;
        if (note.tags?.length) {
          for (const tag of note.tags) {
            const tagLower = tag.toLowerCase();
            if (tagLower === t) boost += 0.3;
            else if (tagLower.includes(t)) boost += 0.15;
          }
        }
        if (note.type?.toLowerCase().includes(t)) boost += 0.1;
      }
      return boost;
    }

    const queryTokens = searchInput.toLowerCase().split(/\s+/);
    const scored = allNotes
      .map((note) => {
        const sim = cosineSimilarity(note.embedding, embedding);
        const boost = keywordBoost(note, queryTokens);
        return { ...note, score: sim + boost };
      })
      .filter((note) => note.score >= threshold)
      .sort((a, b) => b.score - a.score);

    setNotes(scored);
    setIsSearchFiltered(true);
    // Do NOT clear searchInput — keep it visible
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setIsSearchFiltered(false);
    const localRaw = localStorage.getItem("notes");
    const all = localRaw ? (JSON.parse(localRaw) as Note[]) : [];
    setNotes(all);
  };

  const handleSummarize = async () => {
    if (!searchInput.trim()) {
      toast.error("Enter a query to summarize");
      return;
    }
    if (searchInput.trim().length < 20) {
      toast.error("Input too short for a proper summary");
      return;
    }
    // Store query before search (search won't clear it anymore, but be safe)
    summarizeQueryRef.current = searchInput;
    await handleSearch(0.1);
    setActiveView("summaries");
    setTriggerSummarize(true);
  };

  const taskToggle = async (id: number, state: boolean) => {
    let previousState: Note[] = [];
    setNotes((prev) => {
      previousState = prev;
      const updated = prev.map((note) =>
        note.id === id ? { ...note, isDone: !note.isDone } : note
      );
      localStorage.setItem("notes", JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch("/api/task-toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, state }),
      });
      toast.success("Task updated");
    } catch {
      setNotes(previousState);
      localStorage.setItem("notes", JSON.stringify(previousState));
      toast.error("Failed to update task");
    }
  };

  const deleteNote = async (id: number) => {
    toast.info("Deleting...");
    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        toast.error("Failed to delete note");
        return;
      }
      setNotes((prev) => {
        const updated = prev.filter((n) => n.id !== id);
        localStorage.setItem("notes", JSON.stringify(updated));
        return updated;
      });
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const createNote = async (text: string) => {
    setIsCreating(true);
    toast.info("Extracting notes...");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error("Extraction failed. Try again.");
        return;
      }
      const newNotes = data.data as Note[];
      setNotes((prev) => {
        const updated = [...newNotes, ...prev];
        localStorage.setItem("notes", JSON.stringify(updated));
        return updated;
      });
      toast.success(`${newNotes.length} notes extracted`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditNote(note);
    setEditorOpen(true);
  };

  if (!ready) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-black">
        <Loader />
      </div>
    );
  }

  const showSearchBar = activeView !== "jot" && activeView !== "summaries";

  const MOBILE_NAV: { key: ViewType; icon: React.ReactNode; label: string }[] = [
    { key: "jot", icon: <PenLine size={18} />, label: "Jot" },
    { key: "board", icon: <LayoutGrid size={18} />, label: "Board" },
    { key: "todo", icon: <CheckSquare size={18} />, label: "Tasks" },
    { key: "timeline", icon: <Clock size={18} />, label: "Timeline" },
    { key: "summaries", icon: <Sparkles size={18} />, label: "Summaries" },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onFilterToggle={() => setFilterOpen((p) => !p)}
        filterCount={0}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-white/[0.04] md:hidden shrink-0">
          <div className="flex items-center gap-2">
            <Image src="/logo-dark.svg" alt="Neuronote" width={20} height={20} />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Neuronote
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOpen((p) => !p)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <Filter size={16} />
            </button>
            <UserButton />
          </div>
        </div>

        {/* Desktop top bar — filter next to avatar */}
        <div className="hidden md:flex items-center justify-end gap-2 h-12 px-6 border-b border-white/[0.04] shrink-0">
          <button
            onClick={() => setFilterOpen((p) => !p)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter size={16} />
          </button>
          <UserButton />
        </div>

        {/* Sticky search bar for data views */}
        {showSearchBar && (
          <div className="shrink-0 px-6 py-3 border-b border-white/[0.04] bg-black">
            <SearchBar
              input={searchInput}
              setInput={setSearchInput}
              onSearch={() => handleSearch()}
              onSummarize={handleSummarize}
              onClear={handleClearSearch}
              isFiltered={isSearchFiltered}
            />
          </div>
        )}

        {/* View content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {activeView === "jot" && (
            <JotSpaceView
              onCreateNote={createNote}
              isCreating={isCreating}
            />
          )}
          {activeView === "board" && (
            <BoardView
              notes={notes}
              onEdit={handleEdit}
              onDelete={deleteNote}
              onTaskToggle={taskToggle}
            />
          )}
          {activeView === "todo" && (
            <TodoView
              notes={notes}
              onEdit={handleEdit}
              onDelete={deleteNote}
              onTaskToggle={taskToggle}
            />
          )}
          {activeView === "timeline" && (
            <TimelineView
              notes={notes}
              onEdit={handleEdit}
              onDelete={deleteNote}
              onTaskToggle={taskToggle}
            />
          )}
          {activeView === "summaries" && (
            <SummariesView
              input={summarizeQueryRef.current || searchInput}
              notes={notes}
              triggerGenerate={triggerSummarize}
              onGenerateDone={() => setTriggerSummarize(false)}
            />
          )}
        </div>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex items-center justify-around h-14 border-t border-white/[0.04] bg-[#050505] shrink-0">
          {MOBILE_NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
                activeView === item.key ? "text-neon" : "text-muted-foreground"
              }`}
            >
              {item.icon}
              <span className="text-[9px]">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <FilterPanel
        notes={notes}
        onFilter={setNotes}
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      />

      <NoteEditorModal
        note={editNote}
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setEditNote(null);
        }}
        setNotes={setNotes}
      />
    </div>
  );
}
