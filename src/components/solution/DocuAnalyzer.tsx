import { motion, useReducedMotion } from "motion/react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";

/**
 * Solution — Docu. Analyzer section.
 * 내용 미확정 (추후 MZO 내용 입력 후 교체 예정) — 현재는 placeholder.
 */

export function DocuAnalyzer() {
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = useHtmlIsDark();

  const sectionBg = isDark ? "#111111" : "#ffffff";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const overline = isDark ? "rgba(255,255,255,0.25)" : "rgba(24,24,27,0.45)";
  const heading = isDark ? "#f2f2f2" : "#18181b";
  const body = isDark ? "rgba(255,255,255,0.4)" : "rgba(24,24,27,0.6)";
  const cardBg = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";
  const cardBorder = isDark
    ? "rgba(255,255,255,0.12)"
    : "rgba(0,0,0,0.1)";
  const badge = isDark ? "rgba(255,255,255,0.35)" : "rgba(24,24,27,0.5)";

  return (
    <section
      id="docu-analyzer"
      aria-labelledby="docu-analyzer-heading"
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
              color: overline,
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}
          >
            Docu. Analyzer
          </div>
          <h2
            id="docu-analyzer-heading"
            className="text-balance"
            style={{
              fontSize: "clamp(28px, 4vw, 2.4rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: heading,
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Docu. Analyzer
          </h2>
        </motion.div>

        <div
          style={{
            marginTop: "2.5rem",
            border: `1px dashed ${cardBorder}`,
            borderRadius: 16,
            background: cardBg,
            padding: "clamp(40px, 6vw, 72px)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              border: `1px solid ${cardBorder}`,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: badge,
            }}
          >
            Coming Soon
          </span>
          <p
            style={{
              maxWidth: 520,
              fontSize: "1rem",
              color: body,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            상세 콘텐츠를 준비 중입니다. 추후 내용이 확정되는 대로 업데이트될
            예정입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
