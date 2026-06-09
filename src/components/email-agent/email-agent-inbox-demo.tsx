import { useCallback, useEffect, useRef, useState, type FormEvent } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  Check,
  ChevronRight,
  FileText,
  MessageSquare,
  Search,
  SendHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

type Phase = "idle" | "loading" | "streaming" | "done"

type ActionId = "summarize" | "draft" | "translate" | "chatbot"

interface ThreadScenario {
  id: string
  chipLabel: string
  listSender: string
  listSnippet: string
  subject: string
  fromName: string
  fromEmail: string
  toLine: string
  timeLabel: string
  attachment: { name: string; size: string }
  body: string
  /** AI Chatbot — attachment-grounded stream. */
  agentOutput: string
  /** Summarize this email — typed stream (see reference `EmailDemo` SUMMARY_TEXT). */
  summarizeOutput: string
  /** Draft a reply — typed stream. */
  draftOutput: string
  /** Translate this email — typed stream. */
  translateOutput: string
  /** Default chatbot answer (English) for the auto-asked example question. */
  chatbotAnswer: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
}

const CHATBOT_EXAMPLE_QUESTION = "Tell me about this email and its attachments."

function getChatbotResponse(t: ThreadScenario, _question: string): string {
  return t.chatbotAnswer
}

function getActionStreamText(t: ThreadScenario, action: ActionId): string {
  switch (action) {
    case "summarize":
      return t.summarizeOutput
    case "draft":
      return t.draftOutput
    case "translate":
      return t.translateOutput
    case "chatbot":
      return t.agentOutput
    default:
      return ""
  }
}

function actionLoadingLabel(action: ActionId): string {
  switch (action) {
    case "summarize":
      return "Summarizing this email…"
    case "draft":
      return "Drafting a reply…"
    case "translate":
      return "Translating…"
    case "chatbot":
      return "Reading attachment context…"
    default:
      return "Working…"
  }
}

const ACTIONS: { id: ActionId; label: string; done?: boolean }[] = [
  { id: "summarize", label: "Summarize this email", done: true },
  { id: "draft", label: "Draft a reply", done: true },
  { id: "translate", label: "Translate this email", done: true },
  { id: "chatbot", label: "AI Chatbot" },
]

