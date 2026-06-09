import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";

/**
 * Problem Recognition — 3 pitfalls of traditional ML development.
 */

const PLACEHOLDER = "[추후 입력]";

type ProblemPalette = {
  cardBg: string;
  cardBorder: string;
  cardAccent: string;
  cardShadow: string;
  title: string;
  body: string;
  muted: string;
  widgetBg: string;
  widgetBorder: string;
  stepAccent: string;
  barTrack: string;
  barColors: [string, string, string];
  heading: string;
  sub: string;
  overline: string;
  footerLabel: string;
};

function paletteFor(isDark: boolean): ProblemPalette {
  if (isDark) {
    return {
      cardBg: "#1a1a1a",
      cardBorder: "rgba(255,255,255,0.14)",
      cardAccent: "rgba(255,255,255,0.18)",
      cardShadow: "0 14px 38px rgba(0,0,0,0.35)",
      title: "#e8e8e8",
      body: "rgba(255,255,255,0.38)",
      muted: "rgba(255,255,255,0.22)",
      widgetBg: "rgba(255,255,255,0.04)",
      widgetBorder: "rgba(255,255,255,0.08)",
      stepAccent: "rgba(255,255,255,0.45)",
      barTrack: "rgba(255,255,255,0.08)",
      barColors: [
        "rgba(255,255,255,0.75)",
        "rgba(255,255,255,0.45)",
        "rgba(255,255,255,0.25)",
      ],
      heading: "#f2f2f2",
      sub: "rgba(255,255,255,0.45)",
      overline: "rgba(255,255,255,0.25)",
      footerLabel: "rgba(255,255,255,0.2)",
    };
  }

  return {
    cardBg: "#ffffff",
    cardBorder: "rgba(0,0,0,0.1)",
    cardAccent: "rgba(24,24,27,0.18)",
    cardShadow: "0 14px 38px rgba(0,0,0,0.06)",
    title: "#18181b",
    body: "rgba(24,24,27,0.62)",
    muted: "rgba(24,24,27,0.45)",
    widgetBg: "rgba(0,0,0,0.04)",
    widgetBorder: "rgba(0,0,0,0.08)",
    stepAccent: "rgba(24,24,27,0.55)",
    barTrack: "rgba(0,0,0,0.06)",
    barColors: [
      "rgba(24,24,27,0.88)",
      "rgba(24,24,27,0.55)",
      "rgba(24,24,27,0.35)",
    ],
    heading: "#18181b",
    sub: "rgba(24,24,27,0.62)",
    overline: "rgba(24,24,27,0.45)",
    footerLabel: "rgba(24,24,27,0.35)",
  };
}

const DRIFT_COLORS = {
  teal: "#00d4aa",
  amber: "#fbbf24",
  red: "#f87171",
  widgetBg: "rgba(248,113,113,0.06)",
  widgetBorder: "rgba(248,113,113,0.15)",
  barTrack: "rgba(42,58,85,0.4)",
} as const;

