import { motion, useReducedMotion } from "motion/react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";
import Dashboard from "@/components/make-money/Dashboard";

/**
 * Solution — Make Money (AI 금융분석 플랫폼) section.
 * 히어로, 핵심 기능, 작동 원리, 실시간 대시보드 미리보기로 구성된다.
 */

const ACCENT = "#00d4aa";

const FEATURES = [
  {
    icon: "🧠",
    title: "5모델 앙상블 예측",
    description:
      "LSTM · Vanilla Transformer · AutoEncoder Transformer · Hybrid Transformer-LSTM · Res Transformer. 5개 모델의 가중 평균으로 20일 후 목표가를 산출합니다.",
    tag: "DEEP LEARNING",
  },
  {
    icon: "📰",
    title: "BERT 뉴스 감성 분석",
    description:
      "Google 뉴스 RSS를 실시간 크롤링하여 TF Hub BERT 모델로 종목별 상승/하락 확률을 계산합니다. 뉴스 흐름이 투자 판단에 반영됩니다.",
    tag: "NLP · BERT",
  },
  {
    icon: "🤖",
    title: "LLM 투자 의사결정",
    description:
      "Gemini / OpenAI GPT-4o가 앙상블 신호·기술지표·거시경제 데이터를 종합하여 매수/매도/홀드를 최종 판단합니다.",
    tag: "GEMINI · GPT-4o",
  },
  {
    icon: "📈",
    title: "KS200 선물 트레이딩",
    description:
      "DMI + Stochastic + FuturesLSTM 3개 신호를 결합하여 LONG/SHORT 방향을 결정합니다. 손절·목표가 자동 설정 및 페이퍼 트레이딩.",
    tag: "FUTURES PAPER TRADING",
  },
  {
    icon: "🔍",
    title: "3단계 종목 스크리닝",
    description:
      "거래량·시가총액(1차) → 5/20/60MA 정배열(2차) → PER·ROE·PBR 재무필터(3차). KOSPI + KOSDAQ 전 종목을 매일 08:45에 자동 선별합니다.",
    tag: "PYKRX · SCREENER",
  },
  {
    icon: "🌐",
    title: "실시간 대시보드",
    description:
      "HTML5 단일 파일 대시보드. 6탭 구성, Chart.js 실시간 차트, 5초/30초 자동 갱신. 브라우저만 있으면 어디서나 접근 가능합니다.",
    tag: "HTML5 · CHART.JS",
  },
] as const;

const PIPELINE_STEPS = [
  {
    num: "01",
    title: "데이터 수집",
    description:
      "pykrx · yfinance · Google 뉴스 RSS 실시간 수집. KOSPI/KOSDAQ 전 종목 OHLCV + 글로벌 지수",
  },
  {
    num: "02",
    title: "AI 분석",
    description:
      "5모델 앙상블 예측 + BERT 뉴스 감성 분석. 종목별 20일 목표가 · 상승 확률 산출",
  },
  {
    num: "03",
    title: "스크리닝",
    description:
      "3단계 필터로 전 종목에서 상위 30개 후보 선별. 재무지표 + 기술적 조건 동시 적용",
  },
  {
    num: "04",
    title: "LLM 판단",
    description:
      "Gemini가 AI 신호 + 거시경제 컨텍스트를 종합. 매수/매도/홀드 및 포지션 크기 결정",
  },
  {
    num: "05",
    title: "주문 실행",
    description:
      "페이퍼 계좌 자동 매매. 리스크 관리 규칙 적용 (손절·비중·일일 손실 한도)",
  },
] as const;

type Palette = {
  sectionBg: string;
  borderY: string;
  heading: string;
  overline: string;
  subtitle: string;
  body: string;
  muted: string;
  badgeBg: string;
  badgeBorder: string;
  secondaryBtnBorder: string;
  secondaryBtnText: string;
  secondaryBtnHover: string;
  tabBg: string;
  tabBorder: string;
  tabText: string;
  tabActiveText: string;
  frameBg: string;
  frameBorder: string;
  codeBg: string;
  cardBg: string;
  cardBorder: string;
  cardTitle: string;
  featTagBg: string;
  featTagText: string;
  pipeNumBg: string;
  pipeNumText: string;
};

