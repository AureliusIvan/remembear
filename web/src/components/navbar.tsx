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

function Navbar(): React.ReactElement {
  const router = useRouter()

  return <div
      className={"w-full px-6 pt-5 pb-[10px] flex flex-row"}
  >
    {/* side menu */}
    <Sheet>

      {/* side menu trigger */}
      <SheetTrigger className={"h-[1.5rem] w-[2rem]"}>
        <LuMenu width={10}/>
      </SheetTrigger>

      {/* side menu panel */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Remembear</SheetTitle>
          <SheetDescription>
            List of menu
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
        </SheetHeader>
      </SheetContent>
    </Sheet>


    <Link href={"/memory"} className={buttonVariants({variant: "default"})}>
      <BiMemoryCard/>
    </Link>

  </div>
}


export {
  Navbar
}