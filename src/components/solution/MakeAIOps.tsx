import { motion, useReducedMotion } from "motion/react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";

/**
 * Solution — Make AIOps ("Make Engine") section.
 * 좌측에 일반 ML vs 시계열 ML 비교 표와 4가지 핵심 기능을 배치하고,
 * 우측 영역은 비워둔다.
 */

const C = {
  teal: "#00d4aa",
  red: "#f87171",
} as const;

const COMPARISON_ROWS = [
  {
    item: "검증 방법",
    general: "랜덤 분할 (미래 누출)",
    ours: "진화적 학습",
  },
  {
    item: "데이터 누출",
    general: "발생 가능",
    ours: "원천 차단",
  },
  {
    item: "순서 의존성",
    general: "무시",
    ours: "LSTM·Transformer 처리",
  },
  {
    item: "국면 변화 대응",
    general: "없음",
    ours: "HMM 자동 분류",
  },
  {
    item: "피처 생성",
    general: "일반 통계 피처",
    ours: "RSI·MACD 등 60+ 자동생성",
  },
] as const;

const FEATURES = [
  {
    icon: "🧬",
    title: "진화적 데이터셋 선택 — 노이즈 자동 필터링",
    description:
      "학습 데이터 풀에서 무작위 서브셋을 추출해 각각 모델을 학습하고, 고정 검증셋의 F1으로 평가한 뒤 상위 서브셋만 Jaccard 다양성 기반으로 병합합니다. 세대가 거듭될수록 노이즈가 걸러지고 신호가 농축된 데이터만 남아 모델의 일반화 능력이 극대화됩니다.",
  },
  {
    icon: "🌊",
    title: "시장 국면(Regime) 감지 — HMM 자동 분류",
    description:
      "HMM이 수익률·변동성·거래량 데이터를 분석해 Bull·Bear·Sideways 국면을 실시간 자동 분류합니다. 국면 레이블은 피처로 추가되며, 국면별 최적 앙상블 가중치를 동적으로 조정해 시장 급변 시에도 맥락을 반영한 예측이 가능합니다.",
  },
  {
    icon: "🔢",
    title: "시계열 전용 피처 엔지니어링 — 60종 자동 생성",
    description:
      "RSI·MACD·Bollinger Band 등 기술적 지표, 롤링 통계, 로그 수익률, Lag 피처, 시계열 분해, HMM 국면 레이블까지 60종을 버튼 클릭 한 번으로 자동 생성합니다. 학습 후 피처 중요도도 자동으로 시각화됩니다.",
  },
  {
    icon: "🤖",
    title: "4종 모델 앙상블 — 단기·장기 패턴 동시 포착",
    description:
      "XGBoost(비선형 관계), LSTM(단기 시퀀스 패턴), Transformer(장거리 의존성), AutoEncoder(이상치 탐지) 4종을 Weighted Average·Stacking·Voting 방식으로 앙상블합니다. 단일 모델 대비 안정적인 예측을 제공합니다.",
  },
] as const;

type Palette = {
  heading: string;
  overline: string;
  body: string;
  muted: string;
  cardBg: string;
  cardBorder: string;
  tableHeaderBg: string;
  tableRowBorder: string;
  iconBg: string;
  iconBorder: string;
  featureTitle: string;
};

function paletteFor(isDark: boolean): Palette {
  if (isDark) {
    return {
      heading: "#f2f2f2",
      overline: "rgba(255,255,255,0.25)",
      body: "rgba(255,255,255,0.38)",
      muted: "rgba(255,255,255,0.22)",
      cardBg: "#1a1a1a",
      cardBorder: "rgba(255,255,255,0.14)",
      tableHeaderBg: "rgba(255,255,255,0.04)",
      tableRowBorder: "rgba(255,255,255,0.06)",
      iconBg: "rgba(0,212,170,0.1)",
      iconBorder: "rgba(0,212,170,0.2)",
      featureTitle: "#e8e8e8",
    };
  }

  return {
    heading: "#18181b",
    overline: "rgba(24,24,27,0.45)",
    body: "rgba(24,24,27,0.62)",
    muted: "rgba(24,24,27,0.45)",
    cardBg: "#ffffff",
    cardBorder: "rgba(0,0,0,0.1)",
    tableHeaderBg: "rgba(0,0,0,0.04)",
    tableRowBorder: "rgba(0,0,0,0.06)",
    iconBg: "rgba(0,212,170,0.08)",
    iconBorder: "rgba(0,212,170,0.18)",
    featureTitle: "#18181b",
  };
}

