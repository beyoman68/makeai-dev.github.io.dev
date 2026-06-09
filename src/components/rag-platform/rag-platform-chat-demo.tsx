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
  "이 보고서의 모든 섹션에서 월간 영업이익을 합산해줘"

const DEMOS: Record<string, DemoConfig> = {
  finance: {
    responseText:
      "보고서의 관련 섹션 전반에서 영업이익 수치를 집계했습니다.\n\n1. 섹션별 합계\n월간 영업이익 값은 지역 요약, 부문 부록, 경영 개요에 나타납니다. [¹][²][³]\n\n2. 통합 결과\n보고된 수치를 통합한 결과, 해당 월의 총 영업이익은 검색된 섹션 전반에서 일관되게 제시됩니다. [¹][³]\n\n3. 참고\n한 섹션은 해당 수치를 요약 표로 제시하고, 다른 섹션은 동일한 수치를 부문 단위 세부 내역과 함께 제공합니다.",
    docs: [
      {
        title: "월간 실적 보고서 — 경영 요약",
        docType: "PDF",
        citation: "¹",
        matchLabel: "높은 일치",
        beforeHighlight: "해당 월의 총 영업이익은 ",
        highlight: "$18.4M",
        afterHighlight: "으로, 핵심 사업부의 성장을 반영합니다.",
      },
      {
        title: "부문 부록 — 이익 세부 내역",
        docType: "XLS",
        citation: "²",
        matchLabel: "높은 일치",
        beforeHighlight: "부문별 영업이익을 합산하면 ",
        highlight: "$18.4M",
        afterHighlight: "이 되며, 이는 명시된 사업 부문을 합친 값입니다.",
      },
      {
        title: "지역 리뷰 — 월간 하이라이트",
        docType: "PDF",
        citation: "³",
        matchLabel: "양호한 일치",
        beforeHighlight: "보고서는 월간 영업이익을 ",
        highlight: "$18.4M",
        afterHighlight: "으로 경영 하이라이트 섹션에서 재차 명시합니다.",
      },
    ],
  },
  history: {
    responseText:
      "검색된 기록 전반에서 Julia의 인사 이동 이력을 추적했습니다.\n\n1. 최초 발령\nJulia는 2019년 조직 공지에서 전략실 소속으로 처음 등장합니다. [¹]\n\n2. 이동 순서\n이후 인사 공지에서는 2021년 경영기획팀, 2023년 지역운영팀으로의 이동이 확인됩니다. [²]\n\n3. 현재 배치\n검색된 자료 중 가장 최근 인사 공지에서는 Julia가 혁신추진실에 소속된 것으로 기재되어 있습니다. [³]",
    docs: [
      {
        title: "인사 공지 — 2019년 발령",
        docType: "PDF",
        citation: "¹",
        matchLabel: "높은 일치",
        beforeHighlight: "Julia Han은 ",
        highlight: "전략실",
        afterHighlight: "에 2019년 3월부로 발령되었습니다.",
      },
      {
        title: "인사 이동 공지 — 2021년",
        docType: "DOC",
        citation: "²",
        matchLabel: "높은 일치",
        beforeHighlight: "Julia Han은 조직 개편의 일환으로 ",
        highlight: "경영기획팀",
        afterHighlight: "으로 이동했습니다.",
      },
      {
        title: "혁신추진실 공지 — 2024년",
        docType: "PDF",
        citation: "³",
        matchLabel: "양호한 일치",
        beforeHighlight: "이번 분기 다른 리더십 인사와 함께 공지에서는 Julia Han을 ",
        highlight: "혁신추진실",
        afterHighlight: " 소속으로 기재하고 있습니다.",
      },
    ],
  },
  visual: {
    responseText:
      "000 구역 설계 요청에 가장 관련성 높은 도면을 찾았습니다.\n\n1. 주요 일치\n최상위 결과는 요청한 구역명과 도면 종류에 부합하는 배치 도면입니다. [¹]\n\n2. 보조 시각 근거\n관련 도면으로는 평면 배치도, 기계 상세도, 수정 표기본이 포함됩니다. [²][³]\n\n3. 검색 참고\n이 결과들은 제목, 레이아웃, 도면 영역에 대한 세밀한 비주얼 검색을 사용해 시각적으로 풍부한 문서에서 도출되었습니다.",
    docs: [
      {
        title: "000 구역 배치 도면 — 리비전 B",
        docType: "PDF",
        citation: "¹",
        matchLabel: "높은 일치",
        beforeHighlight: "도면 표제란에 ",
        highlight: "000 구역 배치 도면",
        afterHighlight: "이 요청한 리비전 표기와 함께 표시되어 있습니다.",
      },
      {
        title: "기계 상세도 — 000 구역",
        docType: "PDF",
        citation: "²",
        matchLabel: "높은 일치",
        beforeHighlight: "이 도면에는 설계 요청에 부합하는 ",
        highlight: "단면 주석과 부품 지시선",
        afterHighlight: "이 포함되어 있습니다.",
      },
      {
        title: "수정 표기 도면 세트",
        docType: "PDF",
        citation: "³",
        matchLabel: "양호한 일치",
        beforeHighlight: "수정본은 엔지니어링 마크업 전반에서 ",
        highlight: "대상 영역의 배치 변경 사항",
        afterHighlight: "을 강조합니다.",
      },
    ],
  },
  summary: {
    responseText:
      "이번 달 실적 보고서를 간략히 요약하면 다음과 같습니다.\n\n1. 매출과 이익\n보고서는 안정적인 매출 성장과 전월 대비 개선된 영업이익률을 보여줍니다. [¹][²]\n\n2. 운영 하이라이트\n가장 큰 성장은 엔터프라이즈 부문에서 나왔으며, 지역별 실적은 혼조세를 유지했습니다. [²][³]\n\n3. 종합 시사점\n이번 달은 이익률 개선과 보다 균형 잡힌 부문 기여에 힘입어 긍정적인 모멘텀으로 마감되었습니다.",
    docs: [
      {
        title: "이번 달 실적 보고서",
        docType: "PDF",
        citation: "¹",
        matchLabel: "높은 일치",
        beforeHighlight: "매출은 엔터프라이즈 수요에 힘입어 ",
        highlight: "전월 대비 8.2%",
        afterHighlight: " 증가했습니다.",
      },
      {
        title: "경영 리뷰 — 월간 마감",
        docType: "DOC",
        citation: "²",
        matchLabel: "높은 일치",
        beforeHighlight: "팀 전반의 비용 통제 개선으로 영업이익률이 ",
        highlight: "14.6%",
        afterHighlight: "로 개선되었습니다.",
      },
      {
        title: "지역별 스냅샷 부록",
        docType: "PDF",
        citation: "³",
        matchLabel: "양호한 일치",
        beforeHighlight: "전반적인 추세는 개선되었으나 지역별 실적은 ",
        highlight: "시장별로 고르지 않은",
        afterHighlight: " 모습을 유지했습니다.",
      },
    ],
  },
}

