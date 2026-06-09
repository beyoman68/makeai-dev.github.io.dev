import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { BackToHome } from "@/components/back-to-home"
import { DocuGeneratorFeatureCards } from "@/components/docu-generator/docu-generator-feature-cards"
import { DocuGeneratorHero } from "@/components/docu-generator/docu-generator-hero"
import { DocuGeneratorWorkflowSteps } from "@/components/docu-generator/docu-generator-workflow-steps"
import { CONTACT_MAIL } from "@/lib/nav-config"

const ease = [0.16, 1, 0.3, 1] as const

/**
 * MZO Document Generator — `/products/docu-generator`
 * @see `.dev/md/20260421_0000_products_mzo_document_generator_planning.md`
 */
export function DocumentGeneratorPage() {
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
      <DocuGeneratorHero />

      <section
        id="docu-generator-after-hero"
        className="scroll-mt-24 border-t border-border bg-muted/90 text-foreground dark:bg-black dark:text-white"
      >
        <DocuGeneratorWorkflowSteps />
        <DocuGeneratorFeatureCards />
      </section>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
        <motion.section
          className="rounded-xl border border-border bg-muted/30 p-8 sm:p-10"
          {...inView}
        >
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Preview the workflow. Keep production inside your controls.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            This preview demonstrates the drafting experience only. In production, MZO Document
            Generator can operate within your identity, retention, and approval model so structured
            drafts follow the controls your organization already uses.
          </p>
        </motion.section>

        <motion.section className="mt-16 border-t border-border pt-16 text-center" {...inView}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Maximize document workflow efficiency with MZO Document Generator
          </h2>
          <Button asChild size="lg" className="mt-8 rounded-full px-8">
            <a href={`mailto:${CONTACT_MAIL}`}>Contact us</a>
          </Button>
        </motion.section>

        <BackToHome className="mt-14" />
      </div>
    </main>
  )
}
