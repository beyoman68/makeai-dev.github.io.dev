import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

/**
 * Resets the window scroll to the top whenever the pathname changes.
 * Preserves hash navigation (`/page#section`) so in-page anchors still work.
 */
function ScrollToTopOnRouteChange() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "")
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" })
      }
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname, hash])

  return null
}

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollToTopOnRouteChange />
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  )
}
