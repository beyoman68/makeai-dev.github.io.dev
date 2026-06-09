import { CheckCircle2 } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

const ease = [0.16, 1, 0.3, 1] as const

const BULLETS = [
  "Chat and document translation in one product",
  "50+ languages supported",
  "On-device or cloud deployment",
  "Glossary-aware and summary-ready",
  "Built for enterprise privacy and control",
] as const

/**
 * Product hero — centered rhythm aligned with Chat / RAG / Email product pages.
 * Interactive demo lives in a full-width band below (`AiTranslatorPage`).
 */
export function AiTranslatorHero() {
  const reduce = useReducedMotion() ?? false

  return (
    <section className="w-full border-b border-border px-4 pb-14 pt-8 text-center sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Products
        </p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.85,
            delay: reduce ? 0 : 0.18,
            ease,
          }}
          className="mt-3 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          MZO AI Translator
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.7,
            delay: reduce ? 0 : 0.32,
            ease,
          }}
          className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
        >
          Translate chats, documents, voice, and images in one workspace — with streaming output,
          glossary control, and summary built in.
        </motion.p>

        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.4, ease }}
          className="mx-auto mt-8 max-w-lg space-y-3 text-left text-sm leading-relaxed text-foreground"
        >
          {BULLETS.map((line) => (
            <li key={line} className="flex gap-3">
              <CheckCircle2
                className="mt-0.5 size-5 shrink-0 text-foreground"
                aria-hidden
                strokeWidth={2}
              />
              <span>{line}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.48, ease }}
          className="mt-10 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-[11px] font-medium tracking-tight text-foreground shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
            <span>On-device</span>
            <span className="text-muted-foreground/45" aria-hidden>
              ·
            </span>
            <span>Cloud</span>
            <span className="text-muted-foreground/45" aria-hidden>
              ·
            </span>
            <span>On-premise</span>
          </span>
        </motion.div>

        <motion.div
          initial={reduce ? false : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: reduce ? 0 : 1.1,
            delay: reduce ? 0 : 0.5,
            ease,
          }}
          className="mx-auto mt-10 h-px max-w-md origin-center bg-gradient-to-r from-transparent via-border to-transparent"
        />
      </div>
    </section>
  )
}
