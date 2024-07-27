import React from 'react'

export default function Template({children}: { children: React.ReactNode }) {
  return (
      <section>
        {children}
      </section>
  )
}