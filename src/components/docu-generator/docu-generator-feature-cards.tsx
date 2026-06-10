import type { ElementType } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Building2, ClipboardList, Layers, ListTree, PenLine, Zap } from "lucide-react"

const ease = [0.16, 1, 0.3, 1] as const

const FEATURES = [
  {
    icon: Layers,
    title: "섹션별 생성",
    description:
      "대형 문서를 섹션별로 초안 작성하여, 팀이 전체 파일을 다시 작성하지 않고 특정 부분을 검토·재생성·개선할 수 있습니다.",
  },
  {
    icon: ClipboardList,
    title: "문서를 형성하는 입력값",
    description:
      "구조화된 프로젝트 입력을 사용하여 처음부터 생성 문서의 개요, 언어, 범위를 안내합니다.",
  },
  {
    icon: Zap,
    title: "하위 섹션 단위 실시간 초안 작성",
    description:
      "콘텐츠가 해당 위치에 나타나는 것을 확인할 수 있으며, 하위 섹션 단위 스트리밍으로 진행 상황을 가시화하고 검토할 수 있습니다.",
  },
  {
    icon: Building2,
    title: "목적에 맞게 설계된 문서 구조",
    description:
      "RFP, 제안서, 기획 문서, 그리고 기타 공식 엔터프라이즈 산출물을 위한 구조화된 형식을 지원합니다.",
  },
  {
    icon: ListTree,
    title: "탐색 가능한 문서 계층",
    description:
      "접을 수 있는 섹션과 하위 섹션으로 긴 문서를 작업하여, 초안을 체계적으로 유지하고 쉽게 훑어볼 수 있습니다.",
  },
  {
    icon: PenLine,
    title: "재시작 없이 검토 및 재생성",
    description:
      "개별 섹션을 다듬고, 대상 콘텐츠만 재생성하며, 나머지 초안은 그대로 유지합니다.",
  },
] as const

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
  reduce,
}: {
  icon: ElementType
  title: string
  description: string
  delay: number
  reduce: boolean
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="group rounded-xl border border-border bg-card p-5 dark:border-zinc-600 dark:bg-zinc-900"
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
      <p className="text-[13px] leading-relaxed text-muted-foreground dark:text-zinc-300">
        {description}
      </p>
    </motion.div>
  )
}

export function DocuGeneratorFeatureCards() {
  const reduce = useReducedMotion() ?? false

  return (
    <section className="border-t border-border py-16 dark:border-zinc-700 sm:py-24">
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
              팀이 Document Generator를 사용하는 이유
            </span>
          </div>
          <h2 className="max-w-xl text-balance text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-tight text-foreground dark:text-white">
            구조와 통제가 필요한 공식 문서를 위해 설계
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground dark:text-zinc-300">
            계층 구조, 검토, 통제된 초안 작성이 중요한 RFP, 제안서, 계획서,
            그리고 거버넌스가 적용된 비즈니스 문서를 위해 설계되었습니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={reduce ? 0 : i * 0.06}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
