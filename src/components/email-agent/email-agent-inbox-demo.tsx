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

const CHATBOT_EXAMPLE_QUESTION = "이 이메일과 첨부파일에 대해 알려줘."

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
      return "이 이메일을 요약하는 중…"
    case "draft":
      return "답장 초안을 작성하는 중…"
    case "translate":
      return "번역하는 중…"
    case "chatbot":
      return "첨부파일 컨텍스트를 읽는 중…"
    default:
      return "처리하는 중…"
  }
}

const ACTIONS: { id: ActionId; label: string; done?: boolean }[] = [
  { id: "summarize", label: "이 이메일 요약", done: true },
  { id: "draft", label: "답장 초안 작성", done: true },
  { id: "translate", label: "이 이메일 번역", done: true },
  { id: "chatbot", label: "AI 챗봇" },
]

const THREADS: ThreadScenario[] = [
  {
    id: "alpha",
    chipLabel: "프로젝트 알파",
    listSender: "마이클 김",
    listSnippet: "업데이트된 제안서를 보내주셔서…",
    subject: "RE: 프로젝트 알파 제안서 검토 요청",
    fromName: "마이클 김",
    fromEmail: "m.kim@globaltechpartners.com",
    toLine: "사라 윌리엄스",
    timeLabel: "2026년 4월 19일 · 오전 9:42",
    attachment: { name: "proposal_v2.pdf", size: "1.4 MB" },
    body: `사라님,

업데이트된 제안서를 보내주셔서 감사합니다. 첨부 문서를 검토했고, 목요일 스티어링 콜 전에 몇 가지를 짚어두고자 합니다.

다음 항목을 우선적으로 살펴봐 주세요:
• 3섹션 — 기술 아키텍처(API 연동 일정 및 의존성 가정)
• 5섹션 — 예산 내역(라이선스 인상분 및 반복 비용 모델링)
• 7섹션 — 리스크 매트릭스(2분기로 표시된 운영 및 서드파티 리스크)

API 연동 관련 서술은 지난 워크숍 내용과 일치하지만, 5섹션은 1월에 합의한 1분기 15% 라이선스 인상분을 반영해야 합니다. 수정된 전망치에 대해 재무팀의 승인을 꼭 받도록 합시다.

감사합니다,
마이클 김
전략적 파트너십 부문 시니어 디렉터
글로벌 테크 파트너스`,
    agentOutput: `1분기 15% 라이선스 인상분(2026년 1월 합의)이 포함되어 있습니다.

참고: 마이클 김이 5섹션을 수정 대상으로 표시했습니다. 예산 표가 최신 재무 모델과 일치하는지 확인하세요.

권장: 목요일 콜 전에 수정된 전망치를 재무팀과 확인하세요.`,
    summarizeOutput: `이메일 요약  ·  proposal_v2.pdf

보낸 사람: 마이클 김, 글로벌 테크 파트너스
제목: RE: 프로젝트 알파 제안서 검토 요청

핵심 사항
· 제안서 v2 검토 완료; 목요일 스티어링 콜 전 피드백 필요
· 3섹션(기술 아키텍처): API 연동 일정과 의존성이 검토 대상으로 표시됨
· 5섹션(예산): 1분기 15% 라이선스 인상분이 2년차 전망에 반영되어야 함
· 7섹션(리스크 매트릭스): 지난 워크숍 서술과 일치

조치 항목
· 기술 리드가 목요일 전에 3섹션과 5섹션 검토
· 수정된 전망치에 대한 재무팀 승인 확인
· 선택: 콜을 위한 v1 대 v2 비교 요약본(1페이지)`,
    draftOutput: `답장 초안

제목: RE: 프로젝트 알파 제안서 검토 요청

안녕하세요 마이클님,

proposal_v2.pdf를 상세히 검토해 주셔서 감사합니다.

의견을 기술 리드에게 전달했습니다. 3섹션은 현실적인 API 연동 일정으로 수정하고, 5섹션은 표시해 주신 대로 전망 전반에 1분기 15% 라이선스 인상분을 반영하도록 업데이트하겠습니다.

목요일 콜 전에 검토용 근거 표를 준비하겠습니다.

감사합니다,
사라 윌리엄스
프로젝트 알파 리드`,
    translateOutput: `번역 — 영어

Subject: RE: Project Alpha Proposal Review Request

Hi Sarah,

Thank you for sending the updated proposal (v2). Let me highlight a few points before Thursday's steering call.

Review priorities:
· Section 3 — Technical Architecture (API integration schedule and dependencies)
· Section 5 — Budget (whether the 15% Q1 licensing uplift is reflected)
· Section 7 — Risk Matrix

Section 5 needs to be revised to reflect the uplift agreed in January. We'll confirm after finance review.

Best regards,
Michael Kim`,
    chatbotAnswer: `이 이메일은 마이클 김(글로벌 테크 파트너스)이 사라 윌리엄스에게 2026년 4월 19일 오전 9:42에 보낸 것입니다. 목요일 스티어링 회의에 앞서 수정된 프로젝트 알파 제안서를 사전 검토하는 내용입니다.

첨부파일 — proposal_v2.pdf (1.4 MB):
· 3섹션(기술 아키텍처): API 연동 일정과 의존성 가정이 기술 리드 검토 대상으로 표시됨.
· 5섹션(예산 내역): 2년차 전망에 1월 합의된 1분기 15% 라이선스 인상분이 반영되어야 함.
· 7섹션(리스크 매트릭스): 2분기 운영 및 서드파티 리스크 — 이전 워크숍과 일치.

권장 다음 단계: 목요일 콜 전에 수정된 5섹션 전망치를 재무팀과 확인하세요.`,
  },
  {
    id: "legal",
    chipLabel: "법무 검토",
    listSender: "법무·컴플라이언스",
    listSnippet: "Re: 벤더 DPA — 서명 완료…",
    subject: "RE: 벤더 DPA — 서명 완료본",
    fromName: "법무·컴플라이언스",
    fromEmail: "legal@globaltechpartners.com",
    toLine: "마이클 김",
    timeLabel: "2026년 4월 18일 · 오후 4:12",
    attachment: { name: "DPA_countersigned.pdf", size: "820 KB" },
    body: `마이클님,

분석 벤더의 서명 완료된 DPA를 첨부합니다. 지난 수정본 대비 중대한 변경은 없으며, 데이터 상주 조항은 표시된 그대로 유지됩니다.

감사합니다,
법무·컴플라이언스`,
    agentOutput: `첨부 문서는 서명이 완료된 상태이며, 데이터 상주 및 하위 처리자 항목이 승인된 템플릿과 일치합니다.

참고: Exhibit B에 여전히 이전 지역 라벨이 참조되어 있습니다. 보관 전에 업데이트 여부를 IT와 확인하세요.

권장: 계약 저장소에 보관하고 구매팀에 통지하세요.`,
    summarizeOutput: `이메일 요약  ·  DPA_countersigned.pdf

보낸 사람: 법무·컴플라이언스
제목: RE: 벤더 DPA — 서명 완료본

핵심 사항
· 서명이 완료된 DPA 첨부; 지난 수정본 대비 중대한 변경 없음
· 데이터 상주 및 하위 처리자 항목이 승인된 템플릿과 일치
· Exhibit B에 여전히 이전 지역 라벨이 참조됨 — 보관 전 IT와 확인 필요

다음 단계
· 계약 저장소에 보관하고 구매팀에 통지`,
    draftOutput: `답장 초안

제목: RE: 벤더 DPA — 서명 완료본

법무팀 안녕하세요,

잘 받았습니다, 감사합니다. Exhibit B의 지역 라벨을 IT에 전달해 빠르게 확인한 뒤, 기록 정책에 따라 보관하겠습니다.

감사합니다,
마이클 김`,
    translateOutput: `번역 — 영어

Subject: RE: Vendor DPA — countersigned copy

Hi Legal,

I've received the attached DPA. The data residency and subprocessor clauses match the approved version. I'll archive and share Exhibit B's region label after confirming with IT.

Best regards,
Michael Kim`,
    chatbotAnswer: `이 이메일은 법무·컴플라이언스가 마이클 김에게 2026년 4월 18일 오후 4:12에 보낸 것입니다. 분석 벤더 DPA가 서명 완료되었으며 지난 수정본 대비 중대한 변경이 없음을 확인하는 내용입니다.

첨부파일 — DPA_countersigned.pdf (820 KB):
· 서명이 완료된 데이터 처리 계약(DPA).
· 데이터 상주 및 하위 처리자 목록이 승인된 템플릿과 일치.
· Exhibit B에 여전히 이전 지역 라벨이 참조됨 — 보관 전 IT와 확인하는 것이 좋음.

권장 다음 단계: 서명본을 계약 저장소에 보관하고 구매팀에 통지하세요.`,
  },
  {
    id: "analytics",
    chipLabel: "분석",
    listSender: "분석팀",
    listSnippet: "주간 KPI 자료 — 1분기 마감…",
    subject: "주간 KPI 자료 — 1분기 마감",
    fromName: "분석팀",
    fromEmail: "analytics@globaltechpartners.com",
    toLine: "리더십 배포 목록",
    timeLabel: "2026년 4월 17일 · 오전 8:00",
    attachment: { name: "KPI_Q1_summary.xlsx", size: "2.1 MB" },
    body: `팀,

1분기 KPI 자료를 첨부합니다. 발표 모드를 위해 탭은 잠겨 있으며, 원시 추출 데이터는 "Data" 탭에 있습니다.

— 분석팀`,
    agentOutput: `첨부파일의 핵심 표는 매출, 마진, NRR을 주간 증감과 함께 다룹니다.

참고: "Data" 탭에는 미제출 조정값이 포함되어 있습니다. 재무팀이 최종 마감을 게시하기 전까지 슬라이드 수치는 잠정값으로 취급하세요.

권장: 목요일 리뷰에는 요약 탭을 사용하고, 원시 탭의 셀 단위 세부 수치 인용은 피하세요.`,
    summarizeOutput: `이메일 요약  ·  KPI_Q1_summary.xlsx

보낸 사람: 분석팀
제목: 주간 KPI 자료 — 1분기 마감

핵심 사항
· 1분기 KPI 자료 첨부; 발표 모드를 위해 탭 잠김
· 원시 추출 데이터는 "Data" 탭에 위치 — 재무팀의 최종 마감 게시 전까지 수치 변동 가능

유의 사항
· 최종 마감이 게시되기 전까지 전년 대비 표는 잠정값으로 취급`,
    draftOutput: `답장 초안

제목: Re: 주간 KPI 자료 — 1분기 마감

팀,

자료 감사합니다. 목요일 리뷰에는 요약 탭을 사용하고, 재무팀이 최종 수치를 게시하기 전까지 원시 탭의 셀 단위 세부 수치 인용은 피하겠습니다.

감사합니다,
리더십 배포 목록`,
    translateOutput: `번역 — 영어

Subject: Weekly KPI pack — Q1 close

Team,

I've reviewed the Q1 KPI pack. Until Thursday's review, I'll share based on the summary tab. I'll refrain from quoting raw tab figures until the finance final close.

Best regards.`,
    chatbotAnswer: `이 이메일은 분석팀이 리더십 배포 목록에 2026년 4월 17일 오전 8:00에 보낸 것입니다. 검토를 위한 주간 1분기 KPI 자료를 전달하는 내용입니다.

첨부파일 — KPI_Q1_summary.xlsx (2.1 MB):
· 발표용 탭은 잠겨 있으며, 원시 추출 데이터는 "Data" 탭에 위치.
· 매출, 마진, NRR을 주간 증감과 함께 추적.
· "Data" 탭에는 미제출 조정값이 포함됨 — 재무팀이 최종 마감을 게시하기 전까지 수치 변동 가능.

권장 다음 단계: 목요일에는 요약 탭으로 발표하고, 원시 탭의 셀 단위 세부 수치 인용은 피하세요.`,
  },
]

