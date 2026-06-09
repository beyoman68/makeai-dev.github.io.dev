import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { useHtmlIsDark } from "@/lib/use-html-is-dark";
import { productNav } from "@/lib/nav-config";

/**
 * Home hero — MazHero-inspired layout; light mode uses white + dark ink; dark mode keeps near-black band.
 * Theme follows `document.documentElement` `light` / `dark` (see `ThemeProvider`).
 */

const TYPEWRITER_MIDDLE = [
  "structured data extraction and parsing",
  "retrieval and grounded knowledge answers",
  "email agents and AI-assisted operations",
  "translation across 50+ supported languages",
  "structured document generation",
] as const;

function HomeHeroTypewriter({
  texts,
  reduceMotion,
  isDark,
}: {
  texts: readonly string[];
  reduceMotion: boolean;
  isDark: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(texts[0]);
      let i = 0;
      const id = window.setInterval(() => {
        i = (i + 1) % texts.length;
        setDisplayed(texts[i]);
      }, 4500);
      return () => window.clearInterval(id);
    }

    const current = texts[index];
    if (!isDeleting) {
      if (displayed.length < current.length) {
        timeoutRef.current = window.setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, 38);
      } else {
        timeoutRef.current = window.setTimeout(() => setIsDeleting(true), 2400);
      }
    } else if (displayed.length > 0) {
      timeoutRef.current = window.setTimeout(() => {
        setDisplayed(displayed.slice(0, -1));
      }, 22);
    } else {
      setIsDeleting(false);
      setIndex((j) => (j + 1) % texts.length);
    }

    return () => {
      if (timeoutRef.current !== undefined)
        window.clearTimeout(timeoutRef.current);
    };
  }, [displayed, isDeleting, index, texts, reduceMotion]);

  const textColor = isDark ? "#f2f2f2" : "#18181b";
  const cursorBg = isDark ? "rgba(255,255,255,0.4)" : "rgba(24,24,27,0.45)";

  return (
    <span style={{ color: textColor, fontWeight: 600 }}>
      {displayed}
      {!reduceMotion && (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 2,
            height: "0.85em",
            background: cursorBg,
            marginLeft: 2,
            verticalAlign: "middle",
            animation: "homeHeroCursorBlink 1s step-end infinite",
          }}
        />
      )}
    </span>
  );
}

