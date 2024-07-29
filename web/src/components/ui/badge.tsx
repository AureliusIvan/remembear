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
 * @description Combines two types of props: `React.HTMLAttributes<HTMLDivElement>`
 * and `VariantProps<typeof badgeVariants>`.
 * 
 * The former type, `React.HTMLAttributes<HTMLDivElement>`, is an object with properties
 * that are commonly used as attributes in HTML elements. These can include things
 * like the element's id, class, style, and others.
 * 
 * The latter type, `VariantProps<typeof badgeVariants>`, represents props that are
 * specific to a set of variants, which is likely a utility function or object that
 * defines different styles or variations for an HTML component (in this case, a
 * badge). The `typeof` keyword is used here to get the type of the `badgeVariants`
 * variable.
 * 
 * This interface effectively combines these two types into one, allowing any component
 * that uses `BadgeProps` as its prop type to accept both standard HTML attributes
 * and variant-specific props.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * @description Accepts a props object with `className` and `variant` properties,
 * along with any additional props. It returns a `div` element with a class name
 * generated by combining the specified `badgeVariants` variant and the provided
 * `className`, passing through all additional props.
 * 
 * @param {object} obj - Destructured from an argument. It contains two properties:
 * `className` of type string and `variant` of type unknown. The remaining properties
 * are passed through as props.
 * 
 * @param {BadgeProps} obj.className - Optional.
 * 
 * @param {BadgeProps} obj.variant - Used to define different badge styles.
 * 
 * @returns {React.Element} A JSX element representing an HTML div element with its
 * className set to the result of concatenating the class names returned by the
 * `badgeVariants` function and any additional class name provided in the `className`
 * prop, along with any other props passed.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