const THREADS: ThreadScenario[] = [
  {
    id: "alpha",
    chipLabel: "Project Alpha",
    listSender: "Michael Kim",
    listSnippet: "Thank you for sending the updated…",
    subject: "RE: Project Alpha Proposal Review Request",
    fromName: "Michael Kim",
    fromEmail: "m.kim@globaltechpartners.com",
    toLine: "Sarah Williams",
    timeLabel: "Apr 19, 2026 · 9:42 AM",
    attachment: { name: "proposal_v2.pdf", size: "1.4 MB" },
    body: `Sarah,

Thank you for sending the updated proposal. I've reviewed the attached document and want to call out a few areas before Thursday's steering call.

Please prioritize attention on:
• Section 3 — Technical Architecture (API integration timelines and dependency assumptions)
• Section 5 — Budget Breakdown (licensing uplift and recurring cost modeling)
• Section 7 — Risk Matrix (operational and third-party risks flagged for Q2)

The narrative on API integration aligns with our last workshop, but Section 5 should reflect the 15% Q1 licensing uplift we agreed in January. Let's make sure finance signs off on the revised projections.

Best regards,
Michael Kim
Senior Director, Strategic Partnerships
Global Tech Partners`,
    agentOutput: `Includes the 15% Q1 licensing uplift (agreed Jan 2026).

Note: Michael Kim has flagged Section 5 for revision—confirm the budget tables match the latest finance model.

Recommendation: Confirm updated projections with finance before Thursday's call.`,
    summarizeOutput: `Email Summary  ·  proposal_v2.pdf

From: Michael Kim, Global Tech Partners
Subject: RE: Project Alpha Proposal Review Request

Key Points
· Proposal v2 reviewed; feedback before Thursday's steering call
· Section 3 (Technical Architecture): API integration timeline and dependencies flagged for review
· Section 5 (Budget): the 15% Q1 licensing uplift must appear in Year 2 projections
· Section 7 (Risk Matrix): aligned with your last workshop narrative

Action Items
· Technical lead to review Sections 3 and 5 before Thursday
· Confirm finance sign-off on revised projections
· Optional: one-pager comparing v1 vs. v2 for the call`,
    draftOutput: `Draft Reply

Subject: RE: Project Alpha Proposal Review Request

Hi Michael,

Thank you for your detailed review of proposal_v2.pdf.

I've routed your comments to our technical lead. We'll revise Section 3 with a realistic API integration schedule and update Section 5 to reflect the 15% Q1 licensing uplift across the projections you flagged.

We'll have the supporting tables ready for review ahead of Thursday's call.

Best regards,
Sarah Williams
Project Alpha Lead`,
    translateOutput: `Translation — Korean

제목: RE: 프로젝트 알파 제안서 검토 요청

안녕하세요 Sarah님,

업데이트된 제안서(v2)를 주셔서 감사합니다. 목요일 스티어링 콜 전에 몇 가지를 짚어드립니다.

검토 우선순위:
· 3섹션 — 기술 아키텍처(API 연동 일정·의존성)
· 5섹션 — 예산(1분기 15% 라이선스 인상 반영 여부)
· 7섹션 — 리스크 매트릭스

5섹션은 1월에 합의한 인상분이 반영되도록 수정이 필요합니다. 재무 확인 후 확정하겠습니다.

감사합니다,
Michael Kim`,
    chatbotAnswer: `This email is from Michael Kim (Global Tech Partners) to Sarah Williams, sent on Apr 19, 2026 at 9:42 AM. It's a pre-call review of the revised Project Alpha proposal ahead of Thursday's steering meeting.

Attachment — proposal_v2.pdf (1.4 MB):
· Section 3 (Technical Architecture): API integration timelines and dependency assumptions are flagged for the technical lead.
· Section 5 (Budget Breakdown): Year 2 projections must reflect the 15% Q1 licensing uplift agreed in January.
· Section 7 (Risk Matrix): operational and third-party risks for Q2 — aligned with the previous workshop.

Recommended next step: confirm the updated Section 5 projections with finance before the Thursday call.`,
  },
  {
    id: "legal",
    chipLabel: "Legal review",
    listSender: "Legal & Compliance",
    listSnippet: "Re: vendor DPA — countersigned…",
    subject: "RE: Vendor DPA — countersigned copy",
    fromName: "Legal & Compliance",
    fromEmail: "legal@globaltechpartners.com",
    toLine: "Michael Kim",
    timeLabel: "Apr 18, 2026 · 4:12 PM",
    attachment: { name: "DPA_countersigned.pdf", size: "820 KB" },
    body: `Michael,

Attached is the countersigned DPA for the analytics vendor. No material changes from the last redline—data residency clauses remain as marked.

Regards,
Legal & Compliance`,
    agentOutput: `The attachment is fully executed; data residency and subprocessors match the approved template.

Note: Exhibit B still references the legacy region label—confirm with IT whether to update before filing.

Recommendation: Archive in the contract repository and notify procurement.`,
    summarizeOutput: `Email Summary  ·  DPA_countersigned.pdf

From: Legal & Compliance
Subject: RE: Vendor DPA — countersigned copy

Key Points
· Fully executed DPA attached; no material changes from the last redline
· Data residency and subprocessors match the approved template
· Exhibit B still references a legacy region label — confirm with IT before filing

Next Steps
· Archive in the contract repository and notify procurement`,
    draftOutput: `Draft Reply

Subject: RE: Vendor DPA — countersigned copy

Hi Legal,

Received—thank you. I'll route Exhibit B's region label to IT for a quick confirmation, then file per our records policy.

Best,
Michael Kim`,
    translateOutput: `Translation — Korean

제목: RE: 벤더 DPA — 서명 완료본

법무팀 안녕하세요,

첨부 DPA 정상 수령했습니다. 데이터 상주·하도급 처리 조항은 승인본과 일치합니다. Exhibit B 지역 라벨은 IT 확인 후 보관·공유하겠습니다.

감사합니다,
Michael Kim`,
    chatbotAnswer: `This email is from Legal & Compliance to Michael Kim, sent on Apr 18, 2026 at 4:12 PM. It confirms that the analytics vendor DPA has been countersigned, with no material changes from the last redline.

Attachment — DPA_countersigned.pdf (820 KB):
· Fully executed Data Processing Agreement.
· Data residency and subprocessor lists match the approved template.
· Exhibit B still references a legacy region label — worth confirming with IT before filing.

Recommended next step: archive the signed copy in the contract repository and notify procurement.`,
  },
  {
    id: "analytics",
    chipLabel: "Analytics",
    listSender: "Analytics Dept",
    listSnippet: "Weekly KPI pack — Q1 close…",
    subject: "Weekly KPI pack — Q1 close",
    fromName: "Analytics Dept",
    fromEmail: "analytics@globaltechpartners.com",
    toLine: "Leadership distro",
    timeLabel: "Apr 17, 2026 · 8:00 AM",
    attachment: { name: "KPI_Q1_summary.xlsx", size: "2.1 MB" },
    body: `Team,

Please find the Q1 KPI pack. Tabs are locked for presentation mode; raw extracts are on the "Data" tab.

— Analytics`,
    agentOutput: `Key tables in the attachment cover revenue, margin, and NRR with week-over-week deltas.

Note: The "Data" tab includes unsubmitted adjustments—treat slide figures as provisional until finance publishes the final close.

Recommendation: Use the summary tab for Thursday's review; avoid quoting cell-level detail from the raw tab.`,
    summarizeOutput: `Email Summary  ·  KPI_Q1_summary.xlsx

From: Analytics Dept
Subject: Weekly KPI pack — Q1 close

Key Points
· Q1 KPI pack attached; tabs locked for presentation mode
· Raw extracts live on the "Data" tab — figures may still move until finance publishes the final close

Watchouts
· Treat YoY tables as provisional until the final close is published`,
    draftOutput: `Draft Reply

Subject: Re: Weekly KPI pack — Q1 close

Team,

Thanks for the pack. We'll use the summary tab for Thursday's review and avoid quoting cell-level detail from the raw tab until finance publishes the final numbers.

Best regards,
Leadership distro`,
    translateOutput: `Translation — Korean

제목: 주간 KPI 자료 — 1분기 마감

팀,

Q1 KPI 팩 확인했습니다. 목요일 리뷰까지는 요약 탭 기준으로 공유하겠습니다. 재무 최종 마감 전까지는 원시 탭 수치 인용은 자제하겠습니다.

감사합니다.`,
    chatbotAnswer: `This email is from Analytics Dept to the leadership distro, sent on Apr 17, 2026 at 8:00 AM. It delivers the weekly Q1 KPI pack for review.

Attachment — KPI_Q1_summary.xlsx (2.1 MB):
· Presentation tabs are locked; raw extracts live on the "Data" tab.
· Tracks revenue, margin, and NRR with week-over-week deltas.
· The "Data" tab includes unsubmitted adjustments — figures may move until finance publishes the final close.

Recommended next step: present from the summary tab on Thursday and avoid quoting cell-level detail from the raw tab.`,
  },
]