export function HomeHero() {
  const reduceMotion = useReducedMotion() ?? false;
  const isDark = useHtmlIsDark();

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    el?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const heroBg = isDark ? "#0f0f0f" : "#ffffff";
  const gridImage = isDark
    ? "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)"
    : "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)";
  const glow = isDark
    ? "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 65%)"
    : "radial-gradient(ellipse at center, rgba(0,0,0,0.045) 0%, transparent 65%)";

  const h1Main = isDark ? "#f2f2f2" : "#18181b";
  const h1Muted = isDark ? "rgba(255,255,255,0.35)" : "rgba(24,24,27,0.45)";
  const subhead = isDark ? "rgba(255,255,255,0.45)" : "rgba(24,24,27,0.58)";
  const typeLineMuted = isDark
    ? "rgba(255,255,255,0.28)"
    : "rgba(24,24,27,0.5)";
  const productsLabel = isDark
    ? "rgba(255,255,255,0.2)"
    : "rgba(24,24,27,0.45)";
  const pillBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const pillBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const pillText0 = isDark ? "rgba(255,255,255,0.65)" : "rgba(24,24,27,0.88)";
  const pillText = isDark ? "rgba(255,255,255,0.35)" : "rgba(24,24,27,0.55)";
  const scrollMuted = isDark ? "rgba(255,255,255,0.2)" : "rgba(24,24,27,0.35)";
  const chevronColor = isDark
    ? "rgba(255,255,255,0.18)"
    : "rgba(24,24,27,0.35)";

  const primaryBtn = isDark
    ? { color: "#0f0f0f", bg: "#f0f0f0", hover: "#ffffff" }
    : { color: "#fafafa", bg: "#18181b", hover: "#27272a" };
  const secondaryBtn = isDark
    ? {
        color: "rgba(255,255,255,0.6)",
        border: "rgba(255,255,255,0.14)",
        hoverBorder: "rgba(255,255,255,0.3)",
        hoverColor: "#fff",
      }
    : {
        color: "rgba(24,24,27,0.75)",
        border: "rgba(24,24,27,0.2)",
        hoverBorder: "rgba(24,24,27,0.4)",
        hoverColor: "#18181b",
      };

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        background: heroBg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes homeHeroCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes homeHeroGridFade {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.55; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: gridImage,
          backgroundSize: "56px 56px",
          animation: reduceMotion
            ? "none"
            : "homeHeroGridFade 10s ease-in-out infinite",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] -translate-x-1/2"
        style={{
          width: 900,
          height: 600,
          background: glow,
        }}
      />

      <div
        className="relative mx-auto w-full max-w-[1280px] px-8"
        style={{
          paddingTop: "clamp(80px, 14vw, 120px)",
          paddingBottom: 80,
        }}
      >
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.75,
            delay: reduceMotion ? 0 : 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-balance"
          style={{
            fontSize: "clamp(40px, 6.5vw, 82px)",
            fontWeight: 600,
            lineHeight: 1.07,
            letterSpacing: "-0.035em",
            color: h1Main,
            maxWidth: 860,
            marginBottom: 28,
          }}
        >
          Building Real-World AI
          <br />
          <span style={{ color: h1Muted }}>for the Future of Work</span>
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            delay: reduceMotion ? 0 : 0.38,
          }}
          className="text-pretty"
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            fontWeight: 400,
            lineHeight: 1.65,
            color: subhead,
            maxWidth: 580,
            marginBottom: 14,
          }}
        >
          Mazelone turns complex documents, language, images, and operational
          knowledge into AI products people can actually use.
        </motion.p>

        {/* Korean blurb: same color as hero background so it does not show in the UI, but remains in the DOM for SEO. */}
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.65,
            delay: reduceMotion ? 0 : 0.44,
          }}
          className="select-none text-pretty"
          style={{
            color: heroBg,
            fontSize: "clamp(14px, 1.6vw, 16px)",
            fontWeight: 400,
            lineHeight: 1.65,
            maxWidth: 580,
            margin: 0,
            padding: 0,
            maxHeight: 0,
            overflow: "hidden",
          }}
        >
          마젤원(Mazelone)은 기업의 문서, 언어, 이미지, 운영 지식을 AI 제품으로
          전환하는 엔터프라이즈 AI 기업입니다.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.58,
          }}
          className="text-pretty"
          aria-live="polite"
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: typeLineMuted,
            maxWidth: 520,
            marginBottom: 52,
            lineHeight: 1.6,
          }}
        >
          <span>From </span>
          <HomeHeroTypewriter
            texts={TYPEWRITER_MIDDLE}
            reduceMotion={reduceMotion}
            isDark={isDark}
          />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.55,
            delay: reduceMotion ? 0 : 0.62,
          }}
          className="flex flex-wrap gap-2.5"
          style={{ marginBottom: 88 }}
        >
          <button
            type="button"
            onClick={() => scrollTo("#home-products")}
            className="inline-flex cursor-pointer items-center gap-2 border-0 text-sm font-medium tracking-tight transition-colors"
            style={{
              color: primaryBtn.color,
              background: primaryBtn.bg,
              padding: "11px 24px",
              borderRadius: 9,
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = primaryBtn.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = primaryBtn.bg;
            }}
          >
            Explore Products
            <ArrowRight size={15} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollTo("#site-footer")}
            className="inline-flex cursor-pointer items-center gap-1.5 border text-sm font-medium tracking-tight transition-[color,border-color]"
            style={{
              color: secondaryBtn.color,
              background: "transparent",
              padding: "11px 24px",
              borderRadius: 9,
              borderColor: secondaryBtn.border,
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = secondaryBtn.hoverBorder;
              e.currentTarget.style.color = secondaryBtn.hoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = secondaryBtn.border;
              e.currentTarget.style.color = secondaryBtn.color;
            }}
          >
            Talk to us
          </button>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            delay: reduceMotion ? 0 : 0.82,
          }}
          className="flex flex-wrap items-center gap-2"
        >
          <span
            style={{
              fontSize: 11,
              color: productsLabel,
              fontWeight: 450,
              letterSpacing: "0.03em",
            }}
          >
            Products ·
          </span>
          {productNav.map(({ label, href }, i) => (
            <motion.div
              key={href}
              initial={reduceMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.35,
                delay: reduceMotion ? 0 : 0.9 + i * 0.06,
              }}
            >
              <Link
                to={href}
                className="inline-block rounded-full no-underline"
                style={{
                  background: pillBg,
                  border: `1px solid ${pillBorder}`,
                  padding: "3px 11px",
                  fontSize: 11,
                  color: i === 0 ? pillText0 : pillText,
                  fontWeight: i === 0 ? 500 : 400,
                }}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: 100,
          background: `linear-gradient(transparent, ${heroBg})`,
        }}
      />

      <motion.button
        type="button"
        aria-label="Scroll to products"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.5,
          delay: reduceMotion ? 0 : 1.2,
        }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center"
        style={{ gap: 5 }}
        onClick={() => scrollTo("#home-products")}
      >
        <span
          style={{ fontSize: 10, color: scrollMuted, letterSpacing: "0.08em" }}
        >
          SCROLL
        </span>
        {reduceMotion ? (
          <ChevronRight
            size={13}
            color={chevronColor}
            style={{ transform: "rotate(90deg)" }}
          />
        ) : (
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronRight
              size={13}
              color={chevronColor}
              style={{ transform: "rotate(90deg)" }}
            />
          </motion.div>
        )}
      </motion.button>
    </section>
  );
}
