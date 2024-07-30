'use client';

import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {LuMenu} from "react-icons/lu";
import {buttonVariants} from "@/components/ui/button";
import {BiMemoryCard} from "react-icons/bi";
import Link from "next/link";

import {
  APP_NAME,
  VERSION
} from "@/config/version";
import {badgeVariants} from "@/components/ui/badge";

function Navbar(): React.ReactElement {
  return (
      <div
          className={"w-full px-6 pt-5 pb-[10px] flex flex-row gap-1.5 justify-between items-center"}>
        {/* side menu */}
        <Sheet>

          {/* side menu trigger */}
          <SheetTrigger
              className={buttonVariants({variant: 'ghost'})}>
            <LuMenu width={10}/>
          </SheetTrigger>

          {/* side menu panel */}
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                {APP_NAME}
              </SheetTitle>
              <SheetDescription
                  className={badgeVariants({variant: 'secondary', className: 'flex items-center justify-center'})}>
                Version {VERSION}
              </SheetDescription>
              <SheetClose asChild>
                <Link
                    href={'/'}
                    className={buttonVariants({variant: 'outline'})}
                >
                  Home
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                    href={'/memory'}
                    className={buttonVariants({variant: 'outline'})}
                >
                  Memory
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                    href={'/integration'}
                    className={buttonVariants({variant: 'outline'})}
                >
                  Integration
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                    href={'/setting'}
                    className={buttonVariants({variant: 'outline'})}
                >
                  Setting
                </Link>
              </SheetClose>
            </SheetHeader>
          </SheetContent>
        </Sheet>


        <h1 className={'font-bold'}>
          Bear
        </h1>

        <Link href={"/memory"} className={buttonVariants({variant: "ghost"})}>
          <BiMemoryCard/>
        </Link>

      </div>)
}


export {
  Navbar
}