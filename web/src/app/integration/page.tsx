import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

export default function Login() {
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
