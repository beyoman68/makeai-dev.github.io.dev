import { motion, useReducedMotion } from "motion/react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";

/**
 * Products — Make AI time-series AIOps solution cards.
 */

const TEAL = "#00d4aa";

const PRODUCTS = [
  {
    title: "자동 드리프트 감지",
    description:
      "통계적 방법으로 입력 데이터와 예측 분포를 실시간 모니터링, 임계값 초과 시 즉각 알림과 재학습을 트리거합니다.",
  },
  {
    title: "완전 자동화 파이프라인",
    description:
      "데이터 수집부터 피처 엔지니어링, 진화적 데이터 선택에 의한 검증, 모델 등록, 배포까지 단일 플랫폼에서 자동 실행됩니다.",
  },
  {
    title: "투명한 모델 관리",
    description:
      "모든 실험의 메트릭, 파라미터, 모델 파일을 레지스트리에 보관하고 Production/Staging 단계별로 관리합니다.",
  },
] as const;

type ProductPalette = {
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  title: string;
  body: string;
  heading: string;
  overline: string;
};

function paletteFor(isDark: boolean): ProductPalette {
  if (isDark) {
    return {
      cardBg: "#1a1a1a",
      cardBorder: "rgba(255,255,255,0.14)",
      cardShadow: "0 14px 38px rgba(0,0,0,0.35)",
      title: TEAL,
      body: "rgba(255,255,255,0.38)",
      heading: "#f2f2f2",
      overline: "rgba(255,255,255,0.25)",
    };
  }

  return {
    cardBg: "#ffffff",
    cardBorder: "rgba(0,0,0,0.1)",
    cardShadow: "0 14px 38px rgba(0,0,0,0.06)",
    title: "#0d9e7a",
    body: "rgba(24,24,27,0.62)",
    heading: "#18181b",
    overline: "rgba(24,24,27,0.45)",
  };
}

function ProductCard({
  title,
  description,
  index,
  reduceMotion,
  palette,
}: {
  title: string;
  description: string;
  index: number;
  reduceMotion: boolean;
  palette: ProductPalette;
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
      className="transition-[border-color,transform] duration-200 hover:-translate-y-1"
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
          background: TEAL,
        }}
      />
      <h3
        className="text-pretty"
        style={{
          fontSize: "1.05rem",
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
        className="text-pretty"
        style={{
          fontSize: "0.9rem",
          color: palette.body,
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
}

export function Products() {
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = useHtmlIsDark();
  const palette = paletteFor(isDark);

  const sectionBg = isDark ? "#0f0f0f" : "#ffffff";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
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
            Our Products
          </div>
          <h2
            id="products-heading"
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
            Make AI의 시계열 데이터 전용 AIOps
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.title}
              title={product.title}
              description={product.description}
              index={i}
              reduceMotion={reduceMotion}
              palette={palette}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
