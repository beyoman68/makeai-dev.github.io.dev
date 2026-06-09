import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { BackToHome } from "@/components/back-to-home"
import { EmailAgentCapabilities } from "@/components/email-agent/email-agent-capabilities"
import { EmailAgentHero } from "@/components/email-agent/email-agent-hero"
import { EmailAgentInboxDemo } from "@/components/email-agent/email-agent-inbox-demo"
import { CONTACT_MAIL } from "@/lib/nav-config"

const ease = [0.16, 1, 0.3, 1] as const

/**
 * MZO Email Agent — `/products/email-agent`
 * @see `.dev/md/20260420_1601_mzo-email-agent-planning.md`
 */
export function EmailAgentPage() {
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
      <EmailAgentHero />

      <section className="w-full border-b border-border bg-muted/30">
        <EmailAgentInboxDemo />
      </section>

      <EmailAgentCapabilities />

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
        <motion.section
          className="rounded-xl border border-border bg-muted/30 p-8 sm:p-10"
          {...inView}
        >
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            From thread context to governed, send-ready output
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            The view above is an interactive preview: it is not connected to your tenant and
            does not send or receive mail. In production, MZO Email Agent runs as an Outlook
            add-in against your mail and identity stack—so grounded summaries, Q&A, drafts,
            and translations stay inside the operational boundaries your organization
            already enforces.
          </p>
        </motion.section>

        <motion.section className="mt-16 border-t border-border pt-16 text-center" {...inView}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Plan MZO Email Agent for your Microsoft stack
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Talk with us about rollout scope, security and identity alignment, and how
            inbox-native AI fits next to your existing mail and workspace investments.
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
