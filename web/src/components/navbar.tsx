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

/**
 * @description Renders a navigation bar containing a side menu, triggered by a button
 * with an icon. The side menu includes a title, description, and close buttons leading
 * to different routes ('/', '/integration', '/setting') using the `useRouter` hook
 * from React Router.
 * 
 * @returns {React.ReactElement} A JSX element that represents a div with various
 * child elements including a Sheet component, a SheetTrigger component, and other
 * components such as LuMenu, Button, and Text.
 */
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