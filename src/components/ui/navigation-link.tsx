// NavigationLink - Custom wrapper for NavigationMenu that supports asChild with TanStack Router Link
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { navigationMenuTriggerStyle } from "./navigation-menu"

export interface NavigationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean
  href?: string
}

const NavigationLink = React.forwardRef<HTMLAnchorElement, NavigationLinkProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"
    return (
      <Comp
        ref={ref}
        className={cn(navigationMenuTriggerStyle({ className }))}
        {...props}
      />
    )
  }
)
NavigationLink.displayName = "NavigationLink"

export { NavigationLink }