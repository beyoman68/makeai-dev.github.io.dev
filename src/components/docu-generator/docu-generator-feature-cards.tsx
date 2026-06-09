import type { ElementType } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Building2, ClipboardList, Layers, ListTree, PenLine, Zap } from "lucide-react"

const ease = [0.16, 1, 0.3, 1] as const

const FEATURES = [
  {
    icon: Layers,
    title: "Section-by-section generation",
    description:
      "Draft large documents section by section so teams can review, regenerate, and improve specific parts without redoing the whole file.",
  },
  {
    icon: ClipboardList,
    title: "Inputs that shape the document",
    description:
      "Use structured project inputs to guide the outline, language, and scope of the generated document from the start.",
  },
  {
    icon: Zap,
    title: "Live drafting at the subsection level",
    description:
      "See content appear where it belongs, with subsection-level streaming that makes progress visible and reviewable.",
  },
  {
    icon: Building2,
    title: "Purpose-built document structures",
    description:
      "Supports structured formats for RFPs, proposals, planning documents, and other formal enterprise deliverables.",
  },
  {
    icon: ListTree,
    title: "Navigable document hierarchy",
    description:
      "Work through long documents with collapsible sections and subsections that keep the draft organized and easy to scan.",
  },
  {
    icon: PenLine,
    title: "Review and regenerate without restarting",
    description:
      "Refine individual sections, regenerate targeted content, and keep the rest of the draft intact.",
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
              Why teams use MZO Document Generator
            </span>
          </div>
          <h2 className="max-w-xl text-balance text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-tight text-foreground dark:text-white">
            Built for formal documents that need structure and control
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground dark:text-zinc-300">
            Designed for RFPs, proposals, plans, and governed business documents where hierarchy,
            review, and controlled drafting matter.
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
