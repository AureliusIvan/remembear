import React from 'react'

export default function Log(): React.ReactElement {
  return (
      <section>

        <h1>
          Log List
        </h1>

        <LogCard title={'test'}/>

      </section>
  )
}

interface LogType {
  title: string
}

function LogCard({title}: LogType) {
  return (
      <div>
        {title}
      </div>
  )
}
