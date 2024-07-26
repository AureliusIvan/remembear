'use client'

import React from 'react'
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

export default function Login() {
  return (
      <form>
        <main className="flex min-h-screen flex-col items-center p-2">
          <h1>
            Login
          </h1>
          <Link
              href={"/"}
              className={buttonVariants({variant: "default"})}>
            Login with google
          </Link>
        </main>
      </form>
  );
}
