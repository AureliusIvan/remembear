'use client'

import React from 'react'
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

/**
 * @description Returns a JSX element representing an HTML form with a main content
 * area and a heading that says "Login". It includes a link to log in with Google,
 * styled according to the `buttonVariants` function.
 * 
 * @returns {JSX.Element} A form element with its child elements, including an h1
 * heading and a link, all wrapped in a main element with a specific class name.
 */
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
