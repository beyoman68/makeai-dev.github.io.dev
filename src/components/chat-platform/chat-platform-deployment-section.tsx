import { motion, useReducedMotion } from "motion/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ease = [0.16, 1, 0.3, 1] as const

const CARDS = [
  {
    title: "유연한 배포",
    body: "관리형 도입, 프라이빗 인프라, 또는 보다 통제된 엔터프라이즈 구성 등 보안 및 운영 모델에 맞는 형태를 선택하세요. 고정된 소비자형 구성이 아니라 여러분의 거버넌스 검토에 맞춰집니다.",
  },
  {
    title: "여러분의 워크플로에 맞춘 구성",
    body: "획일적인 채팅 UI가 아니라 운영 방식에 맞춰 팀 워크스페이스, 공유 컨텍스트, 접근 패턴을 구성하세요. 보다 광범위한 정책과 조직 설정은 프로그램이 정의한 관리자 흐름과 배포 선택에 따라 진행할 수 있습니다.",
  },
  {
    title: "반복적인 Q&A 사이클 감소",
    body: "팀에 근거 있고 출처를 인식하는 답변을 위한 워크스페이스 화면을 제공하여, 반복되는 정책·프로세스·참조 질문이 공유 컨텍스트를 통해 처리되도록 합니다. 지원, 운영, 비즈니스 대면 팀의 수동적인 반복 응대가 줄어듭니다.",
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
        배포 및 운영 적합성
      </p>
      <h2
        id="chat-platform-deployment-heading"
        className="mt-3 text-2xl font-semibold tracking-tight text-foreground"
      >
        여러분의 환경에 맞추고 — 반복적인 지원 업무를 줄이도록 설계
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
        Chat Platform은 워크스페이스 구조와 공유 지식 흐름부터 ID, 접근 권한, 배포
        선호까지 각 조직의 업무 방식에 맞도록 설계되었습니다. 근거 있고 워크스페이스를
        인식하는 답변은 일반적인 소비자형 패턴이 아니라 여러분의 거버넌스 모델과 함께,
        반복되는 내부·외부 Q&A 사이클을 줄이는 데 도움이 됩니다.
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
