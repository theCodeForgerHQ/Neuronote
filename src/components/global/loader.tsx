"use client";

export default function Loader() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-neon/60 animate-pulse" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 rounded-full bg-neon/60 animate-pulse" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 rounded-full bg-neon/60 animate-pulse" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
