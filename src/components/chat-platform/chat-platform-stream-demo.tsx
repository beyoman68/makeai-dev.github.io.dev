import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  Building2,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  ImageIcon,
  Mic,
  Paperclip,
  PenLine,
  Search,
  Send,
  Sparkles,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

type WorkspacePanelTab = "instructions" | "files" | "conversations"

const WORKSPACE_PANEL_TABS: { id: WorkspacePanelTab; label: string }[] = [
  { id: "instructions", label: "Instructions" },
  { id: "files", label: "Files" },
  { id: "conversations", label: "Conversations" },
]

type Phase = "idle" | "typing" | "sent" | "streaming" | "done"

interface WorkspaceFile {
  name: string
  refId: string
  pages: number
  updated: string
}

interface Scenario {
  id: string
  recentLabel: string
  recentTime: string
  /** Workspace file ref IDs treated as attached / in context for this turn (middle column Files). */
  attachmentRefs: string[]
  user: string
  assistant: string
  /** Primary file highlighted during streaming (middle column). */
  citeRef: string
}

const WORKSPACE_FILES: WorkspaceFile[] = [
  {
    name: "Annual Leave Policy.pdf",
    refId: "HR-POL-2024-03",
    pages: 12,
    updated: "Apr 18",
  },
  {
    name: "Employee Handbook.pdf",
    refId: "EH-2024-v2",
    pages: 63,
    updated: "Apr 12",
  },
]

const WORKSPACE_TOOLS = [
  "Web Search",
  "Document AI",
  "KPI Workflows",
  "Proposal Builder",
] as const

const SCENARIOS: Scenario[] = [
  {
    id: "leave",
    recentLabel: "Annual leave policy summarization",
    recentTime: "2h ago",
    attachmentRefs: ["HR-POL-2024-03"],
    user: "Summarize the annual leave policy and cite the relevant file.",
    citeRef: "HR-POL-2024-03",
    assistant:
      "Based on the Annual Leave Policy (HR-POL-2024-03), here is a concise summary:\n\nEntitlement — Full-time employees receive 20 working days of annual leave per year, accrued monthly. Part-time schedules are prorated against FTE.\n\nCarryover — Up to 5 unused days may roll into the next calendar year if approved by your manager before the December cutoff.\n\nApproval — Requests should be submitted at least 5 business days in advance through the HR portal unless marked urgent.\n\nThe figures and rules above are taken directly from the shared policy file in this workspace.",
  },
  {
    id: "handbook",
    recentLabel: "Employee Handbook — benefits",
    recentTime: "Yesterday",
    attachmentRefs: ["EH-2024-v2"],
    user: "Where does the handbook define remote-work eligibility?",
    citeRef: "EH-2024-v2",
    assistant:
      "In the Employee Handbook (EH-2024-v2), remote-work eligibility is covered in the “Ways of Working” chapter.\n\nEligibility — Roles that are location-agnostic by job family may apply after the probation period. Hybrid schedules require director-level approval.\n\nEquipment — The handbook states that approved remote workers receive a standard hardware stipend and must use the company VPN for access to internal systems.\n\nFor exact wording, see the handbook sections referenced in your workspace Files tab.",
  },
  {
    id: "kpi",
    recentLabel: "Q4 KPI Review Sum…",
    recentTime: "Yesterday",
    attachmentRefs: ["HR-POL-2024-03", "EH-2024-v2"],
    user: "Pull key numbers we discussed for Q4 KPI review.",
    citeRef: "HR-POL-2024-03",
    assistant:
      "I can ground answers in the documents attached to this workspace. For a KPI roll-up, combine metrics from your latest review pack with the policy tables in Annual Leave Policy (HR-POL-2024-03) only where leave impacts staffing plans.\n\nNext step — Upload or link the Q4 KPI spreadsheet to this workspace Files tab so I can cite specific cells and charts in the reply stream.",
  },
]

