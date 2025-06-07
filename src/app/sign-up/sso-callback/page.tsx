"use client";
import Loader from "@/components/global/loader";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function SSOCallbackPage() {
  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <motion.div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          initial={{ scale: 0.8, opacity: 0.3, rotate: 20 }}
          animate={{ scale: 0.9, opacity: 0.4, rotate: 35 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 3,
            ease: "easeInOut",
          }}
          className="relative dark:brightness-100 brightness-80 left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <AuthenticateWithRedirectCallback />
      <div className="relative min-h-screen flex flex-col p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center h-fit gap-2"
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={30}
            height={30}
            className="dark:hidden flex"
          />
          <Image
            src="/logo-dark.svg"
            alt="Logo"
            width={30}
            height={30}
            className="hidden dark:flex"
          />
          <span className="text-xl tracking-wide font-black text-start">
            Neuronote
          </span>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="flex flex-grow items-center justify-center gap-6 flex-col"
        >
          <h1 className="text-3xl font-black">Hold tight, Redirecting....</h1>
          <p className="text-lg max-w-sm text-justify">
            Magic&apos;s happening in the background. You&apos;ll be inside
            Neuronote in a flash.{" "}
          </p>
          <section className="mt-16">
            <Loader />
          </section>
        </motion.div>
      </div>
    </div>
  );
}