const FORMAT_CHIPS = ["PDF", "Word", "Excel", "PowerPoint", "HWP", "이미지"] as const

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
          받은편지함 네이티브 AI 워크플로
          <span className="h-px w-4 bg-border" aria-hidden />
        </div>
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          스레드 안에 내장된 Email Agent
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          이메일과 첨부파일을 요약하고, 근거 있는 질문을 하고, 답장을 작성하고,
          콘텐츠를 번역하세요 — 모두 팀이 이미 사용하는 Outlook 워크플로 안에서.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          인터랙티브 미리보기. 이 데모에서는 발송 작업이 비활성화되어 있습니다.
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
                    placeholder="검색"
                    className="h-8 border-border bg-muted/40 pl-8 text-xs"
                    aria-label="메일 검색 (미리보기)"
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
                      받는 사람: {active.toLine} · {active.timeLabel}
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

            {/* Right — Email Agent (light: neutral panel, dark: Outlook-style add-in) */}
            <aside
              className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-t border-border bg-muted/40 text-foreground dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 lg:h-full lg:min-h-0 lg:w-[min(100%,300px)] lg:border-l lg:border-t-0"
              aria-label="Email Agent 추가 기능"
            >
              <div className="shrink-0 border-b border-border px-3 py-2.5 dark:border-zinc-800">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[13px] font-semibold tracking-tight">Email Agent</span>
                    <p className="text-[10px] text-muted-foreground dark:text-zinc-500">AI 기반</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-medium text-emerald-700 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden />
                    활성
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground dark:text-zinc-400">
                  <span className="truncate">{active.attachment.name} 첨부됨</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground dark:bg-zinc-800 dark:text-zinc-500">
                    컨텍스트 로드됨
                  </span>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 pb-2 pt-1">
                <p className="shrink-0 px-1 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground dark:text-zinc-500">
                  작업
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
                          이 이메일과 첨부파일에 대해 알려줘.
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
                        placeholder="이 이메일에 대해 물어보세요…"
                        className="h-8 min-w-0 flex-1 border-border bg-background text-[11px] dark:bg-zinc-900/50"
                        disabled={phase === "loading" || phase === "streaming"}
                        aria-label="AI 챗봇에게 질문"
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
                        aria-label="질문 보내기"
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
                <span className="text-muted-foreground dark:text-zinc-400">AI</span>
                <span className="mx-1 text-muted-foreground/45 dark:text-zinc-700">·</span>
                엔터프라이즈
                <span className="mx-1 text-muted-foreground/45 dark:text-zinc-700">·</span>
                Outlook 추가 기능
              </div>
            </aside>
          </div>

          {/* Bottom — attachment formats */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border bg-muted/30 px-3 py-2 text-[10px] text-muted-foreground dark:bg-zinc-950 dark:text-zinc-400 lg:rounded-b-[inherit]">
            <span className="font-medium text-muted-foreground dark:text-zinc-500">읽을 수 있는 첨부파일:</span>
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
              샘플 스레드 살펴보기
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
