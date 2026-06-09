import { BrainCircuit, FileSearch, Globe2, Layers, ShieldCheck } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { useHtmlIsDark } from "@/lib/use-html-is-dark"

/**
 * “What Mazelone builds” — five capability cards (parity with `.dev/code/20260421_1111_home` `MazCapabilities`).
 * Light: white / dark ink; dark: original near-black band. No imports from `.dev/code`.
 */

const capabilities = [
  {
    icon: BrainCircuit,
    title: "Multimodal AI Systems",
    description:
      "Systems that understand text, documents, images, audio, and structured data together — built for operational reality, not research demos.",
  },
  {
    icon: FileSearch,
    title: "Retrieval & Knowledge Systems",
    description:
      "Agent-based retrieval pipelines with grounded, source-linked answers across internal knowledge bases, document repositories, and live data.",
  },
  {
    icon: Layers,
    title: "Document Intelligence Pipelines",
    description:
      "End-to-end pipelines for extracting, classifying, summarizing, and generating formal enterprise documents from messy, real-world inputs.",
  },
  {
    icon: Globe2,
    title: "Domain-Specific AI Services",
    description:
      "AI tuned to industry vocabulary, regulatory context, and workflow patterns — not generic models repurposed for enterprise use.",
  },
  {
    icon: ShieldCheck,
    title: "Production-Ready Architectures",
    description:
      "Deployable AI systems designed for governed environments, enterprise integration patterns, controlled rollout, and operational monitoring.",
  },
] as const

export function HomeCapabilities() {
  const reduceMotion = useReducedMotion() ?? false
  const isDark = useHtmlIsDark()

  const sectionBg = isDark ? "#111111" : "#ffffff"
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"
  const overline = isDark ? "rgba(255,255,255,0.25)" : "rgba(24,24,27,0.45)"
  const heading = isDark ? "#f2f2f2" : "#18181b"
  const lead = isDark ? "rgba(255,255,255,0.4)" : "rgba(24,24,27,0.62)"
  const gridOuterBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.1)"
  const gridGutter = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"
  const cardBg = isDark ? "#111" : "#ffffff"
  const cardBgHover = isDark ? "#161616" : "#f4f4f5"
  const iconWrapBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"
  const iconWrapBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)"
  const iconColor = isDark ? "rgba(255,255,255,0.75)" : "rgba(24,24,27,0.72)"
  const indexColor = isDark ? "rgba(255,255,255,0.22)" : "rgba(24,24,27,0.45)"
  const titleColor = isDark ? "#e8e8e8" : "#18181b"
  const bodyColor = isDark ? "rgba(255,255,255,0.38)" : "rgba(24,24,27,0.62)"

  return (
    <section
      id="capabilities"
      style={{
        background: sectionBg,
        padding: "clamp(72px, 12vw, 120px) 32px",
        borderTop: `1px solid ${borderY}`,
        borderBottom: `1px solid ${borderY}`,
      }}
    >
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.65 }}
          viewport={{ once: true, margin: "-80px" }}
          style={{ marginBottom: 72 }}
        >
          <div
            className="uppercase"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: overline,
              marginBottom: 16,
            }}
          >
            What Mazelone builds
          </div>
          <h2
            className="text-balance"
            style={{
              fontSize: "clamp(28px, 4vw, 50px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: heading,
              lineHeight: 1.1,
              marginBottom: 18,
              maxWidth: 640,
            }}
          >
            AI designed for the complexity
            <br />
            of real business operations.
          </h2>
          <p
            className="text-pretty"
            style={{
              fontSize: 17,
              color: lead,
              lineHeight: 1.65,
              maxWidth: 500,
            }}
          >
            We build at the intersection of advanced AI research and practical enterprise execution —
            five capability areas that make the portfolio coherent.
          </p>
        </motion.div>

        <div
          className="overflow-hidden rounded-2xl"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 1,
            background: gridGutter,
            border: `1px solid ${gridOuterBorder}`,
          }}
        >
          {capabilities.map((cap, i) => {
            const Icon = cap.icon
            return (
              <motion.div
                key={cap.title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : i * 0.07 }}
                viewport={{ once: true, margin: "-50px" }}
                className="transition-colors duration-200"
                style={{ background: cardBg, padding: "36px 30px" }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = cardBgHover
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = cardBg
                }}
              >
                <div
                  className="mb-5 flex size-10 items-center justify-center rounded-[10px] border"
                  style={{
                    background: iconWrapBg,
                    borderColor: iconWrapBorder,
                  }}
                >
                  <Icon size={18} color={iconColor} strokeWidth={1.5} aria-hidden />
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: indexColor,
                    letterSpacing: "0.06em",
                    marginBottom: 10,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  className="text-pretty"
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: titleColor,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                    marginBottom: 10,
                  }}
                >
                  {cap.title}
                </h3>
                <p
                  className="text-pretty"
                  style={{
                    fontSize: 13.5,
                    color: bodyColor,
                    lineHeight: 1.7,
                  }}
                >
                  {cap.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
