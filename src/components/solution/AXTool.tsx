import { useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";

const FRAMEWORK_INPUTS = [
  "OECD",
  "UNESCO",
  "EU DigComp 3.0",
  "MIT RASE",
] as const;

const FRAMEWORK_OUTPUTS = [
  "5개 수준 역량 차원",
  "다수준 체계 평가",
  "글로벌 기준 측정 지표",
  "한국형 리더십/경영 평가",
] as const;

const FEATURES = [
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
    icon: "🌐",
    title: "글로벌 기준 측정 지표",
    description:
      "EU·OECD·UNESCO·MIT 등 국제 표준 프레임워크를 기반으로 신뢰할 수 있는 측정 지표를 제공합니다.",
  },
  {
    icon: "🇰🇷",
    title: "한국형 리더십/경영 평가",
    description:
      "국내 조직 문화와 경영 환경을 반영한 한국형 리더십·경영 평가 지표를 함께 제공합니다.",
  },
] as const;

const WORKFLOW_TARGETS = [
  "교육기관용\nAX 진단",
  "기업 및 조직\nAX 진단",
  "정책 수립용\nAX 진단",
] as const;

type PreviewType = "assess" | "report" | "roadmap";

const PROCESS_STEPS: {
  title: string;
  gradient: string;
  accentColor: string;
  previewType: PreviewType;
}[] = [
  {
    title: "AX 평가 및 진단",
    gradient: "linear-gradient(120deg, #d946ef 0%, #a855f7 100%)",
    accentColor: "#d946ef",
    previewType: "assess",
  },
  {
    title: "AI 평가 리포트",
    gradient: "linear-gradient(120deg, #a855f7 0%, #7c3aed 100%)",
    accentColor: "#a855f7",
    previewType: "report",
  },
  {
    title: "역량 향상 로드맵",
    gradient: "linear-gradient(120deg, #7c3aed 0%, #4c1d95 100%)",
    accentColor: "#7c3aed",
    previewType: "roadmap",
  },
];

type Palette = {
  sectionBg: string;
  borderY: string;
  heading: string;
  overline: string;
  subtitle: string;
  body: string;
  muted: string;
  cardBg: string;
  cardBorder: string;
  iconBg: string;
  iconBorder: string;
  featureTitle: string;
  fwInputBg: string;
  fwInputText: string;
  fwOutputBg: string;
  fwOutputText: string;
  fwOutputBorder: string;
  arrowColor: string;
  bottomBg: string;
  bottomBorder: string;
  targetBoxBg: string;
  targetBoxBorder: string;
  targetBoxText: string;
  previewBg: string;
  previewBorder: string;
  previewTitle: string;
  previewBody: string;
  previewMuted: string;
  previewSubBg: string;
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
      cardBg: "#1a1a1a",
      cardBorder: "rgba(255,255,255,0.12)",
      iconBg: "rgba(0,212,170,0.1)",
      iconBorder: "rgba(0,212,170,0.2)",
      featureTitle: "#e8e8e8",
      fwInputBg: "#172554",
      fwInputText: "#bfdbfe",
      fwOutputBg: "rgba(96,165,250,0.1)",
      fwOutputText: "#93c5fd",
      fwOutputBorder: "rgba(96,165,250,0.22)",
      arrowColor: "rgba(255,255,255,0.55)",
      bottomBg: "#141414",
      bottomBorder: "rgba(255,255,255,0.08)",
      targetBoxBg: "#1e1e1e",
      targetBoxBorder: "rgba(255,255,255,0.12)",
      targetBoxText: "#e0e0e0",
      previewBg: "#1a1a1a",
      previewBorder: "rgba(255,255,255,0.08)",
      previewTitle: "#e0e0e0",
      previewBody: "rgba(255,255,255,0.5)",
      previewMuted: "rgba(255,255,255,0.28)",
      previewSubBg: "rgba(255,255,255,0.04)",
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
    cardBg: "#ffffff",
    cardBorder: "rgba(0,0,0,0.1)",
    iconBg: "rgba(0,212,170,0.08)",
    iconBorder: "rgba(0,212,170,0.18)",
    featureTitle: "#18181b",
    fwInputBg: "#1e3a8a",
    fwInputText: "#ffffff",
    fwOutputBg: "#eff6ff",
    fwOutputText: "#1d4ed8",
    fwOutputBorder: "#bfdbfe",
    arrowColor: "#1e293b",
    bottomBg: "#f4f4f6",
    bottomBorder: "rgba(0,0,0,0.08)",
    targetBoxBg: "#ffffff",
    targetBoxBorder: "rgba(0,0,0,0.1)",
    targetBoxText: "#18181b",
    previewBg: "#ffffff",
    previewBorder: "rgba(0,0,0,0.09)",
    previewTitle: "#18181b",
    previewBody: "rgba(24,24,27,0.62)",
    previewMuted: "rgba(24,24,27,0.38)",
    previewSubBg: "rgba(0,0,0,0.025)",
  };
}

