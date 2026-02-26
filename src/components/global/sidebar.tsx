"use client";

import {
  LayoutGrid,
  CheckSquare,
  Clock,
  PenLine,
  Filter,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export type ViewType = "jot" | "board" | "todo" | "timeline" | "summaries";

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onFilterToggle: () => void;
  filterCount: number;
}

const NAV_ITEMS: { key: ViewType; label: string; icon: React.ReactNode }[] = [
  { key: "jot", label: "JotSpace", icon: <PenLine size={18} /> },
  { key: "board", label: "Board", icon: <LayoutGrid size={18} /> },
  { key: "todo", label: "Tasks", icon: <CheckSquare size={18} /> },
  { key: "timeline", label: "Timeline", icon: <Clock size={18} /> },
  { key: "summaries", label: "Summaries", icon: <Sparkles size={18} /> },
];

export default function Sidebar({
  activeView,
  onViewChange,
  onFilterToggle,
  filterCount,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-14 lg:w-52 shrink-0 h-screen sticky top-0 border-r border-white/[0.04] bg-[#050505]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5">
        <Image src="/logo-dark.svg" alt="Neuronote" width={24} height={24} className="shrink-0" />
        <span className="text-sm font-semibold tracking-tight text-foreground hidden lg:block">
          Neuronote
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 mt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-neon/10 text-neon"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="hidden lg:block">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col gap-0.5 px-2 pb-4">
        <button
          onClick={onFilterToggle}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-colors relative"
        >
          <Filter size={18} className="shrink-0" />
          <span className="hidden lg:block">Filter</span>
          {filterCount > 0 && (
            <span className="absolute top-1.5 left-7 lg:static lg:ml-auto text-[9px] bg-neon/20 text-neon px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
              {filterCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
