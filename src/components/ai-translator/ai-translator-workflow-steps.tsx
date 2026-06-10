import { motion, useReducedMotion } from "motion/react"

const ease = [0.16, 1, 0.3, 1] as const

const STEPS = [
  {
    number: "01",
    title: "언어와 범위 설정",
    description:
      "출발어와 도착어, 선택적 용어집을 고르고, 실시간 채팅을 번역할지 업로드한 문서를 번역할지 선택하세요.",
  },
  {
    number: "02",
    title: "텍스트 전송 또는 콘텐츠 첨부",
    description:
      "메시지를 붙여넣거나, PDF·이미지를 올려 OCR 기반으로 텍스트를 추출하거나, 도입 환경에서 활성화된 경우 음성을 음성 인식으로 처리하세요.",
  },
  {
    number: "03",
    title: "스트리밍 결과 검토",
    description:
      "번역이 워크스페이스에 도착하는 과정을 명확한 진행 신호와 함께 확인하여, 검토자가 일찍 개입할 수 있습니다.",
  },
  {
    number: "04",
    title: "최종 확정 및 전달",
    description:
      "관리자가 정의한 거버넌스 경계를 벗어나지 않고 결과물을 내보내거나 편집하거나 후속 워크플로에 연결하세요.",
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
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-foreground dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          aria-hidden
        >
          <span className="text-[11px] font-semibold">{number}</span>
        </div>
        <div className="mt-2 w-px flex-1 bg-border dark:bg-zinc-800" aria-hidden />
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

export function AiTranslatorWorkflowSteps() {
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
              번역이 동작하는 방식
            </span>
          </div>
          <h2 className="max-w-xl text-balance text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-tight text-foreground dark:text-white">
            입력부터 검토 준비가 된 번역까지
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground dark:text-zinc-300">
            대화형 작업과 문서 작업을 위한 하나의 통제된 흐름으로, 직접 감독할 수 있는
            스트리밍과 보안팀이 매핑할 수 있는 정책을 제공합니다.
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