/* ──────────────────────────────────────────────
   Framework diagram
────────────────────────────────────────────── */
function FrameworkDiagram({
  palette,
  reduceMotion,
}: {
  palette: Palette;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.1 }}
      viewport={{ once: true, margin: "-40px" }}
      style={{
        marginTop: 28,
        display: "flex",
        alignItems: "center",
        gap: "clamp(0.75rem, 2vw, 1.5rem)",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {FRAMEWORK_INPUTS.map((fw) => (
          <div
            key={fw}
            style={{
              background: palette.fwInputBg,
              color: palette.fwInputText,
              padding: "12px clamp(14px, 2vw, 22px)",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: "clamp(0.78rem, 1.2vw, 0.92rem)",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {fw}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: palette.muted,
            textAlign: "center",
            lineHeight: 1.5,
            whiteSpace: "nowrap",
          }}
        >
          지표 통합
          <br />및 자체 지표 개발
        </span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 52,
              height: 10,
              background: palette.arrowColor,
              borderRadius: "2px 0 0 2px",
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "14px solid transparent",
              borderBottom: "14px solid transparent",
              borderLeft: `18px solid ${palette.arrowColor}`,
            }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {FRAMEWORK_OUTPUTS.map((out) => (
          <div
            key={out}
            style={{
              background: palette.fwOutputBg,
              color: palette.fwOutputText,
              border: `1px solid ${palette.fwOutputBorder}`,
              padding: "12px clamp(14px, 2vw, 22px)",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: "clamp(0.78rem, 1.2vw, 0.92rem)",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {out}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Feature card
────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────
   Step 1 detail — AX 평가 및 진단
────────────────────────────────────────────── */
function AssessDetail({ palette }: { palette: Palette }) {
  const levels = [
    {
      label: "Level 1",
      text: "6개월 이상 소요되며, 적응에 어려움을 겪습니다.",
      active: false,
    },
    {
      label: "Level 2",
      text: "2-3주 정도 소요되며, 점차 익숙해집니다.",
      active: true,
    },
    { label: "Level 3", text: "1~3개월 정도 소요됩니다.", active: false },
    { label: "Level 4", text: "2~4주 정도면 충분합니다.", active: false },
    {
      label: "Level 5",
      text: "1~2주 이내에 빠르게 습득합니다.",
      active: false,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              background: "#7c3aed",
              color: "#fff",
              padding: "4px 14px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            역량 평가 결과
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              color: palette.previewMuted,
            }}
          >
            테스트 사용자1-1님의 역량 평가 결과입니다.
          </span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "응답 문항", value: "75/75" },
            { label: "평균 점수", value: "2.3/5" },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "0.62rem",
                  color: palette.previewMuted,
                  marginBottom: 2,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  color: palette.previewTitle,
                }}
              >
                {value}
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "0.62rem",
                color: palette.previewMuted,
                marginBottom: 2,
              }}
            >
              상태
            </div>
            <div
              style={{
                background: "#7c3aed",
                color: "#fff",
                padding: "2px 10px",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: "0.78rem",
              }}
            >
              완료
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: palette.previewBorder }} />

      {/* Info box */}
      <div
        style={{
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 10,
          padding: "9px 14px",
          fontSize: "0.78rem",
          color: palette.previewBody,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: "1rem" }}>🔐</span>
        제출된 응답은 수정할 수 없습니다. 수정이 필요하시면 관리자에게
        문의해주세요.
      </div>

      {/* Question */}
      <div>
        <div
          style={{
            fontSize: "0.68rem",
            color: palette.previewMuted,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          디지털 리터러시
        </div>
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: palette.previewTitle,
            lineHeight: 1.65,
            margin: "0 0 12px",
          }}
        >
          새로운 AI 도구나 디지털 솔루션을 도입할 때, 해당 도구를 학습하고
          업무에 적용하는 데 걸리는 시간은 어느 정도입니까?
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {levels.map(({ label, text, active }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 9,
                border: `1px solid ${active ? "#7c3aed" : palette.previewBorder}`,
                background: active ? "rgba(124,58,237,0.06)" : "transparent",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  flexShrink: 0,
                  border: `2px solid ${active ? "#7c3aed" : palette.previewBorder}`,
                  background: active ? "#7c3aed" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {active && (
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#fff",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: active ? palette.previewTitle : palette.previewBody,
                  lineHeight: 1.4,
                }}
              >
                <strong
                  style={{
                    color: active ? "#7c3aed" : palette.previewMuted,
                    marginRight: 6,
                  }}
                >
                  {label}
                </strong>
                {text}
              </span>
              {active && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.65rem",
                    background: "#7c3aed",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: 4,
                    flexShrink: 0,
                    fontWeight: 600,
                  }}
                >
                  선택
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress + button */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
              fontSize: "0.65rem",
              color: palette.previewMuted,
            }}
          >
            <span>문항 1/75</span>
            <span>1%</span>
          </div>
          <div
            style={{
              height: 4,
              background: palette.previewBorder,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "1.3%",
                height: "100%",
                background: "#2563eb",
                borderRadius: 2,
              }}
            />
          </div>
        </div>
        <div
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "7px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.82rem",
            flexShrink: 0,
          }}
        >
          다음
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Step 2 detail — AI 평가 리포트
────────────────────────────────────────────── */
function ReportDetail({ palette }: { palette: Palette }) {
  const columns = [
    {
      label: "역량평가 AI 분석",
      score: 45,
      desc: "테스트 사용자1-1님의 디지털 역량 평가 결과, 전반적으로 디지털 역량 수준은 중간 정도입니다. 모든 역량에서 고르게 낮은 점수를 보여주고 있으며, 특히 문제 해결 및 혁신 역량에서 가장 낮은 점수를 기록했습니다. 꾸준한 학습과 실무 적용을 통해 디지털 역량을 향상시킬 필요가 있습니다.",
    },
    {
      label: "시뮬레이션 AI 분석",
      score: 3,
      desc: "테스트 사용자1-1님은 10개의 시나리오를 모두 완료했지만, 평균 점수가 3점으로 전반적인 수행 능력 향상이 필요합니다. 특히 일부 시나리오에서 높은 점수를 획득한 점을 바탕으로, 강점 분야를 강화하고 약점을 보완하는 노력이 필요합니다.",
    },
    {
      label: "챗봇과제 AI 분석",
      score: 70,
      desc: "테스트 사용자1-1님의 챗봇 과제 수행 결과는 평균 70점으로, 중간 정도의 성과를 보였습니다. 대화 품질 또한 70점으로, 전반적으로 개선의 여지가 있는 것으로 판단됩니다. 특히, 대화 수가 0인 점을 고려할 때, 실제 챗봇과의 상호작용 및 프롬프트 엔지니어링 경험이 부족할 가능성이 있습니다.",
    },
  ];

  const CX = 100;
  const CY = 100;
  const MAX_R = 38;

  function radarPoints(sc: number[]): string {
    return sc
      .map((s, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const r = (s / 100) * MAX_R;
        return `${(CX + r * Math.cos(a)).toFixed(1)},${(CY + r * Math.sin(a)).toFixed(1)}`;
      })
      .join(" ");
  }

  function gridRing(scale: number): string {
    return Array.from({ length: 5 }, (_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const r = scale * MAX_R;
      return `${(CX + r * Math.cos(a)).toFixed(1)},${(CY + r * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
  }

  function axisEnd(i: number): { x: string; y: string } {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return {
      x: (CX + MAX_R * Math.cos(a)).toFixed(1),
      y: (CY + MAX_R * Math.sin(a)).toFixed(1),
    };
  }

  const LABEL_ADJUST = [
    { extraR: 14, dx: 0, dy: -2 },
    { extraR: 12, dx: -8, dy: 2 },
    { extraR: 12, dx: -10, dy: -4 },
    { extraR: 12, dx: 10, dy: -4 },
    { extraR: 12, dx: 8, dy: 2 },
  ] as const;

  function labelPos(i: number): {
    x: number;
    y: number;
    dx: number;
    dy: number;
  } {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const { extraR, dx, dy } = LABEL_ADJUST[i];
    const r = MAX_R + extraR;
    return {
      x: CX + r * Math.cos(a),
      y: CY + r * Math.sin(a),
      dx,
      dy,
    };
  }

  function labelLines(dim: string): string[] {
    if (dim.includes("-")) return dim.split("-");
    return [dim];
  }

  const LABEL_ANCHOR = ["middle", "start", "start", "end", "end"] as const;
  const LABEL_BASELINE = [
    "auto",
    "middle",
    "hanging",
    "hanging",
    "middle",
  ] as const;

  const CHARTS = [
    {
      title: "역량평가 분석",
      icon: "📊",
      subtitle: "역량관리에 등록된 역량 기준 점수 비교",
      avgDiff: -26,
      dimensions: [
        "디지털-리터러시",
        "데이터 분석-역량",
        "업무-자동화",
        "협업 및-커뮤니케이션",
        "문제 해결 및-혁신",
      ],
      myScores: [47, 45, 45, 47, 41],
      avgScores: [71, 71, 70, 71, 71],
      scoreItems: [
        { label: "디지털-리터러시", score: 47, avg: 71 },
        { label: "데이터-분석-역량", score: 45, avg: 71 },
        { label: "업무-자동화", score: 45, avg: 70 },
        { label: "협업-및-커뮤니케이션", score: 47, avg: 71 },
        { label: "문제-해결-및-혁신", score: 41, avg: 71 },
      ],
    },
    {
      title: "챗봇과제 분석",
      icon: "💬",
      subtitle: "AI 활용 역량별 점수 비교",
      avgDiff: 0,
      dimensions: [
        "프롬프트 설계",
        "업무 적용",
        "결과 검증",
        "반복 개선",
        "AI 협업",
      ],
      myScores: [70, 70, 70, 70, 70],
      avgScores: [70, 70, 70, 70, 70],
      scoreItems: [
        { label: "프롬프트 설계", score: 70, avg: 70 },
        { label: "업무 적용", score: 70, avg: 70 },
        { label: "결과 검증", score: 70, avg: 70 },
        { label: "반복 개선", score: 70, avg: 70 },
        { label: "AI 협업", score: 70, avg: 70 },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      {/* 3 analysis columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}
      >
        {columns.map(({ label, score, desc }) => (
          <div
            key={label}
            style={{
              border: `1px solid ${palette.previewBorder}`,
              borderRadius: 12,
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: palette.previewTitle,
                }}
              >
                {label}
              </span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11"
                  stroke={palette.previewMuted}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={{ fontSize: "0.6rem", color: palette.previewMuted }}>
              AI 인지 점수
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "1.3rem",
                color: "#7c3aed",
                lineHeight: 1,
              }}
            >
              {score}
              <span
                style={{ fontSize: "0.75rem", fontWeight: 600, marginLeft: 2 }}
              >
                점
              </span>
            </div>
            <p
              style={{
                fontSize: "0.67rem",
                color: palette.previewBody,
                lineHeight: 1.5,
                margin: 0,
                flexGrow: 1,
              }}
            >
              {desc}
            </p>
            <div
              style={{
                fontSize: "0.67rem",
                color: "#7c3aed",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 2,
              }}
            >
              결과 분석 보기 +
            </div>
          </div>
        ))}
      </div>

      {/* Radar chart cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {CHARTS.map(
          ({
            title,
            icon,
            subtitle,
            avgDiff,
            dimensions,
            myScores,
            avgScores,
            scoreItems,
          }) => (
            <div
              key={title}
              style={{
                border: `1px solid ${palette.previewBorder}`,
                borderRadius: 12,
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>{icon}</span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: palette.previewTitle,
                      }}
                    >
                      {title}
                    </span>
                  </div>
                  <div
                    style={{ fontSize: "0.65rem", color: palette.previewMuted }}
                  >
                    {subtitle}
                  </div>
                </div>
                <div
                  style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}
                >
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: palette.previewMuted,
                      marginBottom: 2,
                    }}
                  >
                    평균 대비
                  </div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      color:
                        avgDiff < 0
                          ? "#ef4444"
                          : avgDiff === 0
                            ? palette.previewTitle
                            : "#22c55e",
                      lineHeight: 1,
                    }}
                  >
                    {avgDiff > 0 ? "+" : ""}
                    {avgDiff}점
                  </div>
                </div>
              </div>

              {/* Radar chart SVG */}
              <div style={{ overflow: "hidden" }}>
                <svg
                  viewBox="0 0 200 200"
                  width="100%"
                  style={{ overflow: "hidden", display: "block" }}
                >
                  {/* Grid rings */}
                  {[0.25, 0.5, 0.75, 1.0].map((scale) => (
                    <polygon
                      key={scale}
                      points={gridRing(scale)}
                      fill="none"
                      stroke={palette.previewBorder}
                      strokeWidth="0.8"
                    />
                  ))}

                  {/* Axis lines */}
                  {Array.from({ length: 5 }, (_, i) => {
                    const { x, y } = axisEnd(i);
                    return (
                      <line
                        key={i}
                        x1={CX}
                        y1={CY}
                        x2={x}
                        y2={y}
                        stroke={palette.previewBorder}
                        strokeWidth="0.8"
                      />
                    );
                  })}

                  {/* Scale numbers along top axis */}
                  {[25, 50, 75, 100].map((val) => (
                    <text
                      key={val}
                      x={CX + 3}
                      y={CY - (val / 100) * MAX_R}
                      fontSize="7"
                      fill={palette.previewMuted}
                      dominantBaseline="middle"
                    >
                      {val}
                    </text>
                  ))}

                  {/* 전체 평균 (orange dashed) */}
                  <polygon
                    points={radarPoints(avgScores)}
                    fill="rgba(245,158,11,0.1)"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                  />

                  {/* 나의 점수 (purple filled) */}
                  <polygon
                    points={radarPoints(myScores)}
                    fill="rgba(109,40,217,0.2)"
                    stroke="#7c3aed"
                    strokeWidth="1.8"
                  />

                  {/* Axis labels */}
                  {dimensions.map((dim, i) => {
                    const lines = labelLines(dim);
                    const lineHeight = 8;
                    const { x, y, dx, dy } = labelPos(i);
                    const textX = x + dx;
                    const baseline = LABEL_BASELINE[i];
                    const startY =
                      baseline === "hanging"
                        ? y + dy
                        : y + dy - ((lines.length - 1) * lineHeight) / 2;

                    return (
                      <text
                        key={dim}
                        x={textX.toFixed(1)}
                        y={startY.toFixed(1)}
                        textAnchor={LABEL_ANCHOR[i]}
                        dominantBaseline={
                          baseline === "hanging" ? "hanging" : "middle"
                        }
                        fontSize="7.5"
                        fill={palette.previewMuted}
                      >
                        {lines.map((line, j) => (
                          <tspan
                            key={line}
                            x={textX}
                            dy={j === 0 ? 0 : lineHeight}
                          >
                            {line}
                          </tspan>
                        ))}
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  justifyContent: "center",
                  marginTop: -4,
                }}
              >
                {[
                  { color: "#7c3aed", label: "나의 점수" },
                  { color: "#f59e0b", label: "전체 평균" },
                ].map(({ color, label: lg }) => (
                  <div
                    key={lg}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: "0.68rem",
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        background: color,
                        borderRadius: 2,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: palette.previewBody }}>{lg}</span>
                  </div>
                ))}
              </div>

              {/* Score items grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "6px 10px",
                  borderTop: `1px solid ${palette.previewBorder}`,
                  paddingTop: 10,
                }}
              >
                {scoreItems.map(({ label: sl, score, avg }) => (
                  <div key={sl}>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        color: palette.previewMuted,
                        marginBottom: 2,
                        lineHeight: 1.3,
                      }}
                    >
                      {sl}
                    </div>
                    <div style={{ lineHeight: 1 }}>
                      <strong style={{ fontSize: "0.82rem", color: "#7c3aed" }}>
                        {score}점
                      </strong>
                      <span
                        style={{
                          fontSize: "0.62rem",
                          color: palette.previewMuted,
                          marginLeft: 3,
                        }}
                      >
                        (평균 {avg})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Step 3 detail — 역량 향상 로드맵
────────────────────────────────────────────── */
function RoadmapDetail({ palette }: { palette: Palette }) {
  const pathSteps = [
    {
      range: "1~2주차",
      title: "AI 기초 역량 강화",
      items: [
        "AI 도구의 기본 개념과 활용법 학습,\n프롬프트 작성 기초",
        // "AI기초 역량 강화\n2개 항목 완료",
      ],
    },
    {
      range: "3~5주차",
      title: "실무 활용 능력 계발",
      items: [
        "업무에 AI 도구를 적용하는 실전 연습",
        // "팀 협업 AI 활용\n능력 계발",
      ],
    },
    {
      range: "6~8주차",
      title: "고급 활용 및 심화",
      items: [
        "고급 기능 활용 및 복잡한 업무 적용",
        // "종합 활용 능력\n완성도 제고",
      ],
    },
  ];

  const timeline = [
    {
      dot: "#d946ef",
      week: "2주차",
      title: "기초 역량 점검",
      desc: "기본 AI 활용 능력 확보",
    },
    {
      dot: "#a855f7",
      week: "5주차",
      title: "중간 점검",
      desc: "실무 적용 능력 확보",
    },
    {
      dot: "#6d28d9",
      week: "8주차",
      title: "최종 점검",
      desc: "독립적 AI 활용 가능",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "0.95rem",
              color: palette.previewTitle,
              marginBottom: 4,
            }}
          >
            AI 맞춤 학습 로드맵
          </div>
          <div style={{ fontSize: "0.68rem", color: palette.previewMuted }}>
            프롬프트 엔지니어링, 업무 자동화, AI 도구 활용 강화
          </div>
        </div>
        <div
          style={{
            background: "#7c3aed",
            color: "#fff",
            padding: "6px 16px",
            borderRadius: 8,
            fontSize: "0.78rem",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          재생성
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
        }}
      >
        {[
          { label: "현재 레벨", value: "AI 활용 중급 단계" },
          { label: "목표 레벨", value: "AI 활용 전문가 수준 달성" },
          { label: "예상 기간", value: "8주" },
          { label: "총 주차", value: "8주" },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "rgba(124,58,237,0.06)",
              border: "1px solid rgba(124,58,237,0.14)",
              borderRadius: 10,
              padding: "10px 10px",
            }}
          >
            <div
              style={{
                fontSize: "0.6rem",
                color: palette.previewMuted,
                lineHeight: 1.4,
                marginBottom: 5,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "#7c3aed",
                lineHeight: 1,
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Learning path */}
      <div>
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: palette.previewTitle,
            marginBottom: 8,
          }}
        >
          학습 경로
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          {pathSteps.map(({ range, title, items }) => (
            <div
              key={range}
              style={{
                border: `1px solid ${palette.previewBorder}`,
                borderRadius: 10,
                padding: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  color: "#7c3aed",
                  marginBottom: 3,
                }}
              >
                {range}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: palette.previewTitle,
                  marginBottom: 8,
                  lineHeight: 1.4,
                }}
              >
                {title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {items.map((item) => (
                  <div
                    key={item}
                    style={{
                      fontSize: "0.65rem",
                      color: palette.previewBody,
                      lineHeight: 1.45,
                      padding: "5px 8px",
                      background: palette.previewSubBg,
                      borderRadius: 7,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: palette.previewTitle,
            marginBottom: 10,
          }}
        >
          타임라인
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {timeline.map(({ dot, week, title, desc }) => (
            <div
              key={week}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "10px 10px",
                background: palette.previewSubBg,
                borderRadius: 10,
                border: `1px solid ${palette.previewBorder}`,
              }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: dot,
                  flexShrink: 0,
                  marginTop: 3,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: palette.previewTitle,
                    marginBottom: 3,
                  }}
                >
                  {week}: {title}
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: palette.previewBody,
                    lineHeight: 1.4,
                  }}
                >
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Process section (interactive chevrons)
────────────────────────────────────────────── */
function ProcessSection({
  palette,
  reduceMotion,
}: {
  palette: Palette;
  reduceMotion: boolean;
}) {
  const [selectedStep, setSelectedStep] = useState(0);

  const currentStep = PROCESS_STEPS[selectedStep];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.55 }}
      viewport={{ once: true, margin: "-40px" }}
      style={{
        marginTop: "3.5rem",
        background: palette.bottomBg,
        border: `1px solid ${palette.bottomBorder}`,
        borderRadius: 20,
        padding: "clamp(1.25rem, 3vw, 2rem)",
        display: "flex",
        gap: "clamp(0.75rem, 2vw, 1.5rem)",
        alignItems: "flex-start",
        overflow: "hidden",
      }}
    >
      {/* Left: stacked target boxes */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          alignSelf: "stretch",
        }}
      >
        {WORKFLOW_TARGETS.map((target) => (
          <div
            key={target}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              flex: 1,
              minHeight: 0,
            }}
          >
            <div
              style={{
                background: palette.targetBoxBg,
                border: `1px solid ${palette.targetBoxBorder}`,
                borderRadius: 10,
                padding: "0.7rem 0.85rem",
                fontSize: "clamp(0.72rem, 1.1vw, 0.82rem)",
                fontWeight: 600,
                color: palette.targetBoxText,
                whiteSpace: "pre-line",
                textAlign: "center",
                lineHeight: 1.4,
                minWidth: 90,
                flex: 1,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {target}
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 7h10M7 2l5 5-5 5"
                stroke={palette.muted}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Vertical role label + divider */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: "0.6rem",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            textOrientation: "upright",
            fontSize: "clamp(0.82rem, 1.2vw, 0.95rem)",
            fontWeight: 600,
            color: palette.muted,
            letterSpacing: "0.1em",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          직무별 &amp; 역할별 진단
        </div>
        <div
          style={{ width: 1, background: palette.bottomBorder, flexShrink: 0 }}
        />
      </div>

      {/* Right: chevrons + animated detail card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minWidth: 0,
        }}
      >
        {/* Chevron row */}
        <div style={{ display: "flex", width: "100%", position: "relative" }}>
          {PROCESS_STEPS.map((step, i) => (
            <button
              key={step.title}
              onClick={() => setSelectedStep(i)}
              aria-pressed={selectedStep === i}
              style={{
                flex: 1,
                height: 52,
                background: step.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "clamp(0.68rem, 1.2vw, 0.88rem)",
                clipPath:
                  i === 0
                    ? "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)"
                    : i === PROCESS_STEPS.length - 1
                      ? "polygon(16px 0, 100% 0, 100% 100%, 0 100%, 16px 50%)"
                      : "polygon(16px 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)",
                paddingLeft: i === 0 ? "0.75rem" : "1.3rem",
                paddingRight:
                  i === PROCESS_STEPS.length - 1 ? "0.75rem" : "1.3rem",
                textAlign: "center",
                whiteSpace: "nowrap",
                border: "none",
                cursor: "pointer",
                opacity: selectedStep === i ? 1 : 0.52,
                transition: "opacity 0.2s ease",
              }}
            >
              {step.title}
            </button>
          ))}
        </div>

        {/* Active step indicator row */}
        <div
          style={{
            display: "flex",
            marginTop: -8,
            paddingBottom: 2,
          }}
        >
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                height: 8,
              }}
            >
              {selectedStep === i && (
                <motion.div
                  layoutId="chevron-indicator"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "7px solid transparent",
                    borderRight: "7px solid transparent",
                    borderTop: `9px solid ${step.accentColor}`,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Animated detail card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStep}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            style={{
              background: palette.previewBg,
              border: `1px solid ${palette.previewBorder}`,
              borderTop: `3px solid ${currentStep.accentColor}`,
              borderRadius: 14,
              padding: "clamp(1rem, 2.5vw, 1.5rem)",
              overflow: "hidden",
            }}
          >
            {selectedStep === 0 && <AssessDetail palette={palette} />}
            {selectedStep === 1 && <ReportDetail palette={palette} />}
            {selectedStep === 2 && <RoadmapDetail palette={palette} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Main export
────────────────────────────────────────────── */
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

          <FrameworkDiagram palette={palette} reduceMotion={reduceMotion} />
        </motion.div>

        {/* 핵심 특징 */}
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
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

        {/* Process section */}
        <ProcessSection palette={palette} reduceMotion={reduceMotion} />
      </div>
    </section>
  );
}
