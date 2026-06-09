import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowUp,
  Check,
  ChevronDown,
  FileText,
  LayoutPanelLeft,
  MessageSquare,
  Mic,
  Pencil,
  Plus,
  Volume2,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

/** Long-form translation panel (Korean) — streams in document mode. */
const DOCUMENT_BODY = `Q3 재무 보고서 — 번역본

요약
본 분기 매출은 전년 대비 안정적인 성장세를 보였으며, 운영 마진은 비용 통제 이니셔티브에 기인해 개선되었습니다.

1. 매출 현황
• 총매출 $4.2B
• 기업 부문 +6% YoY

2. 비용 구조
• 영업비용 주요 항목은 인력 및 클라우드 인프라입니다.`

const DOCUMENT_SUMMARY_EN = `This quarter's financial pack highlights sustained revenue growth, disciplined operating expense, and stronger operating margin versus the prior period. Regional performance remained mixed, while enterprise demand supported headline results.`

/** One chat turn: source (EN) + translation (KO) share a single bubble (product UI). */
const CHAT_SOURCE =
  "The Q3 financial report has been finalized. Please confirm your availability for the briefing session on Friday."

const CHAT_TRANSLATION_KO =
  "3분기 재무 보고서가 최종 완성되었습니다. 금요일 브리핑 세션 참석 가능 여부를 확인해 주시기 바랍니다."

const CHAT_DEMO_TIMESTAMP = "Apr 21, 2026, 4:30 PM"

const CHAT_SOURCE_2 = "I can attend after 2 PM this Friday."

const CHAT_TRANSLATION_KO_2 = "이번주 금요일 2시 이후 참석 가능합니다."

const CHAT_DEMO_TIMESTAMP_2 = "Apr 21, 2026, 4:32 PM"

type ChatDemoTurn = {
  source: string
  targetFull: string
  translation: string
  timeLabel: string
  dateTime: string
}

function Toggle({ on, label }: { on: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] font-medium text-foreground">{label}</span>
      <div
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
          on ? "bg-foreground" : "bg-muted-foreground/25",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-background shadow transition-transform duration-200",
            on ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </div>
    </div>
  )
}

function SelectRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <button
        type="button"
        className="flex h-8 w-full cursor-default items-center justify-between rounded-md border border-border/50 bg-background px-2.5 text-left text-[11.5px] text-foreground shadow-sm dark:border-zinc-800/80"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      </button>
    </div>
  )
}

function WorkspaceTopBar() {
  return (
    <div className="flex items-center justify-end border-b border-border/40 bg-background px-4 py-2.5 dark:border-zinc-800/60">
      <div className="rounded-full border border-border/50 bg-muted/20 px-2.5 py-1 text-[9.5px] font-medium text-muted-foreground dark:border-zinc-800/80">
        <span className="text-emerald-600 dark:text-emerald-400">On-device</span>
        <span className="mx-1 text-muted-foreground/50">·</span>
        Active
      </div>
    </div>
  )
}

/**
 * Reference flow: New Project (mode cards) → workspace (chat or document) → repeat with alternate mode.
 * Ported spirit from `.dev/code/20260421_0003_mzo_ai_translator` — client-side only.
 */
