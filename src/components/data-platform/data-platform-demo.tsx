import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  Code2,
  Copy,
  Download,
  FileSpreadsheet,
  Layers,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

const EXAMPLE_FILENAME = "Q3_Financial_Report.docx"

const SUPPORTED_EXTENSIONS =
  ".doc, .docx, .ppt, .pptx, .xls, .xlsx, .pdf, .jpg, .jpeg, .png, .tiff"

// @see `.dev/code/20260421_1435_mzo_data platform` (local design reference; not imported).

type Stage = "select" | "viewer" | "source"

type RegionKind = "title" | "metadata" | "paragraph" | "table" | "figure" | "footer"

const REGION_STYLES: Record<
  RegionKind,
  { border: string; soft: string; badge: string; label: string; filter: string }
> = {
  title: {
    border: "border-red-500/55",
    soft: "bg-red-500/[0.08]",
    badge: "bg-red-600 text-white",
    label: "TITLE",
    filter: "Title",
  },
  metadata: {
    border: "border-violet-500/55",
    soft: "bg-violet-500/[0.08]",
    badge: "bg-violet-600 text-white",
    label: "METADATA",
    filter: "Metadata",
  },
  paragraph: {
    border: "border-blue-500/55",
    soft: "bg-blue-500/[0.08]",
    badge: "bg-blue-600 text-white",
    label: "PARAGRAPH",
    filter: "Paragraph",
  },
  table: {
    border: "border-emerald-500/55",
    soft: "bg-emerald-500/[0.08]",
    badge: "bg-emerald-600 text-white",
    label: "TABLE",
    filter: "Table",
  },
  figure: {
    border: "border-orange-500/55",
    soft: "bg-orange-500/[0.08]",
    badge: "bg-orange-600 text-white",
    label: "FIGURE",
    filter: "Figure",
  },
  footer: {
    border: "border-zinc-400/60 dark:border-zinc-500/55",
    soft: "bg-zinc-500/[0.06]",
    badge: "bg-zinc-600 text-white dark:bg-zinc-500",
    label: "FOOTER",
    filter: "Footer",
  },
}

interface LayoutRegion {
  id: number
  kind: RegionKind
  summary: string
}

const LAYOUT_REGIONS: LayoutRegion[] = [
  { id: 1, kind: "title", summary: "Q3 Financial Report 2024" },
  { id: 2, kind: "metadata", summary: "MZO Corporation · Fiscal Q3 2024 · Confidential" },
  {
    id: 3,
    kind: "paragraph",
    summary:
      "Revenue grew 23% year-over-year to $4.2 million in Q3 2024, driven by strong enterprise adoption across APAC markets.",
  },
  { id: 4, kind: "table", summary: "Table: 4 rows × 4 columns — Revenue, EBITDA, Headcount, NPS" },
  { id: 5, kind: "figure", summary: "Bar chart: Q1–Q3 quarterly revenue trend 2024" },
  { id: 6, kind: "footer", summary: "Page 1 / 8 · Prepared by Finance · Internal use only" },
]

const LAYOUT_JSON = `{
  "document": "Q3_Financial_Report.docx",
  "page": 1,
  "regions": [
    { "id": 1, "type": "title",     "bbox": [0.12, 0.06, 0.76, 0.08], "text": "Q3 Financial Report 2024" },
    { "id": 2, "type": "metadata",  "bbox": [0.12, 0.15, 0.76, 0.05], "text": "MZO Corporation · Fiscal Q3 2024 · Confidential" },
    { "id": 3, "type": "paragraph", "bbox": [0.12, 0.22, 0.76, 0.14], "text": "Revenue grew 23% year-over-year..." },
    { "id": 4, "type": "table",     "bbox": [0.12, 0.38, 0.76, 0.18], "rows": 4, "cols": 4 },
    { "id": 5, "type": "figure",    "bbox": [0.12, 0.58, 0.76, 0.22], "kind": "bar_chart" },
    { "id": 6, "type": "footer",    "bbox": [0.12, 0.88, 0.76, 0.06], "text": "Page 1 / 8" }
  ]
}`

type OutputTab = "blocks" | "markdown" | "html" | "json"

const OUTPUT_TABS: { id: OutputTab; label: string }[] = [
  { id: "blocks", label: "Blocks" },
  { id: "markdown", label: "Markdown" },
  { id: "html", label: "HTML" },
  { id: "json", label: "JSON" },
]

