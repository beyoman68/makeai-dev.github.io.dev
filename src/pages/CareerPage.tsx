import { motion, useReducedMotion } from "motion/react"

import { BackToHome } from "@/components/back-to-home"
import { CONTACT_MAIL } from "@/lib/nav-config"

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Career — `/company/career` (not an anchor on `/company/about`).
 * Hero: centered (OpenAI-style band); body copy from `.dev/txt/20260417_1443.txt` + apply-by-email.
 */
export function CareerPage() {
  const reduce = useReducedMotion() ?? false

  const inView = {
    initial: reduce ? false : ({ opacity: 0, y: 18 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduce ? 0 : 0.65, ease },
  } as const

  return (
    <main className="flex w-full flex-1 flex-col">
      <section
        aria-labelledby="career-hero-heading"
        className="w-full border-b border-border px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-20 sm:pt-12 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.06, ease }}
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            Careers
          </motion.p>
          <motion.h1
            id="career-hero-heading"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.85,
              delay: reduce ? 0 : 0.18,
              ease,
            }}
            className="mt-3 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Join our team
          </motion.h1>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <motion.section className="pt-4 sm:pt-6" {...inView}>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Build AI that works in the real world
          </h2>
          <div className="mt-3 space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              We turn advanced AI into practical systems that solve real problems.
            </p>
            <p>
              Our work goes beyond demos and experiments to create technology
              people can actually use.
            </p>
          </div>
        </motion.section>

        <motion.section className="mt-10 border-t border-border pt-10" {...inView}>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Work with depth, move with speed
          </h2>
          <div className="mt-3 space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              We value technical rigor, clear thinking, and fast execution.
            </p>
            <p>
              As a team, we move across research, engineering, and real deployment
              with strong ownership.
            </p>
          </div>
        </motion.section>

        <motion.section className="mt-10 border-t border-border pt-10" {...inView}>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Join our pursuit of practical impact
          </h2>
          <div className="mt-3 space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              We are looking for people who care not only about innovation, but
              also about usefulness, clarity, and execution.
            </p>
            <p>
              Together, we build AI that creates lasting value in the real world.
            </p>
          </div>
        </motion.section>

        <motion.section className="mt-12 border-t border-border pt-10" {...inView}>
          <p className="text-sm leading-7 text-muted-foreground">
            If you would like to apply, please send your resume to{" "}
            <a
              href={`mailto:${CONTACT_MAIL}`}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {CONTACT_MAIL}
            </a>
            .
          </p>
        </motion.section>

        <motion.div {...inView}>
          <BackToHome />
        </motion.div>
      </div>
    </main>
  )
}
