import { UserButton } from "@clerk/nextjs";
import { Brain } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center justify-between h-14 px-4 border-b border-white/[0.04] md:hidden">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-neon/10 flex items-center justify-center">
          <Brain size={16} className="text-neon" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Neuronote
        </span>
      </div>
      <UserButton />
    </div>
  );
}