const RECENT_STATIC = [
  { label: "Annual leave policy summarization", time: "2h ago", id: "leave" as const },
  { label: "Q4 KPI Review Sum…", time: "Yesterday", id: "kpi" as const },
  { label: "Employee handbook — remote", time: "3 days ago", id: "handbook" as const },
]

function WorkspaceAttachmentChips({ refs }: { refs: string[] }) {
  const list = WORKSPACE_FILES.filter((f) => refs.includes(f.refId))
  if (list.length === 0) return null
  return (
    <div className="flex justify-end" aria-label="Files in context for this message">
      <div className="mb-1.5 flex max-w-full flex-wrap justify-end gap-1.5">
        {list.map((f) => (
          <span
            key={f.refId}
            title={`${f.name} (${f.refId})`}
            className="inline-flex max-w-[min(220px,100%)] items-center gap-1 rounded-full border border-border bg-background/95 px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm"
          >
            <Paperclip className="size-3 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate">{f.name}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function UserBubble({ text, reduce }: { text: string; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, ease }}
      className="flex justify-end"
    >
      <div className="max-w-[92%] rounded-2xl rounded-br-sm bg-foreground px-4 py-2.5 text-sm leading-relaxed text-background shadow-sm">
        {text}
      </div>
    </motion.div>
  )
}

function AssistantBubble({
  text,
  streaming,
  reduce,
}: {
  text: string
  streaming: boolean
  reduce: boolean
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35 }}
      className="flex gap-3"
    >
      <div
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted"
        aria-hidden
      >
        <Sparkles className="size-4 text-foreground" />
      </div>
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground shadow-sm">
        <p className="whitespace-pre-wrap">{text}</p>
        {streaming && (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block h-3.5 w-0.5 rounded-sm bg-primary align-middle"
            animate={reduce ? { opacity: 1 } : { opacity: [1, 0, 1] }}
            transition={reduce ? undefined : { repeat: Infinity, duration: 0.55 }}
          />
        )}
      </div>
    </motion.div>
  )
}

export function ChatPlatformStreamDemo() {
  const reduceMotion = useReducedMotion() ?? false
  const reduce = reduceMotion

  const [activeId, setActiveId] = useState(SCENARIOS[0]!.id)
  const [workspaceTab, setWorkspaceTab] = useState<WorkspacePanelTab>("files")
  const [phase, setPhase] = useState<Phase>("idle")
  const [inputPreview, setInputPreview] = useState("")
  const [revealed, setRevealed] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0]!

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    if (streamRef.current) {
      clearInterval(streamRef.current)
      streamRef.current = null
    }
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
  }, [])

  const after = useCallback((ms: number, fn: () => void) => {
    const id = setTimeout(fn, ms)
    timersRef.current.push(id)
  }, [])

  const runStream = useCallback(
    (full: string) => {
      setRevealed(0)
      if (reduce) {
        setRevealed(full.length)
        after(80, () => setPhase("done"))
        return
      }
      let n = 0
      streamRef.current = setInterval(() => {
        n = Math.min(n + 4, full.length)
        setRevealed(n)
        if (n >= full.length) {
          if (streamRef.current) clearInterval(streamRef.current)
          streamRef.current = null
          after(320, () => setPhase("done"))
        }
      }, 18)
    },
    [after, reduce],
  )

  const playScenario = useCallback(
    (scenario: Scenario) => {
      clearTimers()
      setActiveId(scenario.id)
      setPhase("idle")
      setInputPreview("")
      setRevealed(0)

      const q = scenario.user
      if (reduce) {
        setPhase("typing")
        setInputPreview(q)
        after(40, () => {
          setPhase("sent")
          after(30, () => {
            setPhase("streaming")
            runStream(scenario.assistant)
          })
        })
        return
      }

      after(400, () => setPhase("typing"))
      after(550, () => {
        let i = 0
        typingIntervalRef.current = setInterval(() => {
          i++
          setInputPreview(q.slice(0, i))
          if (i >= q.length && typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
            typingIntervalRef.current = null
            after(450, () => {
              setPhase("sent")
              after(380, () => {
                setPhase("streaming")
                runStream(scenario.assistant)
              })
            })
          }
        }, 32)
      })
    },
    [after, clearTimers, reduce, runStream],
  )

  useEffect(() => {
    playScenario(SCENARIOS[0]!)
    return () => clearTimers()
  }, [clearTimers, playScenario])

  const showUserBubble = phase === "sent" || phase === "streaming" || phase === "done"
  const isStreaming = phase === "streaming"

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduce ? 0 : 0.65, ease }}
        className="mb-8 text-center"
      >
        <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          <span className="h-px w-4 bg-border" aria-hidden />
          Interactive workspace demo
          <span className="h-px w-4 bg-border" aria-hidden />
        </div>
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Teams, files, and streaming chat in one surface
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          Layout mirrors the MZO workspace experience: global navigation, workspace
          files & tools, and a streaming assistant. Marketing demo only — no live backend.
        </p>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: reduce ? 0 : 0.75, delay: reduce ? 0 : 0.06 }}
      >
        <Card className="overflow-hidden border-border shadow-lg">
          <div className="flex max-h-[min(720px,78vh)] flex-col overflow-hidden lg:flex-row lg:min-h-[560px]">
            {/* 1 — Global navigation */}
            <nav
              className="flex w-full shrink-0 flex-col border-b border-border bg-muted/20 lg:w-[200px] lg:border-b-0 lg:border-r"
              aria-label="Main sidebar: Personal, Team, Organization, and recent conversations"
            >
              <div className="max-h-[200px] space-y-3 overflow-y-auto p-3 lg:max-h-none">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Personal
                </p>
                <ul className="space-y-1 text-xs">
                  <li>
                    <span className="flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground">
                      <FileText className="size-3.5 opacity-70" /> My Notes
                    </span>
                  </li>
                  <li>
                    <span className="flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground">
                      <Search className="size-3.5 opacity-70" /> Personal Research
                    </span>
                  </li>
                </ul>

                <p className="pt-1 text-[10px] font-semibold uppercase tracking-wide text-foreground">
                  Team
                </p>
                <ul className="space-y-1 text-xs">
                  <li>
                    <span className="flex items-center justify-between gap-1 rounded-md bg-foreground px-2 py-1.5 font-medium text-background">
                      <span className="flex items-center gap-2 truncate">
                        <Users className="size-3.5 shrink-0" /> HR Team
                      </span>
                      <span className="shrink-0 rounded bg-background/20 px-1 text-[9px]">
                        Active
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground">
                      <Users className="size-3.5 opacity-70" /> Product Team
                    </span>
                  </li>
                </ul>

                <p className="pt-1 text-[10px] font-semibold uppercase tracking-wide text-foreground">
                  Organization
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2 px-2 py-1">
                    <Building2 className="size-3.5 opacity-70" /> Company Knowledge Base
                  </li>
                  <li className="flex items-center gap-2 px-2 py-1">
                    <Building2 className="size-3.5 opacity-70" /> Compliance Hub
                  </li>
                </ul>

                <p className="pt-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Recent
                </p>
                <ul className="space-y-0.5 text-[11px]">
                  {RECENT_STATIC.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => {
                          const sc = SCENARIOS.find((s) => s.id === r.id)
                          if (sc) playScenario(sc)
                        }}
                        className={cn(
                          "flex w-full items-start gap-1 rounded-md px-2 py-1.5 text-left transition-colors",
                          activeId === r.id
                            ? "bg-background font-medium text-foreground ring-1 ring-border"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                        )}
                      >
                        <Clock className="mt-0.5 size-3 shrink-0 opacity-50" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{r.label}</span>
                          <span className="text-[10px] text-muted-foreground">{r.time}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto border-t border-border p-3">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2">
                  <div
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground"
                    aria-hidden
                  >
                    SK
                  </div>
                  <div className="min-w-0 text-[11px] leading-tight">
                    <div className="truncate font-medium text-foreground">Sarah Kim</div>
                    <div className="truncate text-muted-foreground">HR Team · MZO</div>
                  </div>
                </div>
              </div>
            </nav>

            {/* 2 — Workspace context */}
            <aside
              className="flex w-full shrink-0 flex-col border-b border-border bg-background lg:w-[260px] lg:border-b-0 lg:border-r"
              aria-label="Workspace resources"
            >
              <div className="border-b border-border p-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <Users className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">HR Team</div>
                    <div className="text-[11px] text-muted-foreground">4 members · Workspace</div>
                  </div>
                </div>
              </div>

              <div
                className="flex border-b border-border px-2 pt-2"
                role="tablist"
                aria-label="Workspace panel"
              >
                {WORKSPACE_PANEL_TABS.map(({ id, label }) => {
                  const selected = workspaceTab === id
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      id={`workspace-tab-${id}`}
                      aria-selected={selected}
                      aria-controls={`workspace-panel-${id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setWorkspaceTab(id)}
                      className={cn(
                        "relative min-w-0 flex-1 cursor-pointer px-2 pb-2 text-center text-[11px] font-medium transition-colors",
                        selected
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {label}
                      {selected && (
                        <span
                          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                          aria-hidden
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {workspaceTab === "instructions" && (
                  <div
                    id="workspace-panel-instructions"
                    role="tabpanel"
                    aria-labelledby="workspace-tab-instructions"
                    className="space-y-3"
                  >
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Follow these instructions for every conversation in this workspace.
                    </p>
                    <div className="rounded-lg border border-border bg-muted/20 p-3">
                      <label
                        htmlFor="workspace-instructions-preview"
                        className="sr-only"
                      >
                        Workspace instructions
                      </label>
                      <textarea
                        id="workspace-instructions-preview"
                        readOnly
                        rows={6}
                        className="w-full resize-none bg-transparent text-[11px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
                        defaultValue="Use a formal, professional tone in English for all generated content and summaries."
                      />
                    </div>
                  </div>
                )}

                {workspaceTab === "conversations" && (
                  <div
                    id="workspace-panel-conversations"
                    role="tabpanel"
                    aria-labelledby="workspace-tab-conversations"
                    className="space-y-3"
                  >
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Conversations use this workspace&apos;s instructions and shared files.
                    </p>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="h-9 w-full gap-2 text-[11px] font-medium"
                      onClick={() => playScenario(SCENARIOS[0]!)}
                    >
                      <PenLine className="size-3.5 shrink-0" aria-hidden />
                      Open new conversation
                    </Button>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Recent in workspace
                    </p>
                    <ul className="space-y-1">
                      {RECENT_STATIC.map((r) => {
                        const scenario = SCENARIOS.find((s) => s.id === r.id)
                        if (!scenario) return null
                        const isRowActive = activeId === r.id
                        return (
                          <li key={r.id}>
                            <button
                              type="button"
                              onClick={() => playScenario(scenario)}
                              className={cn(
                                "flex w-full items-start gap-1 rounded-md px-2 py-1.5 text-left text-[11px] transition-colors",
                                isRowActive
                                  ? "bg-background font-medium text-foreground ring-1 ring-border"
                                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                              )}
                            >
                              <Clock className="mt-0.5 size-3 shrink-0 opacity-50" aria-hidden />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate">{r.label}</span>
                                <span className="text-[10px] text-muted-foreground">{r.time}</span>
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}

                {workspaceTab === "files" && (
                  <div
                    id="workspace-panel-files"
                    role="tabpanel"
                    aria-labelledby="workspace-tab-files"
                    className="space-y-2"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Shared files
                    </p>
                    {WORKSPACE_FILES.map((f) => (
                      <div
                        key={f.refId}
                        className={cn(
                          "rounded-lg border p-2.5 text-[11px] transition-colors",
                          active.citeRef === f.refId
                            ? "border-primary/40 bg-muted/50 ring-1 ring-primary/20"
                            : "border-border bg-card",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium text-foreground">{f.name}</div>
                            <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                              ID: {f.refId}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                              <span>{f.pages} pages</span>
                              <span>·</span>
                              <span>Updated {f.updated}</span>
                              <span className="rounded bg-muted px-1.5 py-0 text-[9px] font-medium text-foreground">
                                Shared
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <p className="pt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Workspace tools
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {WORKSPACE_TOOLS.map((tool) => (
                        <button
                          key={tool}
                          type="button"
                          className="rounded-md border border-border bg-muted/40 px-2 py-2 text-center text-[10px] font-medium text-foreground hover:bg-muted/70"
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* 3 — Chat */}
            <main className="relative flex min-h-[420px] min-w-0 flex-1 flex-col bg-muted/10">
              <div className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-2.5 backdrop-blur-sm">
                <div className="min-w-0 text-[11px] text-muted-foreground">
                  <span className="text-foreground">HR Team</span>
                  <span className="mx-1.5 text-border">/</span>
                  <span>New Conversation</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/50 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  Workspace context active
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
                <div className="mb-auto flex flex-col justify-end gap-4">
                  <AnimatePresence mode="popLayout">
                    {showUserBubble && (
                      <div key="user-wrap" className="space-y-1">
                        <p className="text-right text-[10px] text-muted-foreground">Sarah Kim</p>
                        <WorkspaceAttachmentChips refs={active.attachmentRefs} />
                        <UserBubble key="u" text={active.user} reduce={reduce} />
                      </div>
                    )}
                    {(phase === "streaming" || phase === "done") && (
                      <div key="asst-wrap" className="space-y-2">
                        <AssistantBubble
                          text={active.assistant.slice(0, revealed)}
                          streaming={isStreaming}
                          reduce={reduce}
                        />
                        {phase === "done" && (
                          <p className="pl-11 text-[10px] leading-snug text-muted-foreground">
                            Answer is grounded in the attached workspace file
                            {active.attachmentRefs.length > 1 ? "s" : ""} above and the Files
                            list in the middle column ({active.attachmentRefs.join(", ")}).
                          </p>
                        )}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="border-t border-border bg-background p-3">
                <div className="relative rounded-xl border border-border bg-muted/30 p-2 shadow-sm">
                  <div className="mb-2 flex min-h-[44px] items-start pl-1 pr-2 pt-1 text-sm">
                    {inputPreview ? (
                      <span className="text-foreground">{inputPreview}</span>
                    ) : (
                      <span className="text-muted-foreground">
                        Ask anything across your workspace…
                      </span>
                    )}
                    {phase === "typing" && (
                      <motion.span
                        aria-hidden
                        className="ml-0.5 inline-block h-4 w-0.5 rounded-sm bg-primary align-top"
                        animate={reduce ? { opacity: 1 } : { opacity: [1, 0, 1] }}
                        transition={
                          reduce ? undefined : { repeat: Infinity, duration: 0.55 }
                        }
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2">
                    <div className="flex items-center gap-0.5">
                      <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Search">
                        <Search className="size-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Image">
                        <ImageIcon className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label="Add file"
                      >
                        <FileText className="size-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Voice">
                        <Mic className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        className="size-9 rounded-full"
                        disabled
                        aria-label="Send (demo)"
                      >
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-center text-[10px] text-muted-foreground">
                  Workspace conversations can use shared files and instructions.
                </p>
              </div>

              <button
                type="button"
                className="absolute bottom-24 right-4 flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground lg:bottom-28"
                aria-label="Help"
              >
                <HelpCircle className="size-4" />
              </button>
            </main>
          </div>

          {/* Scenario shortcuts (below fold on small screens — extra row) */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/30 px-3 py-2">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Try threads
            </span>
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => playScenario(s)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  activeId === s.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                )}
              >
                <ChevronRight className="size-3 opacity-60" />
                {s.recentLabel}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>
    </section>
  )
}
