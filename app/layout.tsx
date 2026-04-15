import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { WebGLBackground } from "@/components/background/WebGLBackground";
import { SmoothScroll } from "@/components/transitions/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Apps — Organizza la tua giornata",
  description:
    "Una collezione di web app per organizzare la vita quotidiana: produttività, lavoro e utility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="has-custom-cursor flex flex-col relative">
        <WebGLBackground />
        <div className="noise" aria-hidden />
        <SmoothScroll />
        <CustomCursor />
        <main className="relative z-10 flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
