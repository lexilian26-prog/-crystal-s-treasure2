import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TripSync",
    template: "%s · TripSync",
  },
  description: "协同旅行清单 (TripSync) · 轻量级多人行程与待办协作",
  applicationName: "TripSync",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TripSync",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#14b8a6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh bg-background text-foreground">
        <div className="min-h-dvh">
          <Header />
          <main className="mx-auto w-full max-w-xl px-4 pb-24 pt-16 sm:px-6">
            {children}
          </main>
          <BottomNav />
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
