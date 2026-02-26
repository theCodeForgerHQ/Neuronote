"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import React, { JSX } from "react";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

export default function SignUpPage(): JSX.Element {
  return (
    <div className="relative isolate bg-black min-h-screen">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <motion.div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          initial={{ scale: 0.8, opacity: 0.2, rotate: 20 }}
          animate={{ scale: 0.9, opacity: 0.3, rotate: 35 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 3,
            ease: "easeInOut",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="relative min-h-screen flex flex-col p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center h-fit gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-neon/10 flex items-center justify-center">
            <Brain size={16} className="text-neon" />
          </div>
          <span className="text-xl tracking-wide font-semibold text-foreground">
            Neuronote
          </span>
        </motion.div>

        <div className="flex flex-grow items-center justify-center">
          <SignUp.Root>
            <SignUp.Step name="start">
              <motion.div
                variants={fadeUp}
                initial="initial"
                animate="animate"
                className="grid w-fit gap-6 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Your Second Brain, Reimagined.
                  </h1>
                  <p className="text-sm text-muted-foreground mx-auto">
                    Your Gateway to Semantic Memory, no Structure Required.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Clerk.Connection name="google" asChild>
                    <motion.div whileTap={{ scale: 0.96 }}>
                      <Button
                        className="w-full bg-surface border border-white/[0.06] text-foreground font-medium hover:border-white/[0.12] hover:bg-surface-raised"
                        size="lg"
                        type="button"
                      >
                        <Icons.google className="mr-2 size-5 text-center" />
                        Sign Up with Google
                      </Button>
                    </motion.div>
                  </Clerk.Connection>
                  <Clerk.Connection name="github" asChild>
                    <motion.div whileTap={{ scale: 0.96 }}>
                      <Button
                        className="w-full bg-surface border border-white/[0.06] text-foreground font-medium hover:border-white/[0.12] hover:bg-surface-raised"
                        size="lg"
                        type="button"
                      >
                        <Icons.gitHub className="mr-2 size-5 text-center" />
                        Sign Up with GitHub
                      </Button>
                    </motion.div>
                  </Clerk.Connection>
                  <Clerk.Connection name="apple" asChild>
                    <motion.div whileTap={{ scale: 0.96 }}>
                      <Button
                        className="w-full bg-surface border border-white/[0.06] text-foreground font-medium hover:border-white/[0.12] hover:bg-surface-raised"
                        size="lg"
                        type="button"
                      >
                        <Icons.apple className="mr-2 size-5 text-center" />
                        Sign Up with Apple
                      </Button>
                    </motion.div>
                  </Clerk.Connection>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-x-0 h-px bg-white/[0.06]" />
                  <span className="relative z-10 bg-black px-2 text-xs text-muted-foreground">
                    or Continue with Email
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <Clerk.Field name="firstName" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label className="text-xs text-muted-foreground">First Name</Label>
                    </Clerk.Label>
                    <Clerk.Input type="text" required asChild>
                      <Input className="bg-surface border-white/[0.06] focus-visible:ring-neon/50 focus-visible:border-neon/30" />
                    </Clerk.Input>
                    <Clerk.FieldError className="block text-xs text-red-400" />
                  </Clerk.Field>

                  <Clerk.Field name="lastName" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label className="text-xs text-muted-foreground">Last Name</Label>
                    </Clerk.Label>
                    <Clerk.Input type="text" required asChild>
                      <Input className="bg-surface border-white/[0.06] focus-visible:ring-neon/50 focus-visible:border-neon/30" />
                    </Clerk.Input>
                    <Clerk.FieldError className="block text-xs text-red-400" />
                  </Clerk.Field>
                </div>

                <Clerk.Field name="emailAddress" className="space-y-2 text-left">
                  <Clerk.Label asChild>
                    <Label className="text-xs text-muted-foreground">Email Address</Label>
                  </Clerk.Label>
                  <Clerk.Input type="email" required asChild>
                    <Input className="bg-surface border-white/[0.06] focus-visible:ring-neon/50 focus-visible:border-neon/30" />
                  </Clerk.Input>
                  <Clerk.FieldError className="block text-xs text-red-400" />
                </Clerk.Field>

                <Clerk.GlobalError className="block text-xs text-red-400" />

                <SignUp.Action submit asChild>
                  <motion.div whileTap={{ scale: 0.96 }}>
                    <Button
                      variant="link"
                      className="w-full bg-neon/10 text-neon border border-neon/20 hover:bg-neon/20 font-medium"
                    >
                      <Clerk.Loading>
                        {(isLoading: boolean) =>
                          isLoading ? (
                            <Icons.spinner className="size-4 animate-spin" />
                          ) : (
                            <p className="text-sm font-medium">
                              Get Started with Neuronote
                            </p>
                          )
                        }
                      </Clerk.Loading>
                    </Button>
                  </motion.div>
                </SignUp.Action>

                <div className="text-xs mt-2">
                  <Clerk.Link
                    navigate="sign-in"
                    className="text-muted-foreground"
                  >
                    Already have an account?{" "}
                    <span className="inline underline font-medium text-neon">
                      Sign In
                    </span>
                  </Clerk.Link>
                </div>
              </motion.div>
            </SignUp.Step>

            <SignUp.Step name="verifications">
              <motion.div
                variants={fade}
                initial="initial"
                animate="animate"
                className="flex w-full flex-col items-center justify-center gap-6 text-center px-4"
              >
                <h1 className="text-2xl font-semibold text-foreground">
                  Verify your Email Address
                </h1>
                <p className="text-sm text-muted-foreground max-w-sm text-center">
                  We&apos;ve sent a secure sign-up link to your email. Check spam or
                  promotions if you don&apos;t see it.
                </p>
                <div className="flex items-center justify-center flex-row text-sm">
                  <div className="text-muted-foreground mr-2">
                    Didn&apos;t get the email?
                  </div>
                  <SignUp.Action
                    asChild
                    resend
                    fallback={({ resendableAfter }) => (
                      <p className="text-muted-foreground">Resend in {resendableAfter}s</p>
                    )}
                  >
                    <motion.div whileTap={{ scale: 0.96 }}>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-neon"
                      >
                        Resend
                      </Button>
                    </motion.div>
                  </SignUp.Action>
                </div>
              </motion.div>
            </SignUp.Step>
          </SignUp.Root>
        </div>
      </div>
    </div>
  );
}
