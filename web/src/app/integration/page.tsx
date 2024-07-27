'use client';

import React from 'react'
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {
  Drawer, DrawerClose,
  DrawerContent,
  DrawerDescription, DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import {Notify} from "@/services/NotificationService";

/**
 * @description Renders a form containing a main section with an "Integration" heading
 * and a list of links to external platforms (calendar, Whatsapp, Notion) wrapped in
 * buttons. The links are styled using the `buttonVariants` function.
 *
 * @returns {React.ReactElement} A JSX expression containing a form element with
 * various child elements including an h1 heading, a div with links and button variants.
 */
export default function Integration(): React.ReactElement {
  return (
      <form>
        <main className="flex min-h-screen flex-col items-center p-6 gap-6">
          {/* notion */}
          <Card className={cn("w-full")}>
            <CardHeader className={'inline-flex flex-row justify-center items-center'}>
              <h1 className={"text-2xl font-bold"}>Notion</h1>
            </CardHeader>
            <CardContent>
              <p>Connect your Notion account to Remembear</p>
            </CardContent>
            <CardFooter>
                <Drawer>
                  <DrawerTrigger
                      className={buttonVariants({variant: 'default', size: 'lg', className: 'w-full'})}
                  >
                    Connect via API!
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                      <DrawerDescription>This action cannot be undone.</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button
                          type={'button'}
                          onClick={() => {
                            Notify()
                          }}
                      >
                        Connect
                      </Button>
                      <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
            </CardFooter>
          </Card>

          {/* calendar */}
          <Card className={cn("w-full")}>
            <CardHeader>
              <h1 className={"text-2xl font-bold"}>Calendar</h1>
            </CardHeader>
            <CardContent>
              <p>Connect your Calendar account to Remembear</p>
            </CardContent>
            <CardFooter>
              <Button>
                <Link href={"/"}>Connect</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* whatsapp */}
          <Card className={cn("w-full")}>
            <CardHeader>
              <h1 className={"text-2xl font-bold"}>Whatsapp</h1>
            </CardHeader>
            <CardContent>
              <p>Connect your Whatsapp account to Remembear</p>
            </CardContent>
            <CardFooter>
              <Button>
                <Link href={"/"}>Connect</Link>
              </Button>
            </CardFooter>
          </Card>

          {/*  telegram */}
          <Card className={cn("w-full")}>
            <CardHeader>
              <h1 className={"text-2xl font-bold"}>Telegram</h1>
            </CardHeader>
            <CardContent>
              <p>Connect your Telegram account to Remembear</p>
            </CardContent>
            <CardFooter>
              <Button>
                <Link href={"/"}>Connect</Link>
              </Button>
            </CardFooter>
          </Card>

          {/*  line */}
          <Card className={cn("w-full")}>
            <CardHeader>
              <h1 className={"text-2xl font-bold"}>Line</h1>
            </CardHeader>
            <CardContent>
              <p>Connect your Line account to Remembear</p>
            </CardContent>
            <CardFooter>
              <Button>
                <Link href={"/"}>Connect</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </form>
  );
}
