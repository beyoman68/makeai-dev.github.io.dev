import { motion, useReducedMotion } from "motion/react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";

/**
 * Solution — AX 진단 툴 section.
 * 글로벌 기준 프레임워크, 핵심 특징, 진단 대상을 소개한다.
 */

const FRAMEWORKS = [
  "EU DigComp 3.0",
  "OECD",
  "UNESCO",
  "MIT RASE",
] as const;

const FEATURES = [
  {
    icon: "🌐",
    title: "글로벌 기준 측정 지표",
    description:
      "EU·OECD·UNESCO·MIT 등 국제 표준 프레임워크를 기반으로 신뢰할 수 있는 측정 지표를 제공합니다.",
  },
  {
    icon: "📊",
    title: "5개 수준 역량 차원",
    description:
      "AX 역량을 5단계 수준으로 세분화하여 현재 위치와 다음 단계를 명확하게 진단합니다.",
  },
  {
    icon: "🧩",
    title: "다수준 체계 평가",
    description:
      "개인·조직·기관 등 다양한 수준을 아우르는 체계적 평가로 전사적 AX 수준을 파악합니다.",
  },
  {
    icon: "🇰🇷",
    title: "한국형 리더십/경영 평가",
    description:
      "국내 조직 문화와 경영 환경을 반영한 한국형 리더십·경영 평가 지표를 함께 제공합니다.",
  },
  {
    icon: "🛠️",
    title: "지표 통합 및 자체 지표 개발",
    description:
      "기존 글로벌 지표를 통합하고, 조직 특성에 맞춘 자체 지표를 개발·확장할 수 있습니다.",
  },
] as const;

const TARGETS = [
  {
    icon: "🎓",
    title: "교육기관용 AX 진단",
    description: "학교·대학 등 교육기관의 AX 역량과 준비도를 진단합니다.",
  },
  {
    icon: "🏛️",
    title: "정책 수립용 AX 진단",
    description: "정책 설계와 의사결정에 필요한 AX 수준을 정량적으로 측정합니다.",
  },
  {
    icon: "🏢",
    title: "기업 및 조직 AX 진단",
    description: "기업·조직 전반의 AX 역량을 체계적으로 평가하고 개선점을 도출합니다.",
  },
  {
    icon: "👥",
    title: "직무별 & 역할별 진단",
    description: "직무와 역할 특성에 맞춘 맞춤형 AX 역량 진단을 제공합니다.",
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
  chipBg: string;
  chipBorder: string;
  chipText: string;
  cardBg: string;
  cardBorder: string;
  iconBg: string;
  iconBorder: string;
  featureTitle: string;
};

function paletteFor(isDark: boolean): Palette {
  if (isDark) {
    return {
      sectionBg: "#0c0c0c",
      borderY: "rgba(255,255,255,0.06)",
      heading: "#f2f2f2",
      overline: "rgba(255,255,255,0.25)",
      subtitle: "rgba(255,255,255,0.62)",
      body: "rgba(255,255,255,0.4)",
      muted: "rgba(255,255,255,0.3)",
      chipBg: "rgba(0,212,170,0.1)",
      chipBorder: "rgba(0,212,170,0.28)",
      chipText: "rgba(0,212,170,0.95)",
      cardBg: "#1a1a1a",
      cardBorder: "rgba(255,255,255,0.12)",
      iconBg: "rgba(0,212,170,0.1)",
      iconBorder: "rgba(0,212,170,0.2)",
      featureTitle: "#e8e8e8",
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
    chipBg: "rgba(0,212,170,0.08)",
    chipBorder: "rgba(0,212,170,0.25)",
    chipText: "#0a9e80",
    cardBg: "#ffffff",
    cardBorder: "rgba(0,0,0,0.1)",
    iconBg: "rgba(0,212,170,0.08)",
    iconBorder: "rgba(0,212,170,0.18)",
    featureTitle: "#18181b",
  };
}

function FeatureCard({
  icon,
  title,
  description,
  palette,
  index,
  reduceMotion,
}: {
  icon: string;
  title: string;
  description: string;
  palette: Palette;
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        delay: reduceMotion ? 0 : index * 0.06,
      }}
      viewport={{ once: true, margin: "-40px" }}
      style={{
        background: palette.cardBg,
        border: `1px solid ${palette.cardBorder}`,
        borderRadius: 14,
        padding: "1.6rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          background: palette.iconBg,
          border: `1px solid ${palette.iconBorder}`,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
        }}
      >
        {icon}
      </div>
      <h4
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          color: palette.featureTitle,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: "0.9rem",
          color: palette.body,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
}

export function AXTool() {
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = useHtmlIsDark();
  const palette = paletteFor(isDark);

  return (
    <section
      id="ax-tool"
      aria-labelledby="ax-tool-heading"
      className="scroll-mt-24"
      style={{
        background: palette.sectionBg,
        padding: "clamp(72px, 12vw, 120px) 32px",
        borderTop: `1px solid ${palette.borderY}`,
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* HEADER */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.65 }}
          viewport={{ once: true, margin: "-80px" }}
          style={{ marginBottom: "3rem" }}
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
            AX 진단 툴
          </div>
          <h2
            id="ax-tool-heading"
            className="text-balance"
            style={{
              fontSize: "clamp(28px, 4vw, 2.4rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: palette.heading,
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            AX 진단 툴
          </h2>
          <p
            style={{
              marginTop: 16,
              maxWidth: 720,
              fontSize: "clamp(16px, 2vw, 1.15rem)",
              color: palette.subtitle,
              lineHeight: 1.6,
            }}
          >
            조직과 개인의 AX 역량을 체계적으로 파악하고, 수준을 정량화 하여 개선
            방안 도출
          </p>

          {/* 글로벌 기준 프레임워크 */}
          <div style={{ marginTop: 28 }}>
            <div
              className="uppercase"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: palette.muted,
                letterSpacing: "0.12em",
                marginBottom: 12,
              }}
            >
              글로벌 기준 프레임워크
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {FRAMEWORKS.map((fw) => (
                <span
                  key={fw}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 999,
                    background: palette.chipBg,
                    border: `1px solid ${palette.chipBorder}`,
                    color: palette.chipText,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                  }}
                >
                  {fw}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 특징 */}
        <div
          className="uppercase"
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: palette.muted,
            letterSpacing: "0.12em",
            marginBottom: 18,
          }}
        >
          핵심 특징
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              palette={palette}
              index={i}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        {/* 진단 대상 */}
        <div
          className="uppercase"
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: palette.muted,
            letterSpacing: "0.12em",
            margin: "3.5rem 0 18px",
          }}
        >
          진단 대상
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TARGETS.map((target, i) => (
            <motion.div
              key={target.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : i * 0.06,
              }}
              viewport={{ once: true, margin: "-40px" }}
              style={{
                background: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`,
                borderRadius: 14,
                padding: "1.6rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div style={{ fontSize: "1.6rem" }}>{target.icon}</div>
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: palette.featureTitle,
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {target.title}
              </h4>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: palette.body,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {target.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
