"use client"

import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {ask} from "@/services/ServerService";
import {useState} from "react";

export default function Home() {
  const [chat, setChat] = useState<String[]>([])
  const [isLoading, setIsLoading] = useState(false)


  const handleSetLoading = (state: boolean) => {
    setIsLoading(state)
  }

  const handleAsk = async (formData: any) => {
    setIsLoading(true)
    const reply = await ask(formData.get("name"))
    if (reply) {
      setChat([...chat, reply?.message])
    }
    setIsLoading(false)
  }

  return (
      <form
          action={handleAsk}
      >
        <main className="flex h-full flex-col items-center justify-between p-6">

          <div>
            {chat.map((message: String) => {
              return (
                  <div>
                    {message}
                  </div>
              )
            })}
          </div>


          {/* status loading */}
          {isLoading && (
              <div className={"bg-black/80"}>
                loading...
              </div>
          )}

          <div className={"flex flex-row gap-[10px] w-full fixed bottom-0 p-6"}>
            <Textarea
                name={"name"}
                className={"w-full"}
                placeholder={"Enter message here"}>
            </Textarea>
            <Button
                onSubmit={(e) => e.currentTarget.value = ""}
                type={"submit"}
            >
              send
            </Button>
          </div>


        </main>
      </form>
  );
}
