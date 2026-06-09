import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Filler,
);

/**
 * Platform / Solution — time-series specialization section.
 */

const C = {
  teal: "#00d4aa",
  red: "#f87171",
  blue: "#4f9cf9",
  amber: "#fbbf24",
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

type PlatformPalette = {
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
  statsBoxBg: string;
  statsBoxBorder: string;
};

function paletteFor(isDark: boolean): PlatformPalette {
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
      statsBoxBg: "rgba(0,212,170,0.05)",
      statsBoxBorder: "rgba(0,212,170,0.1)",
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
    statsBoxBg: "rgba(0,212,170,0.05)",
    statsBoxBorder: "rgba(0,212,170,0.12)",
  };
}

function ComparisonTable({ palette }: { palette: PlatformPalette }) {
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
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
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
              <td style={{ padding: "0.55rem 1rem", color: palette.body }}>{row.item}</td>
              <td style={{ padding: "0.55rem 1rem", textAlign: "center", color: C.red }}>
                {row.general}
              </td>
              <td style={{ padding: "0.55rem 1rem", textAlign: "center", color: C.teal }}>
                {row.ours}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Seeded PRNG — HTML randArr과 동일한 패턴을 매 렌더마다 고정 */
function createSeededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function randArr(n: number, base: number, amp: number, rand: () => number): number[] {
  return Array.from({ length: n }, (_, i) =>
    +(base + amp * (Math.sin(i * 0.35 + rand() * 0.4) + rand() * 0.25)).toFixed(3),
  );
}

function buildWalkForwardData() {
  const rand = createSeededRandom(42);
  const n = 80;
  const labels = Array.from({ length: n }, () => "");
  const price = randArr(n, 100, 18, rand);
  const pred = price.map((v, i) =>
    i < 8 ? null : +(v + 2.5 * (rand() - 0.5)).toFixed(2),
  );
  return { labels, price, pred };
}

function WalkForwardChart({ palette }: { palette: PlatformPalette }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { labels, price, pred } = buildWalkForwardData();

    chartRef.current?.destroy();

    chartRef.current = new ChartJS(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data: price,
            borderColor: "#64748b",
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
          },
          {
            data: pred,
            borderColor: C.blue,
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            borderDash: [4, 2],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  return (
    <div
      style={{
        background: palette.cardBg,
        border: `1px solid ${palette.cardBorder}`,
        borderRadius: 16,
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          color: palette.muted,
          marginBottom: "1rem",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Walk-Forward 검증 시각화
      </div>
      <div style={{ height: 200, position: "relative" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Bull 국면", bg: "rgba(0,212,170,0.15)", color: C.teal },
          { label: "Bear 국면", bg: "rgba(248,113,113,0.15)", color: C.red },
          { label: "Sideways 국면", bg: "rgba(251,191,36,0.15)", color: C.amber },
          { label: "모델 예측", bg: "rgba(79,156,249,0.15)", color: C.blue },
        ].map((pill) => (
          <span
            key={pill.label}
            style={{
              padding: "0.25rem 0.7rem",
              borderRadius: 20,
              fontSize: "0.75rem",
              fontWeight: 600,
              background: pill.bg,
              color: pill.color,
            }}
          >
            {pill.label}
          </span>
        ))}
      </div>
      <div
        style={{
          marginTop: "1.2rem",
          padding: "0.8rem",
          background: palette.statsBoxBg,
          borderRadius: 8,
          border: `1px solid ${palette.statsBoxBorder}`,
        }}
      >
        <div
          style={{
            fontSize: "0.75rem",
            color: palette.muted,
            marginBottom: "0.5rem",
          }}
        >
          Walk-Forward Split 5회 검증 결과
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.5rem",
          }}
        >
          {[
            { value: "2.41", label: "평균 Sharpe", color: C.teal },
            { value: "87.3%", label: "방향 정확도", color: C.blue },
            { value: "-12.4%", label: "최대 낙폭", color: C.amber },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.65rem", color: palette.muted }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
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
  palette: PlatformPalette;
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

export function Platform() {
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = useHtmlIsDark();
  const palette = paletteFor(isDark);

  const sectionBg = isDark ? "#111111" : "#ffffff";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  return (
    <section
      id="platform"
      aria-labelledby="platform-heading"
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
            Solution
          </div>
          <h2
            id="platform-heading"
            className="text-balance"
            style={{
              fontSize: "clamp(28px, 4vw, 2.4rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: palette.heading,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            시계열 데이터는 일반 ML과 다릅니다
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2"
          style={{ marginTop: 0 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <WalkForwardChart palette={palette} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