function paletteFor(isDark: boolean): Palette {
  if (isDark) {
    return {
      sectionBg: "#0c0c0c",
      borderY: "rgba(255,255,255,0.06)",
      heading: "#f2f2f2",
      overline: "rgba(255,255,255,0.25)",
      subtitle: "rgba(255,255,255,0.7)",
      body: "rgba(255,255,255,0.42)",
      muted: "rgba(255,255,255,0.3)",
      badgeBg: "rgba(0,212,170,0.1)",
      badgeBorder: "rgba(0,212,170,0.28)",
      secondaryBtnBorder: "rgba(255,255,255,0.2)",
      secondaryBtnText: "#e8e8e8",
      secondaryBtnHover: "rgba(255,255,255,0.06)",
      tabBg: "transparent",
      tabBorder: "rgba(255,255,255,0.1)",
      tabText: "rgba(255,255,255,0.45)",
      tabActiveText: ACCENT,
      frameBg: "#050810",
      frameBorder: "rgba(255,255,255,0.1)",
      codeBg: "rgba(0,212,170,0.1)",
      cardBg: "#141414",
      cardBorder: "rgba(255,255,255,0.08)",
      cardTitle: "#e8e8e8",
      featTagBg: "rgba(0,212,170,0.08)",
      featTagText: "rgba(0,212,170,0.75)",
      pipeNumBg: "rgba(0,212,170,0.12)",
      pipeNumText: ACCENT,
    };
  }

  return {
    sectionBg: "#fafafa",
    borderY: "rgba(0,0,0,0.08)",
    heading: "#18181b",
    overline: "rgba(24,24,27,0.45)",
    subtitle: "rgba(24,24,27,0.7)",
    body: "rgba(24,24,27,0.6)",
    muted: "rgba(24,24,27,0.45)",
    badgeBg: "rgba(0,212,170,0.08)",
    badgeBorder: "rgba(0,212,170,0.25)",
    secondaryBtnBorder: "rgba(0,0,0,0.18)",
    secondaryBtnText: "#18181b",
    secondaryBtnHover: "rgba(0,0,0,0.04)",
    tabBg: "transparent",
    tabBorder: "rgba(0,0,0,0.1)",
    tabText: "rgba(24,24,27,0.5)",
    tabActiveText: "#0a9e80",
    frameBg: "#0a0e16",
    frameBorder: "rgba(0,0,0,0.12)",
    codeBg: "rgba(0,212,170,0.1)",
    cardBg: "#ffffff",
    cardBorder: "rgba(0,0,0,0.08)",
    cardTitle: "#18181b",
    featTagBg: "rgba(0,212,170,0.08)",
    featTagText: "#0a9e80",
    pipeNumBg: "rgba(0,212,170,0.1)",
    pipeNumText: "#0a9e80",
  };
}

