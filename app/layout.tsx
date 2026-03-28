import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "EcoSignal Enterprise",
  description: "Piattaforma ESG Intelligence per PMI italiane."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${syne.variable} bg-bg text-text antialiased`}>
        {children}
      </body>
    </html>
  );
}
