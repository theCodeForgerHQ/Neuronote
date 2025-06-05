"use client";

import Header from "@/components/global/header";
import InputBox from "@/components/global/input-box";
import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/global/loader";

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
      className="max-h-screen min-h-screen w-screen p-8 flex flex-col space-y-7 overflow-auto no-scrollbar"
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
    </motion.div>
  ) : (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loader />
    </div>
  );
}