const CHIP_MAP: Record<string, string> = {
  "이 보고서의 모든 섹션에서 월간 영업이익을 합산해줘":
    "finance",
  "참조 문서들에서 Julia의 인사 이동 이력을 추적해줘":
    "history",
  "000 구역 설계를 위한 도면을 찾아줘": "visual",
  "이번 달 실적 보고서를 요약해줘": "summary",
}

const CHIPS = Object.keys(CHIP_MAP)

const PIPELINE_STEPS = [
  { label: "질의 이해 완료", icon: Search },
  { label: "검색 중", icon: Database },
  { label: "근거 선택됨", icon: ShieldCheck },
  { label: "근거 기반 답변", icon: Zap },
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
          답변 근거를 위해 선택된 출처 발췌.
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
                aria-label="완료"
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
            근거 기반 답변
          </span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          검색된 출처 전반의 근거 기반 종합.
        </p>
        <div className="mb-3 flex flex-wrap gap-8">
          {[
            { v: "여러 출처", l: "출처" },
            { v: "구절 간 교차", l: "인용" },
            { v: "출처 기반", l: "근거" },
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
          에이전트 기반 검색 증강 생성
          <span className="h-px w-4 bg-border" aria-hidden />
        </div>
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          <span className="block">자연스럽게 질문하세요.</span>
          <span className="mt-1 block text-balance">
            AI 에이전트가 여러분의 데이터 전반에서 답변을 검색하고, 연결하고, 근거를 마련합니다.
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
                    프롬프트를 선택하면 RAG 워크플로가 작동하는 모습을 볼 수 있습니다
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
                      <span>출처에서 근거 검색 중</span>
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
                  예시 프롬프트
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
                      지식베이스에 대해 무엇이든 물어보세요…
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
                  aria-label="전송 (데모)"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>

            {/* Right column */}
            <div className="flex min-w-0 flex-1 flex-col gap-3.5 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div>
                <p className="mb-2 text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  파이프라인 상태
                </p>
                <PipelineStatusBar phase={phase} reduce={reduce} />
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  검색된 출처
                </span>
                <AnimatePresence>
                  {visibleDocs > 0 && (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1.5"
                      aria-label="데모에 나타나는 출처"
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
