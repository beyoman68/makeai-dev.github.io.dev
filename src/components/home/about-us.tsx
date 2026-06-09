import { motion, useReducedMotion } from "motion/react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";

/**
 * About Us — Make AI company introduction.
 * Light: white / dark ink; dark: original near-black band.
 */

export function AboutUs() {
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = useHtmlIsDark();

  const sectionBg = isDark ? "#111111" : "#ffffff";
  const borderY = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const overline = isDark ? "rgba(255,255,255,0.25)" : "rgba(24,24,27,0.45)";
  const body = isDark ? "rgba(255,255,255,0.88)" : "rgba(24,24,27,0.88)";

  const bodyStyle = {
    fontSize: "clamp(16px, 2vw, 20px)",
    fontWeight: 400,
    color: body,
    lineHeight: 1.85,
    letterSpacing: "-0.015em",
    margin: 0,
  } as const;

  return (
    <section
      id="about-us"
      style={{
        background: sectionBg,
        padding: "clamp(72px, 12vw, 120px) 32px",
        borderTop: `1px solid ${borderY}`,
        borderBottom: `1px solid ${borderY}`,
      }}
    >
      <div className="mx-auto max-w-[1280px]">
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
              letterSpacing: "0.1em",
              color: overline,
              marginBottom: 28,
            }}
          >
            ABOUT US
          </div>
          <div
            className="text-pretty"
            style={{ display: "flex", flexDirection: "column", gap: "1em" }}
          >
            <p style={bodyStyle}>
              기업에 최적화되고 검증된 인공지능 플랫폼으로, 가장 똑똑한 AI로의
              여정을 만들어 갑니다.
            </p>
            <p style={bodyStyle}>
              머신러닝, 딥러닝과 멀티 모달의 만남은 데이터의 경계를 허물고 AX의
              새로운 가치를 만들어 가는 지름길입니다.
            </p>
            <p style={bodyStyle}>
              금융, 제조, 헬스케어 등 다양한 도메인의 인공지능 적용 문제점을
              인식해야 합니다.
            </p>
            <p style={bodyStyle}>
              제조의 미세한 정밀분야, 1/100의 오차도 용납하지 않는 금융의
              컴플라이언스, 사람의 생명을 다루는 헬스케어, 문제의 본질을
              인정하고 더 나은 AI 서비스를 만들기 위해 노력하는 Make AI 입니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
