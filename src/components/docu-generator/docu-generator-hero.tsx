import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { DocuGeneratorWorkflowDemo } from "@/components/docu-generator/docu-generator-workflow-demo"
import { CONTACT_MAIL } from "@/lib/nav-config"

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Hero — product column and live workflow preview (no separate demo headline; see Data Platform).
 */
export function DocuGeneratorHero() {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <section className="relative w-full overflow-hidden border-b border-zinc-300 bg-zinc-100 text-zinc-950 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45] dark:opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,transparent_0%,rgba(244,244,245,0.85)_60%,rgb(244,244,245)_100%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,transparent_0%,rgba(9,9,11,0.5)_60%,rgb(9,9,11)_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
          <div className="w-full max-w-[520px] flex-1 text-center lg:text-left">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">
              Products
            </p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.12, ease }}
            >
              <h1 className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-zinc-950 dark:text-zinc-50">
                MZO
              </h1>
              <h1 className="mb-6 text-[clamp(2.25rem,4.5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-zinc-700 dark:text-zinc-200">
                Document Generator
              </h1>
            </motion.div>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.24, ease }}
              className="mx-auto mb-8 max-w-md text-pretty text-[clamp(0.9375rem,1.5vw,1.0625rem)] leading-relaxed text-zinc-800 dark:text-zinc-300"
            >
              A structured drafting workspace for formal business documents: outline-first assembly,
              section ownership, and review-ready output your program office can govern—not
              open-ended content generation.
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.36, ease }}
              className="flex justify-center lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800 dark:border-0 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                <a href={`mailto:${CONTACT_MAIL}`} className="inline-flex items-center gap-2">
                  Contact us
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </Button>
            </motion.div>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.5, ease }}
              className="mt-6 text-center text-[11.5px] text-zinc-600 dark:text-zinc-400 lg:text-left"
            >
              Built for procurement, proposals, and governed documentation programs.
            </motion.p>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.8,
              delay: reduceMotion ? 0 : 0.2,
              ease: "easeOut",
            }}
            className="flex w-full flex-1 justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[560px]">
              <div
                className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,0,0,0.05),transparent_70%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]"
                aria-hidden
              />
              <DocuGeneratorWorkflowDemo />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
