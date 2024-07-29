import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        destructive:
          "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80",
        outline: "text-slate-950 dark:text-slate-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * @description Extends  `React.HTMLAttributes<HTMLDivElement>` and `VariantProps<typeof
 * badgeVariants>`.
 * 
 * It inherits properties from both interfaces.
 * 
 * 1/ `React.HTMLAttributes<HTMLDivElement>` provides basic HTML attributes that can
 * be applied to an HTML element, such as `className`, `style`, `id`, etc.
 * 
 * 2/ `VariantProps<typeof badgeVariants>` is a type inferred from the value of the
 * `badgeVariants` variable. It likely represents different variants of badges and
 * their corresponding properties.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * @description Creates a customizable badge component, taking `className`, `variant`,
 * and other props as arguments. It returns a `div` element with the specified class
 * name and variant-specific styles applied, allowing for flexible customization of
 * the badge's appearance.
 * 
 * @param {object} obj - Destructured from an interface `BadgeProps`. It contains two
 * properties: `className` of type string, and `variant` of type string or other
 * supported variant types.
 * 
 * @param {BadgeProps} obj.className - Used to specify additional CSS classes for the
 * component.
 * 
 * @param {BadgeProps} obj.variant - Optional, used to specify different styles for
 * the badge.
 * 
 * @returns {ReactElement} A JSX element represented by the div tag with its className
 * property set to the result of calling `cn` function and passing `badgeVariants({
 * variant })` and `className` as arguments.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