function DriftWidget({ palette }: { palette: ProblemPalette }) {
  const rows = [
    {
      label: "배포 직후",
      width: "90%",
      value: "Sharpe 2.4",
      color: DRIFT_COLORS.teal,
    },
    {
      label: "3개월 후",
      width: "55%",
      value: "Sharpe 1.3",
      color: DRIFT_COLORS.amber,
    },
    {
      label: "6개월 후",
      width: "20%",
      value: "Sharpe 0.4",
      color: DRIFT_COLORS.red,
    },
  ];

  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "0.9rem",
        background: palette.widgetBg,
        border: `1px solid ${palette.widgetBorder}`,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          color: palette.muted,
          marginBottom: "0.6rem",
          fontWeight: 600,
          letterSpacing: "0.5px",
        }}
      >
        <span style={{ color: DRIFT_COLORS.teal }}>▍</span> 드리프트 진행
        시나리오
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {rows.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.8rem",
            }}
          >
            <span style={{ color: row.color, fontWeight: 700, minWidth: 52 }}>
              {row.label}
            </span>
            <div
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${row.color} ${row.width}, ${DRIFT_COLORS.barTrack} ${row.width})`,
              }}
            />
            <span style={{ color: row.color, fontSize: "0.75rem" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetrainWidget({ palette }: { palette: ProblemPalette }) {
  const steps = [
    {
      num: "①",
      title: "성능 저하 인지",
      rest: "대부분 불만 접수 후 뒤늦게 발견",
    },
    {
      num: "②",
      title: "데이터 재수집 · 전처리",
      rest: "파이프라인 재실행, 이상치 처리",
    },
    {
      num: "③",
      title: "하이퍼파라미터 재탐색",
      rest: "수십 회 반복 실험",
    },
    {
      num: "④",
      title: "검증 · 승인 · 배포",
      rest: "담당자 일정에 종속",
    },
    {
      num: "⑤",
      title: "다음 드리프트까지 반복",
      rest: "끝없는 소방 대응",
    },
  ] as const;

  return (
    <div
      style={{
        marginTop: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {steps.map((step) => (
        <div
          key={step.num}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.7rem",
            fontSize: "0.8rem",
            color: palette.body,
          }}
        >
          <span
            style={{ color: palette.stepAccent, fontWeight: 700, minWidth: 20 }}
          >
            {step.num}
          </span>
          <span>
            <strong style={{ color: palette.title }}>{step.title}</strong>
            {" — "}
            {step.rest}
          </span>
        </div>
      ))}
      <div
        style={{
          marginTop: "0.9rem",
          padding: "0.6rem 0.9rem",
          background: palette.widgetBg,
          borderLeft: `3px solid ${palette.cardAccent}`,
          borderRadius: "0 6px 6px 0",
          fontSize: "0.8rem",
          color: palette.body,
        }}
      >
        데이터 과학자 1명이 수동 ML 파이프라인 유지에 사용하는 시간은 전체
        업무의 <strong style={{ color: DRIFT_COLORS.red }}>60~70%</strong>에
        달합니다.
      </div>
    </div>
  );
}

function BlackboxWidget({ palette }: { palette: ProblemPalette }) {
  const items = [
    { title: "추적 불가", rest: "이전 모델 성능 비교 불가" },
    { title: "롤백 불가", rest: "신모델 배포 후 문제 발생 시 복구 수단 없음" },
    { title: "감사 불가", rest: "규제·컴플라이언스 대응 증빙 부재" },
    { title: "재현 불가", rest: "같은 실험 재현 시 다른 결과 발생" },
  ] as const;

  return (
    <>
      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.6rem",
        }}
      >
        {items.map((item) => (
          <div
            key={item.title}
            style={{
              background: palette.widgetBg,
              border: `1px solid ${palette.widgetBorder}`,
              borderRadius: 8,
              padding: "0.7rem",
              fontSize: "0.78rem",
            }}
          >
            <div
              style={{
                color: DRIFT_COLORS.red,
                fontWeight: 700,
                marginBottom: "0.3rem",
              }}
            >
              ❌ {item.title}
            </div>
            <div style={{ color: palette.body }}>{item.rest}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: "0.9rem",
          fontSize: "0.82rem",
          color: palette.body,
          lineHeight: 1.75,
        }}
      >
        본 시스템은 모든 학습 실험의{" "}
        <strong style={{ color: DRIFT_COLORS.teal }}>
          Run ID · 파라미터 · 메트릭 · 모델 파일
        </strong>
        을 SQLite 레지스트리에 자동 기록합니다. Production/Staging/Archived 단계
        관리로 언제든 이전 모델로 즉시 롤백 가능합니다.
      </div>
    </>
  );
}

function ProblemCard({
  icon,
  title,
  index,
  reduceMotion,
  widget,
  palette,
  description = PLACEHOLDER,
}: {
  icon: string;
  title: string;
  index: number;
  reduceMotion: boolean;
  widget: ReactNode;
  palette: ProblemPalette;
  description?: ReactNode;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        delay: reduceMotion ? 0 : index * 0.08,
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="transition-colors duration-200"
      style={{
        background: palette.cardBg,
        border: `1px solid ${palette.cardBorder}`,
        borderRadius: 16,
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        boxShadow: palette.cardShadow,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: DRIFT_COLORS.red,
        }}
      />
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{icon}</div>
      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: palette.title,
          marginBottom: "0.7rem",
          lineHeight: 1.35,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.9rem",
          color: palette.body,
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>
      {widget}
    </motion.div>
  );
}

export function ProblemSection() {
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = useHtmlIsDark();
  const palette = paletteFor(isDark);

  const sectionBg = isDark ? "#0f0f0f" : "#ffffff";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  const cards = [
    {
      icon: "📉",
      title: "데이터 드리프트 — 침묵하는 성능 붕괴",
      description:
        "AI 모델은 배포 순간부터 낡기 시작합니다. 시장 구조, 소비자 행동, 공정 조건은 끊임없이 바뀌지만 학습 데이터는 과거에 고정되어 있습니다.",
      widget: (
        <>
          <DriftWidget palette={palette} />
          <div
            style={{
              marginTop: "0.9rem",
              fontSize: "0.82rem",
              color: palette.body,
              lineHeight: 1.75,
            }}
          >
            PSI(Population Stability Index)가{" "}
            <strong style={{ color: DRIFT_COLORS.amber }}>0.2를 초과</strong>
            하는 순간 입력 피처 분포가 학습 당시와 유의미하게 달라진 것입니다.
            모니터링 없이는 이 임계값 초과를 수주 뒤에야 인지하게 됩니다.
          </div>
        </>
      ),
    },
    {
      icon: "🔧",
      title: "수동 재학습 — 느리고 오류 나기 쉬운 반복",
      description: (
        <>
          문제를 인식한 시점부터 배포 완료까지 평균{" "}
          <strong style={{ color: DRIFT_COLORS.red }}>2~4주</strong>가
          소요됩니다. 그 사이 비즈니스 손실은 이미 누적됩니다.
        </>
      ),
      widget: <RetrainWidget palette={palette} />,
    },
    {
      icon: "🕳️",
      title: "블랙박스 운영 — 추적 불가능한 의사결정",
      description:
        "어떤 버전의 모델이 어떤 데이터로 학습되었는지, 왜 이번 예측이 틀렸는지 설명할 수 없다면 AI는 신뢰받을 수 없습니다.",
      widget: <BlackboxWidget palette={palette} />,
    },
  ] as const;

  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
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
            CHALLENGES
          </div>
          <h2
            id="problem-heading"
            className="text-balance"
            style={{
              fontSize: "clamp(28px, 4vw, 2.4rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: palette.heading,
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            전통적인 ML 개발의 3가지 함정
          </h2>
          <p
            className="text-pretty"
            style={{
              fontSize: 17,
              color: palette.sub,
              lineHeight: 1.65,
              maxWidth: 600,
              marginBottom: "4rem",
            }}
          >
            모델을 한번 만들고 끝내는 방식, 이미 실패가 예약되어 있습니다.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {cards.map((card, i) => (
            <ProblemCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={"description" in card ? card.description : undefined}
              index={i}
              reduceMotion={reduceMotion}
              widget={card.widget}
              palette={palette}
            />
          ))}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          style={{
            marginTop: "3.5rem",
            paddingTop: "2rem",
            borderTop: `1px solid ${borderY}`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: palette.footerLabel,
            }}
          >
            Time-Series MLOps Platform
          </span>
        </motion.div>
      </div>
    </section>
  );
}
