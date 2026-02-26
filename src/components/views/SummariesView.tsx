"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { ArrowLeft, Copy, Download, Trash2, BookmarkMinus, Bookmark, Search, X } from "lucide-react";
import { type Summary } from "@/providers/types";
import Loader from "@/components/global/loader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

function cleanMarkdown(input: string): string {
  if (input.startsWith("```markdown") && input.endsWith("```")) {
    return input.replace(/^```markdown/, "").replace(/```$/, "").trim();
  }
  return input.trim();
}

const SESSION_KEY = "neuronote_summaries";
const SAVED_KEY = "neuronote_saved_summaries";

type SessionSummary = Summary & { isSaved: boolean };

function loadSession(): SessionSummary[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSession(items: SessionSummary[]) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(items));
}

function loadSavedCache(): Summary[] {
  try {
    const raw = sessionStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSavedCache(items: Summary[]) {
  sessionStorage.setItem(SAVED_KEY, JSON.stringify(items));
}

interface SummariesViewProps {
  input: string;
  notes: { note: string; type: string; people: string[]; place: string[]; priority: string | null; timeRef: string | null; tags: string[]; category: string | null; urgency: string | null; dueDate: string | null; status: string | null; isDone: boolean | null }[];
  triggerGenerate: boolean;
  onGenerateDone: () => void;
}

export default function SummariesView({ input, notes, triggerGenerate, onGenerateDone }: SummariesViewProps) {
  const [recentList, setRecentList] = useState<SessionSummary[]>(loadSession);
  const [savedList, setSavedList] = useState<Summary[]>(loadSavedCache);
  const [dbLoaded, setDbLoaded] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<SessionSummary | null>(null);

  const [pendingMarkdown, setPendingMarkdown] = useState("");
  const [pendingTitle, setPendingTitle] = useState("");
  const [pendingQuery, setPendingQuery] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // Load saved summaries from DB once per session
  useEffect(() => {
    const cached = loadSavedCache();
    if (cached.length > 0) {
      setSavedList(cached);
      setDbLoaded(true);
    } else {
      fetchSavedFromDB();
    }
  }, []);

  // Handle generate trigger from parent
  const generateSummary = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setGenerating(true);
    setPendingMarkdown("");
    setPendingTitle("");
    setPendingQuery(query);
    setActiveReport(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: query, notes }),
      });

      if (!res.ok) throw new Error("Request failed");
      const { title, report } = await res.json();
      if (!report?.trim()) throw new Error("Empty response");

      const finalTitle = title || query.slice(0, 50);
      setPendingTitle(finalTitle);
      setPendingMarkdown(report);

      // Save to recent cache (session)
      // First, check if this exact report exists to avoid duplication
      setRecentList((prev) => {
        const exists = prev.some((s) => s.query === finalTitle && s.report === report);
        if (exists) return prev;

        const recent: SessionSummary = {
          id: Date.now(),
          createdAt: new Date().toISOString(),
          userId: "",
          query: finalTitle, // We use the LLM generated title here for the UI
          report,
          isSaved: false,
        };
        const updated = [recent, ...prev];
        saveSession(updated);
        return updated;
      });
    } catch {
      toast.error("Failed to generate summary");
    } finally {
      setGenerating(false);
    }
  }, [notes]);

  useEffect(() => {
    if (triggerGenerate && input.trim()) {
      generateSummary(input);
      onGenerateDone();
    }
  }, [triggerGenerate, input, generateSummary, onGenerateDone]);

  const fetchSavedFromDB = async () => {
    try {
      const res = await fetch("/api/summaries");
      const data = await res.json();
      if (data.success) {
        setSavedList(data.data);
        saveSavedCache(data.data);
      }
    } catch {
      toast.error("Failed to load summaries");
    } finally {
      setDbLoaded(true);
    }
  };

  const saveToDB = async (summary: { query: string; report: string; id?: number }) => {
    try {
      const res = await fetch("/api/summaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: summary.query, report: summary.report }),
      });
      const data = await res.json();
      if (data.success) {
        const saved = data.data as Summary;
        setSavedList((prev) => {
          const updated = [saved, ...prev];
          saveSavedCache(updated);
          return updated;
        });

        // Mark as saved in recent if it exists there
        if (summary.id) {
          setRecentList((prev) => {
            const updated = prev.map((s) =>
              s.id === summary.id ? { ...s, isSaved: true, dbId: saved.id } : s
            );
            saveSession(updated);
            return updated;
          });
        }

        if (activeReport?.id === summary.id || (!summary.id && pendingMarkdown)) {
          setActiveReport({ ...(summary as SessionSummary), id: saved.id, isSaved: true });
          if (!summary.id) {
            setPendingMarkdown("");
            setPendingTitle("");
          }
        }
        toast.success("Summary saved");
      }
    } catch {
      toast.error("Failed to save summary");
    }
  };

  const unsaveFromDB = async (dbId: number, sessionId?: number, originalQuery?: string, originalReport?: string) => {
    try {
      await fetch("/api/summaries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: dbId }),
      });

      setSavedList((prev) => {
        const updated = prev.filter((s) => s.id !== dbId);
        saveSavedCache(updated);
        return updated;
      });

      // If it exists in recent, just mark as unsaved
      if (sessionId) {
        setRecentList((prev) => {
          const updated = prev.map((s) =>
            s.id === sessionId ? { ...s, isSaved: false } : s
          );
          saveSession(updated);
          return updated;
        });
        if (activeReport?.id === sessionId) {
          setActiveReport({ ...activeReport, isSaved: false });
        }
      } else if (originalQuery && originalReport) {
        // If it wasn't in recent (loaded from DB), add it back to recent when unsaved
        // so it doesn't just disappear
        const restoredRecent: SessionSummary = {
          id: Date.now(),
          createdAt: new Date().toISOString(),
          userId: "",
          query: originalQuery,
          report: originalReport,
          isSaved: false,
        };
        setRecentList((prev) => {
          const updated = [restoredRecent, ...prev];
          saveSession(updated);
          return updated;
        });
        if (activeReport?.id === dbId) {
          setActiveReport(restoredRecent);
        }
      }

      toast.success("Summary unsaved");
    } catch {
      toast.error("Failed to unsave");
    }
  };

  const removeFromRecent = (id: number) => {
    setRecentList((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveSession(updated);
      return updated;
    });
    if (activeReport?.id === id) setActiveReport(null);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(cleanMarkdown(text));
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleDownload = (text: string, query: string) => {
    const blob = new Blob([cleanMarkdown(text)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary-${query.slice(0, 30).replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter lists based on search query
  const filteredRecent = useMemo(() => {
    const unsaved = recentList.filter((s) => !s.isSaved);
    if (!searchQuery.trim()) return unsaved;
    const lowerQ = searchQuery.toLowerCase();
    return unsaved.filter((s) => s.query.toLowerCase().includes(lowerQ));
  }, [recentList, searchQuery]);

  const filteredSaved = useMemo(() => {
    if (!searchQuery.trim()) return savedList;
    const lowerQ = searchQuery.toLowerCase();
    return savedList.filter((s) => s.query.toLowerCase().includes(lowerQ));
  }, [savedList, searchQuery]);

  // Generating state
  if (generating) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-32">
        <Loader />
        <span className="text-sm font-medium text-neon tracking-wide animate-pulse">
          Synthesizing knowledge...
        </span>
      </div>
    );
  }

  // Pending (just generated, not yet saved/navigated away)
  if (pendingMarkdown) {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPendingMarkdown("")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Back to lists
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => handleCopy(pendingMarkdown)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground border border-white/[0.06] hover:border-white/[0.12] transition-colors" title="Copy">
              <Copy size={14} />
            </button>
            <button onClick={() => handleDownload(pendingMarkdown, pendingTitle)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground border border-white/[0.06] hover:border-white/[0.12] transition-colors" title="Download">
              <Download size={14} />
            </button>
            <button
              onClick={() => {
                const match = recentList.find((s) => s.report === pendingMarkdown && s.query === pendingTitle);
                if (match) {
                  saveToDB(match);
                } else {
                  saveToDB({ query: pendingTitle, report: pendingMarkdown });
                }
              }}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-neon/10 text-neon border border-neon/20 hover:bg-neon/20 transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
            >
              <Bookmark size={12} />
              Save Report
            </button>
          </div>
        </div>
        <div className="text-2xl font-semibold tracking-tight text-foreground">
          {pendingTitle}
        </div>
        <div className="rounded-2xl border border-white/[0.04] bg-surface p-8 shadow-xl">
          <div className="markdown prose prose-invert prose-sm md:prose-base max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {cleanMarkdown(pendingMarkdown)}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  // Viewing a single report (saved or recent)
  if (activeReport) {
    // Check if it's saved by matching content against savedList
    const savedEntry = savedList.find((s) => s.query === activeReport.query && s.report === activeReport.report);
    const isSavedInDB = !!savedEntry;

    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveReport(null)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Back to lists
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => handleCopy(activeReport.report)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground border border-white/[0.06] hover:border-white/[0.12] transition-colors" title="Copy">
              <Copy size={14} />
            </button>
            <button onClick={() => handleDownload(activeReport.report, activeReport.query)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground border border-white/[0.06] hover:border-white/[0.12] transition-colors" title="Download">
              <Download size={14} />
            </button>
            {isSavedInDB ? (
              <button
                onClick={() => unsaveFromDB(savedEntry.id, activeReport.id, activeReport.query, activeReport.report)}
                className="px-3 py-2 rounded-lg text-xs font-medium border border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-white/[0.12] transition-colors flex items-center gap-1.5"
              >
                <BookmarkMinus size={12} />
                Unsave
              </button>
            ) : (
              <button
                onClick={() => saveToDB(activeReport)}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-neon/10 text-neon border border-neon/20 hover:bg-neon/20 transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
              >
                <Bookmark size={12} />
                Save Report
              </button>
            )}
          </div>
        </div>
        <div className="text-2xl font-semibold tracking-tight text-foreground">
          {activeReport.query}
        </div>
        <div className="rounded-2xl border border-white/[0.04] bg-surface p-8 shadow-xl">
          <div className="markdown prose prose-invert prose-sm md:prose-base max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {cleanMarkdown(activeReport.report)}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-10">

      {/* Search summaries */}
      {(recentList.length > 0 || savedList.length > 0) && (
        <div className="relative rounded-lg border border-white/[0.06] bg-surface px-3 py-2.5 focus-within:border-neon/30 transition-colors flex items-center gap-2">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            placeholder="Search generated reports by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Saved summaries */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-neon">
            Saved Summaries
          </span>
          <span className="text-[10px] text-muted-foreground bg-white/[0.03] px-2 py-0.5 rounded-full">
            {filteredSaved.length}
          </span>
        </div>

        {!dbLoaded ? (
          <div className="flex justify-center py-12"><Loader /></div>
        ) : filteredSaved.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground/50 py-12 italic">
            {searchQuery ? "No saved summaries match your search." : "No saved summaries yet."}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredSaved.map((summary) => (
              <div
                key={summary.id}
                className="group flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-white/[0.02] hover:border-white/[0.08] hover:bg-surface transition-all duration-200"
              >
                <button
                  onClick={() => setActiveReport({ ...(summary as SessionSummary), isSaved: true })}
                  className="flex-1 text-left min-w-0 pr-4"
                >
                  <p className="text-sm font-medium text-foreground truncate mb-1">{summary.query}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(summary.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </button>
                <button
                  onClick={() => unsaveFromDB(summary.id, undefined, summary.query, summary.report)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                  title="Unsave & Move to Recent"
                >
                  <BookmarkMinus size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent (session) summaries */}
      {filteredRecent.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Recent Summaries
            </span>
            <span className="text-[10px] text-muted-foreground bg-white/[0.03] px-2 py-0.5 rounded-full">
              {filteredRecent.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {filteredRecent.map((summary) => (
              <div
                key={summary.id}
                className="group flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-white/[0.02] hover:border-white/[0.08] hover:bg-surface transition-all duration-200"
              >
                <button onClick={() => setActiveReport(summary)} className="flex-1 text-left min-w-0 pr-4">
                  <p className="text-sm text-foreground truncate mb-1">{summary.query}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(summary.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </button>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => saveToDB(summary)} className="p-2 rounded-lg text-muted-foreground hover:text-neon hover:bg-neon/10" title="Save">
                    <Bookmark size={14} />
                  </button>
                  <button onClick={() => removeFromRecent(summary.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10" title="Remove">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
