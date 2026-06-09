import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { CONTACT_MAIL } from "@/lib/nav-config"
import { cn } from "@/lib/utils"

/** Allowed row labels — fixed set per IA. */
type ResearchTag = "Research" | "Publication" | "Patent"

type FilterTab = "all" | ResearchTag

type SortKey = "date-desc" | "date-asc" | "title-asc"

type ResearchListItem = {
  id: string
  tag: ResearchTag
  /** ISO date string for sorting */
  dateIso: string
  dateLabel: string
  title: string
  summary: string
}

/** MVP static feed — replace with CMS/API later; layout stays the same. */
const RESEARCH_ITEMS: ResearchListItem[] = [
  {
    id: "1",
    tag: "Research",
    dateIso: "2026-04-10",
    dateLabel: "Apr 10, 2026",
    title: "Toward reliable document understanding at enterprise scale",
    summary:
      "Notes on how we combine structure-aware parsing with evaluation harnesses so teams can ship AI features without guessing at quality.",
  },
  {
    id: "2",
    tag: "Publication",
    dateIso: "2026-03-22",
    dateLabel: "Mar 22, 2026",
    title: "Structured extraction patterns for mixed-format corpora",
    summary:
      "A practical overview of parsing strategies when Word, PDF, and images coexist in the same knowledge base.",
  },
  {
    id: "3",
    tag: "Patent",
    dateIso: "2026-02-05",
    dateLabel: "Feb 5, 2026",
    title: "Systems and methods for retrieval-augmented enterprise workflows",
    summary:
      "Patent filing update on RAG orchestration and guardrails tailored to regulated environments.",
  },
]

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Research", label: "Research" },
  { id: "Publication", label: "Publication" },
  { id: "Patent", label: "Patent" },
]

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "date-desc", label: "Newest first" },
  { key: "date-asc", label: "Oldest first" },
  { key: "title-asc", label: "Title (A–Z)" },
]

/** Same chevron as `site-header` `DesktopDropdown`. */
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

/**
 * Sort control — panel matches global nav `DesktopDropdown` menu
 * (`rounded-lg border bg-popover shadow-xl`, item hover `bg-accent`).
 */
function ResearchSortMenu({
  value,
  onChange,
}: {
  value: SortKey
  onChange: (next: SortKey) => void
}) {
  const [open, setOpen] = React.useState(false)
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const menuId = "research-sort-menu"

  const currentLabel =
    SORT_OPTIONS.find((o) => o.key === value)?.label ?? SORT_OPTIONS[0].label

  React.useEffect(() => {
    if (!open) {
      return undefined
    }
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current?.contains(e.target as Node)) {
        return
      }
      setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  React.useEffect(() => {
    if (!open) {
      return undefined
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        className="flex h-9 min-w-[min(100vw-2rem,10rem)] items-center justify-between gap-2 rounded-md border border-border bg-background px-3 text-left text-sm font-normal text-muted-foreground shadow-sm outline-none transition-colors hover:bg-accent/60 hover:text-foreground/80 focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-zinc-800/80 dark:hover:text-zinc-300"
        aria-label="Sort"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown className="shrink-0 opacity-50" />
      </button>
      <div
        className={cn(
          "absolute right-0 top-full z-50 min-w-[min(100vw-2rem,16rem)] pt-2 transition-[opacity,visibility] duration-150",
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0",
        )}
      >
        <ul
          id={menuId}
          role="listbox"
          aria-label="Sort"
          className="rounded-lg border border-border bg-popover py-2 text-muted-foreground shadow-xl"
        >
          {SORT_OPTIONS.map((opt) => {
            const selected = value === opt.key
            return (
              <li key={opt.key} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  tabIndex={open ? 0 : -1}
                  className={cn(
                    "flex w-full px-4 py-2 text-left text-sm font-normal outline-none transition-colors hover:bg-accent/60 hover:text-foreground/80 focus-visible:bg-accent/60 focus-visible:text-foreground/80 dark:hover:text-zinc-300",
                    selected &&
                      "bg-muted/80 text-foreground/75 dark:bg-muted dark:text-zinc-300",
                  )}
                  onClick={() => {
                    onChange(opt.key)
                    setOpen(false)
                  }}
                >
                  {opt.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function sortItems(items: ResearchListItem[], sort: SortKey): ResearchListItem[] {
  const copy = [...items]
  if (sort === "date-desc") {
    copy.sort((a, b) => (a.dateIso < b.dateIso ? 1 : a.dateIso > b.dateIso ? -1 : 0))
  } else if (sort === "date-asc") {
    copy.sort((a, b) => (a.dateIso > b.dateIso ? 1 : a.dateIso < b.dateIso ? -1 : 0))
  } else {
    copy.sort((a, b) => a.title.localeCompare(b.title, "en"))
  }
  return copy
}

/**
 * Research hub — `/research`
 * @see `.dev/md/20260417_1720_research-nav-planning.md`
 */
export function ResearchPage() {
  const [filter, setFilter] = React.useState<FilterTab>("all")
  const [sort, setSort] = React.useState<SortKey>("date-desc")

  const filtered =
    filter === "all"
      ? RESEARCH_ITEMS
      : RESEARCH_ITEMS.filter((item) => item.tag === filter)

  const rows = sortItems(filtered, sort)
  const catalogEmpty = RESEARCH_ITEMS.length === 0

  return (
    <main className="flex w-full flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Research
        </h1>

        <div className="mt-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div
            className="min-w-0 flex-1"
            role="tablist"
            aria-label="Category"
          >
            <div className="-mx-1 flex gap-1 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
              {FILTER_TABS.map((tab) => {
                const selected = filter === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={cn(
                      "shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                    )}
                    onClick={() => setFilter(tab.id)}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Sort</span>
              <ResearchSortMenu value={sort} onChange={setSort} />
            </div>
          </div>
        </div>

        {catalogEmpty ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              Research and updates are being prepared. Please check back soon.
            </p>
            <a
              href={`mailto:${CONTACT_MAIL}`}
              className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Contact us
            </a>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              No items match this filter yet. Research and updates will appear here.
            </p>
            <a
              href={`mailto:${CONTACT_MAIL}`}
              className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Contact us
            </a>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((item) => (
              <li key={item.id}>
                <article>
                  <div className="block cursor-default py-8 sm:rounded-lg sm:px-3">
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                      <div className="shrink-0 sm:w-[20%] sm:min-w-[8rem]">
                        <Badge variant="muted" className="font-semibold">
                          {item.tag}
                        </Badge>
                        <time
                          dateTime={item.dateIso}
                          className="mt-2 block text-sm text-muted-foreground"
                        >
                          {item.dateLabel}
                        </time>
                      </div>
                      <div className="min-w-0 flex-1 sm:w-[80%]">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                          {item.title}
                        </h2>
                        <p className="mt-2 line-clamp-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