export function AiTranslatorDemo() {
  const reduce = useReducedMotion() ?? false
  const [surface, setSurface] = useState<"picker" | "workspace">("picker")
  const [pickerSelection, setPickerSelection] = useState<"chat" | "document">("chat")
  const [workspaceMode, setWorkspaceMode] = useState<"document" | "chat">("chat")
  const [createPulse, setCreatePulse] = useState(false)

  const [docBody, setDocBody] = useState("")
  const [docSummary, setDocSummary] = useState("")
  const [translateActive, setTranslateActive] = useState(false)
  const [chatInput, setChatInput] = useState("")
  /** Each item is one turn = one bubble (source + streaming translation). */
  const [chatTurns, setChatTurns] = useState<ChatDemoTurn[]>([])

  const timersRef = useRef<number[]>([])
  const intervalsRef = useRef<number[]>([])

  const clearAll = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
    intervalsRef.current.forEach((id) => window.clearInterval(id))
    intervalsRef.current = []
  }, [])

  useEffect(() => {
    const afterLocal = (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, ms)
      timersRef.current.push(id)
    }

    const streamLocal = (
      text: string,
      setter: (s: string) => void,
      chunk: number,
      delayMs: number,
      onDone: () => void,
    ) => {
      let i = 0
      const id = window.setInterval(() => {
        i = Math.min(text.length, i + chunk)
        setter(text.slice(0, i))
        if (i >= text.length) {
          window.clearInterval(id)
          intervalsRef.current = intervalsRef.current.filter((x) => x !== id)
          onDone()
        }
      }, delayMs)
      intervalsRef.current.push(id)
    }

    const runPicker = (choice: "chat" | "document", then: () => void) => {
      setSurface("picker")
      setPickerSelection(choice)
      setCreatePulse(false)

      if (reduce) {
        afterLocal(200, () => {
          setSurface("workspace")
          setWorkspaceMode(choice)
          afterLocal(200, then)
        })
        return
      }

      afterLocal(2200, () => setCreatePulse(true))
      afterLocal(3000, () => {
        setCreatePulse(false)
        afterLocal(400, () => {
          setSurface("workspace")
          setWorkspaceMode(choice)
          afterLocal(450, then)
        })
      })
    }

    const runDocument = (then: () => void) => {
      setDocBody("")
      setDocSummary("")
      setTranslateActive(false)

      if (reduce) {
        setDocBody(DOCUMENT_BODY)
        setDocSummary(DOCUMENT_SUMMARY_EN)
        afterLocal(600, then)
        return
      }

      afterLocal(700, () => setTranslateActive(true))
      afterLocal(1500, () => setTranslateActive(false))
      afterLocal(1600, () => {
        streamLocal(DOCUMENT_BODY, setDocBody, 2, 14, () => {
          afterLocal(500, () => {
            streamLocal(DOCUMENT_SUMMARY_EN, setDocSummary, 3, 12, () => {
              afterLocal(2800, then)
            })
          })
        })
      })
    }

    const runChat = (then: () => void) => {
      setChatInput("")
      setChatTurns([])

      const turn1: ChatDemoTurn = {
        source: CHAT_SOURCE,
        targetFull: CHAT_TRANSLATION_KO,
        translation: "",
        timeLabel: CHAT_DEMO_TIMESTAMP,
        dateTime: "2026-04-21T16:30:00",
      }
      const turn2: ChatDemoTurn = {
        source: CHAT_SOURCE_2,
        targetFull: CHAT_TRANSLATION_KO_2,
        translation: "",
        timeLabel: CHAT_DEMO_TIMESTAMP_2,
        dateTime: "2026-04-21T16:32:00",
      }

      if (reduce) {
        setChatTurns([
          { ...turn1, translation: CHAT_TRANSLATION_KO },
          { ...turn2, translation: CHAT_TRANSLATION_KO_2 },
        ])
        afterLocal(600, then)
        return
      }

      const typeIntoComposer = (text: string, onTyped: () => void) => {
        let i = 0
        const id = window.setInterval(() => {
          i++
          setChatInput(text.slice(0, i))
          if (i >= text.length) {
            window.clearInterval(id)
            intervalsRef.current = intervalsRef.current.filter((x) => x !== id)
            afterLocal(450, onTyped)
          }
        }, 28)
        intervalsRef.current.push(id)
      }

      const streamTurnTranslation = (turnIndex: number, onDone: () => void) => {
        const full = turnIndex === 0 ? CHAT_TRANSLATION_KO : CHAT_TRANSLATION_KO_2
        streamLocal(full, (slice) => {
          setChatTurns((prev) => {
            const next = [...prev]
            const row = next[turnIndex]
            if (!row) return prev
            next[turnIndex] = { ...row, translation: slice }
            return next
          })
        }, 2, 14, onDone)
      }

      afterLocal(500, () => {
        typeIntoComposer(CHAT_SOURCE, () => {
          setChatInput("")
          setChatTurns([turn1])
          afterLocal(200, () => {
            streamTurnTranslation(0, () => {
              afterLocal(1400, () => {
                typeIntoComposer(CHAT_SOURCE_2, () => {
                  setChatInput("")
                  setChatTurns((prev) => [...prev, turn2])
                  afterLocal(200, () => {
                    streamTurnTranslation(1, () => {
                      afterLocal(2200, then)
                    })
                  })
                })
              })
            })
          })
        })
      })
    }

    const iterate = (next: "chat" | "document") => {
      clearAll()
      runPicker(next, () => {
        if (next === "chat") {
          runChat(() => iterate("document"))
        } else {
          runDocument(() => iterate("chat"))
        }
      })
    }

    iterate("chat")
    return () => clearAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- autoplay loop; `reduce` at mount
  }, [clearAll, reduce])

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Card className="overflow-hidden border-border shadow-lg">
        <AnimatePresence mode="wait">
          {surface === "picker" ? (
            <motion.div
              key={`picker-${pickerSelection}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease }}
              className="min-h-[min(520px,70vh)] bg-background dark:bg-zinc-950"
            >
              <WorkspaceTopBar />
              <div className="px-5 pb-8 pt-8 sm:px-8">
                <h2 className="text-center text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  New Project
                </h2>
                <p className="mx-auto mt-1 max-w-md text-center text-[12px] text-muted-foreground">
                  Select a translation mode to get started
                </p>

                <div className="mx-auto mt-8 grid max-w-lg gap-3 sm:grid-cols-2 sm:gap-4">
                  <div
                    className={cn(
                      "relative flex flex-col rounded-xl border bg-background p-4 text-left shadow-sm transition-colors duration-300 dark:bg-zinc-950/80",
                      pickerSelection === "chat"
                        ? "border-foreground/20 ring-1 ring-foreground/10 dark:border-zinc-600 dark:ring-white/10"
                        : "border-border/40 dark:border-zinc-800/80",
                    )}
                  >
                    {pickerSelection === "chat" && (
                      <span className="absolute right-3 top-3 rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-muted-foreground dark:border-zinc-700">
                        Most used
                      </span>
                    )}
                    <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-border/50 bg-muted/30 dark:border-zinc-800">
                      <MessageSquare className="size-5 text-foreground/80" aria-hidden />
                    </div>
                    <div className="text-[13px] font-semibold text-foreground">Chat Translation</div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                      Real-time conversation translation with streaming output and glossary support.
                    </p>
                    {pickerSelection === "chat" && (
                      <div className="mt-4 flex items-center gap-1.5 text-[10px] font-medium text-foreground">
                        <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                        Selected
                      </div>
                    )}
                  </div>

                  <div
                    className={cn(
                      "relative flex flex-col rounded-xl border bg-background p-4 text-left shadow-sm transition-colors duration-300 dark:bg-zinc-950/80",
                      pickerSelection === "document"
                        ? "border-foreground/20 ring-1 ring-foreground/10 dark:border-zinc-600 dark:ring-white/10"
                        : "border-border/40 dark:border-zinc-800/80",
                    )}
                  >
                    <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-border/50 bg-muted/30 dark:border-zinc-800">
                      <FileText className="size-5 text-foreground/80" aria-hidden />
                    </div>
                    <div className="text-[13px] font-semibold text-foreground">Document Translation</div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                      Process PDFs and documents with page-range control and download.
                    </p>
                    {pickerSelection === "document" && (
                      <div className="mt-4 flex items-center gap-1.5 text-[10px] font-medium text-foreground">
                        <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                        Selected
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-[12px] font-semibold text-background transition-all duration-300",
                      createPulse && "ring-2 ring-foreground/25 ring-offset-2 ring-offset-background",
                    )}
                  >
                    <Plus className="size-4" strokeWidth={2.5} aria-hidden />
                    Create New Project
                  </button>
                </div>
              </div>
            </motion.div>
          ) : workspaceMode === "document" ? (
            <motion.div
              key="doc"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease }}
              className="flex min-h-[min(480px,62vh)] flex-col bg-background dark:bg-zinc-950 md:min-h-[560px]"
            >
              <WorkspaceTopBar />
              <div className="flex min-h-[420px] flex-1 flex-col md:min-h-[520px] md:flex-row">
                <aside className="w-full shrink-0 border-b border-border/50 bg-muted/15 p-4 md:w-[260px] md:border-b-0 md:border-r dark:border-zinc-800/80">
                  <div className="mb-4 text-[10px] text-muted-foreground">
                    <span className="text-muted-foreground/80">Projects</span>
                    <span className="mx-1">/</span>
                    <span className="font-medium text-foreground">Document</span>
                  </div>

                  <div className="mb-4 rounded-lg border border-border/50 bg-background p-2.5 shadow-sm dark:border-zinc-800/80">
                    <div className="flex items-start gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded border border-border/50 bg-muted/30 dark:border-zinc-800">
                        <FileText className="size-4 text-foreground/80" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[11px] font-semibold text-foreground">Q3_Report_2024.pdf</div>
                        <div className="text-[10px] text-muted-foreground">2.4 MB · 42 pages</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <SelectRow label="Source language" value="English" />
                    <SelectRow label="Target language" value="Korean" />
                    <div>
                      <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Page range
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-8 flex-1 rounded-md border border-border/50 bg-background px-2 text-center text-[11px] dark:border-zinc-800"
                        >
                          1
                        </button>
                        <span className="text-[10px] text-muted-foreground">to</span>
                        <button
                          type="button"
                          className="h-8 flex-1 rounded-md border border-border/50 bg-background px-2 text-center text-[11px] dark:border-zinc-800"
                        >
                          15
                        </button>
                      </div>
                    </div>
                    <Toggle on label="Glossary" />
                    <div className="rounded-lg border border-border/40 bg-background/80 p-2.5 dark:border-zinc-800/80">
                      <div className="flex items-center gap-2 text-[10px] font-medium text-foreground">
                        <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                        On-device
                      </div>
                      <p className="mt-1 text-[9.5px] leading-snug text-muted-foreground">
                        Use cloud processing for faster results.
                      </p>
                    </div>
                    <button
                      type="button"
                      className={cn(
                        "mt-1 flex h-9 w-full items-center justify-center rounded-lg text-[11px] font-semibold text-background transition-all duration-300",
                        translateActive
                          ? "bg-foreground ring-2 ring-foreground/25 ring-offset-2 ring-offset-background"
                          : "bg-foreground/90",
                      )}
                    >
                      Translate
                    </button>
                  </div>
                </aside>

                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 px-4 py-2.5 dark:border-zinc-800/80">
                    <span className="text-[12px] font-semibold text-foreground">Translation Result</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-7 rounded-md border border-border/50 bg-background px-2.5 text-[10px] font-medium text-foreground dark:border-zinc-800"
                      >
                        Summary
                      </button>
                      <button
                        type="button"
                        className="h-7 rounded-md bg-foreground px-2.5 text-[10px] font-medium text-background"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto p-4">
                    <div className="whitespace-pre-wrap text-[12px] leading-relaxed text-foreground">
                      {docBody}
                      {docBody.length > 0 && docBody.length < DOCUMENT_BODY.length && (
                        <span
                          aria-hidden
                          className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-foreground/50 align-middle"
                        />
                      )}
                    </div>
                    {docSummary.length > 0 && (
                      <div className="mt-5 border-t border-border/40 pt-4 dark:border-zinc-800/80">
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          # Document Summary
                        </div>
                        <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                          {docSummary}
                          {docSummary.length < DOCUMENT_SUMMARY_EN.length && (
                            <span
                              aria-hidden
                              className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-primary align-middle"
                            />
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease }}
              className="flex min-h-[min(560px,72vh)] flex-col bg-background dark:bg-zinc-950"
            >
              <WorkspaceTopBar />
              <div className="flex items-center justify-between border-b border-border/50 px-3 py-2 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-md border border-border/50 text-muted-foreground dark:border-zinc-800"
                    aria-label="Panel"
                  >
                    <LayoutPanelLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-md border border-border/50 text-muted-foreground dark:border-zinc-800"
                    aria-label="Edit"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <div className="ml-2 text-[10px] text-muted-foreground">
                    <span className="text-muted-foreground/80">Projects</span>
                    <span className="mx-1">/</span>
                    <span className="font-medium text-foreground">Chat Translation</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-dashed border-border/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
                >
                  Summary
                </button>
              </div>

              <div className="flex min-h-[min(300px,42vh)] flex-1 flex-col gap-3 bg-muted/10 p-4 dark:bg-zinc-950/50">
                {chatTurns.map((turn, idx) => {
                  const fromRight = idx % 2 === 1
                  return (
                  <motion.div
                    key={`${turn.dateTime}-${idx}`}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0 : 0.35, ease }}
                    className={cn("flex w-full", fromRight ? "justify-end" : "justify-start")}
                  >
                    <div className="w-full max-w-[min(100%,560px)] rounded-2xl border border-border/60 bg-muted/30 px-3.5 py-3 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900/60">
                      <p className="text-[12px] leading-relaxed text-muted-foreground">{turn.source}</p>
                      <div
                        className="my-2.5 border-t border-border/50 dark:border-zinc-700/80"
                        aria-hidden
                      />
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 flex-1 text-[12px] font-semibold leading-relaxed text-foreground">
                          {turn.translation}
                          {turn.translation.length > 0 &&
                            turn.translation.length < turn.targetFull.length && (
                              <span
                                aria-hidden
                                className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-primary align-middle"
                              />
                            )}
                        </p>
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                          aria-label="Play translation (TTS preview)"
                        >
                          <Volume2 className="size-4" aria-hidden />
                        </button>
                      </div>
                      <div className="mt-2.5 flex justify-end border-t border-border/40 pt-2 dark:border-zinc-700/60">
                        <time className="text-[10px] text-muted-foreground" dateTime={turn.dateTime}>
                          {turn.timeLabel}
                        </time>
                      </div>
                    </div>
                  </motion.div>
                  )
                })}
              </div>

              <div className="border-t border-border/50 bg-background p-3 dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="rounded-xl border border-border/50 bg-muted/10 p-2 dark:border-zinc-800">
                  <div className="min-h-[52px] px-2 py-1 text-[12px] leading-relaxed text-foreground">
                    {chatInput}
                    {(() => {
                      const translating = chatTurns.some(
                        (t) => t.translation.length < t.targetFull.length,
                      )
                      const showCaret =
                        !translating && (chatTurns.length === 0 || chatInput.length > 0)
                      return showCaret ? (
                        <span
                          aria-hidden
                          className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-foreground align-middle"
                        />
                      ) : null
                    })()}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2 dark:border-zinc-800/60">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="flex h-7 items-center gap-1 rounded-md border border-border/50 bg-background px-2 text-[10px] dark:border-zinc-800"
                      >
                        English
                        <ChevronDown className="size-3 opacity-60" aria-hidden />
                      </button>
                      <span className="text-[10px] text-muted-foreground">↔</span>
                      <button
                        type="button"
                        className="flex h-7 items-center gap-1 rounded-md border border-border/50 bg-background px-2 text-[10px] dark:border-zinc-800"
                      >
                        Korean
                        <ChevronDown className="size-3 opacity-60" aria-hidden />
                      </button>
                      <div className="flex items-center gap-1.5 pl-1">
                        <span className="text-[10px] font-medium text-muted-foreground">Glossary</span>
                        <div
                          className="relative h-4 w-7 shrink-0 rounded-full bg-foreground"
                          aria-hidden
                        >
                          <span className="absolute top-0.5 size-3 translate-x-3.5 rounded-full bg-background shadow-sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-md border border-border/50 text-muted-foreground dark:border-zinc-800"
                        aria-label="Voice"
                      >
                        <Mic className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="flex size-9 items-center justify-center rounded-full bg-foreground text-background"
                        aria-label="Send"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="border-t border-border bg-muted/30 px-3 py-2 text-center text-[9.5px] text-muted-foreground">
          Client-side preview · No API calls
        </p>
      </Card>
    </section>
  )
}
