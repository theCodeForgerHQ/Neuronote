"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: "#0a0a0a",
          colorInputBackground: "#111111",
          colorShimmer: "#a855f7",
          fontSize: "0.9rem",
          colorPrimary: "#a855f7",
          colorDanger: "#ef4444",
          borderRadius: "0.5rem",
        },
        baseTheme: dark,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
