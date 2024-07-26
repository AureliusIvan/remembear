'use client';

import React from 'react'
import Link from 'next/link'

/**
 * @description Renders a UI component that displays a "Not Found" message with a
 * brief description and a link to return to the home page when a requested resource
 * is not found.
 * 
 * @returns {ReactNode} A JSX element that consists of a `<div>` element with three
 * child elements: an `<h2>` element, a `<p>` element, and a `<Link>` element.
 */
export default function NotFound() {
  return (
      <div>
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">Return Home</Link>
      </div>
  )
}