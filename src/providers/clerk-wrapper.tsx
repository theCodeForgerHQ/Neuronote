"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: resolvedTheme === "dark" ? "#000000" : "#FFFFFF",
          colorInputBackground:
            resolvedTheme === "dark" ? "#000000" : "#FFFFFF",
          colorShimmer: "#00E5FF",
          fontSize: "0.9rem",
          colorPrimary: "#9059D5",
          colorDanger: "#FF2C2C",
          borderRadius: "0.3rem",
        },
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
