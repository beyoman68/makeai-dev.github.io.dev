import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarController,
  BarElement,
  Filler,
);

/**
 * Solution — Make AIOps ("Make Engine") section.
 * 좌측에 일반 ML vs 시계열 ML 비교 표와 4가지 핵심 기능을 배치하고,
 * 우측 영역은 비워둔다.
 */

const C = {
  teal: "#00d4aa",
  red: "#f87171",
  blue: "#4f9cf9",
  amber: "#fbbf24",
  purple: "#a78bfa",
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
  statsBoxBg: string;
  statsBoxBorder: string;
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

function createSeededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function randArr(
  n: number,
  base: number,
  amp: number,
  rand: () => number,
): number[] {
  return Array.from(
    { length: n },
    (_, i) =>
      +(
        base +
        amp * (Math.sin(i * 0.35 + rand() * 0.4) + rand() * 0.25)
      ).toFixed(3),
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

function WalkForwardChart({ palette }: { palette: Palette }) {
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
        scales: { x: { display: false }, y: { display: false } },
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
          {
            label: "Sideways 국면",
            bg: "rgba(251,191,36,0.15)",
            color: C.amber,
          },
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
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.65rem", color: palette.muted }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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

// ─── Weather Chart (Case Study) ──────────────────────────────────────────────

function generateWeatherDates(
  year: number,
  month: number,
  day: number,
  count: number,
): string[] {
  const dates: string[] = [];
  const d = new Date(year, month - 1, day);
  for (let i = 0; i < count; i++) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    dates.push(`${d.getFullYear()}-${m}-${dd}`);
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

// Transformer: 50일 (2026-04-07 ~ 2026-05-26)
const TRANSFORMER_LABELS = generateWeatherDates(2026, 4, 7, 50);
// 실측(종가): Apr 7~12 급등(15→30), Apr 21~23 저점(~10), 이후 완만 상승
const TRANSFORMER_ACTUAL: number[] = [
  15,
  15,
  22,
  27,
  30,
  30,
  27, // Apr 7–13   (0–6)
  25,
  23,
  21,
  20,
  18,
  17,
  16, // Apr 14–20  (7–13)
  11,
  10,
  11,
  13,
  15,
  18,
  20, // Apr 21–27  (14–20)
  20,
  18,
  17,
  19,
  21,
  22,
  22, // Apr 28–May 4 (21–27)
  20,
  20,
  22,
  24,
  23,
  24,
  24, // May 5–11   (28–34)
  25,
  25,
  26,
  28,
  27,
  27,
  28, // May 12–18  (35–41)
  27,
  27,
  26,
  28,
  30,
  30,
  28,
  30, // May 19–26 (42–49)
];
// 예측: index 19(Apr 26)부터 21.3→26.0 선형 상승 (앞 19행 null)
const TRANSFORMER_PRED: (number | null)[] = [
  ...(Array.from({ length: 19 }, () => null) as null[]),
  21.3,
  21.5,
  21.6,
  21.8,
  22.0,
  22.1,
  22.3,
  22.5,
  22.7,
  22.9,
  23.1,
  23.3,
  23.5,
  23.7,
  23.9,
  24.1,
  24.3,
  24.5,
  24.7,
  24.9,
  25.0,
  25.2,
  25.4,
  25.6,
  25.7,
  25.8,
  25.9,
  26.0,
  26.0,
  26.0,
  26.0,
];

// FFN: 30일 (2026-04-27 ~ 2026-05-26), 전 구간 예측
const FFN_LABELS = generateWeatherDates(2026, 4, 27, 30);
// 실측(종가): Apr 27 ~15 급등 후 May 1~9 평탄(21~23), May 13~20 피크(~31), May 21 급락(~16), 회복
const FFN_ACTUAL: number[] = [
  15,
  20,
  23,
  22,
  23,
  22,
  22,
  21, // Apr 27–May 4  (0–7)
  22,
  23,
  23,
  22,
  23,
  25,
  26,
  24, // May 5–12      (8–15)
  26,
  29,
  30,
  31,
  30,
  30,
  30,
  30, // May 13–20     (16–23)
  16,
  21,
  25,
  29,
  28,
  25, // May 21–26     (24–29)
];
// 예측: 실측과 거의 동일 패턴, min 14.8(May 21), max 30.9(May 16)
const FFN_PRED: (number | null)[] = [
  15.0,
  19.5,
  22.0,
  21.5,
  22.5,
  21.5,
  21.0,
  20.5, // Apr 27–May 4  (0–7)
  21.0,
  22.0,
  22.5,
  21.5,
  22.5,
  25.0,
  25.5,
  23.5, // May 5–12      (8–15)
  25.5,
  28.5,
  30.0,
  30.9,
  29.5,
  29.0,
  29.5,
  29.5, // May 13–20     (16–23)
  14.8,
  20.0,
  24.0,
  28.5,
  27.5,
  24.0, // May 21–26     (24–29)
];

function WeatherChartCanvas({
  isDark,
  actualData,
  predData,
  labels,
}: {
  isDark: boolean;
  actualData: number[];
  predData: (number | null)[];
  labels: string[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<InstanceType<typeof ChartJS> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    chartRef.current?.destroy();

    const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
    const tickColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
    const legendColor = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)";

    chartRef.current = new ChartJS(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "종가",
            data: actualData,
            borderColor: "#4f9cf9",
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false,
            tension: 0.3,
            spanGaps: false,
          },
          {
            label: "예측",
            data: predData,
            borderColor: C.teal,
            borderWidth: 2,
            pointRadius: 3.5,
            pointBackgroundColor: C.teal,
            pointBorderColor: C.teal,
            fill: false,
            tension: 0.35,
            spanGaps: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: legendColor,
              boxWidth: 14,
              boxHeight: 3,
              font: { size: 11 },
              padding: 16,
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            border: { color: gridColor },
            ticks: { color: tickColor, maxTicksLimit: 8, font: { size: 10 } },
          },
          y: {
            grid: { color: gridColor },
            border: { color: gridColor },
            ticks: { color: tickColor, font: { size: 10 }, stepSize: 5 },
            min: 5,
            max: 36,
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [isDark, actualData, predData, labels]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />;
}

// ─── Case Study Section ───────────────────────────────────────────────────────

function CaseStudySection({
  palette,
  isDark,
}: {
  palette: Palette;
  isDark: boolean;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const sectionBg = isDark ? "#111111" : "#ffffff";
  const bg2 = isDark ? "#111827" : "#f1f5f9";
  const bg3 = isDark ? "#1a2234" : "#e8edf5";
  const border2 = isDark ? "#1e3050" : "rgba(0,0,0,0.06)";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  const transformerStats = [
    { label: "예측 포인트", value: "31개", color: C.purple },
    { label: "평균 (°C)", value: "23.54", color: C.teal },
    { label: "표준편차", value: "1.48", color: C.blue },
    { label: "범위 (°C)", value: "4.7°", color: C.amber },
    { label: "커버리지", value: "62%", color: C.red },
  ];

  const ffnStats = [
    { label: "예측 포인트", value: "30개", color: C.teal },
    { label: "평균 (°C)", value: "22.91", color: C.teal },
    { label: "표준편차", value: "4.61", color: C.blue },
    { label: "범위 (°C)", value: "16.1°", color: C.amber },
    { label: "커버리지", value: "100%", color: C.teal },
  ];

  const quantRows = [
    {
      item: "예측 포인트 수",
      transformer: "31개 / 50개",
      ffn: "30개 / 30개",
      note: "SEQ_LEN=20 → Transformer 앞 19개 공백",
      bad: true,
    },
    {
      item: "예측 커버리지",
      transformer: "62%",
      ffn: "100% ✓",
      note: "FFN은 입력 즉시 예측 가능 (warm-up 불필요)",
      bad: true,
    },
    {
      item: "예측 평균 (°C)",
      transformer: "23.54°C",
      ffn: (
        <span style={{ color: palette.body, fontWeight: 400 }}>22.91°C</span>
      ),
      note: "Transformer는 후반부(따뜻한 구간)만 예측해 평균 ↑",
      bad: false,
    },
    {
      item: "표준편차 (°C)",
      transformer: "1.48°C",
      ffn: "4.61°C ✓",
      note: "FFN이 실제 기온 변동성(±5°C급)을 3.3배 더 잘 반영",
      bad: true,
    },
    {
      item: "예측 범위 (°C)",
      transformer: "21.3~26.0 (4.7°C 폭)",
      ffn: "14.7~30.9 (16.2°C 폭)",
      note: "FFN 예측 폭이 3.4배 넓어 급등락 포착 가능",
      bad: true,
    },
    {
      item: "예측 곡선 형태",
      transformer: "완만한 상승 곡선",
      ffn: "실측과 유사한 등락",
      note: "용도에 따라 선택: 추세 파악 vs 단기 급변 감지",
      bad: false,
    },
    {
      item: "추세",
      transformer: <span style={{ color: C.teal }}>▲ 상승</span>,
      ffn: <span style={{ color: C.teal }}>▲ 상승</span>,
      note: "두 모델 모두 동일한 계절 방향성 포착 ✓",
      bad: false,
    },
  ];

  return (
    <section
      id="casestudy"
      aria-labelledby="casestudy-heading"
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
            실측 비교 분석
          </div>
          <h2
            id="casestudy-heading"
            className="text-balance"
            style={{
              fontSize: "clamp(24px, 3.5vw, 2.2rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: palette.heading,
              lineHeight: 1.2,
              margin: "0 0 0.4rem",
            }}
          >
            기상 데이터 1일 후 기온 예측
          </h2>
          <div
            style={{
              fontSize: "clamp(16px, 2.5vw, 1.6rem)",
              fontWeight: 600,
              color: C.teal,
              marginBottom: "1rem",
            }}
          >
            Transformer vs 진화학습 FFN
          </div>
          <p
            style={{
              fontSize: "1rem",
              color: palette.body,
              maxWidth: 720,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            동일한 기상 데이터(최근 30일)를 입력으로 1일 후 기온을 예측한 실제
            운영 결과입니다. 두 모델의 구조적 차이가 예측
            커버리지·변동성·정확도에 어떻게 나타나는지 확인하세요.
          </p>
        </motion.div>

        {/* Model comparison cards */}
        <div
          className="grid grid-cols-1 gap-8 lg:grid-cols-2"
          style={{ marginBottom: "2.5rem" }}
        >
          {/* Transformer */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            viewport={{ once: true, margin: "-40px" }}
            style={{
              background: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: bg2,
                padding: "0.75rem 1.2rem",
                borderBottom: `1px solid ${border2}`,
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: C.purple,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: palette.heading,
                }}
              >
                Transformer 모델
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: palette.muted,
                  marginLeft: "auto",
                }}
              >
                evo_1779885810016
              </span>
            </div>
            <div
              style={{
                background: "rgba(0,212,170,0.12)",
                borderBottom: `1px solid rgba(0,212,170,0.22)`,
                padding: "0.45rem 1.1rem",
                fontSize: "0.72rem",
                color: C.teal,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              ✅ 예측 완료 &nbsp;|&nbsp; 모델: evo_1779885810016 &nbsp;|&nbsp;
              31개 예측 포인트 (앞 19행은 시퀀스 구성용 — 예측 없음)
            </div>
            <div
              style={{
                padding: "0.5rem 1.1rem",
                borderBottom: `1px solid ${border2}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: palette.heading,
                }}
              >
                예측 결과
              </span>
              <span style={{ fontSize: "0.66rem", color: palette.muted }}>
                시퀀스 길이로 인해 앞 19개 행은 예측 제외
              </span>
            </div>
            <div
              style={{
                position: "relative",
                height: 220,
                background: isDark ? "#0d1117" : "#f1f5fb",
              }}
            >
              <WeatherChartCanvas
                isDark={isDark}
                actualData={TRANSFORMER_ACTUAL}
                predData={TRANSFORMER_PRED}
                labels={TRANSFORMER_LABELS}
              />
            </div>
            <div
              style={{
                display: "flex",
                borderBottom: `1px solid ${border2}`,
              }}
            >
              {(
                [
                  { label: "평균", value: "23.541" },
                  { label: "표준편차", value: "1.4774" },
                  { label: "최소", value: "21.3181" },
                  { label: "최대", value: "26.0044" },
                  { label: "추세", value: "▲상승", color: C.teal },
                ] as Array<{ label: string; value: string; color?: string }>
              ).map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    flex: 1,
                    padding: "0.45rem 0.3rem",
                    textAlign: "center",
                    borderRight: i < 4 ? `1px solid ${border2}` : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.58rem",
                      color: palette.muted,
                      marginBottom: "0.12rem",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      color: s.color ?? palette.heading,
                    }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "1rem 1.2rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                {transformerStats.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: bg3,
                      borderRadius: 8,
                      padding: "0.55rem 0.4rem",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.6rem",
                        color: palette.muted,
                        marginBottom: "0.2rem",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: s.color,
                      }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: isDark
                    ? "rgba(248,113,113,0.06)"
                    : "rgba(248,113,113,0.04)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  borderRadius: 8,
                  padding: "0.7rem 0.9rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: C.red,
                    marginBottom: "0.35rem",
                  }}
                >
                  ⚠️ 구조적 제약 확인
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: palette.body,
                    lineHeight: 1.6,
                  }}
                >
                  SEQ_LEN=20으로 인해{" "}
                  <strong style={{ color: C.red }}>
                    앞 19행은 시퀀스 구성용
                  </strong>
                  으로 예측 없음. 50개 입력 중 31개(62%)만 예측 가능. 예측
                  범위(4.7°C)가 좁아 <strong>변동성을 과소평가</strong>하는
                  경향이 있음.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Evolutionary FFN */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-40px" }}
            style={{
              background: palette.cardBg,
              border: "1px solid rgba(0,212,170,0.3)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: bg2,
                padding: "0.75rem 1.2rem",
                borderBottom: `1px solid ${border2}`,
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: C.teal,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: palette.heading,
                }}
              >
                진화학습 FFN 모델
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: palette.muted,
                  marginLeft: "auto",
                }}
              >
                evo_1779885703650
              </span>
            </div>
            <div
              style={{
                background: "rgba(0,212,170,0.12)",
                borderBottom: `1px solid rgba(0,212,170,0.22)`,
                padding: "0.45rem 1.1rem",
                fontSize: "0.72rem",
                color: C.teal,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              ✅ 예측 완료 &nbsp;|&nbsp; 모델: evo_1779885703650 &nbsp;|&nbsp;
              30개 예측 포인트
            </div>
            <div
              style={{
                padding: "0.5rem 1.1rem",
                borderBottom: `1px solid ${border2}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: palette.heading,
                }}
              >
                예측 결과
              </span>
            </div>
            <div
              style={{
                position: "relative",
                height: 220,
                background: isDark ? "#0d1117" : "#f1f5fb",
              }}
            >
              <WeatherChartCanvas
                isDark={isDark}
                actualData={FFN_ACTUAL}
                predData={FFN_PRED}
                labels={FFN_LABELS}
              />
            </div>
            <div
              style={{
                display: "flex",
                borderBottom: `1px solid ${border2}`,
              }}
            >
              {(
                [
                  { label: "평균", value: "22.911" },
                  { label: "표준편차", value: "4.6135" },
                  { label: "최소", value: "14.787" },
                  { label: "최대", value: "30.9103" },
                  { label: "추세", value: "▲상승", color: C.teal },
                ] as Array<{ label: string; value: string; color?: string }>
              ).map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    flex: 1,
                    padding: "0.45rem 0.3rem",
                    textAlign: "center",
                    borderRight: i < 4 ? `1px solid ${border2}` : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.58rem",
                      color: palette.muted,
                      marginBottom: "0.12rem",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      color: s.color ?? palette.heading,
                    }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "1rem 1.2rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                {ffnStats.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: bg3,
                      borderRadius: 8,
                      padding: "0.55rem 0.4rem",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.6rem",
                        color: palette.muted,
                        marginBottom: "0.2rem",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: s.color,
                      }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: isDark
                    ? "rgba(0,212,170,0.06)"
                    : "rgba(0,212,170,0.04)",
                  border: "1px solid rgba(0,212,170,0.2)",
                  borderRadius: 8,
                  padding: "0.7rem 0.9rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: C.teal,
                    marginBottom: "0.35rem",
                  }}
                >
                  ✅ 진화학습 특성 확인
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: palette.body,
                    lineHeight: 1.6,
                  }}
                >
                  시퀀스 제약 없이{" "}
                  <strong style={{ color: C.teal }}>
                    전체 30개 포인트 예측
                  </strong>{" "}
                  가능. 실제 기온 변동(14~30°C)을 폭넓게 추종하며{" "}
                  <strong>표준편차 4.61°C</strong>로 실제 기온 변동성을 훨씬
                  충실하게 반영. 진화적 서브셋 선택으로 다양한 기온 패턴 학습.
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quantitative comparison table */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          viewport={{ once: true, margin: "-40px" }}
          style={{
            marginBottom: "2rem",
            background: palette.cardBg,
            border: `1px solid ${palette.cardBorder}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: bg2,
              padding: "0.85rem 1.5rem",
              borderBottom: `1px solid ${border2}`,
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: palette.heading,
              }}
            >
              📊 정량 비교 — 기상 1일 후 기온 예측 (최근 30일)
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.85rem",
              }}
            >
              <thead>
                <tr style={{ background: bg3 }}>
                  <th
                    style={{
                      padding: "0.75rem 1.2rem",
                      textAlign: "left",
                      color: palette.muted,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: `1px solid ${palette.cardBorder}`,
                    }}
                  >
                    비교 항목
                  </th>
                  <th
                    style={{
                      padding: "0.75rem 1.2rem",
                      textAlign: "center",
                      color: C.purple,
                      fontSize: "0.78rem",
                      borderBottom: `1px solid ${palette.cardBorder}`,
                    }}
                  >
                    Transformer
                  </th>
                  <th
                    style={{
                      padding: "0.75rem 1.2rem",
                      textAlign: "center",
                      color: C.teal,
                      fontSize: "0.78rem",
                      borderBottom: `1px solid ${palette.cardBorder}`,
                    }}
                  >
                    진화학습 FFN
                  </th>
                  <th
                    style={{
                      padding: "0.75rem 1.2rem",
                      textAlign: "left",
                      color: palette.muted,
                      fontSize: "0.75rem",
                      borderBottom: `1px solid ${palette.cardBorder}`,
                    }}
                  >
                    해석
                  </th>
                </tr>
              </thead>
              <tbody>
                {quantRows.map((row, i) => (
                  <tr
                    key={row.item}
                    style={{
                      background:
                        i % 2 !== 0
                          ? isDark
                            ? "rgba(255,255,255,0.01)"
                            : "rgba(0,0,0,0.01)"
                          : undefined,
                      borderBottom: `1px solid ${border2}`,
                    }}
                  >
                    <td
                      style={{
                        padding: "0.7rem 1.2rem",
                        fontWeight: 600,
                        color: palette.heading,
                      }}
                    >
                      {row.item}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 1.2rem",
                        textAlign: "center",
                        color: row.bad ? C.red : palette.body,
                        fontWeight: row.bad ? 700 : 400,
                      }}
                    >
                      {row.transformer}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 1.2rem",
                        textAlign: "center",
                        color: C.teal,
                        fontWeight: 700,
                      }}
                    >
                      {row.ffn}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 1.2rem",
                        color: palette.muted,
                        fontSize: "0.8rem",
                      }}
                    >
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Insight boxes */}
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          style={{ marginBottom: "2rem" }}
        >
          {[
            {
              icon: "🔍",
              title: "시퀀스 제약 vs 즉시 예측",
              body: "LSTM·Transformer는 SEQ_LEN만큼의 warm-up이 필요합니다. 데이터가 충분하면 문제없지만, 짧은 구간 예측이나 실시간 스트리밍 환경에서는 FFN 계열이 불리하지 않습니다.",
              highlight: false,
            },
            {
              icon: "📉",
              title: "변동성 과소평가 문제",
              body: "Transformer 표준편차 1.48°C는 실제 기온 변동성(4~6°C)을 크게 과소평가합니다. 급격한 기온 변화 감지·알람 용도에는 FFN의 4.61°C 표준편차가 훨씬 유리합니다.",
              highlight: false,
            },
            {
              icon: "🧬",
              title: "진화학습 FFN의 실용적 강점",
              body: "진화적 서브셋 선택은 다양한 기온 패턴(한파·폭염·평상시)을 골고루 학습해 극값 예측 능력을 높입니다. 앙상블 구성 시 Transformer와 FFN을 결합하면 두 강점을 모두 활용할 수 있습니다.",
              highlight: true,
            },
          ].map((insight) => (
            <motion.div
              key={insight.title}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.45 }}
              viewport={{ once: true, margin: "-40px" }}
              style={{
                background: palette.cardBg,
                border: insight.highlight
                  ? "1px solid rgba(0,212,170,0.25)"
                  : `1px solid ${palette.cardBorder}`,
                borderRadius: 12,
                padding: "1.4rem",
              }}
            >
              <div style={{ fontSize: "1.3rem", marginBottom: "0.6rem" }}>
                {insight.icon}
              </div>
              <div
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: insight.highlight ? C.teal : palette.heading,
                  marginBottom: "0.5rem",
                }}
              >
                {insight.title}
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: palette.body,
                  lineHeight: 1.7,
                }}
              >
                {insight.body}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Conclusion banner */}
        <div
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(0,212,170,0.06) 0%, rgba(167,139,250,0.06) 100%)"
              : "linear-gradient(135deg, rgba(0,212,170,0.05) 0%, rgba(167,139,250,0.04) 100%)",
            border: `1px solid ${palette.cardBorder}`,
            borderRadius: 12,
            padding: "1.4rem 1.8rem",
            display: "flex",
            alignItems: "center",
            gap: "1.2rem",
            flexWrap: "wrap" as const,
          }}
        >
          <div style={{ fontSize: "1.6rem" }}>💡</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: palette.heading,
                marginBottom: "0.3rem",
              }}
            >
              실측 결과 요약
            </div>
            <div
              style={{
                fontSize: "0.82rem",
                color: palette.body,
                lineHeight: 1.7,
              }}
            >
              동일 기상 데이터에서{" "}
              <strong style={{ color: C.teal }}>진화학습 FFN</strong>은 커버리지
              100%·변동성 3.3배 충실 반영,{" "}
              <strong style={{ color: C.purple }}>Transformer</strong>는
              부드러운 추세 곡선·노이즈 억제라는 서로 다른 특성을 보였습니다. 두
              모델을 앙상블하면 <strong>추세 + 급변 감지</strong>를 동시에
              달성할 수 있습니다.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Demo Section Charts ──────────────────────────────────────────────────────

function DemoLineChart({
  id,
  buildData,
}: {
  id: string;
  buildData: () => {
    labels: string[];
    datasets: {
      data: (number | null)[];
      borderColor: string;
      borderWidth: number;
      pointRadius: number;
      fill: boolean | { target: string; above: string };
      tension: number;
      borderDash?: number[];
    }[];
  };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<InstanceType<typeof ChartJS> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    chartRef.current?.destroy();
    const { labels, datasets } = buildData();
    chartRef.current = new ChartJS(canvas, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
      },
    });
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />;
}

function DemoLineChartGrid({
  id,
  buildData,
}: {
  id: string;
  buildData: () => {
    labels: string[];
    datasets: {
      data: (number | null)[];
      borderColor: string;
      borderWidth: number;
      pointRadius: number;
      fill: boolean | { target: string; above: string };
      tension: number;
      borderDash?: number[];
    }[];
  };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<InstanceType<typeof ChartJS> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    chartRef.current?.destroy();
    const { labels, datasets } = buildData();
    chartRef.current = new ChartJS(canvas, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: {
            display: true,
            grid: { color: "rgba(42,58,85,0.5)" },
            ticks: { color: "#64748b", font: { size: 9 } },
          },
        },
      },
    });
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />;
}

function DemoBarChart({
  id,
  buildData,
}: {
  id: string;
  buildData: () => { labels: string[]; data: number[]; colors: string[] };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<InstanceType<typeof ChartJS> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    chartRef.current?.destroy();
    const { labels, data, colors } = buildData();
    chartRef.current = new ChartJS(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderRadius: 3 }],
      },
      options: {
        indexAxis: "y" as const,
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            display: true,
            grid: { color: "rgba(42,58,85,0.5)" },
            ticks: { color: "#64748b", font: { size: 8 } },
          },
          y: { display: true, ticks: { color: "#94a3b8", font: { size: 9 } } },
        },
      },
    });
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />;
}

function randDemoArr(n: number, base: number, amp: number): number[] {
  return Array.from(
    { length: n },
    (_, i) =>
      +(
        base +
        amp * (Math.sin(i * 0.35 + Math.random() * 0.4) + Math.random() * 0.25)
      ).toFixed(3),
  );
}

// ─── Demo Section ─────────────────────────────────────────────────────────────

type DemoTab =
  | "collect"
  | "feature"
  | "train"
  | "ensemble"
  | "predict"
  | "monitor"
  | "registry";

const DEMO_TABS: { key: DemoTab; label: string }[] = [
  { key: "collect", label: "① 데이터 수집" },
  { key: "feature", label: "② 피처 엔지니어링" },
  { key: "train", label: "③ 진화 학습" },
  { key: "ensemble", label: "④ 앙상블 구성" },
  { key: "predict", label: "⑤ Production 예측" },
  { key: "monitor", label: "⑥ 드리프트 모니터링" },
  { key: "registry", label: "⑦ 모델 레지스트리" },
];

function DemoSection({
  palette,
  isDark,
}: {
  palette: Palette;
  isDark: boolean;
}) {
  const [activeTab, setActiveTab] = useState<DemoTab>("collect");
  const sectionBg = isDark ? "#111111" : "#ffffff";
  const bg3 = isDark ? "#1a2234" : "#e8edf5";
  const border2 = isDark ? "#1e3050" : "rgba(0,0,0,0.06)";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const textMuted = isDark ? "#64748b" : "#94a3b8";

  const tabKey = activeTab;

  const kpiStyle = {
    background: bg3,
    border: `1px solid ${border2}`,
    borderRadius: 8,
    padding: "0.8rem 1rem",
  };
  const kpiLabelStyle = {
    fontSize: "0.65rem",
    color: textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  };
  const kpiValStyle = {
    fontSize: "1.4rem",
    fontWeight: 800,
    marginTop: "0.2rem",
  };

  const sidebarStyle = {
    background: bg3,
    border: `1px solid ${border2}`,
    borderRadius: 10,
    padding: "1rem",
  };
  const widgetTitleStyle = {
    fontSize: "0.7rem",
    color: textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: "0.7rem",
  };
  const selectStyle = {
    width: "100%",
    background: isDark ? "#0f1826" : "#f8fafc",
    border: `1px solid ${palette.cardBorder}`,
    borderRadius: 6,
    padding: "0.4rem 0.7rem",
    color: palette.heading,
    fontSize: "0.8rem",
    marginBottom: "0.5rem",
  };
  const checkboxRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.8rem",
    color: palette.body,
    marginBottom: "0.3rem",
  };
  const actionBtnStyle = {
    width: "100%",
    padding: "0.5rem",
    background: C.teal,
    color: "#0a0e1a",
    border: "none",
    borderRadius: 6,
    fontWeight: 700,
    fontSize: "0.85rem",
    cursor: "pointer",
    marginTop: "0.5rem",
  };

  const chartAreaStyle = {
    background: bg3,
    border: `1px solid ${border2}`,
    borderRadius: 10,
    padding: "1rem",
    height: 200,
    position: "relative" as const,
  };

  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="scroll-mt-24"
      style={{
        background: sectionBg,
        padding: "clamp(72px, 12vw, 120px) 32px",
        borderTop: `1px solid ${borderY}`,
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div style={{ marginBottom: "3rem" }}>
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
            인터랙티브 데모
          </div>
          <h2
            id="demo-heading"
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
            실제 대시보드 워크플로우
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: palette.body,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            데이터 수집부터 진화 학습·앙상블 구성·Production 배포까지 7단계를
            탭별로 확인하세요.
          </p>
        </div>

        {/* Tab nav */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            marginBottom: "2rem",
            flexWrap: "wrap" as const,
          }}
        >
          {DEMO_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "0.5rem 1.2rem",
                borderRadius: 8,
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                border: `1px solid ${activeTab === tab.key ? C.teal : palette.cardBorder}`,
                background: activeTab === tab.key ? C.teal : "transparent",
                color: activeTab === tab.key ? "#0a0e1a" : palette.body,
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          style={{
            background: palette.cardBg,
            border: `1px solid ${palette.cardBorder}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Topbar */}
          <div
            style={{
              background: bg3,
              padding: "0.8rem 1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${border2}`,
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: palette.heading,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  background: C.teal,
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              />
              {DEMO_TABS.find((t) => t.key === activeTab)?.label.replace(
                /^.\s/,
                "",
              )}
            </div>
            <span style={{ fontSize: "0.75rem", color: textMuted }}>
              {activeTab === "collect" &&
                "Yahoo Finance · FRED · Binance · CSV"}
              {activeTab === "feature" && "기술적 지표 · 롤링 통계 · HMM 국면"}
              {activeTab === "train" &&
                "진화적 데이터셋 선택 · FFN/XGB/LSTM/Transformer"}
              {activeTab === "ensemble" &&
                "수동 모델 선택 · Soft/Hard Voting · 자동 Production 등록"}
              {activeTab === "predict" && (
                <span style={{ color: C.teal }}>● Production 모델 활성</span>
              )}
              {activeTab === "monitor" && (
                <span style={{ color: C.teal }}>● 실시간 PSI 스캔</span>
              )}
              {activeTab === "registry" &&
                "SQLite 기반 로컬 저장소 · Stage 관리"}
            </span>
          </div>

          <div style={{ padding: "1.5rem" }}>
            {/* ① 데이터 수집 */}
            {activeTab === "collect" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "280px 1fr",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>데이터 소스</div>
                    <select style={selectStyle}>
                      <option>📈 Yahoo Finance (주식/ETF)</option>
                      <option>🏛️ FRED (경제지표)</option>
                      <option>₿ Binance (암호화폐)</option>
                      <option>📂 CSV 파일 업로드</option>
                    </select>
                  </div>
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>종목 / 심볼</div>
                    <input
                      defaultValue="005930.KS, BTC-USD, ^KS11"
                      style={{ ...selectStyle, marginBottom: "0.3rem" }}
                    />
                    <div style={{ fontSize: "0.72rem", color: textMuted }}>
                      삼성전자·BTC·KOSPI — CSV 업로드도 지원
                    </div>
                  </div>
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>수집 기간 &amp; 간격</div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.4rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <input
                        defaultValue="2020-01-01"
                        style={{ ...selectStyle, marginBottom: 0 }}
                      />
                      <input
                        defaultValue="2025-05-01"
                        style={{ ...selectStyle, marginBottom: 0 }}
                      />
                    </div>
                    <select style={selectStyle}>
                      <option>1일봉 (1d)</option>
                      <option>1시간봉 (1h)</option>
                      <option>주봉 (1wk)</option>
                    </select>
                  </div>
                  <button style={actionBtnStyle}>📥 데이터 수집 시작</button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "0.8rem",
                    }}
                  >
                    {[
                      { label: "총 샘플", val: "1,240", color: C.teal },
                      { label: "컬럼 수", val: "6", color: C.blue },
                      { label: "결측치", val: "0.0%", color: C.amber },
                      { label: "기간", val: "5년", color: palette.body },
                    ].map((k) => (
                      <div key={k.label} style={kpiStyle}>
                        <div style={kpiLabelStyle}>{k.label}</div>
                        <div
                          style={{
                            ...kpiValStyle,
                            color: k.color,
                            fontSize: k.label === "기간" ? "0.85rem" : "1.4rem",
                          }}
                        >
                          {k.val}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={chartAreaStyle}>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: textMuted,
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 1,
                      }}
                    >
                      삼성전자(005930) 종가 — 수집된 원시 OHLCV
                    </div>
                    <DemoLineChart
                      id={`collect-${tabKey}`}
                      buildData={() => {
                        const n = 60;
                        const labels = Array.from({ length: n }, () => "");
                        const price = randDemoArr(n, 180, 25);
                        return {
                          labels,
                          datasets: [
                            {
                              data: price,
                              borderColor: "#4f9cf9",
                              borderWidth: 2,
                              pointRadius: 0,
                              fill: false,
                              tension: 0.4,
                            },
                          ],
                        };
                      }}
                    />
                  </div>
                  <div
                    style={{
                      background: bg3,
                      border: `1px solid ${border2}`,
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "0.8rem",
                      }}
                    >
                      <thead>
                        <tr>
                          {[
                            "날짜",
                            "Open",
                            "High",
                            "Low",
                            "Close",
                            "Volume",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                color: textMuted,
                                fontSize: "0.7rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                padding: "0.5rem 0.8rem",
                                borderBottom: `1px solid ${border2}`,
                                textAlign: "left",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [
                            "2024-12-27",
                            "53,800",
                            "54,200",
                            "53,500",
                            "54,100",
                            "12.4M",
                          ],
                          [
                            "2024-12-26",
                            "53,200",
                            "53,900",
                            "52,900",
                            "53,800",
                            "9.8M",
                          ],
                          [
                            "2024-12-24",
                            "52,700",
                            "53,400",
                            "52,400",
                            "53,200",
                            "11.2M",
                          ],
                        ].map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                style={{
                                  padding: "0.5rem 0.8rem",
                                  borderBottom: `1px solid ${border2}`,
                                  color: j === 4 ? C.teal : palette.body,
                                }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ② 피처 엔지니어링 */}
            {activeTab === "feature" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "280px 1fr",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>기술적 지표</div>
                    {[
                      "RSI (14일)",
                      "MACD (12/26/9)",
                      "Bollinger Band",
                      "ATR (변동성)",
                      "Stochastic %K/%D",
                    ].map((item, i) => (
                      <div key={item} style={checkboxRowStyle}>
                        <input
                          type="checkbox"
                          defaultChecked={i < 4}
                          style={{ accentColor: C.teal }}
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>시계열 피처</div>
                    {[
                      "롤링 평균 (5/10/20일)",
                      "로그 수익률 · 변동성",
                      "Lag 피처 (1~5일)",
                      "HMM 국면 레이블",
                      "시계열 분해 (STL)",
                    ].map((item, i) => (
                      <div key={item} style={checkboxRowStyle}>
                        <input
                          type="checkbox"
                          defaultChecked={i < 4}
                          style={{ accentColor: C.teal }}
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                  <button style={actionBtnStyle}>⚙️ 피처 생성</button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "0.8rem",
                    }}
                  >
                    {[
                      { label: "생성된 피처 수", val: "63", color: C.teal },
                      { label: "Bull 구간", val: "58%", color: C.teal },
                      { label: "Bear 구간", val: "26%", color: C.red },
                      { label: "Sideways", val: "16%", color: C.amber },
                    ].map((k) => (
                      <div key={k.label} style={kpiStyle}>
                        <div style={kpiLabelStyle}>{k.label}</div>
                        <div style={{ ...kpiValStyle, color: k.color }}>
                          {k.val}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={chartAreaStyle}>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: textMuted,
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 1,
                      }}
                    >
                      피처 중요도 Top 10 (XGBoost 기준)
                    </div>
                    <DemoBarChart
                      id={`feature-${tabKey}`}
                      buildData={() => ({
                        labels: [
                          "RSI_14",
                          "MACD_signal",
                          "Volume_20d",
                          "BB_upper",
                          "Return_5d",
                          "Regime_HMM",
                          "ATR_14",
                          "Lag_1",
                          "Std_20d",
                          "Trend",
                        ],
                        data: [
                          0.182, 0.154, 0.138, 0.121, 0.108, 0.097, 0.085,
                          0.071, 0.063, 0.058,
                        ],
                        colors: [
                          0.182, 0.154, 0.138, 0.121, 0.108, 0.097, 0.085,
                          0.071, 0.063, 0.058,
                        ].map((v) =>
                          v > 0.15
                            ? "#00d4aa"
                            : v > 0.1
                              ? "#4f9cf9"
                              : "#64748b",
                        ),
                      })}
                    />
                  </div>
                  <div
                    style={{
                      background: bg3,
                      border: `1px solid ${border2}`,
                      borderRadius: 10,
                      padding: "0.8rem 1rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: textMuted,
                        marginBottom: "0.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      HMM 국면 감지 결과
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          padding: "0.25rem 0.7rem",
                          borderRadius: 6,
                          fontSize: "0.75rem",
                          background: "rgba(0,212,170,0.15)",
                          color: C.teal,
                          fontWeight: 600,
                        }}
                      >
                        🟢 현재 국면: Bull
                      </span>
                      <span
                        style={{
                          padding: "0.25rem 0.7rem",
                          borderRadius: 6,
                          fontSize: "0.75rem",
                          background: isDark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.04)",
                          color: textMuted,
                        }}
                      >
                        전환 확률: Bear 12% / Sideways 8%
                      </span>
                      <span
                        style={{
                          padding: "0.25rem 0.7rem",
                          borderRadius: 6,
                          fontSize: "0.75rem",
                          background: "rgba(79,156,249,0.1)",
                          color: C.blue,
                        }}
                      >
                        HMM States: 3
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ③ 진화 학습 */}
            {activeTab === "train" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "280px 1fr",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>학습 모델 선택</div>
                    {["XGBoost", "LSTM", "Transformer", "AutoEncoder"].map(
                      (item, i) => (
                        <div key={item} style={checkboxRowStyle}>
                          <input
                            type="checkbox"
                            defaultChecked={i < 3}
                            style={{ accentColor: C.teal }}
                          />
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>진화 설정</div>
                    <select style={selectStyle}>
                      <option>세대 1 (빠른 탐색)</option>
                      <option>세대 3 (균형)</option>
                      <option>세대 5 (심층)</option>
                    </select>
                    {[
                      { label: "Population", val: "30" },
                      { label: "검증 비율", val: "20%" },
                    ].map((s) => (
                      <div key={s.label} style={{ marginBottom: "0.5rem" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.75rem",
                            color: palette.body,
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span>{s.label}</span>
                          <span style={{ color: C.teal }}>{s.val}</span>
                        </div>
                        <input
                          type="range"
                          style={{ width: "100%", accentColor: C.teal }}
                        />
                      </div>
                    ))}
                  </div>
                  <button style={actionBtnStyle}>🚀 학습 시작</button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "0.8rem",
                    }}
                  >
                    {[
                      {
                        label: "진행 상태",
                        val: "세대 2/3",
                        color: C.teal,
                        sm: true,
                      },
                      { label: "Best F1", val: "0.4571", color: C.teal },
                      { label: "Pool 크기", val: "672", color: C.amber },
                      { label: "초기 대비", val: "70%", color: C.blue },
                    ].map((k) => (
                      <div key={k.label} style={kpiStyle}>
                        <div style={kpiLabelStyle}>{k.label}</div>
                        <div
                          style={{
                            ...kpiValStyle,
                            color: k.color,
                            fontSize: k.sm ? "0.85rem" : "1.4rem",
                          }}
                        >
                          {k.val}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      background: bg3,
                      border: `1px solid ${border2}`,
                      borderRadius: 8,
                      padding: "0.7rem 1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.72rem",
                        color: textMuted,
                        marginBottom: "0.4rem",
                      }}
                    >
                      <span>전체 진행률</span>
                      <span style={{ color: C.teal }}>60%</span>
                    </div>
                    <div
                      style={{
                        background: isDark ? "#0f1826" : "#e2e8f0",
                        borderRadius: 4,
                        height: 6,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "60%",
                          height: "100%",
                          background: C.teal,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: textMuted,
                        marginTop: "0.3rem",
                      }}
                    >
                      현재: 세대 2 — Pool 672 서브셋 샘플링·학습 중...
                    </div>
                  </div>
                  <div style={chartAreaStyle}>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: textMuted,
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 1,
                      }}
                    >
                      Train Loss (실선) / Val Loss (점선) — Epoch별 수렴 곡선
                    </div>
                    <DemoLineChartGrid
                      id={`train-${tabKey}`}
                      buildData={() => {
                        const n = 50;
                        const labels = Array.from({ length: n }, (_, i) =>
                          String(i),
                        );
                        const loss = Array.from(
                          { length: n },
                          (_, i) =>
                            +(
                              0.82 * Math.exp(-i * 0.07) +
                              0.042 +
                              Math.random() * 0.018
                            ).toFixed(4),
                        );
                        const valLoss = Array.from(
                          { length: n },
                          (_, i) =>
                            +(
                              0.88 * Math.exp(-i * 0.065) +
                              0.055 +
                              Math.random() * 0.025
                            ).toFixed(4),
                        );
                        return {
                          labels,
                          datasets: [
                            {
                              data: loss,
                              borderColor: "#00d4aa",
                              borderWidth: 2,
                              pointRadius: 0,
                              fill: false,
                              tension: 0.4,
                            },
                            {
                              data: valLoss,
                              borderColor: "#fbbf24",
                              borderWidth: 1.5,
                              pointRadius: 0,
                              fill: false,
                              tension: 0.4,
                              borderDash: [3, 3],
                            },
                          ],
                        };
                      }}
                    />
                  </div>
                  <div
                    style={{
                      background: bg3,
                      border: `1px solid ${border2}`,
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "0.8rem",
                      }}
                    >
                      <thead>
                        <tr>
                          {[
                            "세대",
                            "Best F1",
                            "Pool 크기",
                            "초기 대비",
                            "상태",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                color: textMuted,
                                fontSize: "0.7rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                padding: "0.5rem 0.8rem",
                                borderBottom: `1px solid ${border2}`,
                                textAlign: "left",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            gen: "1세대",
                            f1: "0.4103",
                            pool: "672",
                            ratio: "70.0%",
                            status: "완료",
                            statusColor: C.teal,
                          },
                          {
                            gen: "2세대",
                            f1: "0.4571",
                            pool: "470",
                            ratio: "49.0%",
                            status: "완료",
                            statusColor: C.teal,
                          },
                          {
                            gen: "3세대",
                            f1: "학습 중...",
                            pool: "—",
                            ratio: "—",
                            status: "진행중",
                            statusColor: C.amber,
                          },
                        ].map((row) => (
                          <tr key={row.gen}>
                            <td
                              style={{
                                padding: "0.5rem 0.8rem",
                                color: palette.body,
                              }}
                            >
                              {row.gen}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem 0.8rem",
                                color:
                                  row.f1 === "학습 중..." ? textMuted : C.teal,
                                fontWeight: 700,
                              }}
                            >
                              {row.f1}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem 0.8rem",
                                color: palette.body,
                              }}
                            >
                              {row.pool}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem 0.8rem",
                                color: palette.body,
                              }}
                            >
                              {row.ratio}
                            </td>
                            <td style={{ padding: "0.5rem 0.8rem" }}>
                              <span
                                style={{
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: 4,
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  background:
                                    row.statusColor === C.teal
                                      ? "rgba(0,212,170,0.15)"
                                      : "rgba(251,191,36,0.15)",
                                  color: row.statusColor,
                                }}
                              >
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ④ 앙상블 구성 */}
            {activeTab === "ensemble" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "280px 1fr",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>앙상블 구성 모델 선택</div>
                    {[
                      {
                        label: "evo_17794_FFN_G3P30 (F1: 0.489)",
                        checked: true,
                      },
                      {
                        label: "evo_17793_XGB_G3P30 (F1: 0.461)",
                        checked: true,
                      },
                      {
                        label: "evo_17790_LSTM_G2P10 (F1: 0.421)",
                        checked: false,
                      },
                      {
                        label: "evo_17788_TF_G3P30 (F1: 0.453)",
                        checked: true,
                      },
                    ].map((item) => (
                      <div key={item.label} style={checkboxRowStyle}>
                        <input
                          type="checkbox"
                          defaultChecked={item.checked}
                          style={{ accentColor: C.teal }}
                        />
                        <span style={{ fontSize: "0.75rem" }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>투표 방식</div>
                    <select style={selectStyle}>
                      <option>Soft Voting (확률 평균)</option>
                      <option>Hard Voting (다수결)</option>
                      <option>가중 Soft Voting (F1 가중)</option>
                    </select>
                  </div>
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>실험명 · 모델명</div>
                    <input
                      defaultValue="Samsung_Evo"
                      style={{ ...selectStyle, marginBottom: "0.4rem" }}
                    />
                    <input
                      defaultValue="Ensemble_FFN_XGB_TF"
                      style={selectStyle}
                    />
                  </div>
                  <button style={actionBtnStyle}>
                    🔀 앙상블 생성 &amp; 등록
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "0.8rem",
                    }}
                  >
                    {[
                      { label: "앙상블 F1", val: "0.512", color: C.teal },
                      { label: "구성 모델", val: "3개", color: C.blue },
                      { label: "단일 최고", val: "0.489", color: C.amber },
                      { label: "개선폭", val: "+4.7%", color: C.teal },
                    ].map((k) => (
                      <div key={k.label} style={kpiStyle}>
                        <div style={kpiLabelStyle}>{k.label}</div>
                        <div style={{ ...kpiValStyle, color: k.color }}>
                          {k.val}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      background: bg3,
                      border: `1px solid ${border2}`,
                      borderRadius: 10,
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: textMuted,
                        marginBottom: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      모델별 기여도 비교
                    </div>
                    {[
                      {
                        name: "FFN_G3P30",
                        score: "0.489",
                        width: "95%",
                        color: C.teal,
                      },
                      {
                        name: "XGB_G3P30",
                        score: "0.461",
                        width: "89%",
                        color: C.blue,
                      },
                      {
                        name: "TF_G3P30",
                        score: "0.453",
                        width: "87%",
                        color: C.purple,
                      },
                      {
                        name: "🔀 Ensemble",
                        score: "0.512",
                        width: "100%",
                        color: C.teal,
                        gradient: true,
                      },
                    ].map((m) => (
                      <div
                        key={m.name}
                        style={{
                          marginBottom: "0.6rem",
                          paddingTop: m.gradient ? "0.6rem" : 0,
                          borderTop: m.gradient
                            ? `1px solid ${border2}`
                            : "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.72rem",
                            marginBottom: "0.2rem",
                          }}
                        >
                          <span
                            style={{
                              color: palette.body,
                              fontWeight: m.gradient ? 700 : 400,
                            }}
                          >
                            {m.name}
                          </span>
                          <span
                            style={{
                              color: m.color,
                              fontWeight: m.gradient ? 700 : 400,
                            }}
                          >
                            F1: {m.score}
                          </span>
                        </div>
                        <div
                          style={{
                            background: isDark ? "#0f1826" : "#e2e8f0",
                            borderRadius: 4,
                            height: m.gradient ? 6 : 5,
                          }}
                        >
                          <div
                            style={{
                              width: m.width,
                              height: "100%",
                              background: m.gradient
                                ? `linear-gradient(90deg, ${C.teal}, ${C.blue})`
                                : m.color,
                              borderRadius: 4,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      background: bg3,
                      border: `1px solid ${border2}`,
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "0.8rem",
                      }}
                    >
                      <thead>
                        <tr>
                          {["모델", "타입", "세대", "F1", "앙상블 포함"].map(
                            (h) => (
                              <th
                                key={h}
                                style={{
                                  color: textMuted,
                                  fontSize: "0.7rem",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  padding: "0.5rem 0.8rem",
                                  borderBottom: `1px solid ${border2}`,
                                  textAlign: "left",
                                }}
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            model: "evo_17794...",
                            type: "FFN",
                            gen: "3세대 / Pop 30",
                            f1: "0.489",
                            f1Color: C.teal,
                            included: true,
                          },
                          {
                            model: "evo_17793...",
                            type: "XGBoost",
                            gen: "3세대 / Pop 30",
                            f1: "0.461",
                            f1Color: C.blue,
                            included: true,
                          },
                          {
                            model: "evo_17790...",
                            type: "LSTM",
                            gen: "2세대 / Pop 10",
                            f1: "0.421",
                            f1Color: palette.body,
                            included: false,
                          },
                          {
                            model: "evo_17788...",
                            type: "Transformer",
                            gen: "3세대 / Pop 30",
                            f1: "0.453",
                            f1Color: C.purple,
                            included: true,
                          },
                        ].map((row) => (
                          <tr key={row.model}>
                            <td
                              style={{
                                padding: "0.5rem 0.8rem",
                                color: palette.body,
                              }}
                            >
                              {row.model}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem 0.8rem",
                                color: palette.body,
                              }}
                            >
                              {row.type}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem 0.8rem",
                                color: palette.body,
                              }}
                            >
                              {row.gen}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem 0.8rem",
                                color: row.f1Color,
                                fontWeight: 700,
                              }}
                            >
                              {row.f1}
                            </td>
                            <td style={{ padding: "0.5rem 0.8rem" }}>
                              {row.included ? (
                                <span style={{ color: C.teal }}>✓ 포함</span>
                              ) : (
                                <span style={{ color: textMuted }}>제외</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div
                    style={{
                      background: "rgba(0,212,170,0.06)",
                      border: "1px solid rgba(0,212,170,0.15)",
                      borderRadius: 8,
                      padding: "0.7rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    <span>✅</span>
                    <div style={{ fontSize: "0.8rem", color: palette.body }}>
                      앙상블 모델이{" "}
                      <strong style={{ color: C.teal }}>Staging</strong>으로
                      등록됩니다. 레지스트리에서 성능 비교 후 Production으로
                      승격하세요.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ⑤ Production 예측 */}
            {activeTab === "predict" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "280px 1fr",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>예측 모델 선택</div>
                    <select style={selectStyle}>
                      <option>🟢 Ensemble_FFN_XGB_TF (Production)</option>
                      <option>🟡 evo_17794_FFN_G3P30 (Staging)</option>
                    </select>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.5rem 0.7rem",
                        background: "rgba(0,212,170,0.08)",
                        borderRadius: 6,
                        fontSize: "0.72rem",
                        color: palette.body,
                      }}
                    >
                      F1 <strong style={{ color: C.teal }}>0.512</strong> · 세대
                      3 · Pop 30 · Horizon <strong>10일</strong>
                    </div>
                  </div>
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>예측 종목</div>
                    <select style={selectStyle}>
                      <option>삼성전자 (005930.KS)</option>
                      <option>BTC-USD (비트코인)</option>
                      <option>KOSPI (^KS11)</option>
                    </select>
                  </div>
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>예측 옵션</div>
                    {["신뢰구간 표시", "국면 색상 오버레이"].map((item) => (
                      <div key={item} style={checkboxRowStyle}>
                        <input
                          type="checkbox"
                          defaultChecked
                          style={{ accentColor: C.teal }}
                        />
                        {item}
                      </div>
                    ))}
                    <div style={{ marginTop: "0.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.75rem",
                          color: palette.body,
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span>예측 horizon</span>
                        <span style={{ color: C.teal }}>5일</span>
                      </div>
                      <input
                        type="range"
                        defaultValue={5}
                        min={1}
                        max={20}
                        style={{ width: "100%", accentColor: C.teal }}
                      />
                    </div>
                  </div>
                  <button style={actionBtnStyle}>📈 예측 실행</button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "0.8rem",
                    }}
                  >
                    {[
                      { label: "예측 클래스", val: "↑ 상승", color: C.teal },
                      { label: "앙상블 F1", val: "0.512", color: C.teal },
                      { label: "상승 확률", val: "63%", color: C.blue },
                      { label: "Horizon", val: "10일 후", color: palette.body },
                    ].map((k) => (
                      <div key={k.label} style={kpiStyle}>
                        <div style={kpiLabelStyle}>{k.label}</div>
                        <div
                          style={{
                            ...kpiValStyle,
                            color: k.color,
                            fontSize:
                              k.label === "Horizon" ? "0.85rem" : "1.4rem",
                          }}
                        >
                          {k.val}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={chartAreaStyle}>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: textMuted,
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 1,
                      }}
                    >
                      실제 vs 예측 (최근 30일 + 5일 선행)
                    </div>
                    <DemoLineChart
                      id={`predict-${tabKey}`}
                      buildData={() => {
                        const hist = 30;
                        const future = 5;
                        const n = hist + future;
                        const labels = Array.from({ length: n }, () => "");
                        const actual = randDemoArr(hist, 200, 18);
                        const predHist = actual.map(
                          (v) => +(v + (Math.random() - 0.5) * 3).toFixed(2),
                        );
                        const lastVal = actual[actual.length - 1];
                        const predFuture = [
                          lastVal * 1.0123,
                          lastVal * 1.0213,
                          lastVal * 1.0197,
                          lastVal * 1.0261,
                          lastVal * 1.0364,
                        ].map((v) => +v.toFixed(2));
                        return {
                          labels,
                          datasets: [
                            {
                              data: [...actual, ...Array(future).fill(null)],
                              borderColor: "#94a3b8",
                              borderWidth: 1.5,
                              pointRadius: 0,
                              fill: false,
                              tension: 0.4,
                            },
                            {
                              data: [...predHist, ...Array(future).fill(null)],
                              borderColor: "#00d4aa",
                              borderWidth: 1.5,
                              pointRadius: 0,
                              fill: false,
                              tension: 0.4,
                              borderDash: [2, 2],
                            },
                            {
                              data: [
                                ...Array(hist - 1).fill(null),
                                actual[hist - 1],
                                ...predFuture,
                              ],
                              borderColor: "#00d4aa",
                              borderWidth: 2.5,
                              pointRadius: 0,
                              fill: false,
                              tension: 0.3,
                            },
                          ],
                        };
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(0,212,170,0.06)",
                        border: "1px solid rgba(0,212,170,0.15)",
                        borderRadius: 8,
                        padding: "0.8rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: textMuted,
                          marginBottom: "0.4rem",
                        }}
                      >
                        5일 예측 요약
                      </div>
                      {[
                        ["+1일", "+1.23%", C.teal],
                        ["+2일", "+0.87%", C.teal],
                        ["+3일", "-0.14%", C.amber],
                        ["+4일", "+0.62%", C.teal],
                        ["+5일", "+1.01%", C.teal],
                      ].map(([day, val, color]) => (
                        <div
                          key={String(day)}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.78rem",
                            marginBottom: "0.2rem",
                          }}
                        >
                          <span style={{ color: palette.body }}>{day}</span>
                          <span style={{ color: String(color) }}>{val}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        background: bg3,
                        border: `1px solid ${border2}`,
                        borderRadius: 8,
                        padding: "0.8rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: textMuted,
                          marginBottom: "0.4rem",
                        }}
                      >
                        모델별 예측값 (+1일)
                      </div>
                      {[
                        ["FFN_G3P30", "상승 (61%)", C.teal],
                        ["XGB_G3P30", "상승 (64%)", C.teal],
                        ["TF_G3P30", "상승 (59%)", C.blue],
                        ["🔀 앙상블", "상승 (63%)", C.teal],
                      ].map(([name, val, color]) => (
                        <div
                          key={String(name)}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.78rem",
                            marginBottom: "0.2rem",
                          }}
                        >
                          <span
                            style={{
                              color: palette.body,
                              fontWeight: String(name).includes("앙상블")
                                ? 700
                                : 400,
                            }}
                          >
                            {name}
                          </span>
                          <span
                            style={{
                              color: String(color),
                              fontWeight: String(name).includes("앙상블")
                                ? 700
                                : 400,
                            }}
                          >
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ⑥ 드리프트 모니터링 */}
            {activeTab === "monitor" && (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "0.8rem",
                    marginBottom: "1rem",
                  }}
                >
                  {[
                    { label: "전체 Drift Score", val: "0.18", color: C.amber },
                    { label: "PSI 임계값", val: "0.20", color: palette.body },
                    { label: "이상 피처 수", val: "2", color: C.amber },
                    {
                      label: "마지막 검사",
                      val: "5분 전",
                      color: palette.body,
                    },
                  ].map((k) => (
                    <div key={k.label} style={kpiStyle}>
                      <div style={kpiLabelStyle}>{k.label}</div>
                      <div
                        style={{
                          ...kpiValStyle,
                          color: k.color,
                          fontSize: "1.4rem",
                        }}
                      >
                        {k.val}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={chartAreaStyle}>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: textMuted,
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 1,
                      }}
                    >
                      Drift Score 추이 (30일)
                    </div>
                    <DemoLineChart
                      id={`monitor-drift-${tabKey}`}
                      buildData={() => {
                        const n = 30;
                        const labels = Array.from({ length: n }, () => "");
                        const drift = Array.from(
                          { length: n },
                          (_, i) =>
                            +(0.04 + i * 0.005 + Math.random() * 0.018).toFixed(
                              3,
                            ),
                        );
                        const threshold = Array(n).fill(0.2);
                        return {
                          labels,
                          datasets: [
                            {
                              data: drift,
                              borderColor: "#fbbf24",
                              borderWidth: 2,
                              pointRadius: 0,
                              fill: false,
                              tension: 0.4,
                            },
                            {
                              data: threshold,
                              borderColor: "#f87171",
                              borderWidth: 1,
                              pointRadius: 0,
                              fill: false,
                              tension: 0,
                            },
                          ],
                        };
                      }}
                    />
                  </div>
                  <div style={chartAreaStyle}>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: textMuted,
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 1,
                      }}
                    >
                      피처별 PSI 점수
                    </div>
                    <DemoBarChart
                      id={`monitor-psi-${tabKey}`}
                      buildData={() => {
                        const psi = [
                          0.23, 0.19, 0.14, 0.11, 0.09, 0.08, 0.06, 0.04,
                        ];
                        return {
                          labels: [
                            "RSI_14",
                            "Volume_20d",
                            "MACD",
                            "BB_upper",
                            "Return_5d",
                            "Regime",
                            "ATR",
                            "Lag_1",
                          ],
                          data: psi,
                          colors: psi.map((v) =>
                            v >= 0.2
                              ? "#f87171"
                              : v >= 0.15
                                ? "#fbbf24"
                                : "#00d4aa",
                          ),
                        };
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(251,191,36,0.08)",
                      border: "1px solid rgba(251,191,36,0.2)",
                      borderRadius: 8,
                      padding: "0.8rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>⚠️</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: C.amber,
                        }}
                      >
                        거래량 피처 (Volume_20d_avg) PSI 0.19 — 임계값 근접
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: textMuted,
                          marginTop: "0.2rem",
                        }}
                      >
                        최근 14일간 평균 거래량 분포가 학습 기간 대비 이동 감지
                      </div>
                    </div>
                    <button
                      style={{
                        padding: "0.3rem 0.8rem",
                        background: C.amber,
                        color: "#0a0e1a",
                        border: "none",
                        borderRadius: 6,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      즉시 재학습
                    </button>
                  </div>
                  <div
                    style={{
                      background: "rgba(248,113,113,0.06)",
                      border: "1px solid rgba(248,113,113,0.15)",
                      borderRadius: 8,
                      padding: "0.8rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>🔴</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: C.red,
                        }}
                      >
                        RSI 피처 PSI 0.23 — 임계값 초과
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: textMuted,
                          marginTop: "0.2rem",
                        }}
                      >
                        자동 재학습 트리거 대기 중 (다음 배치: 00:00)
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "0.2rem 0.6rem",
                        background: "rgba(248,113,113,0.15)",
                        color: C.red,
                        borderRadius: 4,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      자동 처리 예정
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ⑦ 모델 레지스트리 */}
            {activeTab === "registry" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={sidebarStyle}>
                    <div style={widgetTitleStyle}>실험 요약</div>
                    {[
                      ["총 Run", "12회", C.teal],
                      ["Production", "1개", C.teal],
                      ["Staging", "2개", C.amber],
                      ["None", "1개", textMuted],
                      ["Archived", "8개", textMuted],
                    ].map(([label, val, color]) => (
                      <div
                        key={String(label)}
                        style={{
                          fontSize: "0.75rem",
                          color: palette.body,
                          marginBottom: "0.3rem",
                        }}
                      >
                        {label}:{" "}
                        <strong style={{ color: String(color) }}>{val}</strong>
                      </div>
                    ))}
                  </div>
                  <div style={{ ...sidebarStyle, marginTop: "0.8rem" }}>
                    <div style={widgetTitleStyle}>선택 모델 관리</div>
                    <select style={{ ...selectStyle, fontSize: "0.7rem" }}>
                      <option>evo_17794_FFN_G3P30 (Staging)</option>
                    </select>
                    <button
                      style={{
                        ...actionBtnStyle,
                        fontSize: "0.72rem",
                        marginTop: "0.4rem",
                      }}
                    >
                      📤 Production 승격
                    </button>
                    <button
                      style={{
                        ...actionBtnStyle,
                        fontSize: "0.72rem",
                        marginTop: "0.4rem",
                        background: "rgba(79,156,249,0.12)",
                        color: C.blue,
                        border: `1px solid rgba(79,156,249,0.2)`,
                      }}
                    >
                      🤖 자동 프로모션
                    </button>
                    <button
                      style={{
                        ...actionBtnStyle,
                        fontSize: "0.72rem",
                        marginTop: "0.4rem",
                        background: "rgba(248,113,113,0.08)",
                        color: C.red,
                        border: `1px solid rgba(248,113,113,0.2)`,
                      }}
                    >
                      🗑️ 삭제
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    overflow: "hidden",
                    border: `1px solid ${border2}`,
                    borderRadius: 10,
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.75rem",
                    }}
                  >
                    <thead>
                      <tr style={{ background: bg3 }}>
                        {[
                          "Run ID",
                          "모델명",
                          "타입",
                          "Stage",
                          "Val F1",
                          "세대/Pop",
                          "Horizon",
                          "생성일",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              color: textMuted,
                              fontSize: "0.65rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              padding: "0.5rem 0.8rem",
                              borderBottom: `1px solid ${border2}`,
                              textAlign: "left",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "evo_17795507...",
                          name: "Ensemble_FFN_XGB_TF",
                          type: "앙상블",
                          stage: "Production",
                          stageColor: C.teal,
                          stageBg: "rgba(0,212,170,0.15)",
                          f1: "0.512",
                          f1Color: C.teal,
                          gen: "3세대/Pop30",
                          horizon: "10일",
                          date: "2025-05-23",
                        },
                        {
                          id: "evo_17794...",
                          name: "FFN_G3P30",
                          type: "FFN",
                          stage: "Staging",
                          stageColor: C.amber,
                          stageBg: "rgba(251,191,36,0.15)",
                          f1: "0.489",
                          f1Color: C.blue,
                          gen: "3세대/Pop30",
                          horizon: "10일",
                          date: "2025-05-22",
                        },
                        {
                          id: "evo_17793...",
                          name: "XGB_G3P30",
                          type: "XGB",
                          stage: "Staging",
                          stageColor: C.amber,
                          stageBg: "rgba(251,191,36,0.15)",
                          f1: "0.461",
                          f1Color: C.blue,
                          gen: "3세대/Pop30",
                          horizon: "10일",
                          date: "2025-05-22",
                        },
                        {
                          id: "evo_17790...",
                          name: "LSTM_G2P10",
                          type: "LSTM",
                          stage: "None",
                          stageColor: textMuted,
                          stageBg: "rgba(100,116,139,0.15)",
                          f1: "0.421",
                          f1Color: textMuted,
                          gen: "2세대/Pop10",
                          horizon: "10일",
                          date: "2025-05-21",
                        },
                        {
                          id: "evo_17788...",
                          name: "TF_G3P30",
                          type: "TF",
                          stage: "Archived",
                          stageColor: C.red,
                          stageBg: "rgba(248,113,113,0.15)",
                          f1: "0.453",
                          f1Color: textMuted,
                          gen: "3세대/Pop30",
                          horizon: "5일",
                          date: "2025-05-18",
                        },
                      ].map((row) => (
                        <tr key={row.id}>
                          <td
                            style={{
                              padding: "0.5rem 0.8rem",
                              fontFamily: "monospace",
                              fontSize: "0.63rem",
                              color: textMuted,
                            }}
                          >
                            {row.id}
                          </td>
                          <td
                            style={{
                              padding: "0.5rem 0.8rem",
                              color: palette.body,
                            }}
                          >
                            {row.name}
                          </td>
                          <td style={{ padding: "0.5rem 0.8rem" }}>
                            <span
                              style={{
                                padding: "0.15rem 0.5rem",
                                borderRadius: 4,
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                background: "rgba(100,116,139,0.15)",
                                color: textMuted,
                              }}
                            >
                              {row.type}
                            </span>
                          </td>
                          <td style={{ padding: "0.5rem 0.8rem" }}>
                            <span
                              style={{
                                padding: "0.15rem 0.5rem",
                                borderRadius: 4,
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                background: row.stageBg,
                                color: row.stageColor,
                              }}
                            >
                              {row.stage}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "0.5rem 0.8rem",
                              color: row.f1Color,
                              fontWeight: 700,
                            }}
                          >
                            {row.f1}
                          </td>
                          <td
                            style={{
                              padding: "0.5rem 0.8rem",
                              color: palette.body,
                            }}
                          >
                            {row.gen}
                          </td>
                          <td
                            style={{
                              padding: "0.5rem 0.8rem",
                              color: palette.body,
                            }}
                          >
                            {row.horizon}
                          </td>
                          <td
                            style={{
                              padding: "0.5rem 0.8rem",
                              color: textMuted,
                            }}
                          >
                            {row.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Options / Extensibility Section ─────────────────────────────────────────

function OptionsSection({
  palette,
  isDark,
}: {
  palette: Palette;
  isDark: boolean;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const sectionBg = isDark ? "#111111" : "#ffffff";
  const bg3 = isDark ? "#1a2234" : "#e8edf5";
  const border2 = isDark ? "#1e3050" : "rgba(0,0,0,0.06)";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  const tagStyle = (type: "available" | "custom" | "coming") => ({
    fontSize: "0.65rem",
    fontWeight: 700,
    padding: "0.15rem 0.5rem",
    borderRadius: 4,
    background:
      type === "available"
        ? "rgba(0,212,170,0.15)"
        : type === "custom"
          ? "rgba(167,139,250,0.15)"
          : isDark
            ? "rgba(100,116,139,0.1)"
            : "rgba(0,0,0,0.06)",
    color:
      type === "available"
        ? C.teal
        : type === "custom"
          ? C.purple
          : palette.muted,
  });

  const optionItem = (
    name: string,
    type: "available" | "custom" | "coming",
  ) => (
    <div
      key={name}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: bg3,
        borderRadius: 8,
        padding: "0.6rem 1rem",
      }}
    >
      <span style={{ fontSize: "0.85rem", color: palette.body }}>{name}</span>
      <span style={tagStyle(type)}>
        {type === "available"
          ? "내장"
          : type === "custom"
            ? "확장 가능"
            : "예정"}
      </span>
    </div>
  );

  const cardData = [
    {
      title: "📥 데이터 수집",
      items: [
        ["Yahoo Finance (주식/ETF/지수)", "available"],
        ["FRED (미국 경제 지표 800+종)", "available"],
        ["Binance (암호화폐 OHLCV)", "available"],
        ["CSV / Excel 파일 직접 업로드", "available"],
        ["사내 DB / 사설 API 연동", "custom"],
        ["실시간 스트리밍 (WebSocket)", "custom"],
      ] as [string, "available" | "custom" | "coming"][],
      note: {
        path: "src/data/collectors.py",
        desc: "에 함수 하나 추가 후 대시보드 드롭다운에 이름을 등록하면 즉시 사용 가능합니다. 반환 형식은 pd.DataFrame이면 충분합니다.",
      },
    },
    {
      title: "🔧 피처 엔지니어링",
      items: [
        ["기술적 지표 (RSI·MACD·볼린저·스토캐스틱·ATR)", "available"],
        ["롤링 통계 (평균·표준편차·첨도·왜도)", "available"],
        ["시계열 분해 (추세·계절성·잔차)", "available"],
        ["시장 국면 레이블 (HMM 3-State)", "available"],
        ["Lag 피처 / 자기상관 피처", "available"],
        ["외부 NLP 감성·이벤트 피처", "custom"],
      ] as [string, "available" | "custom" | "coming"][],
      note: {
        path: "src/features/feature_engineering.py",
        desc: "의 add_custom_features(df)에 원하는 계산식을 추가하면 학습 파이프라인에 자동 포함됩니다.",
      },
    },
    {
      title: "🤖 모델 옵션",
      items: [
        ["XGBoost — 프리셋: 기본·정밀·경량", "available"],
        ["LSTM — 단방향/양방향·레이어·시퀀스 길이", "available"],
        ["Transformer — d_model·헤드 수·레이어 수", "available"],
        ["AutoEncoder — 인코더 차원·이상 임계값", "available"],
        ["Prophet · N-BEATS · TiDE", "custom"],
        ["LLM 기반 제로샷 예측", "coming"],
      ] as [string, "available" | "custom" | "coming"][],
      note: {
        path: "BaseTimeSeriesModel",
        desc: "을 상속하고 fit()·predict() 두 메서드만 구현하면 레지스트리·모니터링·앙상블 전체에 자동 통합됩니다.",
      },
    },
    {
      title: "📊 모니터링 & 메트릭",
      items: [
        ["Sharpe · Calmar · Sortino Ratio", "available"],
        ["MDD (최대 낙폭) · RMSE · MAE", "available"],
        ["PSI 드리프트 점수 (피처별)", "available"],
        ["피처 중요도 시계열 추적", "available"],
        ["드리프트 임계값 자동 알림", "available"],
        ["Slack · 이메일 외부 알림", "custom"],
      ] as [string, "available" | "custom" | "coming"][],
      note: {
        path: "src/monitoring/drift_detector.py",
        desc: "에 커스텀 메트릭을 추가합니다. 드리프트 임계값(기본 PSI 0.2)은 대시보드 슬라이더로 즉시 조정됩니다.",
      },
    },
  ];

  return (
    <section
      id="options"
      aria-labelledby="options-heading"
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
            확장성
          </div>
          <h2
            id="options-heading"
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
            모든 옵션이 커스터마이징 가능합니다
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: palette.body,
              maxWidth: 600,
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            기본 설정만으로도 즉시 운영 가능하며, 도메인 전문 지식에 맞게 각
            단계를 세밀하게 조정할 수 있습니다.
          </p>
        </motion.div>

        {/* Design principle + code example */}
        <div
          className="grid grid-cols-1 gap-8 lg:grid-cols-2"
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{
              background: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`,
              borderRadius: 14,
              padding: "1.8rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: C.teal,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "0.8rem",
              }}
            >
              설계 원칙
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: palette.body,
                lineHeight: 1.8,
                marginBottom: "1rem",
              }}
            >
              모든 구성 요소는{" "}
              <strong style={{ color: palette.heading }}>독립 모듈</strong>로
              분리되어 있습니다. 데이터 수집기·피처 생성기·모델·메트릭 중 어느
              하나를 교체하거나 추가해도 나머지 파이프라인은 변경 없이
              작동합니다.
            </p>
            {[
              "기본값만으로 즉시 운영 가능",
              "도메인 전문 지식 반영 위한 세밀한 조정 지원",
              "추가 코드 최소화 — 표준 인터페이스 준수만으로 통합",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontSize: "0.82rem",
                  color: palette.body,
                  marginBottom: "0.4rem",
                }}
              >
                <span style={{ color: C.teal }}>✓</span>
                {item}
              </div>
            ))}
          </div>
          <div
            style={{
              background: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`,
              borderRadius: 14,
              padding: "1.8rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: C.purple,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "0.8rem",
              }}
            >
              새 모델 추가 예시
            </div>
            <pre
              style={{
                background: isDark ? "#0a0e1a" : "#f1f5f9",
                border: `1px solid ${border2}`,
                borderRadius: 8,
                padding: "1rem",
                fontSize: "0.72rem",
                color: palette.body,
                overflowX: "auto",
                lineHeight: 1.6,
              }}
            >
              {`from src.models.base_model import BaseTimeSeriesModel\n\nclass MyModel(BaseTimeSeriesModel):\n    def __init__(self):\n        super().__init__("MyModel", is_regression=True)\n\n    def fit(self, X, y, **kwargs):\n        # 학습 로직\n        self.is_fitted = True\n        return self\n\n    def predict(self, X):\n        return self.model.predict(X)`}
            </pre>
            <div
              style={{
                marginTop: "0.7rem",
                fontSize: "0.78rem",
                color: palette.muted,
              }}
            >
              이것이 전부입니다. 대시보드에 자동으로 등록됩니다.
            </div>
          </div>
        </div>

        {/* Options cards grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {cardData.map((card) => (
            <motion.div
              key={card.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
              viewport={{ once: true, margin: "-40px" }}
              style={{
                background: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`,
                borderRadius: 16,
                padding: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: palette.heading,
                  marginBottom: "1.2rem",
                }}
              >
                {card.title}
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  marginBottom: "1rem",
                }}
              >
                {card.items.map(([name, type]) => optionItem(name, type))}
              </div>
              <div
                style={{
                  padding: "0.8rem 1rem",
                  background: isDark
                    ? "rgba(0,212,170,0.05)"
                    : "rgba(0,212,170,0.04)",
                  border: "1px dashed rgba(0,212,170,0.2)",
                  borderRadius: 8,
                  fontSize: "0.8rem",
                  color: palette.body,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: palette.heading,
                    marginBottom: "0.3rem",
                  }}
                >
                  확장 방법
                </div>
                <code style={{ color: C.teal }}>{card.note.path}</code>
                {card.note.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Architecture Section ─────────────────────────────────────────────────────

function ArchitectureSection({
  palette,
  isDark,
}: {
  palette: Palette;
  isDark: boolean;
}) {
  const sectionBg = isDark ? "#111111" : "#ffffff";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const steps = [
    { icon: "📥", title: "데이터 수집", desc: "다중 소스 자동 수집" },
    { icon: "🔧", title: "피처 엔지니어링", desc: "60+ 시계열 피처 생성" },
    { icon: "🧠", title: "Walk-Forward 학습", desc: "시간 축 보존 검증" },
    { icon: "🗂️", title: "모델 레지스트리", desc: "버전 관리 및 승격" },
    { icon: "📊", title: "모니터링", desc: "드리프트 감지 · 재학습" },
  ];

  return (
    <section
      style={{
        background: sectionBg,
        padding: "clamp(48px, 8vw, 80px) 32px",
        borderTop: `1px solid ${borderY}`,
      }}
    >
      <div className="mx-auto max-w-[1200px]">
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
          파이프라인 아키텍처
        </div>
        <h2
          className="text-balance"
          style={{
            fontSize: "clamp(20px, 3vw, 1.8rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: palette.heading,
            lineHeight: 1.1,
            margin: "0 0 3rem",
          }}
        >
          end-to-end 자동화 파이프라인
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 0,
            overflowX: "auto",
            paddingBottom: "1rem",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.title}
              style={{ display: "flex", alignItems: "center", flex: 1 }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: 120,
                  background: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`,
                  borderRadius: 12,
                  padding: "1.2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
                  {step.icon}
                </div>
                <h4
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: palette.heading,
                    marginBottom: "0.25rem",
                  }}
                >
                  {step.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: palette.muted,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.teal,
                    fontSize: "1.3rem",
                    flexShrink: 0,
                  }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Use Cases Section ────────────────────────────────────────────────────────

function UseCasesSection({
  palette,
  isDark,
}: {
  palette: Palette;
  isDark: boolean;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const sectionBg = isDark ? "#111111" : "#ffffff";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  const cases = [
    {
      icon: "📈",
      title: "퀀트 트레이딩 / 자산운용",
      desc: "주식·ETF·암호화폐의 가격 방향 예측, 알파 신호 생성, 포트폴리오 리스크 모니터링. 시장 국면 변화 시 자동 재학습.",
      metrics: ["방향 정확도 87%", "Sharpe 2.4+", "MDD 관리"],
    },
    {
      icon: "🏭",
      title: "제조 · 공정 이상 탐지",
      desc: "센서 데이터 시계열에서 이상 패턴을 탐지하고, 설비 고장 예측 모델의 성능을 실시간 모니터링합니다.",
      metrics: ["이상 감지 F1 92%", "예방 정비", "가동률 향상"],
    },
    {
      icon: "🛒",
      title: "유통 · 수요 예측",
      desc: "매출, 재고, 수요의 시계열 패턴을 학습하고 계절성·트렌드 변화에 자동 적응하는 수요 예측 시스템을 구축합니다.",
      metrics: ["MAPE 8% 이하", "재고 최적화", "자동 재학습"],
    },
    {
      icon: "⚡",
      title: "에너지 · 전력 수요 예측",
      desc: "시간대·날씨·이벤트 피처를 결합한 전력 수요 예측, 신재생에너지 발전량 예측으로 그리드 안정성을 높입니다.",
      metrics: ["24시간 선행 예측", "RMSE 최소화", "실시간 갱신"],
    },
    {
      icon: "🏦",
      title: "금융 리스크 관리",
      desc: "VaR, 신용 스코어, 부도 예측 등 시계열 기반 리스크 모델의 성능 저하를 조기에 감지하고 규제 컴플라이언스를 유지합니다.",
      metrics: ["모델 감사 추적", "드리프트 알림", "자동 문서화"],
    },
    {
      icon: "🌡️",
      title: "헬스케어 · 생체 신호",
      desc: "ECG, 혈당, 활동 센서 데이터의 이상 감지 및 예측 모델 관리. 환자 개인별 기저 변화에 자동 적응합니다.",
      metrics: ["개인화 적응", "이상 탐지", "실시간 모니터링"],
    },
  ];

  return (
    <section
      id="usecases"
      aria-labelledby="usecases-heading"
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
            활용 사례
          </div>
          <h2
            id="usecases-heading"
            className="text-balance"
            style={{
              fontSize: "clamp(24px, 3.5vw, 2.2rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: palette.heading,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            어떤 비즈니스에 필요한가요?
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : i * 0.07,
              }}
              viewport={{ once: true, margin: "-40px" }}
              style={{
                background: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`,
                borderRadius: 16,
                padding: "1.8rem",
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
                {c.icon}
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: palette.heading,
                  marginBottom: "0.5rem",
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: palette.body,
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                {c.desc}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap" as const,
                }}
              >
                {c.metrics.map((m) => (
                  <span
                    key={m}
                    style={{
                      background: "rgba(0,212,170,0.08)",
                      border: "1px solid rgba(0,212,170,0.15)",
                      borderRadius: 6,
                      padding: "0.2rem 0.6rem",
                      fontSize: "0.7rem",
                      color: C.teal,
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────

function CTASection({
  palette,
  isDark,
}: {
  palette: Palette;
  isDark: boolean;
}) {
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const sectionBg = isDark
    ? "linear-gradient(135deg, rgba(0,212,170,0.08) 0%, rgba(79,156,249,0.05) 100%)"
    : "linear-gradient(135deg, rgba(0,212,170,0.06) 0%, rgba(79,156,249,0.04) 100%)";

  return (
    <section
      id="platform-cta"
      style={{
        background: sectionBg,
        borderTop: `1px solid ${borderY}`,
        textAlign: "center",
        padding: "clamp(72px, 12vw, 120px) 32px",
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(0,212,170,0.1)",
            border: "1px solid rgba(0,212,170,0.3)",
            color: C.teal,
            padding: "0.35rem 0.9rem",
            borderRadius: 20,
            fontSize: "0.8rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
          }}
        >
          지금 바로 시작할 수 있습니다
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 2.8rem)",
            fontWeight: 700,
            color: palette.heading,
            marginBottom: "1rem",
            letterSpacing: "-0.03em",
          }}
        >
          AI 모델을 <span style={{ color: C.teal }}>살아있게</span> 만드세요
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: palette.body,
            marginBottom: "2.5rem",
            maxWidth: 560,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          한 번 만들고 방치하는 AI가 아닌, 데이터와 함께 진화하는 AI 시스템을
          구축하세요. 설치부터 첫 Production 배포까지 30분이면 충분합니다.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap" as const,
            marginBottom: "3rem",
          }}
        >
          <a
            href="#demo"
            style={{
              background: C.teal,
              color: "#0a0e1a",
              padding: "0.85rem 2rem",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            데모 다시 보기
          </a>
          <a
            href="#casestudy"
            style={{
              border: `1px solid ${palette.cardBorder}`,
              color: palette.body,
              padding: "0.85rem 2rem",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            실측 결과 확인
          </a>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            flexWrap: "wrap" as const,
          }}
        >
          {[
            { val: "100%", label: "로컬 설치 · 데이터 외부 전송 없음" },
            { val: "4종", label: "내장 AI 모델 + 무제한 확장" },
            { val: "No-Code", label: "웹 대시보드 완전 운영" },
          ].map((s) => (
            <div key={s.val} style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: "1.8rem", fontWeight: 800, color: C.teal }}
              >
                {s.val}
              </div>
              <div style={{ fontSize: "0.85rem", color: palette.muted }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MakeAIOps() {
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = useHtmlIsDark();
  const palette = paletteFor(isDark);

  const sectionBg = isDark ? "#111111" : "#ffffff";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  return (
    <>
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
          </motion.div>
        </div>
      </section>

      <DemoSection palette={palette} isDark={isDark} />

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
            <h2
              id="platform-heading"
              className="text-balance"
              style={{
                fontSize: "clamp(24px, 3.5vw, 2.2rem)",
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

          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
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
      <CaseStudySection palette={palette} isDark={isDark} />
      {/* <DemoSection palette={palette} isDark={isDark} /> */}
      <OptionsSection palette={palette} isDark={isDark} />
      <ArchitectureSection palette={palette} isDark={isDark} />
      <UseCasesSection palette={palette} isDark={isDark} />
      <CTASection palette={palette} isDark={isDark} />
    </>
  );
}
