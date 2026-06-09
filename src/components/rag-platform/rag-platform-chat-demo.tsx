import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  BarChart2,
  BookOpen,
  ChevronRight,
  FileText,
  Search,
  Database,
  ShieldCheck,
  Zap,
  Send,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Phase =
  | "idle"
  | "typing"
  | "loading"
  | "retrieving"
  | "generating"
  | "complete"

interface DocCard {
  title: string
  docType: string
  citation: string
  /** Qualitative retrieval signal (no numeric score). */
  matchLabel: string
  beforeHighlight: string
  highlight: string
  afterHighlight: string
}

interface DemoConfig {
  responseText: string
  docs: DocCard[]
}

const DEFAULT_DEMO_CHIP =
  "Add up monthly operating profit across all sections in this report"

const DEMOS: Record<string, DemoConfig> = {
  finance: {
    responseText:
      "I aggregated the operating profit figures across the relevant sections of the report.\n\n1. Section totals\nThe monthly operating profit values appear in the regional summary, segment appendix, and management overview. [¹][²][³]\n\n2. Combined result\nAfter consolidating the reported figures, the total operating profit for the month is presented consistently across the retrieved sections. [¹][³]\n\n3. Notes\nOne section reports the number in a summarized table, while another provides the same figure with segment-level breakdowns.",
    docs: [
      {
        title: "Monthly Performance Report — Executive Summary",
        docType: "PDF",
        citation: "¹",
        matchLabel: "Strong match",
        beforeHighlight: "The total operating profit for the month was ",
        highlight: "$18.4M",
        afterHighlight: ", reflecting gains in the core business units.",
      },
      {
        title: "Segment Appendix — Profit Breakdown",
        docType: "XLS",
        citation: "²",
        matchLabel: "Strong match",
        beforeHighlight: "Operating profit by segment sums to ",
        highlight: "$18.4M",
        afterHighlight: " when the listed business lines are combined.",
      },
      {
        title: "Regional Review — Monthly Highlights",
        docType: "PDF",
        citation: "³",
        matchLabel: "Good match",
        beforeHighlight: "The report restates monthly operating profit as ",
        highlight: "$18.4M",
        afterHighlight: " in the management highlights section.",
      },
    ],
  },
  history: {
    responseText:
      "I traced Julia's personnel transfer history across the retrieved records.\n\n1. Earliest assignment\nJulia appears first in the 2019 organizational notice as part of the Strategy Office. [¹]\n\n2. Transfer sequence\nSubsequent HR notices show transfers to Corporate Planning in 2021 and Regional Operations in 2023. [²]\n\n3. Current placement\nThe most recent personnel bulletin in the retrieved set lists Julia in the Transformation Office. [³]",
    docs: [
      {
        title: "HR Notice — 2019 Appointments",
        docType: "PDF",
        citation: "¹",
        matchLabel: "Strong match",
        beforeHighlight: "Julia Han was assigned to the ",
        highlight: "Strategy Office",
        afterHighlight: " effective March 2019.",
      },
      {
        title: "Personnel Transfer Bulletin — 2021",
        docType: "DOC",
        citation: "²",
        matchLabel: "Strong match",
        beforeHighlight: "Julia Han was transferred to ",
        highlight: "Corporate Planning",
        afterHighlight: " as part of the reorganization.",
      },
      {
        title: "Transformation Office Bulletin — 2024",
        docType: "PDF",
        citation: "³",
        matchLabel: "Good match",
        beforeHighlight: "The bulletin lists Julia Han under ",
        highlight: "Transformation Office",
        afterHighlight: " alongside other leadership moves this quarter.",
      },
    ],
  },
  visual: {
    responseText:
      "I found the most relevant drawings for the 000 division design request.\n\n1. Primary match\nThe top result is a layout drawing that matches the requested division name and plan type. [¹]\n\n2. Supporting visual evidence\nRelated drawings include a floor layout, a mechanical detail sheet, and a marked-up revision set. [²][³]\n\n3. Retrieval note\nThese matches were surfaced from visually rich documents using fine-grained visual retrieval over titles, layouts, and drawing regions.",
    docs: [
      {
        title: "000 Division Layout Plan — Revision B",
        docType: "PDF",
        citation: "¹",
        matchLabel: "Strong match",
        beforeHighlight: "Drawing title block shows ",
        highlight: "000 Division Layout Plan",
        afterHighlight: " with the requested revision marker.",
      },
      {
        title: "Mechanical Detail Sheet — 000 Division",
        docType: "PDF",
        citation: "²",
        matchLabel: "Strong match",
        beforeHighlight: "The sheet contains ",
        highlight: "section annotations and component callouts",
        afterHighlight: " aligned with the design request.",
      },
      {
        title: "Marked-Up Drawing Set",
        docType: "PDF",
        citation: "³",
        matchLabel: "Good match",
        beforeHighlight: "The revision set highlights ",
        highlight: "layout updates in the target area",
        afterHighlight: " across the engineering markup.",
      },
    ],
  },
  summary: {
    responseText:
      "Here is a concise summary of this month's performance report.\n\n1. Revenue and profit\nThe report shows stable top-line growth and stronger operating margin performance than the previous month. [¹][²]\n\n2. Operational highlights\nThe strongest gains came from the enterprise segment, while regional performance remained mixed. [²][³]\n\n3. Overall takeaway\nThe month closed with positive momentum, supported by margin improvement and more balanced segment contribution.",
    docs: [
      {
        title: "This Month's Performance Report",
        docType: "PDF",
        citation: "¹",
        matchLabel: "Strong match",
        beforeHighlight: "Revenue increased by ",
        highlight: "8.2% month over month",
        afterHighlight: ", led by enterprise demand.",
      },
      {
        title: "Management Review — Monthly Close",
        docType: "DOC",
        citation: "²",
        matchLabel: "Strong match",
        beforeHighlight: "Operating margin improved to ",
        highlight: "14.6%",
        afterHighlight: " with better cost discipline across teams.",
      },
      {
        title: "Regional Snapshot Appendix",
        docType: "PDF",
        citation: "³",
        matchLabel: "Good match",
        beforeHighlight: "Regional results remained ",
        highlight: "uneven across markets",
        afterHighlight: ", though the overall trend improved.",
      },
    ],
  },
}

