"use client";

import Header from "@/components/global/header";
import InputBox from "@/components/global/input-box";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loader from "@/components/global/loader";
import BentoGrid from "@/components/global/bento-grid";
import clsx from "clsx";
import Note from "@/providers/types";
import { Search } from "lucide-react";
import FilterDialog from "@/components/global/filter-dialog";
import SummaryDialog from "@/components/global/summary-dialog";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const { isSignedIn, isLoaded } = useUser();
  const [ready, setReady] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryInput, setSummaryInput] = useState("");

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
        const serverNotes: { success: boolean; data: Note[] } =
          await res.json();

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

  const summaryHandler = async () => {
    if (!input.trim()) {
      toast.error("User input is empty");
      return;
    }

    if (input.trim().length < 20) {
      toast.error("Input too short for a proper summary");
      return;
    }

    await handleSearch(0.15);
    setSummaryOpen(true);
    setSummaryInput(input);
  };

  const handleSearch = async (threshold: number = 0.3) => {
    if (!input.trim()) {
      const localRaw = localStorage.getItem("notes");
      const all = localRaw ? (JSON.parse(localRaw) as Note[]) : [];
      setNotes(all);
      return;
    }

    const res = await fetch("/api/query-embedding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
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

    const queryTokens = input.toLowerCase().split(/\s+/);

    const scored = allNotes
      .map((note) => {
        const sim = cosineSimilarity(note.embedding, embedding);
        const boost = keywordBoost(note, queryTokens);
        return { ...note, score: sim + boost };
      })
      .filter((note) => note.score >= threshold)
      .sort((a, b) => b.score - a.score);

    setNotes(scored);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (!ready) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  const newNote: Note = {
    id: -1,
    userId: "",
    createdAt: "",
    note: "Create New Note...",
    type: "note",
    people: [],
    place: [],
    priority: null,
    timeRef: null,
    tags: [],
    isDone: null,
    embedding: [],
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: {} }}
      className={clsx(
        "max-h-screen min-h-screen w-screen p-8 flex flex-col space-y-7 overflow-auto no-scrollbar",
        "bg-[linear-gradient(135deg,_#fff_40%,_#fce7f3_100%)]",
        "dark:bg-[linear-gradient(135deg,_#000_30%,_#462f6b_100%)]",
        "backdrop-blur-2xl"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
      >
        <Header />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
      >
        <InputBox input={input} setInput={setInput} onKeyDown={handleKeyDown} />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.9 }}
        className="w-full max-w-5xl mx-auto flex items-center justify-end -mt-2"
      >
        <button
          className="bg-foreground text-background border font-bold tracking-wide px-4 py-2 rounded-xl"
          onClick={summaryHandler}
        >
          Summarize
        </button>
        <FilterDialog notes={notes} onFilter={setNotes} />
        <button
          className="bg-foreground text-background border font-bold tracking-wide flex flex-row gap-2 ml-3 items-center px-4 py-2 rounded-xl"
          onClick={() => handleSearch()}
        >
          <Search size={15} className="hidden md:flex" />
          <p>Search</p>
        </button>
      </motion.section>

      <BentoGrid
        items={[newNote, ...(Array.isArray(notes) ? notes : [])]}
        setNotes={setNotes}
      />
      <SummaryDialog
        input={summaryInput}
        notes={notes}
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
      />
    </motion.div>
  );
}
