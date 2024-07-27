import React from 'react'

export default function LoginLayout(
    {
      children, // will be a page or nested layout
    }: {
      children: React.ReactNode
    }) {
  return (
      <section>
        {children}
      </section>
  )
}
