import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowLeft, ChevronDown, ChevronRight, FileText, RefreshCw, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Self-running demo — ported from `.dev/code/20260421_0000_mzo_docu_generator` `DemoWorkflow.tsx`
 * (layout, timing). Client-side simulation; `prefers-reduced-motion` shows a static snapshot.
 */

const CATEGORY_OPTIONS = ["Software", "Development / Services"] as const
const PROCUREMENT_OPTIONS = ["Negotiated Contract", "Open Competitive Bid", "Direct Purchase"] as const
const DOC_TYPE_OPTIONS = ["RFP", "Proposal", "Business Plan"] as const

type SectionRow = { id: number; title: string }
type SubsectionRow = { id: number; number: string; title: string }

type DemoScenario = {
  title: string
  category: string
  procurement: string
  docType: string
  budget: string
  duration: string
  categoryIdx: number
  procurementIdx: number
  docTypeIdx: number
  sections: readonly SectionRow[]
  subsections: readonly SubsectionRow[]
  stream11: string
  stream12: string
}

const SCENARIOS: readonly DemoScenario[] = [
  {
    title: "2027 AI Transformation Project",
    category: "Software",
    procurement: "Negotiated Contract",
    docType: "RFP",
    budget: "100,000,000",
    duration: "12 months",
    categoryIdx: 0,
    procurementIdx: 0,
    docTypeIdx: 0,
    sections: [
      { id: 1, title: "Project Overview" },
      { id: 2, title: "Current System Status" },
      { id: 3, title: "Proposal Requirements" },
      { id: 4, title: "Submission and Evaluation Guidelines" },
    ],
    subsections: [
      { id: 11, number: "1.1", title: "Overview" },
      { id: 12, number: "1.2", title: "Background" },
      { id: 13, number: "1.3", title: "Current State and Improvements" },
    ],
    stream11:
      "This RFP outlines requirements for the 2027 AI Transformation Project — a strategic initiative to modernize enterprise systems through AI-assisted automation and intelligent document processing for organizational workflows.",
    stream12:
      "The organization currently operates on legacy platforms requiring manual document processing. This initiative establishes AI-first workflows to reduce operational overhead while improving accuracy and compliance across all departments.",
  },
  {
    title: "Platform modernization initiative",
    category: "Development / Services",
    procurement: "Open Competitive Bid",
    docType: "Proposal",
    budget: "85,000,000",
    duration: "18 months",
    categoryIdx: 1,
    procurementIdx: 1,
    docTypeIdx: 1,
    sections: [
      { id: 1, title: "Scope and delivery model" },
      { id: 2, title: "Supplier qualification criteria" },
      { id: 3, title: "Technical and commercial evaluation" },
      { id: 4, title: "Submission and Q&A calendar" },
    ],
    subsections: [
      { id: 11, number: "1.1", title: "Program objectives" },
      { id: 12, number: "1.2", title: "Delivery phasing" },
      { id: 13, number: "1.3", title: "Governance and exit criteria" },
    ],
    stream11:
      "This proposal defines the modernization initiative — delivery phasing, exit criteria for each phase, and governance checkpoints aligned with procurement rules.",
    stream12:
      "The services program spans integration, data migration, and controlled rollout. Each subsection ties back to the evaluation matrix published in the solicitation pack.",
  },
] as const

