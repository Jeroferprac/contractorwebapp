"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
        <Toaster richColors position="bottom-center" />
      </ThemeProvider>
    </SessionProvider>
  );
}