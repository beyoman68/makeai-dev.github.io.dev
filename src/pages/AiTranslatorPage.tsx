import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { BackToHome } from "@/components/back-to-home"
import { AiTranslatorDemo } from "@/components/ai-translator/ai-translator-demo"
import { AiTranslatorFeatureCards } from "@/components/ai-translator/ai-translator-feature-cards"
import { AiTranslatorHero } from "@/components/ai-translator/ai-translator-hero"
import { AiTranslatorWorkflowSteps } from "@/components/ai-translator/ai-translator-workflow-steps"
import { CONTACT_MAIL } from "@/lib/nav-config"

const ease = [0.16, 1, 0.3, 1] as const

/**
 * MZO AI Translator — `/products/ai-translator`
 * @see `.dev/md/20260421_120835-mzo-ai-translator-planning.md`
 */
export function AiTranslatorPage() {
  const reduce = useReducedMotion() ?? false

  const inView = {
    initial: reduce ? false : ({ opacity: 0, y: 18 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: {
      duration: reduce ? 0 : 0.65,
      ease,
    },
  } as const

  return (
    <main className="flex w-full flex-1 flex-col">
      <AiTranslatorHero />

      <section className="w-full border-b border-border bg-muted/30">
        <AiTranslatorDemo />
      </section>

      <section
        id="ai-translator-after-demo"
        className="scroll-mt-24 border-t border-border bg-muted/90 text-foreground dark:bg-black dark:text-white"
      >
        <AiTranslatorWorkflowSteps />
        <AiTranslatorFeatureCards />
      </section>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
        <motion.section
          className="rounded-xl border border-border bg-muted/30 p-8 sm:p-10"
          {...inView}
        >
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            텍스트, 음성, 이미지, 문서 워크플로 전반에서 번역하세요.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            AI Translator는 현장 대화부터 다국어 문서까지 실제 운영 환경 전반에서 조직이
            더 빠르고 정확하게 소통하도록 돕는 동시에, 엔터프라이즈 시스템에 자연스럽게
            녹아듭니다.
          </p>
        </motion.section>

        <motion.section className="mt-16 border-t border-border pt-16 text-center" {...inView}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            여러분의 다국어 프로그램에 맞춰 AI Translator 도입을 계획하세요
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            채팅 방식과 문서 방식의 차이, 용어집 전략, 그리고 번역이 여러분의 스택에서
            Chat Platform, RAG Platform, Email Agent와 어떻게 함께 동작하는지 함께
            살펴볼 수 있습니다.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-8">
            <a href={`mailto:${CONTACT_MAIL}`}>문의하기</a>
          </Button>
        </motion.section>

        <BackToHome className="mt-14" />
      </div>
    </main>
  )
}
