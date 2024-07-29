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
 * @description Extends the `React.HTMLAttributes<HTMLDivElement>` type and merges
 * with the `VariantProps` type from `badgeVariants`. This means it inherits all
 * properties from both types, effectively combining their key-value pairs. The
 * resulting interface can be used to describe props that a React component expects.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * @description Renders a div element with a set of class names and props passed from
 * its parent component, allowing customization through its `variant` property and
 * optional additional classes provided by the `className` prop.
 * 
 * @param {object} obj - Destructured from an interface called `BadgeProps`. It expects
 * two properties: `className` and `variant`, along with any additional props passed
 * through the spread operator (`...props`).
 * 
 * @param {BadgeProps} obj.className - Used to add custom classes to the badge component.
 * 
 * @param {BadgeProps} obj.variant - Optional.
 * 
 * @returns {ReactElement} A JSX element represented as an object with properties
 * such as "type" and "key", and optionally, additional props and children.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
