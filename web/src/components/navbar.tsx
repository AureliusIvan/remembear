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
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

function Navbar() {
  const router = useRouter()

  return <div
      className={"w-full p-6"}
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
  </div>
}


export {
  Navbar
}