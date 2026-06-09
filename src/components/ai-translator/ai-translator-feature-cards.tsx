import type { ElementType } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Cloud, FileText, Languages, ShieldCheck } from "lucide-react"

const ease = [0.16, 1, 0.3, 1] as const

/** Four value props aligned with hero checklist (reference bundle cards). */
const FEATURES = [
  {
    icon: Languages,
    title: "Chat and document translation in one product",
    body: "Move between conversational turns and file-backed pages without changing tools—one workspace, consistent controls, and support for 50+ languages.",
  },
  {
    icon: Cloud,
    title: "On-device or cloud deployment",
    body: "Choose where models and speech run so sensitive programs can stay air-gapped while others scale on managed cloud.",
  },
  {
    icon: FileText,
    title: "Glossary-aware and summary-ready",
    body: "Keep terminology aligned when glossaries are enabled, and surface document summaries alongside translations for faster review.",
  },
  {
    icon: ShieldCheck,
    title: "Built for enterprise privacy and control",
    body: "Design for identity, retention, and audit expectations so multilingual output follows the same posture as the rest of your stack.",
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
              Platform highlights
            </span>
          </div>
          <h2 className="max-w-xl text-balance text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-tight text-foreground dark:text-white">
            One translator for how teams actually work
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground dark:text-zinc-300">
            Deploy on-device, on-premise, or in the cloud — whatever your environment requires.
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
