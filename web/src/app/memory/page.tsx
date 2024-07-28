'use client'

import React from 'react'
import {getMemories} from "@/services/ServerService";
import {Alert, AlertTitle} from "@/components/ui/alert";
import {BiMemoryCard} from "react-icons/bi";
import {Button} from "@/components/ui/button";

export default function Memory() {
  const [memories, setMemories] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    async function fetch() {
      setIsLoading(true)
      const result = await getMemories()

      if (result) {
        setMemories(result)
      }
      setIsLoading(false)
    }

    fetch().then(r => r)
  }, [])

  return (
      <form className={'flex min-h-screen flex-col items-center px-6 py-2'}>

        <section className={'flex flex-col gap-1.5'}>
          {
              memories &&
              memories?.map((memory, index) => {
                return (
                    <div key={index}>
                      <Alert>
                        <BiMemoryCard/>
                        <AlertTitle>{memory}</AlertTitle>
                        {/*<AlertDescription>*/}
                        {/*  {memory}*/}
                        {/*</AlertDescription>*/}
                      </Alert>
                    </div>
                )
              })
          }

          {
              memories.length > 0 &&

              <Button variant={'destructive'}>
                <span>
                  Delete all memories
                </span>
              </Button>
          }
        </section>


        {isLoading &&
            <div>
              Loading...
            </div>
        }

        {memories.length === 0 && !isLoading &&
            <div>
              No memories
            </div>
        }

      </form>
  );
}


// TODO: refactor mapped component into function and card