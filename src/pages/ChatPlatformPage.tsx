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
            웹 클라이언트에서 스트림 엔드포인트까지
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Chat Platform은 화이트보드에 그릴 법한 동일한 구성 요소를 중심으로
            설계되었습니다. 라우팅된 웹 클라이언트, 인증된 API 호출, 그리고 어시스턴트
            출력을 위한 장시간 유지되는 응답입니다. 위의 인터랙티브 데모는 경험
            계층을 보여주며, 아키텍처 검토 시 여러분의 네트워크 및 ID 제약과 함께
            구성할 수 있습니다.
          </p>
        </motion.section>

        <motion.section className="mt-16 border-t border-border pt-16 text-center" {...inView}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            채팅 도입에 대해 이야기할 준비가 되셨나요?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            스트리밍 동작, 배포 모델, 그리고 어시스턴트가 기존 시스템에 어떻게
            연동되는지 함께 살펴볼 수 있습니다.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-8">
            <a href={`mailto:${CONTACT_MAIL}`}>문의하기</a>
          </Button>
        </motion.section>

        <BackToHome className="mt-14" />
      </div>
    </main>
  )
}