const DOC_MARKDOWN = `# Q3 Financial Report 2024

*MZO Corporation · Fiscal Q3 2024 · Confidential*

## Executive summary

Revenue grew **23%** year-over-year to **$4.2M** in Q3 2024, driven by strong
enterprise adoption and expanded service offerings across the Asia Pacific
region. Operating margins expanded by **4.2** percentage points year over year.

## Key metrics

| Metric | Q3 2024 | Q3 2023 | Change |
|--------|---------|---------|--------|
| Revenue | $4.2M | $3.4M | +23% |
| EBITDA | $1.1M | $0.8M | +38% |
| Headcount | 142 | 118 | +20% |
| NPS Score | 72 | 61 | +11 pts |

## Figure 1 — Quarterly revenue trend 2024

A bar chart summarizes Q1–Q3 revenue. Q3 represents the strongest quarter
of the fiscal year to date.

---

*Page 1 / 8 · Internal use only*
`

const DOC_HTML = `<article>
  <header>
    <h1>Q3 Financial Report 2024</h1>
    <p class="meta">MZO Corporation · Fiscal Q3 2024 · Confidential</p>
  </header>

  <section>
    <h2>Executive summary</h2>
    <p>Revenue grew <strong>23%</strong> year-over-year to <strong>$4.2M</strong> in Q3 2024, driven by strong
      enterprise adoption and expanded service offerings across the Asia Pacific region.
      Operating margins expanded by <strong>4.2</strong> percentage points year over year.</p>
  </section>

  <section>
    <h2>Key metrics</h2>
    <table>
      <thead>
        <tr><th>Metric</th><th>Q3 2024</th><th>Q3 2023</th><th>Change</th></tr>
      </thead>
      <tbody>
        <tr><td>Revenue</td><td>$4.2M</td><td>$3.4M</td><td>+23%</td></tr>
        <tr><td>EBITDA</td><td>$1.1M</td><td>$0.8M</td><td>+38%</td></tr>
        <tr><td>Headcount</td><td>142</td><td>118</td><td>+20%</td></tr>
        <tr><td>NPS Score</td><td>72</td><td>61</td><td>+11 pts</td></tr>
      </tbody>
    </table>
  </section>

  <figure>
    <figcaption>Figure 1 — Quarterly revenue trend 2024</figcaption>
  </figure>

  <footer>Page 1 / 8 · Internal use only</footer>
</article>`

const DOC_JSON = `{
  "filename": "Q3_Financial_Report.docx",
  "pages": [
    {
      "page_number": 1,
      "page_type": "page",
      "page_size": { "width": 8.2639, "height": 11.6806 },
      "elements": [
        { "seq": 0, "type": "title",     "content": "Q3 Financial Report 2024" },
        { "seq": 1, "type": "metadata",  "content": "MZO Corporation · Fiscal Q3 2024 · Confidential" },
        { "seq": 2, "type": "paragraph", "content": "Revenue grew 23% year-over-year to $4.2M in Q3 2024..." },
        { "seq": 3, "type": "table",     "content": { "rows": 4, "cols": 4, "headers": ["Metric", "Q3 2024", "Q3 2023", "Change"] } },
        { "seq": 4, "type": "figure",    "content": { "kind": "bar_chart", "caption": "Quarterly revenue trend 2024" } },
        { "seq": 5, "type": "footer",    "content": "Page 1 / 8" }
      ]
    }
  ]
}`

interface RailStep {
  id: string
  label: string
  stage: Stage
}

const PROCESS_RAIL: RailStep[] = [
  { id: "ingest", label: "Ingest & parse", stage: "select" },
  { id: "layout", label: "Layout Detection", stage: "viewer" },
  { id: "export", label: "Structured Export", stage: "source" },
]

/**
 * Body height while on the upload screen (before lock). After first paint in `viewer`, height is locked in px
 * so Blocks / Markdown / HTML / JSON tab switches do not resize the demo window.
 */
const DEMO_BODY_H_UNLOCKED =
  "flex h-[clamp(480px,48dvh,560px)] max-h-[calc(100dvh-9rem)] shrink-0 flex-col overflow-hidden lg:h-[560px] lg:max-h-[calc(100dvh-10rem)] lg:flex-row"

/** Flex shell when height is controlled by inline style (viewer / source). */
const DEMO_BODY_H_LOCKED =
  "flex max-h-[calc(100dvh-9rem)] shrink-0 flex-col overflow-hidden lg:max-h-[calc(100dvh-10rem)] lg:flex-row"

