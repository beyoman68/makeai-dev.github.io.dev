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
            워크플로를 미리보고, 운영은 여러분의 통제 안에서 유지하세요.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            이 미리보기는 초안 작성 경험만 보여줍니다. 운영 환경에서 Document Generator는
            ID, 보존, 승인 모델 안에서 동작하여 구조화된 초안이 조직이 이미 사용하는
            통제 체계를 따르도록 할 수 있습니다.
          </p>
        </motion.section>

        <motion.section className="mt-16 border-t border-border pt-16 text-center" {...inView}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Document Generator로 문서 워크플로 효율을 극대화하세요
          </h2>
          <Button asChild size="lg" className="mt-8 rounded-full px-8">
            <a href={`mailto:${CONTACT_MAIL}`}>문의하기</a>
          </Button>
        </motion.section>

        <BackToHome className="mt-14" />
      </div>
    </main>
  )
}
