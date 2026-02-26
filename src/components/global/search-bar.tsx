"use client";

import { Search, Sparkles, X } from "lucide-react";

interface SearchBarProps {
  input: string;
  setInput: (val: string) => void;
  onSearch: () => void;
  onSummarize: () => void;
  onClear: () => void;
  isFiltered: boolean;
}

export default function SearchBar({ input, setInput, onSearch, onSummarize, onClear, isFiltered }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-surface px-3 py-2 focus-within:border-neon/30 transition-colors min-w-0">
        <Search size={14} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none min-w-0"
          placeholder="Search by keyword, sentence, or concept..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
        />
        {(input || isFiltered) && (
          <button
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <button
        onClick={onSearch}
        className="shrink-0 p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-medium border border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-white/[0.12] transition-colors"
        title="Search"
      >
        <Search size={14} className="sm:hidden" />
        <span className="hidden sm:inline">Search</span>
      </button>
      <button
        onClick={onSummarize}
        className="shrink-0 p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-medium bg-neon/10 text-neon border border-neon/20 hover:bg-neon/20 transition-colors flex items-center gap-1.5"
        title="Summarize"
      >
        <Sparkles size={12} />
        <span className="hidden sm:inline">Summarize</span>
      </button>
    </div>
  );
}