function DocPage({
  showBBoxes,
  visibleKinds,
}: {
  showBBoxes: boolean
  visibleKinds: Set<RegionKind>
}) {
  const shown = (k: RegionKind) => !showBBoxes || visibleKinds.has(k)
  return (
    <div className="mx-auto max-w-sm space-y-3 rounded-sm border border-zinc-200 bg-white px-4 py-5 text-[11px] leading-snug text-zinc-900 shadow-sm dark:border-zinc-300/80 dark:bg-white dark:text-zinc-900 dark:shadow-md">
      <RegionShell kind="title" active={showBBoxes} visible={shown("title")}>
        <h2 className="pt-0.5 text-center text-[13px] font-bold tracking-tight text-zinc-900">Q3 Financial Report 2024</h2>
      </RegionShell>
      <RegionShell kind="metadata" active={showBBoxes} visible={shown("metadata")}>
        <p className="pt-0.5 text-center text-[10px] text-zinc-500">
          MZO Corporation · Fiscal Q3 2024 · Confidential
        </p>
      </RegionShell>
      <RegionShell kind="paragraph" active={showBBoxes} visible={shown("paragraph")}>
        <h3 className="pt-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-800">Executive summary</h3>
        <p className="mt-1 text-justify text-[10.5px] leading-relaxed text-zinc-800">
          Revenue grew 23% year-over-year to $4.2 million in Q3 2024, driven by strong enterprise adoption and expanded
          service offerings across the Asia Pacific region. Operating margins expanded by 4.2 percentage points year
          over year.
        </p>
      </RegionShell>
      <RegionShell kind="table" active={showBBoxes} visible={shown("table")}>
        <h3 className="pt-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-800">Key metrics</h3>
        <table className="mt-1.5 w-full border-collapse text-left text-[9.5px]">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="py-1 pr-2 font-semibold text-zinc-800">Metric</th>
              <th className="py-1 pr-2 font-semibold text-zinc-800">Q3 2024</th>
              <th className="py-1 pr-2 font-semibold text-zinc-800">Q3 2023</th>
              <th className="py-1 font-semibold text-zinc-800">Change</th>
            </tr>
          </thead>
          <tbody className="text-zinc-600">
            {[
              ["Revenue", "$4.2M", "$3.4M", "+23%"],
              ["EBITDA", "$1.1M", "$0.8M", "+38%"],
              ["Headcount", "142", "118", "+20%"],
              ["NPS Score", "72", "61", "+11 pts"],
            ].map(([m, a, b, c], i) => (
              <tr key={String(m) + String(i)} className="border-b border-zinc-100 last:border-0">
                <td className="py-1 pr-2 text-zinc-900">{m}</td>
                <td className="py-1 pr-2 font-semibold text-zinc-900">{a}</td>
                <td className="py-1 pr-2">{b}</td>
                <td className="py-1 font-medium text-emerald-600">{c}</td>
            </tr>
            ))}
          </tbody>
        </table>
      </RegionShell>
      <RegionShell kind="figure" active={showBBoxes} visible={shown("figure")}>
        <p className="pt-0.5 text-[10px] font-semibold text-zinc-800">Figure 1: Quarterly revenue trend 2024</p>
        <div className="mt-2 flex h-20 items-end justify-between gap-1.5 px-1">
          {[
            { q: "Q1", h: "h-8", c: "bg-sky-400" },
            { q: "Q2", h: "h-10", c: "bg-amber-400" },
            { q: "Q3", h: "h-16", c: "bg-emerald-600" },
          ].map((b) => (
            <div key={b.q} className="flex flex-1 flex-col items-center gap-1">
              <div className={cn("w-full max-w-[32px] rounded-t-sm", b.h, b.c)} />
              <span className="text-[8px] font-medium text-zinc-500">{b.q}</span>
            </div>
          ))}
        </div>
      </RegionShell>
      <RegionShell kind="footer" active={showBBoxes} visible={shown("footer")}>
        <p className="pt-0.5 text-center text-[9px] text-zinc-500">Page 1 / 8</p>
      </RegionShell>
    </div>
  )
}