export function DocuGeneratorWorkflowDemo() {
  const prefersReducedMotion = useReducedMotion() ?? false

  const [fTitle, setFTitle] = useState("")
  const [fCategory, setFCategory] = useState("")
  const [fProcurement, setFProcurement] = useState("")
  const [fDocType, setFDocType] = useState("")
  const [fBudget, setFBudget] = useState("")
  const [fDuration, setFDuration] = useState("")
  const [activeField, setActiveField] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<"category" | "procurement" | "docType" | null>(null)
  const [dropdownHighlight, setDropdownHighlight] = useState<number | null>(null)
  const [btnState, setBtnState] = useState<"idle" | "active" | "clicked">("idle")
  const [phase, setPhase] = useState<"form" | "overview">("form")
  const [visibleSecs, setVisibleSecs] = useState<number[]>([])
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [visibleSubs, setVisibleSubs] = useState<number[]>([])
  const [streamingId, setStreamingId] = useState<number | null>(null)
  const [streamContent, setStreamContent] = useState<Record<number, string>>({})
  const [overviewSections, setOverviewSections] = useState<readonly SectionRow[]>(SCENARIOS[0].sections)
  const [overviewSubsections, setOverviewSubsections] = useState<readonly SubsectionRow[]>(SCENARIOS[0].subsections)

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([])
  const scenarioIndexRef = useRef(0)

  useEffect(() => {
    const clearAll = () => {
      timersRef.current.forEach(clearTimeout)
      intervalsRef.current.forEach(clearInterval)
      timersRef.current = []
      intervalsRef.current = []
    }

    const staticScenario = SCENARIOS[0]

    if (prefersReducedMotion) {
      setFTitle(staticScenario.title)
      setFCategory(staticScenario.category)
      setFProcurement(staticScenario.procurement)
      setFDocType(staticScenario.docType)
      setFBudget(staticScenario.budget)
      setFDuration(staticScenario.duration)
      setActiveField(null)
      setOpenDropdown(null)
      setDropdownHighlight(null)
      setBtnState("idle")
      setPhase("overview")
      setOverviewSections(staticScenario.sections)
      setOverviewSubsections(staticScenario.subsections)
      setVisibleSecs([0, 1, 2, 3])
      setExpandedIdx(0)
      setVisibleSubs([0, 1, 2])
      setStreamingId(null)
      setStreamContent({ 11: staticScenario.stream11, 12: staticScenario.stream12 })
      return clearAll
    }

    const at = (delay: number, fn: () => void) => {
      const t = setTimeout(fn, delay)
      timersRef.current.push(t)
    }

    const typeField = (
      startDelay: number,
      text: string,
      setter: (v: string) => void,
      charDelay: number,
    ): number => {
      for (let i = 1; i <= text.length; i++) {
        const captured = i
        const t = setTimeout(
          () => setter(text.slice(0, captured)),
          startDelay + captured * charDelay,
        )
        timersRef.current.push(t)
      }
      return startDelay + text.length * charDelay
    }

    const stream = (delay: number, id: number, text: string): number => {
      const charDelay = 17
      at(delay, () => {
        setStreamingId(id)
        let idx = 0
        const interval = setInterval(() => {
          idx++
          setStreamContent((prev) => ({ ...prev, [id]: text.slice(0, idx) }))
          if (idx >= text.length) {
            clearInterval(interval)
            intervalsRef.current = intervalsRef.current.filter((x) => x !== interval)
            setStreamingId(null)
          }
        }, charDelay)
        intervalsRef.current.push(interval)
      })
      return delay + text.length * charDelay + 80
    }

    function scheduleDropdown(
      start: number,
      field: "category" | "procurement" | "docType",
      options: readonly string[],
      selectIndex: number,
      apply: (label: string) => void,
    ): number {
      let next = start
      at(next, () => {
        setActiveField(field)
        setOpenDropdown(field)
        setDropdownHighlight(null)
      })
      next += 420
      at(next, () => setDropdownHighlight(selectIndex))
      next += 480
      at(next, () => {
        apply(options[selectIndex]!)
        setOpenDropdown(null)
        setDropdownHighlight(null)
        setActiveField(null)
      })
      next += 400
      return next
    }

    function start() {
      clearAll()
      const si = scenarioIndexRef.current % SCENARIOS.length
      scenarioIndexRef.current = (scenarioIndexRef.current + 1) % SCENARIOS.length
      const sc = SCENARIOS[si]!

      setFTitle("")
      setFCategory("")
      setFProcurement("")
      setFDocType("")
      setFBudget("")
      setFDuration("")
      setActiveField(null)
      setOpenDropdown(null)
      setDropdownHighlight(null)
      setBtnState("idle")
      setPhase("form")
      setVisibleSecs([])
      setExpandedIdx(null)
      setVisibleSubs([])
      setStreamingId(null)
      setStreamContent({})
      setOverviewSections(sc.sections)
      setOverviewSubsections(sc.subsections)

      at(500, () => setActiveField("title"))
      let cursor = typeField(500, sc.title, setFTitle, 52)

      cursor = scheduleDropdown(cursor + 200, "category", CATEGORY_OPTIONS, sc.categoryIdx, setFCategory)
      cursor = scheduleDropdown(cursor + 120, "procurement", PROCUREMENT_OPTIONS, sc.procurementIdx, setFProcurement)
      cursor = scheduleDropdown(cursor + 100, "docType", DOC_TYPE_OPTIONS, sc.docTypeIdx, setFDocType)

      at(cursor + 200, () => setActiveField("budget"))
      cursor = typeField(cursor + 200, sc.budget, setFBudget, 63)

      at(cursor + 260, () => setActiveField("duration"))
      cursor = typeField(cursor + 260, sc.duration, setFDuration, 68)

      at(cursor + 180, () => setActiveField(null))
      at(cursor + 680, () => setBtnState("active"))
      at(cursor + 1480, () => setBtnState("clicked"))
      at(cursor + 1980, () => {
        setOverviewSections(sc.sections)
        setOverviewSubsections(sc.subsections)
        setPhase("overview")
        setBtnState("idle")
      })

      const oStart = cursor + 2300

      at(oStart, () => setVisibleSecs([0]))
      at(oStart + 320, () => setVisibleSecs([0, 1]))
      at(oStart + 640, () => setVisibleSecs([0, 1, 2]))
      at(oStart + 960, () => setVisibleSecs([0, 1, 2, 3]))

      at(oStart + 1720, () => setExpandedIdx(0))

      at(oStart + 2420, () => setVisibleSubs([0]))
      at(oStart + 2820, () => setVisibleSubs([0, 1]))
      at(oStart + 3220, () => setVisibleSubs([0, 1, 2]))

      const s1Start = oStart + 4000
      const s1End = stream(s1Start, 11, sc.stream11)

      const s2Start = s1End + 440
      const s2End = stream(s2Start, 12, sc.stream12)

      at(s2End + 2400, start)
    }

    start()
    return clearAll
  }, [prefersReducedMotion])

  const renderField = (
    label: string,
    value: string,
    fieldKey: string,
    placeholder?: string,
  ) => {
    const isActive = activeField === fieldKey
    return (
      <div>
        <div className="mb-1 block text-[10px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
          {label}
        </div>
        <div
          className={cn(
            "flex h-8 min-w-0 items-center rounded-md border bg-zinc-50 px-3 transition-all duration-150 dark:border-zinc-800/90 dark:bg-zinc-950",
            isActive
              ? "border-zinc-400 dark:border-zinc-600"
              : "border-zinc-200 dark:border-zinc-800/80",
          )}
        >
          {value ? (
            <span className="truncate text-[11.5px] text-zinc-900 dark:text-zinc-100">{value}</span>
          ) : (
            <span className="text-[11.5px] text-zinc-500 dark:text-zinc-400">{placeholder || ""}</span>
          )}
          {isActive && (
            <span
              aria-hidden
              className="ml-px inline-block h-3 w-px animate-pulse bg-zinc-600 dark:bg-zinc-300"
            />
          )}
        </div>
      </div>
    )
  }

  const renderSelectField = (
    label: string,
    fieldKey: "category" | "procurement" | "docType",
    value: string,
    options: readonly string[],
    placeholder: string,
  ) => {
    const isOpen = openDropdown === fieldKey
    const isActive = activeField === fieldKey || isOpen
    return (
      <div className="relative">
        <div className="mb-1 block text-[10px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
          {label}
        </div>
        <div
          className={cn(
            "flex h-8 min-w-0 cursor-default items-center justify-between rounded-md border bg-zinc-50 px-2.5 transition-all duration-200 dark:border-zinc-800/90 dark:bg-zinc-950",
            isActive
              ? "border-zinc-400 dark:border-zinc-600"
              : "border-zinc-200 dark:border-zinc-800/80",
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left text-[11.5px]",
              value ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400",
            )}
          >
            {value || placeholder}
          </span>
          <ChevronDown
            size={14}
            className={cn(
              "shrink-0 text-zinc-500 transition-transform duration-200 dark:text-zinc-400",
              isOpen && "rotate-180",
            )}
            aria-hidden
          />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-md border border-zinc-200 bg-white py-0.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
            >
              {options.map((opt, i) => (
                <div
                  key={opt}
                  className={cn(
                    "px-2.5 py-1.5 text-[11px] leading-snug text-zinc-700 transition-colors duration-150 dark:text-zinc-200",
                    dropdownHighlight === i &&
                      "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white",
                  )}
                >
                  {opt}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const chipOrder = [fDocType, fCategory, fProcurement, fDuration].filter(Boolean)

  return (
    <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl ring-1 ring-black/[0.06] dark:border-zinc-800 dark:bg-zinc-950 dark:ring-white/[0.05]">
      <div className="relative h-[502px] overflow-hidden bg-white dark:bg-zinc-950">
        <AnimatePresence mode="wait">
          {phase === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 overflow-y-auto"
            >
              <div className="px-6 py-5">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
                    <span className="text-[11px] font-bold tracking-tight text-white dark:text-zinc-950">M</span>
                  </div>
                  <div>
                    <div className="text-[12.5px] font-semibold tracking-tight text-zinc-900 dark:text-white">
                      Document Generator
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400">MZO Platform</div>
                  </div>
                </div>

                <div className="mb-[18px] h-px bg-zinc-200 dark:bg-zinc-800/90" />

                <div className="flex flex-col gap-3">
                  {renderField("Document Title", fTitle, "title", "Enter project name")}
                  <div className="grid grid-cols-2 gap-3">
                    {renderSelectField(
                      "Document Category",
                      "category",
                      fCategory,
                      CATEGORY_OPTIONS,
                      "Select category",
                    )}
                    {renderSelectField(
                      "Procurement Type",
                      "procurement",
                      fProcurement,
                      PROCUREMENT_OPTIONS,
                      "Select type",
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {renderSelectField("Document Type", "docType", fDocType, DOC_TYPE_OPTIONS, "Select document")}
                    {renderField("Budget (USD)", fBudget, "budget")}
                  </div>
                  {renderField("Duration", fDuration, "duration")}

                  <div className="mt-0.5 h-px bg-zinc-200 dark:bg-zinc-800/90" />

                  <button
                    type="button"
                    className={cn(
                      "flex h-[38px] w-full items-center justify-center gap-2 rounded-lg border text-[12px] font-semibold tracking-wide transition-all duration-300",
                      btnState === "idle" &&
                        "cursor-default border-zinc-800 bg-zinc-900 text-zinc-100 dark:border-zinc-700 dark:bg-black dark:text-zinc-100",
                      btnState === "active" &&
                        "cursor-pointer border-zinc-700 bg-zinc-800 text-white dark:border-transparent dark:bg-zinc-50 dark:text-zinc-950",
                      btnState === "clicked" &&
                        "scale-[0.98] cursor-pointer border-zinc-700 bg-zinc-800/95 text-white dark:border-transparent dark:bg-zinc-100 dark:text-zinc-950",
                    )}
                  >
                    {btnState === "clicked" ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        <span>Generating Document...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} className={btnState === "idle" ? "opacity-40" : "opacity-100"} />
                        <span>Generate Document</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-[9.5px] text-zinc-500 dark:text-zinc-500">
                    AI-generated draft · Review before submission
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="absolute inset-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="px-5 py-4">
                <div className="mb-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <button
                    type="button"
                    aria-label="New document"
                    className="flex size-7 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 text-zinc-600 transition-colors dark:border-white/[0.07] dark:bg-black dark:text-zinc-300"
                  >
                    <ArrowLeft size={12} />
                  </button>
                  <span className="min-w-0 flex-1 truncate text-[10.5px] font-medium tracking-tight text-zinc-600 dark:text-zinc-200">
                    Input → Structured Draft
                  </span>
                </div>

                <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/[0.06] dark:bg-black">
                  <div className="mb-1.5 text-[13px] font-semibold tracking-tight text-zinc-900 dark:text-white">
                    {fTitle || overviewSections[0]?.title}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {chipOrder.map((chip) => (
                      <span
                        key={chip}
                        className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-[9.5px] text-zinc-700 dark:border-white/[0.05] dark:bg-zinc-950/80 dark:text-zinc-200"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {overviewSections.map((section, idx) => {
                    const isVisible = visibleSecs.includes(idx)
                    const isExpanded = expandedIdx === idx
                    return (
                      <AnimatePresence key={section.id}>
                        {isVisible && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={cn(
                              "overflow-hidden rounded-lg border",
                              isExpanded
                                ? "border-zinc-300 dark:border-white/[0.09]"
                                : "border-zinc-200 dark:border-white/[0.05]",
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-10 items-center gap-2 px-3",
                                isExpanded
                                  ? "bg-zinc-100 dark:bg-zinc-900"
                                  : "bg-white dark:bg-black",
                              )}
                            >
                              <div className="flex size-[18px] shrink-0 items-center justify-center rounded text-zinc-500 dark:text-zinc-400">
                                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              </div>
                              <span
                                className={cn(
                                  "min-w-0 flex-1 truncate text-[11.5px] tracking-tight",
                                  isExpanded
                                    ? "font-medium text-zinc-900 dark:text-white"
                                    : "font-normal text-zinc-600 dark:text-zinc-400",
                                )}
                              >
                                {idx + 1}. {section.title}
                              </span>
                              <button
                                type="button"
                                className="flex h-[22px] shrink-0 items-center gap-1 rounded border border-zinc-200 bg-zinc-50 px-2 text-[9.5px] text-zinc-700 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-zinc-200"
                              >
                                <Sparkles size={8} />
                                <span>Draft Section</span>
                              </button>
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4, ease: "easeInOut" }}
                                  className="overflow-hidden border-t border-zinc-200 bg-zinc-50 dark:border-white/[0.05] dark:bg-black"
                                >
                                  <div className="flex flex-col gap-2.5 px-3 py-3">
                                    {overviewSubsections.map((sub, subIdx) => {
                                      const isSubVisible = visibleSubs.includes(subIdx)
                                      const content = streamContent[sub.id]
                                      const isStreaming = streamingId === sub.id

                                      return (
                                        <AnimatePresence key={sub.id}>
                                          {isSubVisible && (
                                            <motion.div
                                              initial={{ opacity: 0, y: 5 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.28, ease: "easeOut" }}
                                            >
                                              <div className="mb-1.5 flex items-center gap-2 border-l-2 border-zinc-300 pl-1.5 dark:border-white/[0.08]">
                                                <span className="text-[10px] font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
                                                  {sub.number}
                                                </span>
                                                <span className="text-[10.5px] font-medium text-zinc-600 dark:text-zinc-300">
                                                  {sub.title}
                                                </span>
                                                {isStreaming && (
                                                  <div className="ml-auto flex items-center gap-1">
                                                    <div className="size-[5px] animate-pulse rounded-full bg-emerald-600 dark:bg-emerald-400" />
                                                    <span className="text-[9px] text-emerald-700 dark:text-emerald-400">
                                                      generating
                                                    </span>
                                                  </div>
                                                )}
                                              </div>

                                              <div
                                                className={cn(
                                                  "ml-2 min-h-[44px] rounded-md border border-zinc-200 bg-white px-3 py-2.5 dark:border-white/[0.06] dark:bg-zinc-950/80",
                                                  isStreaming
                                                    ? "border-zinc-400 dark:border-white/[0.1]"
                                                    : "border-zinc-200 dark:border-white/[0.05]",
                                                )}
                                              >
                                                {content ? (
                                                  <p className="text-[11px] leading-relaxed text-zinc-800 dark:text-zinc-200">
                                                    {content}
                                                    {isStreaming && (
                                                      <span
                                                        aria-hidden
                                                        className="ml-0.5 inline-block h-3 w-px animate-pulse bg-zinc-600 align-middle dark:bg-zinc-300"
                                                      />
                                                    )}
                                                  </p>
                                                ) : isStreaming ? (
                                                  <div className="flex items-center gap-2 py-1">
                                                    <div className="size-1 animate-pulse rounded-full bg-emerald-600 dark:bg-emerald-400" />
                                                    <span className="text-[10.5px] text-emerald-800 dark:text-emerald-400">
                                                      Generating content...
                                                    </span>
                                                  </div>
                                                ) : (
                                                  <div className="flex flex-col gap-1.5 py-0.5">
                                                    <div className="h-[7px] w-4/5 rounded bg-zinc-200 dark:bg-zinc-800/90" />
                                                    <div className="h-[7px] w-[55%] rounded bg-zinc-200 dark:bg-zinc-800/90" />
                                                  </div>
                                                )}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      )
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )
                  })}
                </div>

                {visibleSecs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-white/[0.06] dark:bg-black"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <FileText className="size-3 shrink-0 text-zinc-500 dark:text-zinc-400" aria-hidden />
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-300">
                        {overviewSections.length} sections loaded · {fDocType || "RFP"} structure ready for drafting
                      </span>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-2 sm:ml-0">
                      <div className="flex items-center gap-1.5 rounded border border-zinc-200 bg-white px-2 py-0.5 dark:border-white/[0.05] dark:bg-zinc-950/80">
                        <div className="size-[5px] rounded-full bg-zinc-500 dark:bg-zinc-400" />
                        <span className="text-[9.5px] text-zinc-600 dark:text-zinc-200">Structured Draft</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          <div
            className={cn(
              "h-[5px] rounded-full transition-all duration-500",
              phase === "form" ? "w-4 bg-zinc-500 dark:bg-zinc-300" : "w-[5px] bg-zinc-300 dark:bg-zinc-800",
            )}
          />
          <div
            className={cn(
              "h-[5px] rounded-full transition-all duration-500",
              phase === "overview" ? "w-4 bg-zinc-500 dark:bg-zinc-300" : "w-[5px] bg-zinc-300 dark:bg-zinc-800",
            )}
          />
        </div>
      </div>

      <div className="flex h-8 items-center border-t border-zinc-200 bg-zinc-50 px-4 dark:border-zinc-800 dark:bg-black">
        <span className="text-[9.5px] text-zinc-500 dark:text-zinc-400">
          MZO Document Generator · Enterprise
        </span>
      </div>
    </div>
  )
}
