import { motion, useReducedMotion } from "motion/react"

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Hero — workspace-first positioning, MZO Chat Platform H1 (same motion rhythm as RAG / Data product pages).
 */
export function ChatPlatformHero() {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <section className="w-full border-b border-border px-4 pb-14 pt-8 text-center sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.06, ease }}
          className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase"
        >
          워크스페이스 기반 AI
        </motion.p>

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
          Chat Platform
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
          지침, 공유 파일, 대화를 하나의 워크스페이스로 모으세요. 개인, 팀, 조직
          범위 전반에서 답변은 고립된 프롬프트가 아니라 관련 컨텍스트와 워크스페이스
          지식과 함께 스트리밍됩니다.
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
