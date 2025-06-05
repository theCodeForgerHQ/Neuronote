"use client";

import React, { JSX } from "react";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import Image from "next/image";
import { motion } from "framer-motion";

// Animation Variants
const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

export default function SignInPage(): JSX.Element {
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
        <div className="flex flex-grow items-center justify-center">
          <SignIn.Root>
            <SignIn.Step name="start">
              <motion.div
                variants={fadeUp}
                initial="initial"
                animate="animate"
                className="grid w-fit gap-6 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-black">
                    Your Second Brain, Reimagined.
                  </h1>
                  <p className="text-md text-muted-foreground mx-auto">
                    Your Gateway to Semantic Memory, no Structure Required.
                  </p>
                </div>

                {/* Social Sign Ins */}
                <div className="grid grid-cols-1 gap-3">
                  <Clerk.Connection name={"google"} asChild>
                    <motion.div whileTap={{ scale: 0.96 }}>
                      <Button
                        className="w-full bg-background text-foreground border font-semibold hover:bg-foreground hover:text-background"
                        size="lg"
                        type="button"
                      >
                        <Icons.google className="mr-2 size-5 text-center" />
                        Sign In with Google
                      </Button>
                    </motion.div>
                  </Clerk.Connection>
                  <Clerk.Connection name={"github"} asChild>
                    <motion.div whileTap={{ scale: 0.96 }}>
                      <Button
                        className="w-full bg-background text-foreground border font-semibold hover:bg-foreground hover:text-background"
                        size="lg"
                        type="button"
                      >
                        <Icons.gitHub className="mr-2 size-5 text-center" />
                        Sign In with GitHub
                      </Button>
                    </motion.div>
                  </Clerk.Connection>
                  <Clerk.Connection name={"apple"} asChild>
                    <motion.div whileTap={{ scale: 0.96 }}>
                      <Button
                        className="w-full bg-background text-foreground border font-semibold hover:bg-foreground hover:text-background"
                        size="lg"
                        type="button"
                      >
                        <Icons.apple className="mr-2 size-5 text-center" />
                        Sign In with Apple
                      </Button>
                    </motion.div>
                  </Clerk.Connection>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-x-0 h-px bg-border" />
                  <span className="relative z-10 bg-background px-2 text-sm text-muted-foreground">
                    or Continue with Email
                  </span>
                </div>

                {/* Email Field */}
                <Clerk.Field name="identifier" className="space-y-2 text-left">
                  <Clerk.Label asChild>
                    <Label>Email Address</Label>
                  </Clerk.Label>
                  <Clerk.Input type="email" required asChild>
                    <Input className="bg-muted focus-visible:ring-foreground focus-visible:ring-1" />
                  </Clerk.Input>
                  <Clerk.FieldError className="block text-sm text-red-400" />
                </Clerk.Field>

                <Clerk.GlobalError className="block text-sm text-red-400" />

                <SignIn.Action submit asChild>
                  <motion.div whileTap={{ scale: 0.96 }}>
                    <Button
                      variant="link"
                      className="w-full bg-foreground text-background"
                    >
                      <Clerk.Loading>
                        {(isLoading: boolean) =>
                          isLoading ? (
                            <Icons.spinner className="size-4 animate-spin" />
                          ) : (
                            <p className="text-md font-semibold">
                              Access Neuronote
                            </p>
                          )
                        }
                      </Clerk.Loading>
                    </Button>
                  </motion.div>
                </SignIn.Action>

                {/* Link to Sign Up */}
                <div className="text-sm mt-2">
                  <Clerk.Link
                    navigate="sign-up"
                    className="text-muted-foreground"
                  >
                    New here?{" "}
                    <span className="inline underline font-semibold text-foreground">
                      Create an Account
                    </span>
                  </Clerk.Link>
                </div>
              </motion.div>
            </SignIn.Step>

            <SignIn.Step name="verifications">
              <motion.div
                variants={fade}
                initial="initial"
                animate="animate"
                className="flex w-full flex-col items-center justify-center gap-6 text-center px-4"
              >
                <h1 className="text-3xl font-black text-foreground">
                  Verify your Email Address
                </h1>
                <p className="text-md text-muted-foreground max-w-sm text-justify">
                  We&apos;ve sent a secure login link to your email. Please
                  click it to access your Neuronote account. Check spam or
                  promotions if you don&apos;t see it.
                </p>
                <div className="flex items-center justify-center flex-row text-md">
                  <div className="text-muted-foreground mr-2">
                    Didn&apos;t get the email?
                  </div>
                  <SignIn.Action
                    asChild
                    resend
                    fallback={({
                      resendableAfter,
                    }: {
                      resendableAfter: number;
                    }) => (
                      <p className="text-foreground">
                        Resend available in {resendableAfter}s
                      </p>
                    )}
                  >
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-foreground hover:underline"
                      >
                        Resend Verification Email
                      </Button>
                    </motion.div>
                  </SignIn.Action>
                </div>
              </motion.div>
            </SignIn.Step>
          </SignIn.Root>
        </div>
      </div>
    </div>
  );
}
