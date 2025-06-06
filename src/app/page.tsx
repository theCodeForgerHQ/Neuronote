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

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const { isSignedIn, isLoaded } = useUser();
  const [ready, setReady] = useState(false);

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
        setReady(true);
      }
    };

    run();
  }, [isLoaded, isSignedIn]);

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
      variants={{
        hidden: {},
        visible: {},
      }}
      className={clsx(
        "max-h-screen min-h-screen w-screen p-8 flex flex-col space-y-7 overflow-auto no-scrollbar",
        "bg-[linear-gradient(135deg,_#fff_40%,_#fce7f3_100%)]",
        "dark:bg-[linear-gradient(135deg,_#000_30%,_#462f6b_100%)]",
        "backdrop-blur-2xl"
      )}
    >
      {/* Header Animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
      >
        <Header />
      </motion.div>

      {/* InputBox Animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
      >
        <InputBox input={input} setInput={setInput} />
      </motion.div>

      {/* Button Animation */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.9 }}
        className="w-full max-w-5xl mx-auto flex items-center justify-end -mt-2"
      >
        <button
          className="bg-foreground text-background border font-bold tracking-wide px-4 py-2 rounded-xl"
          onClick={() => setInput("")}
        >
          Smart Summary
        </button>
      </motion.section>
      <BentoGrid
        items={[newNote, ...(Array.isArray(notes) ? notes : [])]}
        setNotes={setNotes}
      />
    </motion.div>
  );
}