const CHIP_MAP: Record<string, string> = {
  "Add up monthly operating profit across all sections in this report":
    "finance",
  "Trace Julia's personnel transfer history across referenced documents":
    "history",
  "Find the drawing for designing the 000 division": "visual",
  "Summarize this month's performance report": "summary",
}

const CHIPS = Object.keys(CHIP_MAP)

const PIPELINE_STEPS = [
  { label: "Query understood", icon: Search },
  { label: "Retrieving", icon: Database },
  { label: "Evidence selected", icon: ShieldCheck },
  { label: "Grounded response", icon: Zap },
] as const

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[\S+\])/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <span key={i} className="font-medium text-foreground">
          {part.slice(2, -2)}
        </span>
      )
    }
    if (/^\[\S+\]$/.test(part)) {
      return (
        <Badge
          key={i}
          variant="outline"
          className="mx-0.5 inline-flex align-middle text-[10px] font-semibold"
        >
          {part}
        </Badge>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function renderText(text: string) {
  const lines = text.split("\n")
  const elements: ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ""
    if (line === "") {
      elements.push(<div key={key++} className="h-2" />)
    } else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^\d+/)?.[0]
      const rest = line.replace(/^\d+\.\s+/, "")
      elements.push(
        <div key={key++} className="mb-0.5 mt-1 flex gap-2">
          <span className="min-w-[1rem] font-medium text-primary">
            {num}.
          </span>
          <span className="font-medium text-foreground">{rest}</span>
        </div>,
      )
    } else {
      elements.push(
        <div
          key={key++}
          className="text-sm leading-relaxed text-muted-foreground"
        >
          {renderInline(line)}
        </div>,
      )
    }
  }
  return elements
}

