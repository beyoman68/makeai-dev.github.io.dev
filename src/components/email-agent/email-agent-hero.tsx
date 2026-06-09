import { motion, useReducedMotion } from "motion/react"

const ease = [0.16, 1, 0.3, 1] as const

/**
 * MZO Email Agent — hero (eyebrow **Products** like `RagPlatformHero`; motion rhythm like Chat / RAG).
 */
export function EmailAgentHero() {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <section className="w-full border-b border-border px-4 pb-14 pt-8 text-center sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Products
        </p>

        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.85,
            delay: reduceMotion ? 0 : 0.18,
            ease,
          }}
          className="mt-3 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          MZO Email Agent
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            delay: reduceMotion ? 0 : 0.32,
            ease,
          }}
          className="mt-4 text-pretty text-lg text-muted-foreground sm:text-xl"
        >
          Bring attachment-aware summaries, grounded Q&A, reply drafts, and translation into
          Outlook—so teams stay in the same thread, identity boundary, and policy posture
          they run on today.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 1.1,
            delay: reduceMotion ? 0 : 0.5,
            ease,
          }}
          className="mx-auto mt-10 h-px max-w-md origin-center bg-gradient-to-r from-transparent via-border to-transparent"
        />
      </div>
    </section>
  )
}
