"use client"

import React from 'react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import {useToast} from "@/components/ui/use-toast"

/**
 * @description Renders a list of toast notifications provided by `useToast()`. Each
 * toast contains title, description and action if available. It also includes a close
 * button. The toasts are wrapped around a `ToastProvider` component which provides
 * a viewport for the toast notifications.
 * 
 * @returns {ReactNode} A JSX element that contains a list of toast notifications
 * wrapped with a `ToastProvider` and a `ToastViewport`.
 */
export function Toaster() {
  const {toasts} = useToast()

  return (
      <ToastProvider>
        {toasts.map(function ({id, title, description, action, ...props}) {
          // Renders toast list.

          // Renders a toast list.

          return (
              <Toast key={id} {...props}>
                <div className="grid gap-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                      <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
                {action}
                <ToastClose/>
              </Toast>
          )
        })}
        <ToastViewport/>
      </ToastProvider>
  )
}
