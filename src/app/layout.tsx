import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "../components/ui/sonner";
import { cn } from "@/lib/utils";
import Translate from "@/components/Translate";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "KultKlub",
  description: "Odkryj kluby",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          " h-full min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
          <Toaster />
          <Translate />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
