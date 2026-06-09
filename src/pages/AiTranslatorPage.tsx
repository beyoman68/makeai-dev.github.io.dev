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
            Translate across text, voice, image, and document workflows.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            MZO AI Translator helps organizations communicate faster and more accurately across real
            operational environments, from field conversations to multilingual documents, while
            fitting naturally into enterprise systems.
          </p>
        </motion.section>

        <motion.section className="mt-16 border-t border-border pt-16 text-center" {...inView}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Plan MZO AI Translator for your multilingual programs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            We can walk through chat versus document flows, glossary strategy, and how translation
            sits alongside MZO Chat Platform, MZO RAG Platform, and MZO Email Agent in your stack.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-8">
            <a href={`mailto:${CONTACT_MAIL}`}>Contact us</a>
          </Button>
        </motion.section>

        <BackToHome className="mt-14" />
      </div>
    </main>
  )
}
