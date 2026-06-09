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
    badge: "검색",
    title: "하이브리드 시맨틱 검색",
    description:
      "코퍼스 전반에 걸친 렉시컬·덴스 검색을 결합하고 관련성에 따라 순위를 매깁니다. 질의에서 근거까지 저지연 경로를 위해 설계되었습니다.",
    detail: "BM25 · 덴스 임베딩 · 재순위화",
  },
  {
    icon: ShieldCheck,
    badge: "근거",
    title: "근거 연결형 답변",
    description:
      "답변은 직접 확인할 수 있는 구절에 기반합니다. 인용, 발췌, 출처가 로그에 묻히지 않고 답변과 함께 표시됩니다.",
    detail: "인용 연결 · 구절 출처 표기 · 신뢰도 신호",
  },
  {
    icon: Images,
    badge: "비주얼 검색",
    title: "세밀한 비주얼 검색",
    description:
      "레이트 인터랙션 검색은 질의와 문서 표현을 더 세밀한 수준에서 매칭하여 도면, 표, 그림, 레이아웃 등 시각적으로 밀도 높은 콘텐츠의 검색 성능을 향상시킵니다.",
    detail: "레이트 인터랙션 · MaxSim 매칭 · 멀티 벡터 검색",
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
          에이전트 오케스트레이션
        </p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          검색, 도구, 근거 기반 생성을 위해 설계되었습니다.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          질의 이해와 하이브리드 검색부터 도구 사용, 컨텍스트 구성, 스트리밍
          답변까지, 각 계층은 엔터프라이즈 데이터를 근거 있는 답변으로 전환하도록
          설계되었습니다.
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
