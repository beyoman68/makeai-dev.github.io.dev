import { motion, useReducedMotion } from "motion/react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";
import Dashboard from "@/components/make-money/Dashboard";

/**
 * Solution — Make Money (AI 금융분석 플랫폼) section.
 * 히어로 영역과 '실시간 대시보드' 미리보기로 구성된다.
 */

const ACCENT = "#00d4aa";

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
};

function paletteFor(isDark: boolean): Palette {
  if (isDark) {
    return {
      sectionBg: "#0c0c0c",
      borderY: "rgba(255,255,255,0.06)",
      heading: "#f2f2f2",
      overline: "rgba(0,212,170,0.85)",
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
    };
  }

  return {
    sectionBg: "#fafafa",
    borderY: "rgba(0,0,0,0.08)",
    heading: "#18181b",
    overline: "#0a9e80",
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
  };
}

export function MakeMoney() {
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = useHtmlIsDark();
  const palette = paletteFor(isDark);

  return (
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
        {/* HERO */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.65 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: palette.badgeBg,
              border: `1px solid ${palette.badgeBorder}`,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: palette.overline,
              marginBottom: 24,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: ACCENT,
              }}
            />
            예측 분석 시스템
          </span>

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
            &amp; 코스피 200 선물 예측 분석 시스템. pykrx 실시간 데이터와 5개 AI
            모델이 24시간 시장을 분석합니다.
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

        {/* 실시간 대시보드 */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, delay: 0.1 }}
          viewport={{ once: true, margin: "-60px" }}
          style={{ marginTop: "clamp(56px, 8vw, 96px)" }}
        >
          <div
            className="uppercase"
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: palette.muted,
              letterSpacing: "0.18em",
              marginBottom: 14,
            }}
          >
            Dashboard Preview
          </div>
          <h3
            className="text-balance"
            style={{
              fontSize: "clamp(26px, 3.5vw, 2.1rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: palette.heading,
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            실시간 대시보드
          </h3>
          <p
            style={{
              marginTop: 14,
              maxWidth: 680,
              fontSize: "0.98rem",
              color: palette.body,
              lineHeight: 1.75,
            }}
          >
            6탭 HTML5 단일 파일 대시보드. 탭을 클릭하여 실제 화면을 확인하세요.
            브라우저에서{" "}
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

          {/* 미리보기 프레임 */}
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
  );
}
