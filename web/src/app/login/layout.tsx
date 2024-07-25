import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Analytics} from "@vercel/analytics/react"
import React from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Remembear",
  description: "An app for short term memory",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        <html lang="en">
        <body className={inter.className}>
        {children}
        </body>
        </html>
        <Analytics/>
      </>
  );
}
