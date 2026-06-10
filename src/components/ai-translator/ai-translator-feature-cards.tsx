import type { ElementType } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Cloud, FileText, Languages, ShieldCheck } from "lucide-react"

const ease = [0.16, 1, 0.3, 1] as const

/** Four value props aligned with hero checklist (reference bundle cards). */
const FEATURES = [
  {
    icon: Languages,
    title: "채팅과 문서 번역을 하나의 제품에서",
    body: "도구를 바꾸지 않고 대화형 메시지와 파일 기반 페이지 사이를 오갈 수 있습니다. 하나의 워크스페이스, 일관된 제어, 그리고 50개 이상의 언어 지원.",
  },
  {
    icon: Cloud,
    title: "온디바이스 또는 클라우드 배포",
    body: "모델과 음성 처리가 실행되는 위치를 선택하여, 민감한 프로그램은 망분리 환경에 두고 그 외에는 관리형 클라우드에서 확장할 수 있습니다.",
  },
  {
    icon: FileText,
    title: "용어집 인식 및 요약 지원",
    body: "용어집이 활성화되면 용어를 일관되게 유지하고, 번역과 함께 문서 요약을 제공하여 더 빠른 검토를 돕습니다.",
  },
  {
    icon: ShieldCheck,
    title: "엔터프라이즈 프라이버시와 제어를 위한 설계",
    body: "ID, 보존, 감사 요건을 고려해 설계하여, 다국어 결과물이 나머지 스택과 동일한 보안 환경을 따르도록 합니다.",
  },
] as const

function FeatureCard({
  icon: Icon,
  title,
  body,
  delay,
  reduce,
}: {
  icon: ElementType
  title: string
  body: string
  delay: number
  reduce: boolean
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="group rounded-xl border border-border bg-card p-5 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <div
        className="mb-4 flex size-9 items-center justify-center rounded-lg border border-border bg-muted dark:border-zinc-600 dark:bg-zinc-800"
        aria-hidden
      >
        <Icon className="size-4 text-foreground/90 dark:text-zinc-200" />
      </div>
      <h3 className="mb-2 text-sm font-medium tracking-tight text-foreground dark:text-white">
        {title}
      </h3>
      <p className="text-[13px] leading-relaxed text-muted-foreground dark:text-zinc-300">{body}</p>
    </motion.div>
  )
}

export function AiTranslatorFeatureCards() {
  const reduce = useReducedMotion() ?? false

  return (
    <section className="border-t border-border py-16 dark:border-zinc-800 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduce ? 0 : 0.5, ease }}
          className="mb-10 sm:mb-14"
        >
          <div className="mb-4 inline-flex max-w-full items-center rounded-full border border-border bg-card px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.06]">
            <span className="text-left text-[11px] font-medium uppercase leading-snug tracking-[0.04em] text-muted-foreground dark:text-zinc-300">
              플랫폼 주요 기능
            </span>
          </div>
          <h2 className="max-w-xl text-balance text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-tight text-foreground dark:text-white">
            팀이 실제로 일하는 방식에 맞춘 하나의 번역기
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground dark:text-zinc-300">
            온디바이스, 온프레미스, 클라우드 — 환경이 요구하는 어디에든 배포하세요.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              body={f.body}
              delay={reduce ? 0 : i * 0.07}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
