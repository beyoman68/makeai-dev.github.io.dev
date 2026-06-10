import { motion, useReducedMotion } from "motion/react"
import { Building2, FileText, Globe, Layers, Shield, Zap } from "lucide-react"

const ease = [0.16, 1, 0.3, 1] as const

/** Mirrors `.dev/code/20260420_1600_mzo_email_agent/src/app/App.tsx` FEATURES + section layout. */
const CAPABILITIES = [
  {
    icon: FileText,
    title: "첨부파일을 인식하는 지능",
    body: "메시지 본문과 업무 첨부파일(PDF, Office 문서, 스프레드시트, 발표 자료)을 한 번에 분석하여, 결과물이 스레드와 파일 전체 맥락을 반영합니다.",
  },
  {
    icon: Zap,
    title: "컨텍스트 전환 없음",
    body: "요약, 근거 있는 Q&A, 답장 초안, 번역이 활성 메일 항목 옆에서 실행됩니다. 추가 기능은 Outlook 안에 머물러 별도의 어시스턴트 콘솔로 복사·붙여넣기할 필요가 없습니다.",
  },
  {
    icon: Globe,
    title: "다국어 번역",
    body: "본문과 첨부파일 기반 콘텐츠를 각 지역에 필요한 언어로 번역하며, 비즈니스 서신에 적합한 어조와 구조를 유지합니다.",
  },
  {
    icon: Shield,
    title: "엔터프라이즈급 보안",
    body: "자체 인프라 또는 프라이빗 클라우드에서 운영하세요. Microsoft 365, 온프레미스 Exchange, 그리고 보안팀이 이미 관리하는 데이터 상주 정책과 정합됩니다.",
  },
  {
    icon: Layers,
    title: "확장 가능한 아키텍처",
    body: "ERP, CRM, 내부 지식 시스템과 연결하세요. 워크플로, 도메인 특화 모델, 그리고 기존 스택이 지원하는 에이전트형 통합으로 확장할 수 있습니다.",
  },
  {
    icon: Building2,
    title: "엔터프라이즈를 위한 설계",
    body: "역할 기반 접근 제어, 감사 로깅, SSO, 컴플라이언스 제어가 대용량 메일에 맞춰 확장되며, 모든 받은편지함이 바쁠 때도 일관된 응답 속도를 제공합니다.",
  },
] as const

export function EmailAgentCapabilities() {
  const reduce = useReducedMotion() ?? false

  return (
    <section
      className="w-full bg-background py-16 text-foreground sm:py-20 lg:py-24 dark:bg-black dark:text-white"
      aria-labelledby="email-agent-capabilities-heading"
    >
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduce ? 0 : 0.65, ease }}
          className="mb-12 sm:mb-14"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-muted-foreground dark:text-white/35">
            Outlook 네이티브 기능
          </p>
          <h2
            id="email-agent-capabilities-heading"
            className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl sm:leading-[1.1] dark:text-white"
          >
            메일과 첨부파일에 대한 근거 있는 지능을,
            <br />
            <span className="text-muted-foreground dark:text-white/40">
              여러분이 표준으로 사용하는 Outlook 경험 안에서 제공합니다.
            </span>
          </h2>
        </motion.div>

        <div className="overflow-hidden rounded-[14px] border border-border bg-background dark:border-white/[0.06] dark:bg-white/[0.06]">
          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3 dark:bg-white/[0.06]">
            {CAPABILITIES.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: reduce ? 0 : 0.5,
                    delay: reduce ? 0 : i * 0.06,
                    ease,
                  }}
                  className="flex flex-col gap-3.5 bg-background px-7 py-8 dark:bg-[#0c0c0c]"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 dark:border-white/[0.08] dark:bg-white/[0.05]">
                    <Icon className="size-4 text-foreground dark:text-white/60" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-[14.5px] font-medium tracking-tight text-foreground dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground dark:text-white/45">
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
