'use client'

import React from 'react'
import {getMemories} from "@/services/ServerService";

export default function Memory() {
  const [memories, setMemories] = React.useState<string[]>([])

  React.useEffect(() => {
    async function fetch() {
      const result = await getMemories()

      if (result) {
        setMemories(result)
      }
    }

    fetch()
  })

  return (
      <form>
        <main className="flex min-h-screen flex-col items-center p-2">

          <h1>
            Memory
          </h1>

          <div>
            {memories?.map((memory, index) => {
              return (<div key={index}>
                    &ldquo;{memory}&rdquo;
                  </div>
              )
            })}
          </div>

        </main>
      </form>
  );
}


// TODO: refactor mapped component into function and card