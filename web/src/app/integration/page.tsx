'use client';

import React from 'react'
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

/**
 * @description Renders a form containing a main section with an "Integration" heading
 * and a list of links to external platforms (calendar, Whatsapp, Notion) wrapped in
 * buttons. The links are styled using the `buttonVariants` function.
 * 
 * @returns {React.ReactElement} A JSX expression containing a form element with
 * various child elements including an h1 heading, a div with links and button variants.
 */
export default function Integration() {
  return (
      <form>
        <main className="flex min-h-screen flex-col items-center p-2">
          <h1>
            Integration
          </h1>

          <div className={"flex flex-col gap-1"}>
            <Link
                href={"/"}
                className={buttonVariants({variant: "default"})}>
              with calendar
            </Link>

            <Link
                href={"/"}
                className={buttonVariants({variant: "default"})}>
              with Whatsapp
            </Link>

            <Link
                href={"/"}
                className={buttonVariants({variant: "default"})}>
              with Notion
            </Link>
          </div>

        </main>
      </form>
  );
}