function ComparisonTable({ palette }: { palette: Palette }) {
  return (
    <div
      style={{
        background: palette.cardBg,
        border: `1px solid ${palette.cardBorder}`,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: "1.8rem",
      }}
    >
      <div
        style={{
          padding: "0.8rem 1.2rem",
          background: palette.tableHeaderBg,
          fontSize: "0.75rem",
          fontWeight: 700,
          color: palette.muted,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        일반 ML vs 시계열 ML 핵심 차이
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.82rem",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "0.6rem 1rem",
                textAlign: "left",
                color: palette.muted,
                fontWeight: 600,
                borderBottom: `1px solid ${palette.tableRowBorder}`,
              }}
            >
              항목
            </th>
            <th
              style={{
                padding: "0.6rem 1rem",
                textAlign: "center",
                color: C.red,
                fontWeight: 700,
                borderBottom: `1px solid ${palette.tableRowBorder}`,
              }}
            >
              일반 ML
            </th>
            <th
              style={{
                padding: "0.6rem 1rem",
                textAlign: "center",
                color: C.teal,
                fontWeight: 700,
                borderBottom: `1px solid ${palette.tableRowBorder}`,
              }}
            >
              본 시스템 (시계열)
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row, i) => (
            <tr
              key={row.item}
              style={{
                borderBottom:
                  i < COMPARISON_ROWS.length - 1
                    ? `1px solid ${palette.tableRowBorder}`
                    : undefined,
              }}
            >
              <td style={{ padding: "0.55rem 1rem", color: palette.body }}>
                {row.item}
              </td>
              <td
                style={{
                  padding: "0.55rem 1rem",
                  textAlign: "center",
                  color: C.red,
                }}
              >
                {row.general}
              </td>
              <td
                style={{
                  padding: "0.55rem 1rem",
                  textAlign: "center",
                  color: C.teal,
                }}
              >
                {row.ours}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeatureItem({
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
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        delay: reduceMotion ? 0 : index * 0.07,
      }}
      viewport={{ once: true, margin: "-40px" }}
      style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start" }}
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
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <h4
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: palette.featureTitle,
            marginBottom: "0.3rem",
            lineHeight: 1.35,
            letterSpacing: "-0.02em",
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
      </div>
    </motion.div>
  );
}

export function MakeAIOps() {
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = useHtmlIsDark();
  const palette = paletteFor(isDark);

  const sectionBg = isDark ? "#111111" : "#ffffff";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  return (
    <section
      id="make-aiops"
      aria-labelledby="make-aiops-heading"
      className="scroll-mt-24"
      style={{
        background: sectionBg,
        padding: "clamp(72px, 12vw, 120px) 32px",
        borderTop: `1px solid ${borderY}`,
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.65 }}
          viewport={{ once: true, margin: "-80px" }}
          style={{ marginBottom: "4rem" }}
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
            Make AIOps
          </div>
          <h2
            id="make-aiops-heading"
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
            <span style={{ color: C.teal }}>AIOps</span>
          </h2>
          <p
            style={{
              marginTop: 14,
              fontSize: "clamp(18px, 2.6vw, 1.6rem)",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: palette.heading,
              lineHeight: 1.3,
              margin: "14px 0 0",
            }}
          >
            똑똑한 인공지능을 만드는 플랫폼 Make Engine
          </p>
          <p
            style={{
              marginTop: 16,
              fontSize: "clamp(16px, 2vw, 1.15rem)",
              color: palette.body,
              lineHeight: 1.6,
              margin: "16px 0 0",
            }}
          >
            시계열 데이터는 일반 ML과 다릅니다
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <ComparisonTable palette={palette} />
            {FEATURES.map((feature, i) => (
              <FeatureItem
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

          {/* 우측 영역 — 의도적으로 비워둠 */}
          <div aria-hidden className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
