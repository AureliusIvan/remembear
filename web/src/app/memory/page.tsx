'use client'

import React from 'react'
import {getMemories} from "@/services/ServerService";
import {Alert, AlertTitle} from "@/components/ui/alert";
import {BiMemoryCard} from "react-icons/bi";
import {Button} from "@/components/ui/button";

/**
 * @description Renders a form to display a list of memories and provide an option
 * to delete them all. It fetches memories from an API, displaying a loading message
 * while waiting for the response, and displays an error message if no memories are
 * found or if there is an error during fetching.
 * 
 * @returns {ReactNode} A JSX element that represents a form with various sections
 * including memory cards and buttons for deletion.
 */
export default function Memory() {
  const [memories, setMemories] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    // Fetches and sets memories.

    /**
     * @description Loads memories asynchronously, sets a loading state to true before
     * making the request, and then updates the memory list with the received result if
     * it is not empty. Finally, it sets the loading state back to false once the operation
     * is complete.
     */
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
                // Transforms memories array into React components.

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