import { motion, useReducedMotion } from "motion/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ease = [0.16, 1, 0.3, 1] as const

const CARDS = [
  {
    title: "워크스페이스 범위의 컨텍스트",
    body: "지침, 공유 파일, 대화를 함께 유지하여 모든 답변이 빈 스레드가 아닌 올바른 작업 컨텍스트에서 시작되도록 합니다.",
  },
  {
    title: "공유 지식에서 나오는 근거 있는 답변",
    body: "워크스페이스 파일과 검색된 컨텍스트에 연결된 답변을 스트리밍하여, 응답이 추적 가능하고 실제 팀 워크플로에 유용하게 유지됩니다.",
  },
  {
    title: "팀 AI 작업을 위한 통합 화면",
    body: "워크스페이스 탐색에서 활성 대화, 공유 리소스, 후속 작업까지 하나의 연속된 경험으로 이동하세요.",
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
        체계적으로 정리되는 지식 업무를 위해 설계되었습니다
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
        Chat Platform은 워크스페이스 지침, 공유 파일, 그리고 출처를 인식하는 스트리밍
        답변을 하나의 운영 화면으로 모아, 팀이 업무가 이루어지는 곳에 컨텍스트를
        유지할 수 있게 합니다.
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
