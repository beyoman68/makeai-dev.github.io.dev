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
            관찰 가능하고 근거 있는 답변
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            하이브리드 검색에 인용과 신뢰도 신호를 결합하여, 내부 지식베이스부터
            대규모 문서 라이브러리까지 규제가 엄격하고 중요도가 높은 환경에서도
            팀이 결과를 신뢰할 수 있습니다.
          </p>
        </section>

        <section className="mt-16 border-t border-border pt-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            당신의 데이터로 AI를 근거 있게 만들 준비가 되셨나요?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            검색, 평가, 가드레일을 연결하여 답변이 일반적인 모델 문장이 아닌
            근거에 기반하도록 돕습니다.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-8">
            <a href={`mailto:${CONTACT_MAIL}`}>문의하기</a>
          </Button>
        </section>

        <BackToHome className="mt-14" />
      </div>
    </main>
  )
}
