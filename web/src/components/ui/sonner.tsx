"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * @description Renders a `Sonner` component with customized styles based on the
 * current theme. It uses the `useTheme` hook to get the theme and passes it as a
 * prop to `Sonner`. The function also accepts additional props, which are spread
 * onto the `Sonner` component.
 * 
 * @param {object} obj - Used to customize the appearance of the toaster based on
 * different themes. The property names are used as CSS class names to style the
 * toaster's components.
 * 
 * @returns {JSX.Element} A React component that wraps its children with additional
 * props and styles based on the theme provided by `useTheme`.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-slate-950 dark:group-[.toaster]:text-slate-50 dark:group-[.toaster]:border-slate-800",
          description: "group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50 dark:group-[.toast]:bg-slate-50 dark:group-[.toast]:text-slate-900",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 dark:group-[.toast]:bg-slate-800 dark:group-[.toast]:text-slate-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
