import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-row justify-between items-center h-fit">
      <div className="flex flex-row items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={30} height={30} />
        <span className="text-2xl font-black font-serif tracking-wide">
          Neuronote
        </span>
      </div>
      <UserButton />
    </div>
  );
}
