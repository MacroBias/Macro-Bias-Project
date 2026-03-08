import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Macro Bias | Regime-Driven Exposure for Modern Portfolios",
  description:
    "A systematic macro & liquidity-based regime overlay that helps improve drawdowns and compounding through quantified Risk-On / Neutral / Risk-Off positioning.",
  generator: "v0.app",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-x-hidden">
      <body
        className={`${inter.variable} ${geistMono.variable} flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased overflow-x-hidden touch-manipulation`}
      >
        <div className="flex-1">
          {children}
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
