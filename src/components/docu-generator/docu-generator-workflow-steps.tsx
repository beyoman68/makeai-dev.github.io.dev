import { motion, useReducedMotion } from "motion/react"

const ease = [0.16, 1, 0.3, 1] as const

const STEPS = [
  {
    number: "01",
    title: "문서 범위 정의",
    description:
      "프로젝트 제목, 문서 유형, 조달 모델, 예산, 일정을 구조화된 입력으로 수집하여 초안의 형태를 결정합니다.",
  },
  {
    number: "02",
    title: "문서 개요 구성",
    description:
      "입력값을 문서별 개요로 변환합니다. 최상위 섹션은 선택한 비즈니스 문서 형식에 맞춰 정렬됩니다.",
  },
  {
    number: "03",
    title: "섹션별 콘텐츠 초안 작성",
    description:
      "한 섹션씩 생성하거나 전체 문서를 초안 작성할 수 있습니다. 하위 섹션 콘텐츠가 워크스페이스에 바로 스트리밍되어 즉시 검토할 수 있습니다.",
  },
  {
    number: "04",
    title: "검토, 수정, 최종 확정",
    description:
      "어떤 섹션이든 열어 초안을 수정하고, 특정 부분만 재생성하며, 전체 워크플로를 다시 시작하지 않고 문서를 확정할 수 있습니다.",
  },
] as const

function StepCard({
  number,
  title,
  description,
  delay,
  reduce,
}: {
  number: string
  title: string
  description: string
  delay: number
  reduce: boolean
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="flex gap-4"
    >
      <div className="flex shrink-0 flex-col items-center">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-foreground dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200"
          aria-hidden
        >
          <span className="text-[11px] font-semibold">{number}</span>
        </div>
        <div className="mt-2 w-px flex-1 bg-border dark:bg-zinc-600" aria-hidden />
      </div>
      <div className="pb-8">
        <h3 className="mb-1.5 text-[14.5px] font-medium tracking-tight text-foreground dark:text-white">
          {title}
        </h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground dark:text-zinc-300">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

export function DocuGeneratorWorkflowSteps() {
  const reduce = useReducedMotion() ?? false

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduce ? 0 : 0.5, ease }}
          className="mb-12 sm:mb-16"
        >
          <div className="mb-4 inline-flex max-w-full items-center rounded-full border border-border bg-card px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.06]">
            <span className="text-left text-[11px] font-medium uppercase leading-snug tracking-[0.04em] text-muted-foreground dark:text-zinc-300">
              초안 작성 워크플로 동작 방식
            </span>
          </div>
          <h2 className="max-w-xl text-balance text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-tight text-foreground dark:text-white">
            구조화된 입력에서 검토 가능한 비즈니스 문서까지
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground dark:text-zinc-300">
            공식 비즈니스 문서를 위한 통제된 초안 작성 흐름으로, 명확한 구조,
            섹션 단위 생성, 그리고 모든 단계에서의 검토를 제공합니다.
          </p>
        </motion.div>

        <div className="max-w-lg">
          {STEPS.map((step, i) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={reduce ? 0 : i * 0.08}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
