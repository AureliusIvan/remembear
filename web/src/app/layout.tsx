import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Analytics} from "@vercel/analytics/react"
import React, {StrictMode} from "react";
import {Navbar} from "@/components/navbar";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Remembear",
  description: "An app for short term memory",
};

export default function RootLayout(
    {
      children,
    }: Readonly<{
      children: React.ReactNode;
    }>) {
  return (
      <>
        <StrictMode>
          <html lang="en">
          <body className={inter.className}>
          <Navbar/>
          <Toaster/>
          {children}
          </body>
          </html>
          <Analytics/>
        </StrictMode>
      </>
  );
}
