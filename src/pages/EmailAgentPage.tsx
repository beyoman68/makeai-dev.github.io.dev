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
            스레드 컨텍스트에서 거버넌스가 적용된 발송 준비 결과물까지
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            위 화면은 인터랙티브 미리보기입니다. 실제 테넌트에 연결되어 있지 않으며
            메일을 보내거나 받지 않습니다. 운영 환경에서 Email Agent는 메일 및 ID
            스택과 연동되는 Outlook 추가 기능으로 동작합니다. 따라서 근거 있는 요약,
            Q&A, 초안, 번역이 조직이 이미 적용하고 있는 운영 경계 안에 머무릅니다.
          </p>
        </motion.section>

        <motion.section className="mt-16 border-t border-border pt-16 text-center" {...inView}>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            여러분의 Microsoft 스택에 맞춰 Email Agent 도입을 계획하세요
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            도입 범위, 보안 및 ID 정합성, 그리고 받은편지함 네이티브 AI가 기존 메일과
            워크스페이스 투자와 어떻게 어우러지는지 함께 논의해 보세요.
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
