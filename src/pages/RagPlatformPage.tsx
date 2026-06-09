import { Button } from "@/components/ui/button"
import { BackToHome } from "@/components/back-to-home"
import { RagPlatformChatDemo } from "@/components/rag-platform/rag-platform-chat-demo"
import { RagPlatformFeatureCards } from "@/components/rag-platform/rag-platform-feature-cards"
import { RagPlatformHero } from "@/components/rag-platform/rag-platform-hero"
import { CONTACT_MAIL } from "@/lib/nav-config"

/**
 * MZO RAG Platform — `/products/rag-platform`
 * @see `.dev/md/20260420_1220_mzo_rag_platform_development_planning.md`
 */
export function RagPlatformPage() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <RagPlatformHero />

      <section className="w-full border-b border-border bg-muted/30">
        <RagPlatformChatDemo />
      </section>

      <RagPlatformFeatureCards />

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-border bg-muted/30 p-8 sm:p-10">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Observable, grounded answers
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Pair hybrid retrieval with citations and confidence signals so teams
            can trust outputs in regulated and high-stakes environments — from
            internal knowledge bases to large document libraries.
          </p>
        </section>

        <section className="mt-16 border-t border-border pt-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Ready to ground your AI on your data?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            We help you wire retrieval, evaluation, and guardrails so answers
            stay tied to evidence — not generic model prose.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-8">
            <a href={`mailto:${CONTACT_MAIL}`}>Contact us</a>
          </Button>
        </section>

        <BackToHome className="mt-14" />
      </div>
    </main>
  )
}
