import React, { ReactNode, Suspense } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import ClerkProviderWrapper from "@/providers/clerk-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Loader from "@/components/global/loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Your Second Brain, Reimagined" />
        <meta name="keywords" content="Knowledge Management, AI" />
        <meta name="author" content="Neuronote" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <title>Neuronote</title>
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProviderWrapper>
            <Suspense
              fallback={
                <div className="w-screen h-screen flex justify-center items-center">
                  <Loader />
                </div>
              }
            >
              <main>{children}</main>
            </Suspense>
            <Toaster />
          </ClerkProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
