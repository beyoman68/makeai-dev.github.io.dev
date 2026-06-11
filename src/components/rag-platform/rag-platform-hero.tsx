import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Hero — same pattern as `DataPlatformPage`: eyebrow **Products**, H1 **MZO RAG Platform**, lead paragraph.
 */
export function RagPlatformHero() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section className="w-full border-b border-border px-4 pb-14 pt-8 text-center sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.9,
            delay: reduceMotion ? 0 : 0.28,
            ease,
          }}
          className="mt-3 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          RAG Platform
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            delay: reduceMotion ? 0 : 0.42,
          }}
          className="mt-4 text-pretty text-lg text-muted-foreground sm:text-xl"
        >
          언어 모델을 여러분의 지식에 연결합니다 — 다양한 소스를 검색하고,
          근거를 마련하며, 추론하고, 프로덕션에 적합한 제어 기능을 제공합니다.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 1.2,
            delay: reduceMotion ? 0 : 0.58,
            ease,
          }}
          className="mx-auto mt-10 h-px max-w-md origin-center bg-gradient-to-r from-transparent via-border to-transparent"
        />
      </div>
    </section>
  );
}
