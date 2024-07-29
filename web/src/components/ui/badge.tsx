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
 * @description Exports an extension of two types: `React.HTMLAttributes<HTMLDivElement>`
 * and `VariantProps<typeof badgeVariants>`. It inherits the properties from both
 * types, effectively merging them into a single type.
 * 
 * This means that `BadgeProps` can accept all the HTML attributes applicable to an
 * HTML element (`React.HTMLAttributes<HTMLDivElement>`), as well as any properties
 * defined in the `badgeVariants` object. The resulting interface provides a flexible
 * set of props for a badge component, allowing it to be customized and styled according
 * to its variant.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * @description Generates a component with a dynamic class name based on the provided
 * `variant`. It takes an object `BadgeProps` as its argument, and spreads its
 * properties into the returned JSX element using the spread operator.
 * 
 * @param {object} obj - Destructured from a props interface named `BadgeProps`. It
 * consists of two properties: `className` and `variant`, along with any other
 * properties not explicitly listed (`...props`).
 * 
 * @param {BadgeProps} obj.className - Used to specify additional CSS classes for the
 * badge element.
 * 
 * @param {BadgeProps} obj.variant - Used to specify the appearance of the badge.
 * 
 * @returns {ReactNode} A JSX element, specifically a `div` element with two attributes:
 * `className` and `{...props}`, where `className` is set by merging the result of
 * `badgeVariants({ variant })` with the provided `className`, and `props` are
 * propagated from the outer component.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
