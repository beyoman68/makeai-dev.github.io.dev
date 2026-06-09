import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Database, Images, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

const features = [
  {
    icon: Database,
    badge: "Retrieval",
    title: "Hybrid semantic search",
    description:
      "Lexical and dense retrieval across your corpus, fused and ranked for relevance. Built for low-latency paths from query to evidence.",
    detail: "BM25 · dense embeddings · re-ranking",
  },
  {
    icon: ShieldCheck,
    badge: "Grounding",
    title: "Evidence-linked answers",
    description:
      "Responses anchor to passages you can inspect: citations, snippets, and provenance surfaced with the answer — not buried in logs.",
    detail: "Citation linking · passage attribution · confidence signals",
  },
  {
    icon: Images,
    badge: "Visual Retrieval",
    title: "Fine-Grained Visual Retrieval",
    description:
      "Late-interaction retrieval matches query and document representations at a finer level, improving retrieval for drawings, tables, figures, layouts, and other visually dense content.",
    detail: "Late interaction · MaxSim matching · multi-vector retrieval",
  },
] as const

export function RagPlatformFeatureCards() {
  const [hovered, setHovered] = useState<number | null>(null)
  const reduceMotion = useReducedMotion() ?? false

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduceMotion ? 0 : 0.7 }}
        className="mb-12 text-center"
      >
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Agent orchestration
        </p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Built for retrieval, tools, and grounded generation.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          From query understanding and hybrid retrieval to tool use, context
          assembly, and streaming answers, each layer is designed to turn
          enterprise data into grounded responses.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => {
          const Icon = feature.icon
          const isHovered = hovered === i
          return (
            <motion.div
              key={feature.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduceMotion ? 0 : 0.6,
                delay: reduceMotion ? 0 : i * 0.1,
                ease,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <Card
                className={cn(
                  "h-full border-border shadow-sm transition-colors",
                  isHovered && "border-primary/25 bg-muted/20",
                )}
              >
                <CardHeader className="space-y-4">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted/40">
                    <Icon className="size-5 text-foreground" aria-hidden />
                  </div>
                  <Badge variant="outline" className="w-fit text-[10px] tracking-wide uppercase">
                    {feature.badge}
                  </Badge>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="border-t border-border pt-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {feature.detail}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