export function MakeMoney() {
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = useHtmlIsDark();
  const palette = paletteFor(isDark);

  return (
    <>
      <section
        id="make-money"
        aria-labelledby="make-money-heading"
        className="scroll-mt-24"
        style={{
          background: palette.sectionBg,
          padding: "clamp(72px, 12vw, 120px) 32px",
          borderTop: `1px solid ${palette.borderY}`,
        }}
      >
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.65 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div
              className="uppercase"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: palette.overline,
                letterSpacing: "0.1em",
                marginBottom: 16,
              }}
            >
              Make Money
            </div>

            <h2
              id="make-money-heading"
              className="text-balance"
              style={{
                fontSize: "clamp(40px, 7vw, 5rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: palette.heading,
                lineHeight: 1.02,
                margin: 0,
              }}
            >
              Make
              <br />
              <span style={{ color: ACCENT }}>Money</span>
            </h2>
            <p
              style={{
                marginTop: 14,
                fontSize: "clamp(18px, 2.6vw, 1.6rem)",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: palette.subtitle,
                margin: "14px 0 0",
              }}
            >
              AI 금융분석 플랫폼
            </p>

            <p
              style={{
                marginTop: 28,
                maxWidth: 640,
                fontSize: "clamp(15px, 1.7vw, 1.05rem)",
                color: palette.body,
                lineHeight: 1.8,
              }}
            >
              딥러닝 앙상블·BERT 뉴스 감성 분석·LLM 의사결정이 통합된 한국 주식
              &amp; 코스피 200 선물 예측 분석 시스템. pykrx 실시간 데이터와 5개
              AI 모델이 24시간 시장을 분석합니다.
            </p>

            <div
              style={{
                marginTop: 36,
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                style={{
                  background: ACCENT,
                  color: "#04130f",
                  border: "none",
                  padding: "14px 30px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(0,212,170,0.32)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                무료 체험 시작
              </button>
              <button
                type="button"
                style={{
                  background: "transparent",
                  color: palette.secondaryBtnText,
                  border: `1px solid ${palette.secondaryBtnBorder}`,
                  padding: "14px 30px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = palette.secondaryBtnHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                시스템 둘러보기
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="features"
        aria-labelledby="features-heading"
        className="scroll-mt-24"
        style={{
          background: palette.sectionBg,
          padding: "clamp(72px, 12vw, 120px) 32px",
          borderTop: `1px solid ${palette.borderY}`,
        }}
      >
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <div
              className="uppercase"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: palette.overline,
                letterSpacing: "0.1em",
                marginBottom: 16,
              }}
            >
              CORE FEATURES
            </div>
            <h2
              id="features-heading"
              className="text-balance"
              style={{
                fontSize: "clamp(24px, 3.5vw, 2.2rem)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: palette.heading,
                lineHeight: 1.1,
                margin: "0 0 1rem",
              }}
            >
              왜 MAKEMONEY인가
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: palette.body,
                lineHeight: 1.8,
                maxWidth: 680,
                margin: 0,
              }}
            >
              단순한 지표 기반 알고리즘을 넘어, 딥러닝과 자연어 처리, LLM 추론이
              결합된 차세대 자동매매 시스템입니다.
            </p>

            <div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              style={{ marginTop: 40 }}
            >
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.55,
                    delay: reduceMotion ? 0 : i * 0.06,
                  }}
                  viewport={{ once: true, margin: "-40px" }}
                  style={{
                    background: palette.cardBg,
                    border: `1px solid ${palette.cardBorder}`,
                    borderRadius: 12,
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 28, lineHeight: 1 }} aria-hidden>
                    {feature.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: palette.cardTitle,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {feature.title}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      color: palette.body,
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {feature.description}
                  </p>
                  <div
                    className="uppercase"
                    style={{
                      display: "inline-flex",
                      alignSelf: "flex-start",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      color: palette.featTagText,
                      background: palette.featTagBg,
                      padding: "5px 10px",
                      borderRadius: 6,
                    }}
                  >
                    {feature.tag}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="dashboard"
        aria-labelledby="dashboard-heading"
        className="scroll-mt-24"
        style={{
          background: palette.sectionBg,
          padding: "clamp(72px, 12vw, 120px) 32px",
          borderTop: `1px solid ${palette.borderY}`,
        }}
      >
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <div
              className="uppercase"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: palette.overline,
                letterSpacing: "0.1em",
                marginBottom: 16,
              }}
            >
              Dashboard Preview
            </div>
            <h2
              id="dashboard-heading"
              className="text-balance"
              style={{
                fontSize: "clamp(24px, 3.5vw, 2.2rem)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: palette.heading,
                lineHeight: 1.1,
                margin: "0 0 1rem",
              }}
            >
              실시간 대시보드
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: palette.body,
                lineHeight: 1.8,
                maxWidth: 680,
                margin: 0,
              }}
            >
              6탭 HTML5 단일 파일 대시보드. 탭을 클릭하여 실제 화면을
              확인하세요. 브라우저에서{" "}
              <code
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                  fontSize: "0.85em",
                  color: ACCENT,
                  background: palette.codeBg,
                  padding: "2px 7px",
                  borderRadius: 4,
                }}
              >
                http://localhost:8000
              </code>{" "}
              접속만으로 모든 데이터를 실시간 모니터링합니다.
            </p>

            <div
              style={{
                marginTop: 32,
                border: `1px solid ${palette.frameBorder}`,
                background: palette.frameBg,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <Dashboard />
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="how"
        aria-labelledby="how-heading"
        className="scroll-mt-24"
        style={{
          background: palette.sectionBg,
          padding: "clamp(72px, 12vw, 120px) 32px",
          borderTop: `1px solid ${palette.borderY}`,
        }}
      >
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <div
              className="uppercase"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: palette.overline,
                letterSpacing: "0.1em",
                marginBottom: 16,
              }}
            >
              HOW IT WORKS
            </div>
            <h2
              id="how-heading"
              className="text-balance"
              style={{
                fontSize: "clamp(24px, 3.5vw, 2.2rem)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: palette.heading,
                lineHeight: 1.1,
                margin: "0 0 1rem",
              }}
            >
              작동 원리
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: palette.body,
                lineHeight: 1.8,
                maxWidth: 680,
                margin: 0,
              }}
            >
              MakeMoney는 데이터 수집부터 주문 실행까지 5단계 파이프라인으로
              운영됩니다.
            </p>

            <div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5"
              style={{ marginTop: 40 }}
            >
              {PIPELINE_STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.55,
                    delay: reduceMotion ? 0 : i * 0.08,
                  }}
                  viewport={{ once: true, margin: "-40px" }}
                  style={{
                    background: palette.cardBg,
                    border: `1px solid ${palette.cardBorder}`,
                    borderRadius: 12,
                    padding: "24px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: palette.pipeNumBg,
                      color: palette.pipeNumText,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      marginBottom: 16,
                    }}
                  >
                    {step.num}
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: palette.cardTitle,
                      letterSpacing: "-0.01em",
                      marginBottom: 10,
                    }}
                  >
                    {step.title}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.85rem",
                      color: palette.body,
                      lineHeight: 1.65,
                    }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
