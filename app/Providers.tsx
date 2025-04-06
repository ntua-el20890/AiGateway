"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"; // Import SessionProvider from next-auth/react
import { SessionProvider } from "@/context/SessionContext"; // Import your custom SessionProvider

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NextAuthSessionProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <SessionProvider>
                <Toaster />
                <Sonner />
                {children}
              </SessionProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </NextAuthSessionProvider>
      </ThemeProvider>
    </div>
  );
}
