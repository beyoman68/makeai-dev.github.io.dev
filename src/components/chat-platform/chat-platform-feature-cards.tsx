import { motion, useReducedMotion } from "motion/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ease = [0.16, 1, 0.3, 1] as const

const CARDS = [
  {
    title: "Workspace-scoped context",
    body: "Keep instructions, shared files, and conversations together so every reply starts from the right working context—not a blank thread.",
  },
  {
    title: "Grounded answers from shared knowledge",
    body: "Stream answers tied to workspace files and retrieved context, so responses stay traceable and useful for real team workflows.",
  },
  {
    title: "A unified surface for team AI work",
    body: "Move from workspace navigation to active conversation, shared resources, and follow-up in one continuous experience.",
  },
] as const

export function ChatPlatformFeatureCards() {
  const reduce = useReducedMotion() ?? false

  const inView = {
    initial: reduce ? false : ({ opacity: 0, y: 16 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduce ? 0 : 0.55, ease },
  } as const

  return (
    <section aria-labelledby="chat-platform-value-heading" className="border-t border-border pt-16">
      <h2
        id="chat-platform-value-heading"
        className="text-2xl font-semibold tracking-tight text-foreground"
      >
        Built for knowledge work that stays organized
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
        MZO Chat Platform brings workspace instructions, shared files, and streaming,
        source-aware answers into one operating surface—so teams keep context where the
        work lives.
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
