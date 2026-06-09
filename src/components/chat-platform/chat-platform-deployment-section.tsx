import { motion, useReducedMotion } from "motion/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ease = [0.16, 1, 0.3, 1] as const

const CARDS = [
  {
    title: "Flexible deployment",
    body: "Choose a posture that fits your security and operational model—managed rollout, private infrastructure, or a more controlled enterprise setup—aligned to your governance review rather than a fixed consumer footprint.",
  },
  {
    title: "Configured for your workflows",
    body: "Shape team workspaces, shared context, and access patterns around how you operate—not a one-size chat UI. Broader policy and organization setup can follow the admin flows and deployment choices your program defines.",
  },
  {
    title: "Fewer repetitive Q&A cycles",
    body: "Give teams a workspace surface for grounded, source-aware answers so recurring policy, process, and reference questions route through shared context—with less manual back-and-forth for support, operations, and business-facing teams.",
  },
] as const

export function ChatPlatformDeploymentSection() {
  const reduce = useReducedMotion() ?? false

  const inView = {
    initial: reduce ? false : ({ opacity: 0, y: 16 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduce ? 0 : 0.55, ease },
  } as const

  return (
    <section
      aria-labelledby="chat-platform-deployment-heading"
      className="mt-16 border-t border-border pt-16"
    >
      <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Deployment and operational fit
      </p>
      <h2
        id="chat-platform-deployment-heading"
        className="mt-3 text-2xl font-semibold tracking-tight text-foreground"
      >
        Adapted to your environment — and built to reduce repetitive support work
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
        MZO Chat Platform is designed to fit how each organization works—from workspace
        structure and shared knowledge flows to identity, access, and deployment preferences.
        Grounded, workspace-aware answers can help teams see fewer cycles of repeated
        internal and external Q&A, alongside your governance model—not a generic consumer
        pattern.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.title}
            {...inView}
            transition={{
              duration: reduce ? 0 : 0.5,
              delay: reduce ? 0 : i * 0.07,
              ease,
            }}
          >
            <Card className="h-full border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{c.body}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
