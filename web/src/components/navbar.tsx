import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {LuMenu} from "react-icons/lu";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

function Navbar() {
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
          {/*<SheetDescription>*/}
          {/*</SheetDescription>*/}
          <Link
              href={"/"}
              className={buttonVariants({variant: "outline"})}>
            Home
          </Link>
          <Link
              href={"/setting"}
              className={buttonVariants({variant: "outline"})}>
            Setting
          </Link>
          <Link
              href={"/integration"}
              className={buttonVariants({variant: "outline"})}>
            Integration
          </Link>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  </div>
}


export {
  Navbar
}