function LoadingDots({ reduce }: { reduce: boolean }) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="size-1.5 rounded-full bg-muted-foreground/50"
          animate={
            reduce
              ? { opacity: 0.85, y: 0 }
              : { opacity: [0.3, 1, 0.3], y: [0, -3, 0] }
          }
          transition={
            reduce
              ? undefined
              : {
                  repeat: Infinity,
                  duration: 1.1,
                  delay: i * 0.18,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </div>
  )
}

function UserBubble({ text, reduce }: { text: string; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] rounded-2xl rounded-br-sm border border-border bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
        {text}
      </div>
    </motion.div>
  )
}

function AssistantAvatar() {
  return (
    <div
      className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground"
      aria-hidden
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="2" fill="currentColor" />
        <circle
          cx="6"
          cy="6"
          r="4.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="1.5 1.5"
          fill="none"
        />
      </svg>
    </div>
  )
}

function AssistantBubble({
  text,
  isGenerating,
  reduce,
}: {
  text: string
  isGenerating: boolean
  reduce: boolean
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.4 }}
      className="flex gap-2.5"
    >
      <AssistantAvatar />
      <Card className="flex-1 rounded-2xl rounded-tl-sm border-border bg-card py-3.5 pl-4 pr-4 shadow-sm">
        <div className="text-sm leading-relaxed">{renderText(text)}</div>
        {isGenerating && (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block h-3 w-0.5 rounded-sm bg-primary align-middle"
            animate={reduce ? { opacity: 1 } : { opacity: [1, 0, 1] }}
            transition={
              reduce ? undefined : { repeat: Infinity, duration: 0.55 }
            }
          />
        )}
      </Card>
    </motion.div>
  )
}

function DocCardComponent({
  doc,
  index,
  reduce,
}: {
  doc: DocCard
  index: number
  reduce: boolean
}) {
  const iconMap: Record<string, ReactNode> = {
    PDF: <FileText className="size-3" />,
    DOC: <BookOpen className="size-3" />,
    XLS: <BarChart2 className="size-3" />,
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.45,
        delay: reduce ? 0 : index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card className="border-border p-4 shadow-sm">
        <div className="mb-2.5 flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="gap-1 px-2 py-0.5 text-[10px] font-semibold tracking-wide"
            >
              {iconMap[doc.docType] ?? <FileText className="size-3" />}
              {doc.docType}
            </Badge>
            <span className="min-w-0 text-xs font-medium text-foreground">
              {doc.title}
            </span>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] font-semibold">
              {doc.matchLabel}
            </Badge>
            <Badge variant="outline" className="text-[10px] font-semibold">
              [{doc.citation}]
            </Badge>
          </div>
        </div>
        <p className="m-0 text-xs leading-relaxed text-muted-foreground">
          &ldquo;{doc.beforeHighlight}
          {reduce ? (
            <span className="rounded bg-accent/70 px-0.5 text-foreground">
              {doc.highlight}
            </span>
          ) : (
            <motion.span
              initial={{ backgroundColor: "transparent" }}
              animate={{ backgroundColor: "var(--color-accent)" }}
              transition={{
                duration: 0.6,
                delay: index * 0.08 + 0.3,
              }}
              className="rounded px-0.5 text-foreground"
            >
              {doc.highlight}
            </motion.span>
          )}
          {doc.afterHighlight}&rdquo;
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Source excerpt selected for answer grounding.
        </p>
      </Card>
    </motion.div>
  )
}

