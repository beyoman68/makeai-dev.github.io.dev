import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

type BackToHomeProps = {
  className?: string
}

/** Footer link to `/` — shared by company pages and product/solution placeholders. */
export function BackToHome({ className }: BackToHomeProps) {
  return (
    <Link
      to="/"
      className={cn(
        "mt-12 inline-block text-sm font-medium text-foreground underline underline-offset-4",
        className,
      )}
    >
      Back to home
    </Link>
  )
}
