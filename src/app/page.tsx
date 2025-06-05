"use client";

import Header from "@/components/global/header";
import InputBox from "@/components/global/input-box";
import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/global/loader";
import BentoGrid from "@/components/global/bento-grid";
import clsx from "clsx";

export default function Home() {
  const { user } = useUser();
  const [input, setInput] = useState("");

  return user?.firstName ? (
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
        startComponent={
          <button className="px-4 py-2 font-semibold bg-blue-600 text-white rounded-lg">
            Create New Note
          </button>
        }
        items={[
          "Create New Note...",
          "Meeting recap",
          "Feature backlog",
          "Research paper summary",
          "Design idea",
          "Client notes",
          "Weekly plan",
        ]}
      />
    </motion.div>
  ) : (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loader />
    </div>
  );
}