const FORMAT_CHIPS = ["PDF", "Word", "Excel", "PowerPoint", "HWP", "Images"] as const

export function EmailAgentInboxDemo() {
  const reduce = useReducedMotion() ?? false
  const [activeId, setActiveId] = useState(THREADS[0]!.id)
  const [selectedAction, setSelectedAction] = useState<ActionId>("summarize")
  const [phase, setPhase] = useState<Phase>("idle")
  const [revealed, setRevealed] = useState(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  /** Assistant reply currently being streamed (chatbot only). */
  const [chatStreamFull, setChatStreamFull] = useState<string | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const active = THREADS.find((t) => t.id === activeId) ?? THREADS[0]!

  const after = useCallback((ms: number, fn: () => void) => {
    const id = setTimeout(fn, ms)
    timersRef.current.push(id)
  }, [])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    if (streamRef.current) {
      clearInterval(streamRef.current)
      streamRef.current = null
    }
  }, [])

  const runStream = useCallback(
    (
      full: string,
      options?: { commitToChat?: boolean; onComplete?: () => void },
    ) => {
      const commitToChat = options?.commitToChat ?? false
      const onComplete = options?.onComplete
      setRevealed(0)
      if (reduce) {
        setRevealed(full.length)
        after(60, () => {
          if (commitToChat) {
            setChatMessages((m) => [
              ...m,
              { id: crypto.randomUUID(), role: "assistant", text: full },
            ])
            setPhase("idle")
            setChatStreamFull(null)
          } else {
            setPhase("done")
            onComplete?.()
          }
        })
        return
      }
      let n = 0
      streamRef.current = setInterval(() => {
        n = Math.min(n + 4, full.length)
        setRevealed(n)
        if (n >= full.length) {
          if (streamRef.current) clearInterval(streamRef.current)
          streamRef.current = null
          after(180, () => {
            if (commitToChat) {
              setChatMessages((m) => [
                ...m,
                { id: crypto.randomUUID(), role: "assistant", text: full },
              ])
              setPhase("idle")
              setRevealed(0)
              setChatStreamFull(null)
            } else {
              setPhase("done")
              onComplete?.()
            }
          })
        }
      }, 16)
    },
    [after, reduce],
  )

  const askChatbot = useCallback(
    (thread: ThreadScenario, question: string) => {
      clearTimers()
      setChatMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "user", text: question },
      ])
      setChatInput("")
      const answer = getChatbotResponse(thread, question)
      setChatStreamFull(answer)
      setRevealed(0)
      setPhase("loading")
      after(reduce ? 20 : 360, () => {
        setPhase("streaming")
        runStream(answer, { commitToChat: true })
      })
    },
    [after, clearTimers, reduce, runStream],
  )

  const playScenario = useCallback(
    (t: ThreadScenario) => {
      clearTimers()
      setActiveId(t.id)
      setPhase("idle")
      setRevealed(0)
      setChatMessages([])
      setChatInput("")
      setChatStreamFull(null)

      const gap = reduce ? 40 : 500
      const intro = reduce ? 30 : 220

      const runChatbot = () => {
        setSelectedAction("chatbot")
        after(gap, () => askChatbot(t, CHATBOT_EXAMPLE_QUESTION))
      }

      const runTranslate = () => {
        setSelectedAction("translate")
        setPhase("loading")
        setRevealed(0)
        after(reduce ? 20 : 360, () => {
          setPhase("streaming")
          runStream(getActionStreamText(t, "translate"), {
            onComplete: () => after(gap, runChatbot),
          })
        })
      }

      const runDraft = () => {
        setSelectedAction("draft")
        setPhase("loading")
        setRevealed(0)
        after(reduce ? 20 : 360, () => {
          setPhase("streaming")
          runStream(getActionStreamText(t, "draft"), {
            onComplete: () => after(gap, runTranslate),
          })
        })
      }

      const runSummarize = () => {
        setSelectedAction("summarize")
        setPhase("loading")
        setRevealed(0)
        after(reduce ? 20 : 360, () => {
          setPhase("streaming")
          runStream(getActionStreamText(t, "summarize"), {
            onComplete: () => after(gap, runDraft),
          })
        })
      }

      after(intro, runSummarize)
    },
    [after, askChatbot, clearTimers, reduce, runStream],
  )

  useEffect(() => {
    playScenario(THREADS[0]!)
    return () => clearTimers()
  }, [clearTimers, playScenario])

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = chatInput.trim()
    if (!q || phase === "loading" || phase === "streaming") return
    askChatbot(active, q)
  }

  const streamFull =
    selectedAction === "chatbot" && chatStreamFull !== null
      ? chatStreamFull
      : getActionStreamText(active, selectedAction)
  const showActionOutput =
    selectedAction !== "chatbot" &&
    (phase === "loading" || phase === "streaming" || phase === "done")
  const showLoading = phase === "loading"
  const showTypedBody = phase === "streaming" || phase === "done"
  const showChatbotStream =
    selectedAction === "chatbot" &&
    chatStreamFull !== null &&
    (phase === "loading" || phase === "streaming")

  const initials = (name: string) => {
    const clean = name.replace(/&/g, " ").replace(/\s+/g, " ").trim()
    const parts = clean.split(" ").filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
    }
    return clean.slice(0, 2).toUpperCase()
  }

  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduce ? 0 : 0.65, ease }}
        className="mb-8 text-center"
      >
        <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          <span className="h-px w-4 bg-border" aria-hidden />
          Inbox-native AI workflow
          <span className="h-px w-4 bg-border" aria-hidden />
        </div>
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          MZO Email Agent, built into the thread
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          Summarize emails and attachments, ask grounded questions, draft replies, and translate
          content — all inside the Outlook workflow your team already uses.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Interactive preview. Outbound actions are disabled in this demo.
        </p>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: reduce ? 0 : 0.75, delay: reduce ? 0 : 0.06 }}
      >
        <Card className="overflow-hidden border-border shadow-xl">
          <div className="flex min-h-[420px] w-full flex-col overflow-hidden lg:h-[min(620px,82vh)] lg:min-h-0 lg:flex-row">
            {/* Left — search + list */}
            <div className="flex min-h-0 w-full shrink-0 flex-col border-b border-border bg-background lg:h-full lg:w-[min(100%,280px)] lg:border-b-0 lg:border-r">
              <div className="border-b border-border p-2">
                <div className="relative">
                  <Search
                    className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    readOnly
                    placeholder="Search"
                    className="h-8 border-border bg-muted/40 pl-8 text-xs"
                    aria-label="Search mail (preview)"
                  />
                </div>
              </div>
              <ul className="max-h-[200px] min-h-0 flex-1 space-y-0.5 overflow-y-auto p-1.5 lg:max-h-none" role="list">
                {THREADS.map((t) => {
                  const sel = activeId === t.id
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => playScenario(t)}
                        className={cn(
                          "flex w-full flex-col rounded-md border border-transparent px-2.5 py-2 text-left transition-colors",
                          sel
                            ? "border-primary/30 bg-primary/10 text-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        <span className="text-[11px] font-medium text-foreground">{t.listSender}</span>
                        <span className="truncate text-[11px] font-semibold leading-tight">{t.subject}</span>
                        <span className="truncate text-[10px] text-muted-foreground">{t.listSnippet}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Center — reading pane */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted/15 lg:h-full">
              <div className="border-b border-border bg-background px-4 py-3">
                <h3 className="text-[15px] font-semibold leading-snug text-foreground">{active.subject}</h3>
                <div className="mt-3 flex gap-3">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
                    aria-hidden
                  >
                    {initials(active.fromName)}
                  </div>
                  <div className="min-w-0 flex-1 text-[11px] leading-relaxed">
                    <div className="font-semibold text-foreground">{active.fromName}</div>
                    <div className="text-muted-foreground">{active.fromEmail}</div>
                    <div className="text-muted-foreground">
                      To: {active.toLine} · {active.timeLabel}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/35 bg-orange-500/10 px-2.5 py-1 text-[11px] font-medium text-orange-950 dark:text-orange-100"
                  >
                    <FileText className="size-3.5 shrink-0 opacity-80" aria-hidden />
                    {active.attachment.name}
                    <span className="text-muted-foreground">· {active.attachment.size}</span>
                  </span>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/95">
                  {active.body}
                </p>
              </div>
            </div>

            {/* Right — MZO Email Agent (light: neutral panel, dark: Outlook-style add-in) */}
            <aside
              className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-t border-border bg-muted/40 text-foreground dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 lg:h-full lg:min-h-0 lg:w-[min(100%,300px)] lg:border-l lg:border-t-0"
              aria-label="MZO Email Agent add-in"
            >
              <div className="shrink-0 border-b border-border px-3 py-2.5 dark:border-zinc-800">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[13px] font-semibold tracking-tight">MZO Email Agent</span>
                    <p className="text-[10px] text-muted-foreground dark:text-zinc-500">Powered by MZO AI</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-medium text-emerald-700 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden />
                    Active
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground dark:text-zinc-400">
                  <span className="truncate">{active.attachment.name} attached</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground dark:bg-zinc-800 dark:text-zinc-500">
                    context loaded
                  </span>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 pb-2 pt-1">
                <p className="shrink-0 px-1 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground dark:text-zinc-500">
                  Actions
                </p>
                <div className="shrink-0 space-y-1">
                  {ACTIONS.map((a) => {
                    const sel = selectedAction === a.id
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          setSelectedAction(a.id)
                          if (a.id === "chatbot") {
                            clearTimers()
                            setChatMessages([])
                            setChatInput("")
                            setChatStreamFull(null)
                            setRevealed(0)
                            setPhase("idle")
                            after(reduce ? 20 : 240, () => {
                              askChatbot(active, CHATBOT_EXAMPLE_QUESTION)
                            })
                            return
                          }
                          clearTimers()
                          setRevealed(0)
                          setPhase("loading")
                          const text = getActionStreamText(active, a.id)
                          after(reduce ? 20 : 360, () => {
                            setPhase("streaming")
                            runStream(text)
                          })
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[11px] transition-colors",
                          sel
                            ? "border-primary/35 bg-primary/10 text-foreground shadow-sm ring-1 ring-primary/15 dark:border-zinc-100 dark:bg-zinc-900/80 dark:text-zinc-50 dark:ring-white/10"
                            : "border-transparent bg-muted/70 text-muted-foreground hover:bg-muted dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-900/70",
                        )}
                      >
                        {a.done && (
                          <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-500" aria-hidden />
                        )}
                        {!a.done && (
                          <MessageSquare
                            className={cn(
                              "size-3.5 shrink-0",
                              sel ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground dark:text-zinc-500",
                            )}
                            aria-hidden
                          />
                        )}
                        <span className="flex-1">{a.label}</span>
                        {sel && (
                          <span
                            className="size-1.5 shrink-0 rounded-full bg-foreground/35 dark:bg-zinc-300"
                            aria-hidden
                          />
                        )}
                      </button>
                    )
                  })}
                </div>

                {selectedAction === "chatbot" ? (
                  <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden lg:min-h-[140px]">
                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-lg border border-border bg-background/60 p-2 dark:border-zinc-800 dark:bg-zinc-900/40">
                      {chatMessages.length === 0 && !showChatbotStream && (
                        <p className="text-[10px] leading-relaxed text-muted-foreground dark:text-zinc-500">
                          Tell me about this email and its attachments.
                        </p>
                      )}
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            msg.role === "user" ? "justify-end" : "justify-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[min(100%,260px)] rounded-lg px-2.5 py-2 text-[11px] leading-relaxed",
                              msg.role === "user"
                                ? "bg-primary/12 text-foreground dark:bg-zinc-800 dark:text-zinc-100"
                                : "border border-border bg-muted/50 text-foreground dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200",
                            )}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                      {showChatbotStream && (
                        <div className="flex justify-start">
                          <div className="max-w-[min(100%,260px)] rounded-lg border border-border bg-muted/50 px-2.5 py-2 text-[11px] leading-relaxed dark:border-zinc-700 dark:bg-zinc-900/70">
                            {showLoading && (
                              <span className="text-muted-foreground dark:text-zinc-500">
                                {actionLoadingLabel("chatbot")}
                              </span>
                            )}
                            {phase === "streaming" && (
                              <p className="whitespace-pre-wrap text-foreground dark:text-zinc-200">
                                {streamFull.slice(0, revealed)}
                                {revealed < streamFull.length && (
                                  <span
                                    className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-emerald-600 align-middle dark:bg-emerald-400"
                                    aria-hidden
                                  />
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <form
                      onSubmit={handleChatSubmit}
                      className="flex shrink-0 gap-1.5"
                    >
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about this email…"
                        className="h-8 min-w-0 flex-1 border-border bg-background text-[11px] dark:bg-zinc-900/50"
                        disabled={phase === "loading" || phase === "streaming"}
                        aria-label="Question for AI Chatbot"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant="secondary"
                        className="h-8 shrink-0 px-2.5 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                        disabled={
                          phase === "loading" ||
                          phase === "streaming" ||
                          !chatInput.trim()
                        }
                        aria-label="Send question"
                      >
                        <SendHorizontal className="size-3.5" aria-hidden />
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="mt-3 min-h-0 flex-1 overflow-y-auto lg:min-h-[120px]">
                  <AnimatePresence mode="wait">
                    {showActionOutput && (
                      <motion.div
                        key={`${active.id}-${selectedAction}`}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-border bg-background/80 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50"
                      >
                        {showLoading && (
                          <p className="text-[11px] text-muted-foreground dark:text-zinc-500">
                            {actionLoadingLabel(selectedAction)}
                          </p>
                        )}
                        {showTypedBody && (
                          <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-foreground dark:text-zinc-200">
                            {streamFull.slice(0, revealed)}
                            {phase === "streaming" && revealed < streamFull.length && (
                              <span
                                className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-emerald-600 align-middle dark:bg-emerald-400"
                                aria-hidden
                              />
                            )}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-border px-3 py-2 text-[9px] text-muted-foreground dark:border-zinc-800 dark:text-zinc-500">
                <span className="text-muted-foreground dark:text-zinc-400">MZO AI</span>
                <span className="mx-1 text-muted-foreground/45 dark:text-zinc-700">·</span>
                Enterprise
                <span className="mx-1 text-muted-foreground/45 dark:text-zinc-700">·</span>
                Outlook Add-in
              </div>
            </aside>
          </div>

          {/* Bottom — attachment formats */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border bg-muted/30 px-3 py-2 text-[10px] text-muted-foreground dark:bg-zinc-950 dark:text-zinc-400 lg:rounded-b-[inherit]">
            <span className="font-medium text-muted-foreground dark:text-zinc-500">Reads attachments:</span>
            {FORMAT_CHIPS.map((f) => (
              <span
                key={f}
                className="rounded-md border border-border bg-background px-2 py-0.5 font-medium text-foreground dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/40 px-3 py-2">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Explore sample threads
            </span>
            {THREADS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => playScenario(t)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  activeId === t.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                )}
              >
                <ChevronRight className="size-3 opacity-60" aria-hidden />
                {t.chipLabel}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>
    </section>
  )
}
