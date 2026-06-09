import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { BackToHome } from "@/components/back-to-home"
import { ChatPlatformDeploymentSection } from "@/components/chat-platform/chat-platform-deployment-section"
import { ChatPlatformFeatureCards } from "@/components/chat-platform/chat-platform-feature-cards"
import { ChatPlatformHero } from "@/components/chat-platform/chat-platform-hero"
import { ChatPlatformStreamDemo } from "@/components/chat-platform/chat-platform-stream-demo"
import { CONTACT_MAIL } from "@/lib/nav-config"

const ease = [0.16, 1, 0.3, 1] as const

/**
 * MZO Chat Platform — `/products/chat-platform`
 * @see `.dev/md/20260420_1610_products-chat-platform-planning.md`
 */
export function ChatPlatformPage() {
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
      <ChatPlatformHero />

      <section className="w-full border-b border-border bg-muted/30">
        <ChatPlatformStreamDemo />
      </section>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
        <ChatPlatformFeatureCards />

        <ChatPlatformDeploymentSection />

        <motion.section
          className="mt-16 rounded-xl border border-border bg-muted/30 p-8 sm:p-10"
          {...inView}
        >
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            From web client to stream endpoint
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            MZO Chat Platform is designed around the same building blocks you would draw on a
            whiteboard: a routed web client, authenticated API calls, and a long-lived response
            for assistant output. The interactive demo above illustrates the experience layer;
            your architecture review can pair it with your own network and identity constraints.
          </p>
        </motion.section>

        <motion.section className="mt-16 border-t border-border pt-16 text-center" {...inView}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Ready to talk about your chat rollout?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            We can walk through streaming behavior, deployment models, and how assistants plug
            into your existing systems.
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