function PipelineStatusBar({ phase, reduce }: { phase: Phase; reduce: boolean }) {
  const getStatus = (idx: number) => {
    if (phase === "idle" || phase === "typing") return "pending"
    if (phase === "loading") return idx === 0 ? "active" : "pending"
    if (phase === "retrieving") {
      if (idx === 0) return "complete"
      if (idx === 1) return "active"
      return "pending"
    }
    if (phase === "generating") {
      if (idx <= 1) return "complete"
      if (idx === 2) return "active"
      return "pending"
    }
    if (phase === "complete") return "complete"
    return "pending"
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {PIPELINE_STEPS.map((step, i) => {
        const status = getStatus(i)
        const Icon = step.icon
        const isActive = status === "active"
        const isComplete = status === "complete"
        return (
          <motion.div
            key={step.label}
            animate={
              reduce
                ? {}
                : {
                    borderColor: isActive
                      ? "var(--color-ring)"
                      : undefined,
                    backgroundColor: isActive
                      ? "color-mix(in oklab, var(--color-muted) 85%, transparent)"
                      : undefined,
                  }
            }
            transition={{ duration: reduce ? 0 : 0.4 }}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-medium",
              isComplete && "border-border bg-muted/40 text-foreground",
              isActive && "border-primary/40 bg-muted/50 text-foreground",
              !isComplete &&
                !isActive &&
                "border-border bg-muted/20 text-muted-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-3 shrink-0",
                isActive && "text-primary",
                isComplete && "text-foreground",
              )}
              aria-hidden
            />
            <span className="flex items-center gap-1">
              {isActive && i === 1 ? (
                <>
                  {step.label}
                  {!reduce && (
                    <motion.span
                      aria-hidden
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      …
                    </motion.span>
                  )}
                  {reduce && <span aria-hidden>…</span>}
                </>
              ) : (
                step.label
              )}
            </span>
            {isComplete && (
              <motion.span
                initial={reduce ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={
                  reduce
                    ? undefined
                    : { type: "spring", stiffness: 400, damping: 20 }
                }
                className="flex size-3 items-center justify-center rounded-full border border-border bg-muted"
                aria-label="Complete"
              >
                <svg
                  width="7"
                  height="7"
                  viewBox="0 0 7 7"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M1 3.5L2.8 5.3L6 2"
                    className="stroke-foreground"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function GroundedBlock({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card className="border-border bg-muted/30 p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md border border-border bg-background">
            <ShieldCheck className="size-4 text-foreground" aria-hidden />
          </div>
          <span className="text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
            Grounded response
          </span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Grounded synthesis across retrieved sources.
        </p>
        <div className="mb-3 flex flex-wrap gap-8">
          {[
            { v: "Multiple sources", l: "Sources" },
            { v: "Cross-passage", l: "Citations" },
            { v: "Source-grounded", l: "Grounding" },
          ].map((x) => (
            <div key={x.l}>
              <div className="text-sm font-medium leading-snug tracking-tight text-foreground">
                {x.v}
              </div>
              <div className="mt-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                {x.l}
              </div>
            </div>
          ))}
        </div>
        <div
          className="h-0.5 overflow-hidden rounded-full bg-muted"
          aria-hidden
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={reduce ? { width: "72%" } : { width: 0 }}
            animate={{ width: "72%" }}
            transition={{
              duration: reduce ? 0 : 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>
      </Card>
    </motion.div>
  )
}

export function RagPlatformChatDemo() {
  const reduceMotion = useReducedMotion() ?? false
  const reduce = reduceMotion

  const [phase, setPhase] = useState<Phase>("idle")
  const [inputText, setInputText] = useState("")
  const [revealedChars, setRevealedChars] = useState(0)
  const [visibleDocs, setVisibleDocs] = useState(0)
  const [activeDemo, setActiveDemo] = useState("finance")
  const [activeChip, setActiveChip] = useState(DEFAULT_DEMO_CHIP)

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const after = useCallback((delay: number, fn: () => void) => {
    const id = setTimeout(fn, delay)
    timersRef.current.push(id)
  }, [])

  const startGenerating = useCallback(
    (demoKey: string) => {
      const responseText = DEMOS[demoKey]?.responseText ?? ""
      setRevealedChars(0)

      if (reduce) {
        setRevealedChars(responseText.length)
        const id = setTimeout(() => setPhase("complete"), 50)
        timersRef.current.push(id)
        return
      }

      let chars = 0
      intervalRef.current = setInterval(() => {
        chars = Math.min(chars + 3, responseText.length)
        setRevealedChars(chars)
        if (chars >= responseText.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null
          const done = setTimeout(() => {
            setPhase("complete")
          }, 400)
          timersRef.current.push(done)
        }
      }, 22)
    },
    [reduce],
  )

  const submitQuery = useCallback(
    (query: string, demoKey: string) => {
      void query
      setInputText("")
      setPhase("loading")

      if (reduce) {
        after(0, () => {
          setPhase("retrieving")
          after(24, () => setVisibleDocs(1))
          after(48, () => setVisibleDocs(2))
          after(72, () => setVisibleDocs(3))
          after(96, () => {
            setPhase("generating")
            startGenerating(demoKey)
          })
        })
        return
      }

      after(1300, () => {
        setPhase("retrieving")
        after(500, () => setVisibleDocs(1))
        after(1050, () => setVisibleDocs(2))
        after(1600, () => setVisibleDocs(3))
        after(2200, () => {
          setPhase("generating")
          startGenerating(demoKey)
        })
      })
    },
    [after, startGenerating, reduce],
  )

  const startDemo = useCallback(
    (chip: string) => {
      const demoKey = CHIP_MAP[chip] ?? "finance"
      clearAll()
      setPhase("idle")
      setInputText("")
      setRevealedChars(0)
      setVisibleDocs(0)
      setActiveDemo(demoKey)
      setActiveChip(chip)

      if (reduce) {
        setInputText(chip)
        after(0, () => {
          setPhase("loading")
          submitQuery(chip, demoKey)
        })
        return
      }

      let charIndex = 0
      after(600, () => {
        setPhase("typing")
        intervalRef.current = setInterval(() => {
          charIndex++
          setInputText(chip.slice(0, charIndex))
          if (charIndex >= chip.length) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            intervalRef.current = null
            after(700, () => submitQuery(chip, demoKey))
          }
        }, 38)
      })
    },
    [clearAll, after, submitQuery, reduce],
  )

  const startDemoRef = useRef(startDemo)
  startDemoRef.current = startDemo

  useEffect(() => {
    startDemoRef.current(DEFAULT_DEMO_CHIP)
    return () => clearAll()
  }, [clearAll])

  const currentDemoData = DEMOS[activeDemo] ?? DEMOS.finance
  const userQuery = activeChip
  const isShowingDocs =
    phase === "retrieving" || phase === "generating" || phase === "complete"
  const hasMessages =
    phase === "loading" ||
    phase === "retrieving" ||
    phase === "generating" ||
    phase === "complete"

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: reduce ? 0 : 0.7 }}
        className="mb-8 text-center"
      >
        <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          <span className="h-px w-4 bg-border" aria-hidden />
          Agentic Retrieved agumented Generatrion
          <span className="h-px w-4 bg-border" aria-hidden />
        </div>
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          <span className="block">Ask naturally.</span>
          <span className="mt-1 block text-balance">
            AI Agents retrieves, connects, and grounds answers across your data.
          </span>
        </h2>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.1 }}
      >
        <Card className="relative min-h-[640px] overflow-hidden border-border bg-card p-6 shadow-sm sm:p-7">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent"
            aria-hidden
          />

          <div className="mt-6 flex flex-col gap-6 lg:flex-row">
            {/* Left column */}
            <div className="flex min-h-[480px] w-full flex-col lg:w-[54%] lg:max-w-none lg:flex-none">
              <div className="flex min-h-[220px] flex-1 flex-col justify-end gap-3 pb-4">
                {!hasMessages && (
                  <div className="pb-6 text-center text-sm text-muted-foreground">
                    <div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-full border border-border">
                      <Search className="size-4" aria-hidden />
                    </div>
                    Select a prompt to see the RAG workflow in action
                  </div>
                )}

                <AnimatePresence>
                  {hasMessages && (
                    <UserBubble key="user-msg" text={userQuery} reduce={reduce} />
                  )}

                  {phase === "loading" && (
                    <motion.div
                      key="loading"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2"
                    >
                      <AssistantAvatar />
                      <Card className="rounded-2xl rounded-tl-sm border-border py-0 shadow-sm">
                        <LoadingDots reduce={reduce} />
                      </Card>
                    </motion.div>
                  )}

                  {phase === "retrieving" && (
                    <motion.div
                      key="retrieving"
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-xs font-medium text-foreground"
                    >
                      <motion.span
                        className="inline-block size-3.5 rounded-full border-2 border-muted border-t-primary"
                        animate={reduce ? { rotate: 0 } : { rotate: 360 }}
                        transition={
                          reduce
                            ? undefined
                            : { repeat: Infinity, duration: 1.2, ease: "linear" }
                        }
                        aria-hidden
                      />
                      <span>Retrieving evidence from sources</span>
                      {!reduce && (
                        <motion.span
                          aria-hidden
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          …
                        </motion.span>
                      )}
                      {reduce && <span aria-hidden>…</span>}
                    </motion.div>
                  )}

                  {(phase === "generating" || phase === "complete") && (
                    <AssistantBubble
                      key="assistant-msg"
                      text={currentDemoData.responseText.slice(0, revealedChars)}
                      isGenerating={phase === "generating"}
                      reduce={reduce}
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="mb-3">
                <p className="mb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Example prompts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CHIPS.map((chip) => (
                    <Button
                      key={chip}
                      type="button"
                      variant={activeChip === chip ? "secondary" : "outline"}
                      size="sm"
                      className={cn(
                        "h-auto gap-1 rounded-lg py-1.5 text-left text-xs font-medium",
                        activeChip === chip && "ring-2 ring-ring",
                      )}
                      onClick={() => startDemo(chip)}
                    >
                      <ChevronRight className="size-3 shrink-0 opacity-60" />
                      <span className="text-pretty">{chip}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-full border border-border bg-muted/30 px-4 py-2.5 backdrop-blur-sm">
                <div className="flex min-h-5 flex-1 items-center text-sm text-foreground">
                  {inputText || (
                    <span className="text-muted-foreground">
                      Ask anything about your knowledge base…
                    </span>
                  )}
                  {phase === "typing" && (
                    <motion.span
                      aria-hidden
                      className="ml-0.5 inline-block h-3.5 w-0.5 shrink-0 rounded-sm bg-primary align-middle"
                      animate={reduce ? { opacity: 1 } : { opacity: [1, 0, 1] }}
                      transition={
                        reduce
                          ? undefined
                          : { repeat: Infinity, duration: 0.6 }
                      }
                    />
                  )}
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant={inputText ? "default" : "secondary"}
                  className="size-9 shrink-0 rounded-full"
                  disabled
                  aria-label="Send (demo)"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>

            {/* Right column */}
            <div className="flex min-w-0 flex-1 flex-col gap-3.5 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div>
                <p className="mb-2 text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Pipeline status
                </p>
                <PipelineStatusBar phase={phase} reduce={reduce} />
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Retrieved sources
                </span>
                <AnimatePresence>
                  {visibleDocs > 0 && (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1.5"
                      aria-label="Sources appearing in the demo"
                    >
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={cn(
                            "size-2 rounded-full border border-border transition-colors",
                            i < visibleDocs
                              ? "bg-foreground"
                              : "bg-muted",
                          )}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-2">
                {!isShowingDocs &&
                  [0, 1, 2].map((i) => (
                    <Card
                      key={i}
                      className="border-dashed border-border/80 p-4 shadow-none"
                    >
                      <Skeleton className="mb-2 h-2 w-[70%]" />
                      <Skeleton className="mb-1.5 h-2 w-full" />
                      <Skeleton className="h-2 w-[80%]" />
                    </Card>
                  ))}

                <AnimatePresence>
                  {isShowingDocs &&
                    currentDemoData.docs
                      .slice(0, visibleDocs)
                      .map((doc, i) => (
                        <DocCardComponent
                          key={doc.title}
                          doc={doc}
                          index={i}
                          reduce={reduce}
                        />
                      ))}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {phase === "complete" && (
                  <div className="mt-auto pt-2">
                    <GroundedBlock reduce={reduce} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  )
}