function MarkdownPreview({ source }: { source: string }) {
  const lines = source.split("\n")
  const blocks: ReactNode[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i] ?? ""
    if (line.startsWith("# ")) {
      blocks.push(
        <h2 key={`h1-${i}`} className="mt-4 text-[15px] font-bold tracking-tight text-foreground first:mt-0">
          {line.slice(2)}
        </h2>,
      )
      i++
      continue
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h3 key={`h2-${i}`} className="mt-4 text-[12.5px] font-semibold text-foreground">
          {line.slice(3)}
        </h3>,
      )
      i++
      continue
    }
    if (line.startsWith("### ")) {
      blocks.push(
        <h4 key={`h3-${i}`} className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {line.slice(4)}
        </h4>,
      )
      i++
      continue
    }
    if (line.startsWith("#### ")) {
      blocks.push(
        <p key={`h4-${i}`} className="mt-1 font-mono text-[10px] text-muted-foreground">
          {line.slice(5)}
        </p>,
      )
      i++
      continue
    }
    if (line.startsWith("---")) {
      blocks.push(<hr key={`hr-${i}`} className="my-3 border-border/60" />)
      i++
      continue
    }
    if (line.startsWith("|")) {
      const rows: string[] = []
      while (i < lines.length && (lines[i] ?? "").startsWith("|")) {
        rows.push(lines[i] ?? "")
        i++
      }
      const isSep = (r: string) => {
        const cells = r
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean)
        return cells.length > 0 && cells.every((c) => /^[-:]+$/.test(c))
      }
      const [head, ...rest] = rows.filter((r) => !isSep(r))
      const headCells = head?.split("|").filter(Boolean).map((c) => c.trim()) ?? []
      const bodyCells = rest.map((r) => r.split("|").filter(Boolean).map((c) => c.trim()))
      blocks.push(
        <div key={`tbl-${i}`} className="mt-2 overflow-x-auto rounded-md border border-border/60">
          <table className="w-full border-collapse text-left text-[10.5px]">
            <thead className="bg-muted/40">
              <tr>
                {headCells.map((c, j) => (
                  <th key={j} className="border-b border-border/60 px-2 py-1.5 font-semibold text-foreground">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyCells.map((row, j) => (
                <tr key={j} className="border-b border-border/40 last:border-0">
                  {row.map((c, k) => (
                    <td key={k} className="px-2 py-1.5 text-foreground/90">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }
    if (line.trim() === "") {
      blocks.push(<div key={`sp-${i}`} className="h-1" />)
      i++
      continue
    }
    const withBold = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((chunk, idx) => {
      if (chunk.startsWith("**")) return <strong key={idx} className="font-semibold text-foreground">{chunk.slice(2, -2)}</strong>
      if (chunk.startsWith("*")) return <em key={idx} className="text-muted-foreground">{chunk.slice(1, -1)}</em>
      return <span key={idx}>{chunk}</span>
    })
    blocks.push(
      <p key={`p-${i}`} className="text-[11px] leading-relaxed text-foreground/90">
        {withBold}
      </p>,
    )
    i++
  }
  return <div className="space-y-0.5">{blocks}</div>
}

function JsonKeyValueTable({ source }: { source: string }) {
  const parsed = useMemo(() => {
    try {
      return JSON.parse(source) as Record<string, unknown>
    } catch {
      return null
    }
  }, [source])
  if (!parsed) {
    return (
      <pre className="whitespace-pre-wrap break-words rounded-md border border-border/60 bg-zinc-950 p-3 font-mono text-[10px] leading-relaxed text-zinc-200">
        {source}
      </pre>
    )
  }
  return (
    <div className="overflow-hidden rounded-md border border-border/60 bg-zinc-950 text-[10px] text-zinc-200">
      <div className="grid grid-cols-[110px_1fr] border-b border-zinc-800 last:border-0">
        <div className="border-r border-zinc-800 bg-zinc-900 px-2 py-1.5 font-mono text-[10px] text-zinc-400">filename</div>
        <div className="px-2 py-1.5 font-mono">{String((parsed as { filename?: string }).filename ?? "")}</div>
      </div>
      <div className="grid grid-cols-[110px_1fr]">
        <div className="border-r border-zinc-800 bg-zinc-900 px-2 py-1.5 font-mono text-[10px] text-zinc-400">pages</div>
        <div className="p-0">
          {(parsed as { pages?: unknown[] }).pages?.map((pageUnknown, pIdx) => {
            const page = pageUnknown as {
              page_number?: number
              page_type?: string
              page_size?: { width?: number; height?: number }
              elements?: { seq?: number; type?: string; content?: unknown }[]
            }
            return (
              <div key={pIdx} className="border-b border-zinc-800 last:border-0">
                <div className="grid grid-cols-[90px_90px_minmax(0,1fr)_minmax(0,1.4fr)] bg-zinc-900/60 text-[9.5px] uppercase text-zinc-400">
                  <div className="border-r border-zinc-800 px-2 py-1">page_number</div>
                  <div className="border-r border-zinc-800 px-2 py-1">page_type</div>
                  <div className="border-r border-zinc-800 px-2 py-1">page_size</div>
                  <div className="px-2 py-1">elements</div>
                </div>
                <div className="grid grid-cols-[90px_90px_minmax(0,1fr)_minmax(0,1.4fr)] text-[10px]">
                  <div className="border-r border-zinc-800 px-2 py-1.5 font-mono">{page.page_number}</div>
                  <div className="border-r border-zinc-800 px-2 py-1.5 font-mono">{page.page_type}</div>
                  <div className="border-r border-zinc-800 px-2 py-1.5 font-mono text-zinc-300">
                    <div>w: {page.page_size?.width}</div>
                    <div>h: {page.page_size?.height}</div>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {page.elements?.map((el) => (
                      <div key={el.seq} className="grid grid-cols-[32px_80px_minmax(0,1fr)] gap-2 px-2 py-1">
                        <span className="font-mono text-zinc-500">{el.seq}</span>
                        <span className="font-mono text-zinc-300">{el.type}</span>
                        <span className="truncate font-mono text-zinc-200">
                          {typeof el.content === "string" ? el.content : JSON.stringify(el.content)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function HtmlPreview({ source }: { source: string }) {
  return (
    <div className="relative min-h-0 w-full flex-1">
      <iframe
        title="HTML preview"
        sandbox=""
        srcDoc={`<!doctype html><html><head><meta charset="utf-8"/><style>
        body{font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.55;color:#111827;margin:0;padding:14px 16px;background:#ffffff;font-size:12px;}
        h1{font-size:15px;font-weight:700;margin:0 0 6px;letter-spacing:-0.02em;}
        .meta{font-size:10.5px;color:#6b7280;margin:0 0 12px;}
        h2{font-size:12px;font-weight:600;margin:14px 0 6px;}
        p{margin:0 0 6px;}
        table{width:100%;border-collapse:collapse;margin-top:4px;font-size:11px;}
        th,td{border:1px solid #e5e7eb;padding:4px 6px;text-align:left;}
        th{background:#f3f4f6;}
        figure{margin:12px 0 0;padding:10px;border:1px dashed #e5e7eb;border-radius:4px;}
        figcaption{font-size:10.5px;color:#374151;}
        footer{margin-top:14px;color:#6b7280;font-size:10px;border-top:1px solid #e5e7eb;padding-top:6px;}
      </style></head><body>${source}</body></html>`}
        className="absolute inset-0 h-full w-full rounded-md border border-border/60 bg-white"
      />
    </div>
  )
}

function RegionShell({
  kind,
  active,
  visible,
  children,
}: {
  kind: RegionKind
  active: boolean
  visible: boolean
  children: ReactNode
}) {
  const s = REGION_STYLES[kind]
  if (!visible) return null
  if (!active) return <div>{children}</div>
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease }}
      className={cn("relative rounded-md border-2 px-2.5 py-2", s.border, s.soft)}
    >
      <span className={cn("absolute -top-2 left-2 rounded px-1 py-0.5 text-[7px] font-bold tracking-wide shadow-sm", s.badge)}>
        {s.label}
      </span>
      {children}
    </motion.div>
  )
}

/**
 * Data Platform demo — sequence:
 * 1) Upload (DOCX drag motion)  2) Results (layout / tabs)  3) Source view in autoplay cycle.
 * Client-side only, palette aligned with `chat-platform` / `email-agent` demos.
 */
export function DataPlatformDemo() {
  const reduce = useReducedMotion() ?? false
  const [stage, setStage] = useState<Stage>("select")
  const [uploadCycle, setUploadCycle] = useState(0)
  const [outputTab, setOutputTab] = useState<OutputTab>("blocks")
  const [showSource, setShowSource] = useState(false)
  const [visibleKinds, setVisibleKinds] = useState<Set<RegionKind>>(
    () => new Set<RegionKind>(["title", "metadata", "paragraph", "table", "figure", "footer"]),
  )

  /** Snapshot of main split height on first `viewer` paint (Blocks); reused for all tabs until back to `select`. */
  const [lockedDemoBodyPx, setLockedDemoBodyPx] = useState<number | null>(null)
  const demoBodyShellRef = useRef<HTMLDivElement>(null)

  const timersRef = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => {
      window.clearTimeout(id)
      window.clearInterval(id)
    })
    timersRef.current = []
  }, [])

  const schedule = useCallback(
    (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, reduce ? Math.min(ms, 160) : ms)
      timersRef.current.push(id)
    },
    [reduce],
  )

  useEffect(() => {
    let cancelled = false

    const runCycle = () => {
      if (cancelled) return
      clearTimers()
      setStage("select")
      setUploadCycle((n) => n + 1)
      setOutputTab("blocks")
      setShowSource(false)

      schedule(1700, () => {
        if (!cancelled) {
          setStage("viewer")
          setOutputTab("blocks")
          setShowSource(false)
        }
      })
      schedule(5100, () => {
        if (!cancelled) {
          setOutputTab("markdown")
          setShowSource(false)
        }
      })
      schedule(7500, () => {
        if (!cancelled) {
          setOutputTab("html")
          setShowSource(false)
        }
      })
      schedule(9600, () => {
        if (!cancelled) {
          setOutputTab("json")
          setShowSource(false)
        }
      })
      schedule(11900, () => {
        if (!cancelled) {
          setStage("source")
          setShowSource(true)
        }
      })
      schedule(reduce ? 13300 : 15100, () => {
        if (!cancelled) runCycle()
      })
    }

    runCycle()
    return () => {
      cancelled = true
      clearTimers()
    }
  }, [clearTimers, reduce, schedule])

  useLayoutEffect(() => {
    if (stage === "select") {
      setLockedDemoBodyPx(null)
      return
    }
    if (lockedDemoBodyPx !== null) return
    const el = demoBodyShellRef.current
    if (!el) return
    const h = el.getBoundingClientRect().height
    if (h > 0) setLockedDemoBodyPx(Math.round(h))
  }, [stage, lockedDemoBodyPx])

  const toggleKind = useCallback((k: RegionKind) => {
    setVisibleKinds((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }, [])

  const filteredRegions = useMemo(
    () => LAYOUT_REGIONS.filter((r) => visibleKinds.has(r.kind)),
    [visibleKinds],
  )

  const activePayload = useMemo<{ text: string; filename: string; mime: string }>(() => {
    switch (outputTab) {
      case "markdown":
        return { text: DOC_MARKDOWN, filename: "q3_financial_report.md", mime: "text/markdown;charset=utf-8" }
      case "html":
        return { text: DOC_HTML, filename: "q3_financial_report.html", mime: "text/html;charset=utf-8" }
      case "json":
        return { text: DOC_JSON, filename: "q3_financial_report.json", mime: "application/json;charset=utf-8" }
      case "blocks":
      default:
        return { text: LAYOUT_JSON, filename: "layout-regions.json", mime: "application/json;charset=utf-8" }
    }
  }, [outputTab])

  const handleCopy = () => {
    void navigator.clipboard.writeText(activePayload.text)
  }

  const handleDownload = () => {
    const blob = new Blob([activePayload.text], { type: activePayload.mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = activePayload.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const activeRail = PROCESS_RAIL.findIndex(
    (r) => r.stage === (stage === "source" ? "source" : stage),
  )

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Card className="overflow-hidden border-border shadow-lg">
        {/* App header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background px-3 py-2.5 sm:px-4">
          <div className="min-w-0 text-[11px] leading-snug">
            <span className="font-semibold text-foreground">AI Document Analyzer</span>
            <span className="text-muted-foreground"> · </span>
            <span className="text-muted-foreground">{EXAMPLE_FILENAME}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Refresh">
              <RefreshCw className="size-3.5 text-muted-foreground" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Settings">
              <Settings className="size-3.5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div
          ref={demoBodyShellRef}
          className={cn(
            "border-b border-border bg-background",
            lockedDemoBodyPx != null ? DEMO_BODY_H_LOCKED : DEMO_BODY_H_UNLOCKED,
          )}
          style={
            lockedDemoBodyPx != null
              ? {
                  height: lockedDemoBodyPx,
                  minHeight: lockedDemoBodyPx,
                  maxHeight: lockedDemoBodyPx,
                }
              : undefined
          }
        >
          {/* Left — document thumbnail */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-b border-border lg:h-full lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-muted/20 px-3 py-1.5">
              <span className="truncate font-mono text-[10px] font-medium text-foreground">{EXAMPLE_FILENAME}</span>
            </div>
            <div className="flex items-center gap-1 border-b border-border/60 bg-muted/10 px-2 py-1">
              <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Search">
                <Search className="size-3.5" />
              </Button>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground tabular-nums">100%</span>
              <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Zoom out">
                <Minus className="size-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Zoom in">
                <Plus className="size-3.5" />
              </Button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-100/80 dark:bg-zinc-900/50">
              {stage === "select" ? (
                <div className="flex min-h-0 flex-1 items-center justify-center p-6">
                  <div className="w-full max-w-sm rounded-md border border-dashed border-border/60 bg-background/40 px-6 py-16 text-center dark:bg-background/20">
                    <p className="text-[10.5px] font-medium text-muted-foreground">No preview yet</p>
                    <p className="mt-1 text-[10px] text-muted-foreground/80">Upload a file to see the document here</p>
                  </div>
                </div>
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto p-3">
                  <DocPage
                    showBBoxes={stage === "viewer" || stage === "source"}
                    visibleKinds={visibleKinds}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right — stage-driven panel */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:h-full">
            <AnimatePresence mode="wait">
              {stage === "select" && (
                <motion.div
                  key={`stage-select-${uploadCycle}`}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex h-full min-h-0 flex-1 flex-col"
                >
                  <div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-5">
                    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4">
                      <div className="text-center">
                        <h3 className="text-[13px] font-semibold tracking-tight text-foreground">Upload a document</h3>
                        <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                          Supported formats: {SUPPORTED_EXTENSIONS}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">Maximum file size: 50 MB per file</p>
                      </div>

                      <Button
                        type="button"
                        className="h-11 w-full rounded-lg border border-border/60 bg-zinc-950 text-[12.5px] font-semibold tracking-wide text-zinc-50 shadow-sm hover:bg-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:hover:bg-zinc-950"
                      >
                        <Upload className="mr-2 size-4 shrink-0 opacity-95" aria-hidden />
                        Upload file
                      </Button>

                      <div className="relative">
                        <div
                          className={cn(
                            "relative flex min-h-[156px] flex-col items-center justify-start overflow-hidden rounded-xl border-2 border-dashed px-4 pb-4 pt-10 transition-colors",
                            "border-border/70 bg-muted/10 dark:border-border/60 dark:bg-muted/5",
                          )}
                        >
                          <p className="relative z-0 text-center text-[10.5px] font-medium text-muted-foreground">
                            Drag and drop files here
                          </p>
                          <p className="relative z-0 mt-0.5 text-center text-[10px] text-muted-foreground/85">
                            or use Upload file above
                          </p>

                          <motion.div
                            className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex w-[min(100%,240px)] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 shadow-lg ring-1 ring-black/20 dark:border-zinc-200/90 dark:bg-white dark:text-zinc-900 dark:ring-white/30"
                            initial={reduce ? false : { x: 76, y: 132, opacity: 0.2, scale: 0.9 }}
                            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.36, ease }}
                          >
                            <FileSpreadsheet className="size-7 shrink-0 text-zinc-200 dark:text-zinc-700" aria-hidden />
                            <span className="truncate font-mono text-[10px] font-medium text-zinc-100 dark:text-zinc-900">
                              {EXAMPLE_FILENAME}
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {(stage === "viewer" || stage === "source") && (
                <motion.div
                  key="stage-viewer"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex h-full min-h-0 flex-1 flex-col"
                >
                  {/* Output-format tabs */}
                  <div
                    role="tablist"
                    aria-label="Structured output format"
                    className="flex items-center gap-1 border-b border-border/60 bg-muted/10 px-2 pt-1.5"
                  >
                    {OUTPUT_TABS.map((t) => {
                      const active = outputTab === t.id
                      return (
                        <button
                          key={t.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => {
                            setOutputTab(t.id)
                            setShowSource(false)
                            if (stage === "source") setStage("viewer")
                          }}
                          className={cn(
                            "rounded-t-md px-3 py-1.5 text-[11px] font-medium transition-colors",
                            active
                              ? "bg-background text-foreground shadow-[0_1px_0_0_var(--background)]"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {t.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Tab header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/60 px-3 py-2.5">
                    <div>
                      <h3 className="text-[12px] font-semibold text-foreground">
                        {outputTab === "blocks"
                          ? "Layout Detection"
                          : outputTab === "markdown"
                            ? "Markdown viewer"
                            : outputTab === "html"
                              ? "HTML viewer"
                              : "JSON viewer"}
                      </h3>
                      {outputTab === "blocks" && (
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {filteredRegions.length}/{LAYOUT_REGIONS.length} regions
                        </p>
                      )}
                      {outputTab !== "blocks" && (
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {showSource ? "Raw source output" : "Rendered preview"}
                        </p>
                      )}
                    </div>
                    {outputTab !== "blocks" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 gap-1 font-mono text-[10px]",
                          showSource &&
                            "border border-border bg-foreground text-background hover:bg-foreground/90 hover:text-background",
                        )}
                        onClick={() => {
                          setShowSource((v) => {
                            const next = !v
                            setStage(next ? "source" : "viewer")
                            return next
                          })
                        }}
                        aria-pressed={showSource}
                      >
                        <Code2 className="size-3.5" aria-hidden />
                        {showSource ? "Preview" : "Source"}
                      </Button>
                    )}
                  </div>

                  {/* Filter chips — only for Blocks */}
                  {outputTab === "blocks" && (
                    <div className="flex flex-wrap gap-1.5 border-b border-border/60 px-3 py-2">
                      {(Object.keys(REGION_STYLES) as RegionKind[]).map((k) => {
                        const st = REGION_STYLES[k]
                        const on = visibleKinds.has(k)
                        return (
                          <button
                            key={k}
                            type="button"
                            onClick={() => toggleKind(k)}
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-[9.5px] font-semibold tracking-wide transition-opacity",
                              st.border,
                              st.soft,
                              on ? "opacity-100 ring-1 ring-foreground/10" : "opacity-40",
                            )}
                          >
                            {st.filter}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Tab content — flex column so HTML iframe can fill down to the action bar (same footprint as Markdown). */}
                  <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-muted/10 p-3 dark:bg-zinc-950/30">
                    {outputTab === "blocks" ? (
                      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                        {filteredRegions.map((r) => {
                          const st = REGION_STYLES[r.kind]
                          return (
                            <li
                              key={r.id}
                              className={cn("rounded-lg border px-3 py-2.5 text-left", st.border, st.soft)}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className={cn("rounded px-1 py-0.5 text-[8px] font-bold", st.badge)}>
                                  {st.label}
                                </span>
                                <span className="text-[9px] font-medium text-muted-foreground">Region {r.id}</span>
                              </div>
                              <p className="mt-1.5 text-[11px] leading-relaxed text-foreground">{r.summary}</p>
                            </li>
                          )
                        })}
                      </ul>
                    ) : outputTab === "markdown" ? (
                      showSource ? (
                        <pre className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap break-words rounded-md border border-border/60 bg-zinc-950 p-3 font-mono text-[10px] leading-relaxed text-zinc-200">
                          {DOC_MARKDOWN}
                        </pre>
                      ) : (
                        <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-border/60 bg-background p-4">
                          <MarkdownPreview source={DOC_MARKDOWN} />
                        </div>
                      )
                    ) : outputTab === "html" ? (
                      showSource ? (
                        <pre className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap break-words rounded-md border border-border/60 bg-zinc-950 p-3 font-mono text-[10px] leading-relaxed text-zinc-200">
                          {DOC_HTML}
                        </pre>
                      ) : (
                        <HtmlPreview source={DOC_HTML} />
                      )
                    ) : showSource ? (
                      <pre className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap break-words rounded-md border border-border/60 bg-zinc-950 p-3 font-mono text-[10px] leading-relaxed text-zinc-200">
                        {DOC_JSON}
                      </pre>
                    ) : (
                      <div className="min-h-0 flex-1 overflow-y-auto">
                        <JsonKeyValueTable source={DOC_JSON} />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border/60 bg-background px-3 py-3">
                    <Button
                      type="button"
                      size="sm"
                      className="h-9 min-w-[160px] rounded-md bg-foreground text-[11px] font-semibold text-background hover:bg-foreground/90"
                      onClick={handleDownload}
                    >
                      Export
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-9 gap-1 text-[11px]" onClick={handleDownload}>
                      <Download className="size-3.5" aria-hidden />
                      Download
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-9 gap-1 text-[11px]" onClick={handleCopy}>
                      <Copy className="size-3.5" aria-hidden />
                      Copy
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Process rail */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border bg-muted/20 px-3 py-3">
          {PROCESS_RAIL.map((step, i) => {
            const active = i === activeRail
            const done = i < activeRail
            return (
              <div key={step.id} className="flex items-center gap-2 text-[10px] font-medium">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    active
                      ? "bg-foreground shadow-[0_0_0_3px] shadow-foreground/15"
                      : done
                        ? "bg-foreground/60"
                        : "bg-muted-foreground/30",
                  )}
                  aria-hidden
                />
                <span className={cn(active ? "text-foreground" : "text-muted-foreground")}>{step.label}</span>
                {i < PROCESS_RAIL.length - 1 && (
                  <Layers className="size-3 -mx-1 hidden text-muted-foreground/30 sm:inline" aria-hidden />
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </section>
  )
}
