import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackToHome } from "@/components/back-to-home";
import { DataPlatformArchitectureFigure } from "@/components/data-platform-architecture-figure";
import { DataPlatformDemo } from "@/components/data-platform/data-platform-demo";
import { CONTACT_MAIL } from "@/lib/nav-config";

const ease = [0.16, 1, 0.3, 1] as const;

export function DocuAnalyzer() {
  const reduce = useReducedMotion() ?? false;

  const inView = {
    initial: reduce ? false : ({ opacity: 0, y: 18 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: {
      duration: reduce ? 0 : 0.65,
      ease,
    },
  } as const;

  return (
    <main className="flex w-full flex-1 flex-col">
      {/* Hero — fade-up on mount (same rhythm as RAG product hero) */}
      <section
        className="w-full border-b border-border text-left"
        style={{ padding: "clamp(72px, 12vw, 120px) 32px" }}
      >
        <div className="mx-auto max-w-[1200px]">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.55,
              delay: reduce ? 0 : 0.06,
              ease,
            }}
            className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase"
          >
            Document Analyzer
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.85,
              delay: reduce ? 0 : 0.18,
              ease,
            }}
            className="mt-3 text-balance font-bold tracking-tight text-foreground"
            style={{ fontSize: "clamp(40px, 7vw, 5rem)", lineHeight: 1.02 }}
          >
            Document
            <br />
            <span style={{ color: "#00d4aa" }}>Analyzer</span>
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
            무엇이든 파싱하세요. 구조를 추출하세요. 더 빠르게 나아가세요.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.65,
              delay: reduce ? 0 : 0.42,
              ease,
            }}
            className="mt-6 max-w-2xl space-y-4 text-left text-sm leading-7 text-muted-foreground"
          >
            <p>
              Word, Excel, PowerPoint, HWP, HTML, 이미지, PDF 등을 검색, 자동화,
              AI에 활용할 수 있는 구조화된 콘텐츠로 변환합니다 — 모든 파일을
              단순한 이미지처럼 다루지 않습니다.
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
            className="mt-8 flex flex-col items-start justify-start gap-3 sm:flex-row sm:gap-4"
          >
            <Button asChild size="lg" className="rounded-full px-8">
              <a href={`mailto:${CONTACT_MAIL}`}>문의하기</a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-foreground"
            >
              <a href="#supported-formats">지원 형식 보기</a>
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
            데이터 플랫폼 — 처리 아키텍처 다이어그램
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
            OCR을 넘어서도록 설계되었습니다
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            많은 시스템이 모든 파일을 그림처럼 다룹니다. 저희는 그렇지 않습니다.
            Word, PowerPoint, Excel, HWP, HTML 및 유사한 형식의 경우 내부 구조를
            직접 읽습니다. PDF와 이미지가 많은 문서는 필요할 때만 OCR을
            사용합니다 — OCR이 모든 것의 기본값은 아닙니다.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "설계부터 더 빠르게",
                body: "직접 파싱으로 불필요한 OCR 오버헤드를 제거하고 처리 속도를 높입니다.",
              },
              {
                title: "더 정확한 추출",
                body: "네이티브 구조를 통해 텍스트, 표, 레이아웃을 더 안정적으로 보존합니다.",
              },
              {
                title: "실제 AI 시스템을 위한 설계",
                body: "구조화된 출력은 검색 품질, 근거 제공, 후속 자동화를 향상시킵니다.",
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
        <motion.section
          className="mt-16 border-t border-border pt-16"
          {...inView}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            파일에서 활용 가능한 인텔리전스로
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "수집",
                desc: "스토리지, API 또는 엔터프라이즈 시스템에서 문서를 수집합니다",
              },
              {
                step: "파싱",
                desc: "가능한 경우 네이티브 파일 형식을 직접 읽습니다",
              },
              {
                step: "정규화",
                desc: "다양한 형식을 일관된 구조화 스키마로 변환합니다",
              },
              {
                step: "전달",
                desc: "검색, RAG 파이프라인, 분석, 자동화 워크플로를 지원합니다",
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
                <p className="text-sm font-semibold text-foreground">
                  {s.step}
                </p>
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
            기업이 실제로 사용하는 형식을 지원합니다
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            오피스 제품군, 웹, 한글 문서, PDF, 이미지 등 실제 환경에서 접하는
            파일 유형을 포괄합니다. 네이티브 형식은 가능한 경우 직접 파싱하며,
            스캔본과 이미지가 많은 콘텐츠에는 선택적으로 OCR을 적용합니다.
          </p>
          <ul className="mt-8 space-y-3 text-sm leading-7 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">오피스:</span> Word
              (DOC, DOCX), PowerPoint (PPT, PPTX), Excel (XLS, XLSX)
            </li>
            <li>
              <span className="font-medium text-foreground">웹:</span> HTML / 웹
              페이지
            </li>
            <li>
              <span className="font-medium text-foreground">한글:</span> HWP /
              HWPX
            </li>
            <li>
              <span className="font-medium text-foreground">문서:</span> PDF,
              RTF
            </li>
            <li>
              <span className="font-medium text-foreground">이미지:</span> JPEG,
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
            OCR 우선이 아닌 네이티브 파싱
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            파일 구조 수준에서 읽을 수 있는 콘텐츠에는 OCR을 실행하지 않습니다.
            이를 통해 의미를 보존하고, 노이즈를 줄이며, 후속 검색·AI·자동화에
            대한 신뢰도를 높입니다.
          </p>
        </motion.section>

        {/* Use cases */}
        <motion.section
          className="mt-16 border-t border-border pt-16"
          {...inView}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            실제 업무 워크플로를 위한 설계
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "엔터프라이즈 검색",
                body: "정돈되지 않은 문서 라이브러리를 검색 가능하고 일관된 표현으로 변환합니다.",
              },
              {
                title: "RAG 및 AI 시스템",
                body: "더 정확하고 근거 있는 응답을 위해 LLM에 구조화된 컨텍스트를 제공합니다.",
              },
              {
                title: "컴플라이언스 및 감사",
                body: "방대하고 복잡한 문서 집합에서 추적 가능한 정보를 추출합니다.",
              },
              {
                title: "워크플로 자동화",
                body: "비즈니스 프로세스와 연동을 위한 기계 판독 가능한 입력을 생성합니다.",
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
        <motion.section
          className="mt-16 border-t border-border pt-16 text-center"
          {...inView}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            대규모로 문서를 파싱해야 하나요?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            슬라이드 데모가 아닌, 실제 문서 환경을 위해 설계된 플랫폼으로 복잡한
            파일에서 구조화되고 활용 가능한 데이터로 전환하세요.
          </p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reduce ? 0 : 0.5,
              delay: reduce ? 0 : 0.12,
              ease,
            }}
            className="mt-8"
          >
            <Button asChild size="lg" className="rounded-full px-8">
              <a href={`mailto:${CONTACT_MAIL}`}>문의하기</a>
            </Button>
          </motion.div>
        </motion.section>

        <motion.div {...inView}>
          <BackToHome className="mt-14" />
        </motion.div>
      </div>
    </main>
  );
}
