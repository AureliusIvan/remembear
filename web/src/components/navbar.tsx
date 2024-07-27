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
import {Button, buttonVariants} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {BiMemoryCard} from "react-icons/bi";

/**
 * @description Generates a responsive navigation bar with a side menu, featuring
 * buttons to navigate between different routes of an application, as well as a logo
 * and a link to another route.
 * 
 * @returns {React.ReactElement} A JSX element representing a container div with
 * various child components including a side menu panel, navigation links and a title.
 */
function Navbar(): React.ReactElement {
  const router = useRouter()

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
              <SheetTitle>Remembear</SheetTitle>
              <SheetDescription>
                Version {process.env.NEXT_PUBLIC_VERSION}
              </SheetDescription>
              <SheetClose asChild>
                <Button
                    onClick={() => router.push('/')}
                    type={'submit'}
                    variant={'outline'}
                >
                  Home
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                    onClick={() => router.push('/integration')}
                    type={'submit'}
                    variant={'outline'}
                >
                  Integration
                </Button>
              </SheetClose>

              <SheetClose asChild>
                <Button
                    onClick={() => router.push('/setting')}
                    type={'submit'}
                    variant={'outline'}
                >
                  Setting
                </Button>
              </SheetClose>

              <SheetClose asChild>
                <Button
                    onClick={() => router.push('/login')}
                    type={'submit'}
                    variant={'outline'}
                >
                  Login
                </Button>
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