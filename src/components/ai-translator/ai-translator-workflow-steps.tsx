import { motion, useReducedMotion } from "motion/react"

const ease = [0.16, 1, 0.3, 1] as const

const STEPS = [
  {
    number: "01",
    title: "Set languages and scope",
    description:
      "Pick source and target languages, optional glossary, and whether you are translating live chat or an uploaded document.",
  },
  {
    number: "02",
    title: "Send text or attach content",
    description:
      "Paste a message, drop a PDF or image for OCR-backed extraction, or route audio through speech-to-text when your rollout enables it.",
  },
  {
    number: "03",
    title: "Review streamed output",
    description:
      "Watch translation arrive in the workspace with clear progress signals so reviewers can intervene early.",
  },
  {
    number: "04",
    title: "Finalize and hand off",
    description:
      "Export, edit, or connect the result to downstream workflows without leaving the governed boundary your administrators define.",
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
              How translation runs in MZO
            </span>
          </div>
          <h2 className="max-w-xl text-balance text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-tight text-foreground dark:text-white">
            From input to review-ready translation
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground dark:text-zinc-300">
            One controlled flow for conversational and document workloads, with streaming you can
            supervise and policies your security team can map to.
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
