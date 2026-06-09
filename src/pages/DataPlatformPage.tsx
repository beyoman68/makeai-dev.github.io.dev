import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackToHome } from "@/components/back-to-home"
import { DataPlatformArchitectureFigure } from "@/components/data-platform-architecture-figure"
import { DataPlatformDemo } from "@/components/data-platform/data-platform-demo"
import { CONTACT_MAIL } from "@/lib/nav-config"

const ease = [0.16, 1, 0.3, 1] as const

/**
 * MZO Data Platform — `/products/data-platform`
 * @see `.dev/md/20260421_1416_products-data-platform-planning.md`
 */
export function DataPlatformPage() {
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
      {/* Hero — fade-up on mount (same rhythm as RAG product hero) */}
      <section className="w-full border-b border-border px-4 pb-14 pt-8 text-center sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.06, ease }}
            className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase"
          >
            Products
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.85,
              delay: reduce ? 0 : 0.18,
              ease,
            }}
            className="mt-3 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            MZO Data Platform
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.7,
              delay: reduce ? 0 : 0.32,
              ease,
            }}
            className="mt-4 text-pretty text-lg text-muted-foreground sm:text-xl"
          >
            Parse anything. Extract structure. Move faster.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.65,
              delay: reduce ? 0 : 0.42,
              ease,
            }}
            className="mx-auto mt-6 max-w-2xl space-y-4 text-left text-sm leading-7 text-muted-foreground sm:text-center"
          >
            <p>
              Turn Word, Excel, PowerPoint, HWP, HTML, images, PDFs, and more
              into structured content you can use for search, automation, and AI
              — without treating every file like a flat image.
            </p>
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.6,
              delay: reduce ? 0 : 0.52,
              ease,
            }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Button asChild size="lg" className="rounded-full px-8">
              <a href={`mailto:${CONTACT_MAIL}`}>Contact us</a>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-foreground">
              <a href="#supported-formats">See supported formats</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main figure */}
      <motion.section
        aria-labelledby="parse-anything-heading"
        className="w-full border-b border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8"
        {...inView}
      >
        <div className="mx-auto max-w-6xl">
          <h2 id="parse-anything-heading" className="sr-only">
            MZO Data Platform — processing architecture diagram
          </h2>
          <figure className="mt-8 overflow-hidden rounded-lg border border-border shadow-sm">
            <DataPlatformArchitectureFigure />
          </figure>
        </div>
      </motion.section>

      <section className="w-full border-b border-border bg-muted/30">
        <DataPlatformDemo />
      </section>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
        {/* Differentiators */}
        <motion.section aria-labelledby="beyond-ocr-heading" {...inView}>
          <h2
            id="beyond-ocr-heading"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            Built to go beyond OCR
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            Many systems treat every file like a picture. We don&apos;t. For
            Word, PowerPoint, Excel, HWP, HTML, and similar formats, we read
            internal structure directly. PDFs and image-heavy documents use OCR
            only when needed — OCR is not the default for everything.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Faster by design",
                body: "Direct parsing removes unnecessary OCR overhead and speeds up processing.",
              },
              {
                title: "More accurate extraction",
                body: "Native structure preserves text, tables, and layout more reliably.",
              },
              {
                title: "Built for real AI systems",
                body: "Structured output improves search quality, grounding, and downstream automation.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: reduce ? 0 : 0.5,
                  delay: reduce ? 0 : i * 0.08,
                  ease,
                }}
              >
                <Card className="flex h-full flex-col border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {c.body}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How it works */}
        <motion.section className="mt-16 border-t border-border pt-16" {...inView}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            From file to usable intelligence
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "Ingest",
                desc: "Collect documents from storage, APIs, or enterprise systems",
              },
              {
                step: "Parse",
                desc: "Read native file formats directly whenever possible",
              },
              {
                step: "Normalize",
                desc: "Convert diverse formats into a consistent structured schema",
              },
              {
                step: "Deliver",
                desc: "Power search, RAG pipelines, analytics, and automation workflows",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: reduce ? 0 : 0.5,
                  delay: reduce ? 0 : i * 0.07,
                  ease,
                }}
                className="rounded-lg border border-border p-4"
              >
                <p className="text-sm font-semibold text-foreground">{s.step}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Supported formats */}
        <motion.section
          id="supported-formats"
          className="scroll-mt-24 mt-16 border-t border-border pt-16"
          {...inView}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Supports the formats enterprises actually use
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            Cover the file types you see in real environments — office suites,
            web, Korean documents, PDFs, and images. Native formats are parsed
            directly where possible; selective OCR applies to scans and
            image-heavy content.
          </p>
          <ul className="mt-8 space-y-3 text-sm leading-7 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Office:</span> Word
              (DOC, DOCX), PowerPoint (PPT, PPTX), Excel (XLS, XLSX)
            </li>
            <li>
              <span className="font-medium text-foreground">Web:</span> HTML /
              web pages
            </li>
            <li>
              <span className="font-medium text-foreground">Korean:</span> HWP /
              HWPX
            </li>
            <li>
              <span className="font-medium text-foreground">Documents:</span>{" "}
              PDF, RTF
            </li>
            <li>
              <span className="font-medium text-foreground">Images:</span> JPEG,
              PNG
            </li>
          </ul>
        </motion.section>

        {/* Quote block */}
        <motion.section
          className="mt-16 rounded-xl border border-border bg-muted/30 p-8 sm:p-10"
          {...inView}
        >
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Native parsing, not OCR-first
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            We avoid running OCR on content that can be read at the file
            structure level. That preserves meaning, reduces noise, and improves
            trust for search, AI, and automation downstream.
          </p>
        </motion.section>

        {/* Use cases */}
        <motion.section className="mt-16 border-t border-border pt-16" {...inView}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Designed for real-world workflows
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Enterprise Search",
                body: "Turn messy document libraries into searchable, consistent representations.",
              },
              {
                title: "RAG & AI Systems",
                body: "Feed LLMs structured context for more accurate, grounded responses.",
              },
              {
                title: "Compliance & Audit",
                body: "Extract traceable information from large, complex document sets.",
              },
              {
                title: "Workflow Automation",
                body: "Produce machine-readable inputs for business processes and integrations.",
              },
            ].map((u, i) => (
              <motion.div
                key={u.title}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: reduce ? 0 : 0.5,
                  delay: reduce ? 0 : i * 0.07,
                  ease,
                }}
              >
                <Card className="h-full border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">{u.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {u.body}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Closing CTA */}
        <motion.section className="mt-16 border-t border-border pt-16 text-center" {...inView}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Need to parse documents at scale?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Move from complex files to structured, usable data with a platform
            built for real document environments — not slide-deck demos.
          </p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.12, ease }}
            className="mt-8"
          >
            <Button asChild size="lg" className="rounded-full px-8">
              <a href={`mailto:${CONTACT_MAIL}`}>Contact us</a>
            </Button>
          </motion.div>
        </motion.section>

        <motion.div {...inView}>
          <BackToHome className="mt-14" />
        </motion.div>
      </div>
    </main>
  )
}
