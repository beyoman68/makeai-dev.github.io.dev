import * as React from "react"
import { Link, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  companyNav,
  CONTACT_MAIL,
  productNav,
  // researchHref, // re-enable with Research desktop + mobile links below (`/research` route stays in App.tsx)
  // solutionNav, // re-enable with Solution dropdown + mobile section below
} from "@/lib/nav-config"

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function DesktopDropdown({
  id,
  label,
  items,
  open,
  onPointerOpen,
  onPointerClose,
}: {
  id: string
  label: string
  items: readonly { label: string; href: string }[]
  open: boolean
  onPointerOpen: () => void
  onPointerClose: () => void
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = wrapRef.current
    if (!el) {
      return undefined
    }
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget
      if (next instanceof Node && el.contains(next)) {
        return
      }
      onPointerClose()
    }
    el.addEventListener("focusout", onFocusOut)
    return () => el.removeEventListener("focusout", onFocusOut)
  }, [onPointerClose])

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={onPointerOpen}
      onMouseLeave={onPointerClose}
    >
      <button
        type="button"
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-950 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-indigo-500/80 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={`${id}-menu`}
        onFocus={() => onPointerOpen()}
      >
        {label}
        <ChevronDown className="opacity-70" />
      </button>
      <div
        id={`${id}-menu`}
        role="menu"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={cn(
          "absolute left-0 top-full z-50 min-w-[min(100vw-2rem,16rem)] pt-2 transition-[opacity,visibility] duration-150",
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0",
        )}
      >
        <ul className="rounded-lg border border-border bg-popover py-2 text-popover-foreground shadow-xl">
          {items.map((item) => (
            <li key={item.href} role="none">
              <Link
                role="menuitem"
                to={item.href}
                tabIndex={open ? 0 : -1}
                className="block px-4 py-2 text-sm text-popover-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                onFocus={() => onPointerOpen()}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MobileNavSection({
  title,
  items,
}: {
  title: string
  items: readonly { label: string; href: string }[]
}) {
  return (
    <div className="border-b border-zinc-200 py-3 last:border-b-0 dark:border-zinc-800">
      <p className="mb-2 px-1 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
        {title}
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="block rounded-md px-3 py-2 text-sm text-zinc-950 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteHeader() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  /** Only one desktop flyout at a time — avoids hover + focus keeping two panels open. */
  const [openDesktopMenu, setOpenDesktopMenu] = React.useState<string | null>(
    null,
  )

  React.useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname, location.hash])

  React.useEffect(() => {
    if (!mobileOpen) {
      return undefined
    }

    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-10">
          <Link
            to="/"
            className="font-logo shrink-0 text-xl tracking-wide text-zinc-950 sm:text-2xl dark:text-white"
            aria-label="Mazelone home"
          >
            MAZELONE
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center gap-1 lg:flex"
            aria-label="Primary"
          >
            <DesktopDropdown
              id="nav-company"
              label="Company"
              items={companyNav}
              open={openDesktopMenu === "company"}
              onPointerOpen={() => setOpenDesktopMenu("company")}
              onPointerClose={() => setOpenDesktopMenu(null)}
            />
            <DesktopDropdown
              id="nav-product"
              label="Product"
              items={productNav}
              open={openDesktopMenu === "product"}
              onPointerOpen={() => setOpenDesktopMenu("product")}
              onPointerClose={() => setOpenDesktopMenu(null)}
            />
            {/* Solution menu — hidden for now; restore `solutionNav` import + block below
            <DesktopDropdown
              id="nav-solution"
              label="Solution"
              items={solutionNav}
              open={openDesktopMenu === "solution"}
              onPointerOpen={() => setOpenDesktopMenu("solution")}
              onPointerClose={() => setOpenDesktopMenu(null)}
            />
            */}
            {/* Research — temporarily hidden from primary nav; direct URL `/research` still works.
            <Link
              to={researchHref}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-zinc-950 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-indigo-500/80 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white",
                location.pathname === researchHref &&
                  "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white",
              )}
              aria-current={location.pathname === researchHref ? "page" : undefined}
            >
              Research
            </Link>
            */}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <a
            href={`mailto:${CONTACT_MAIL}`}
            className="text-sm font-medium text-zinc-900 underline-offset-4 hover:text-zinc-950 hover:underline sm:hidden dark:text-zinc-300 dark:hover:text-white"
          >
            Contact
          </a>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden h-9 rounded-full bg-black px-5 text-white shadow-sm hover:bg-zinc-800 hover:text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 sm:inline-flex"
          >
            <a href={`mailto:${CONTACT_MAIL}`}>Contact us</a>
          </Button>

          <button
            type="button"
            className="inline-flex rounded-md p-2 text-zinc-950 hover:bg-zinc-100 hover:text-zinc-950 lg:hidden dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-zinc-200 bg-white lg:hidden dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mx-auto max-h-[min(70vh,calc(100dvh-3.5rem))] max-w-6xl overflow-y-auto px-4 pb-6 sm:px-6">
            <MobileNavSection title="Company" items={companyNav} />
            <MobileNavSection title="Product" items={productNav} />
            {/* <MobileNavSection title="Solution" items={solutionNav} /> */}
            {/* Research — temporarily hidden from mobile nav; see desktop block comment.
            <div className="border-b border-zinc-200 py-3 last:border-b-0 dark:border-zinc-800">
              <Link
                to={researchHref}
                className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                Research
              </Link>
            </div>
            */}
            <div className="pt-4">
              <Button
                asChild
                variant="ghost"
                className="h-10 w-full rounded-full bg-black px-5 text-white shadow-sm hover:bg-zinc-800 hover:text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                <a href={`mailto:${CONTACT_MAIL}`}>Contact us</a>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
