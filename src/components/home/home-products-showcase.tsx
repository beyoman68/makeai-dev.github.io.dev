import type { ComponentType, ReactNode, SVGProps } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  Database,
  FileText,
  Languages,
  Mail,
  MessageSquare,
  Search,
} from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { useHtmlIsDark } from "@/lib/use-html-is-dark"
import { productNav } from "@/lib/nav-config"

/**
 * Home — product showcase (scroll target for hero `Explore Products`).
 * Stacks all six products as uniformly-sized, horizontally-split cards
 * (text left, product-specific monochrome mockup right).
 * Mirrors `.dev/code/20260421_1111_home` `MazProducts` in spirit;
 * fully self-contained under `src/` (no `.dev/code` imports).
 * @see `.dev/md/20260421_1635_home_products_showcase_section_planning.md`
 */

type LucideIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>

type ShowcaseEntry = {
  slug: string
  category: string
  icon: LucideIcon
  tagline: string
  description: string
  preview: "DATA" | "RAG" | "CHAT" | "EMAIL" | "TRANSLATE" | "DOCGEN"
}

const META_BY_HREF: Record<string, ShowcaseEntry> = {
  "/products/data-platform": {
    slug: "data-platform",
    category: "Core Platform",
    icon: Database,
    tagline: "Parse anything. Extract structure. Move faster.",
    description:
      "Turn Word, Excel, PowerPoint, HWP, HTML, images, and PDFs into structured content ready for search, automation, and AI — without treating every file like a flat image.",
    preview: "DATA",
  },
  "/products/rag-platform": {
    slug: "rag-platform",
    category: "Knowledge Retrieval",
    icon: Search,
    tagline: "Grounded retrieval, evidence-linked answers, and document search.",
    description:
      "Index enterprise document corpora and retrieve answers grounded in source evidence — with citations, confidence signals, and multimodal document understanding.",
    preview: "RAG",
  },
  "/products/chat-platform": {
    slug: "chat-platform",
    category: "Workspace Intelligence",
    icon: MessageSquare,
    tagline: "Workspace-based AI with shared files, instructions, and source-aware chat.",
    description:
      "Collaborative AI workspaces where teams configure system instructions, share files, and engage with grounded, traceable conversational AI.",
    preview: "CHAT",
  },
  "/products/email-agent": {
    slug: "email-agent",
    category: "Email Automation",
    icon: Mail,
    tagline: "Outlook-native assistant for summaries, reply drafts, and attachment Q&A.",
    description:
      "An intelligent email layer that reads, summarizes, drafts replies, translates threads, and answers questions about attached documents.",
    preview: "EMAIL",
  },
  "/products/ai-translator": {
    slug: "ai-translator",
    category: "Language Services",
    icon: Languages,
    tagline: "Unified translation for chat, documents, images, voice, and glossary.",
    description:
      "A professional translation platform supporting 50+ languages with domain glossaries, document upload, image OCR translation, and voice transcription.",
    preview: "TRANSLATE",
  },
  "/products/docu-generator": {
    slug: "docu-generator",
    category: "Document Intelligence",
    icon: FileText,
    tagline: "Structured AI drafting for RFPs, proposals, and enterprise documents.",
    description:
      "Generate structured enterprise documents from instructions, templates, and source materials — with section-level control and export-ready output.",
    preview: "DOCGEN",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Palette (outer card / text)
// ─────────────────────────────────────────────────────────────────────────────

type Palette = {
  sectionBg: string
  borderY: string
  overline: string
  heading: string
  lead: string
  cardBg: string
  cardBorder: string
  cardBorderHover: string
  cardBoxShadow: string
  cardDivider: string
  cardRightBg: string
  iconWrapBg: string
  iconWrapBorder: string
  iconColor: string
  categoryBg: string
  categoryBorder: string
  categoryText: string
  h3: string
  tagline: string
  body: string
  ctaBg: string
  ctaBorder: string
  ctaText: string
  smallLabel: string
}

function paletteFor(isDark: boolean): Palette {
  if (isDark) {
    return {
      sectionBg: "#0f0f0f",
      borderY: "rgba(255,255,255,0.06)",
      overline: "rgba(255,255,255,0.3)",
      heading: "#f2f2f2",
      lead: "rgba(255,255,255,0.45)",
      cardBg: "#1a1a1a",
      cardBorder: "rgba(255,255,255,0.14)",
      cardBorderHover: "rgba(255,255,255,0.32)",
      cardBoxShadow: "0 14px 38px rgba(0,0,0,0.45)",
      cardDivider: "rgba(255,255,255,0.08)",
      cardRightBg: "#161616",
      iconWrapBg: "rgba(255,255,255,0.1)",
      iconWrapBorder: "rgba(255,255,255,0.15)",
      iconColor: "rgba(255,255,255,0.85)",
      categoryBg: "rgba(255,255,255,0.08)",
      categoryBorder: "rgba(255,255,255,0.14)",
      categoryText: "rgba(255,255,255,0.7)",
      h3: "#f2f2f2",
      tagline: "rgba(255,255,255,0.62)",
      body: "rgba(255,255,255,0.4)",
      ctaBg: "rgba(255,255,255,0.08)",
      ctaBorder: "rgba(255,255,255,0.15)",
      ctaText: "#f2f2f2",
      smallLabel: "rgba(255,255,255,0.25)",
    }
  }
  return {
    sectionBg: "#ffffff",
    borderY: "rgba(0,0,0,0.08)",
    overline: "rgba(24,24,27,0.55)",
    heading: "#18181b",
    lead: "rgba(24,24,27,0.62)",
    cardBg: "#ffffff",
    cardBorder: "rgba(0,0,0,0.12)",
    cardBorderHover: "rgba(0,0,0,0.3)",
    cardBoxShadow: "0 14px 32px rgba(24,24,27,0.1)",
    cardDivider: "rgba(0,0,0,0.08)",
    cardRightBg: "#f7f7f8",
    iconWrapBg: "rgba(0,0,0,0.05)",
    iconWrapBorder: "rgba(0,0,0,0.12)",
    iconColor: "rgba(24,24,27,0.8)",
    categoryBg: "rgba(0,0,0,0.04)",
    categoryBorder: "rgba(0,0,0,0.12)",
    categoryText: "rgba(24,24,27,0.7)",
    h3: "#18181b",
    tagline: "rgba(24,24,27,0.75)",
    body: "rgba(24,24,27,0.6)",
    ctaBg: "rgba(0,0,0,0.05)",
    ctaBorder: "rgba(0,0,0,0.14)",
    ctaText: "#18181b",
    smallLabel: "rgba(24,24,27,0.45)",
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mockup palette (inner right panel)
// Each mockup uses `rgba` helpers that flip white→dark-ink in light mode.
// ─────────────────────────────────────────────────────────────────────────────

type MockupColors = {
  /** outer mockup card bg (slightly different from the right-panel bg) */
  bg: string
  /** secondary band (headers/sidebars inside mockup) */
  bg2: string
  /** primary fg (mid-contrast text) */
  fg: (a: number) => string
  /** divider between sections */
  divider: string
  /** tile bg (list items / chips) */
  tile: string
  tileBorder: string
  /** highlighted tile bg */
  tileHl: string
  tileHlBorder: string
  /** subtle shape bg */
  shape: string
}

function mockupColorsFor(isDark: boolean): MockupColors {
  if (isDark) {
    return {
      bg: "#141414",
      bg2: "#111",
      fg: (a) => `rgba(255,255,255,${a})`,
      divider: "rgba(255,255,255,0.08)",
      tile: "rgba(255,255,255,0.05)",
      tileBorder: "rgba(255,255,255,0.1)",
      tileHl: "rgba(255,255,255,0.1)",
      tileHlBorder: "rgba(255,255,255,0.2)",
      shape: "rgba(255,255,255,0.04)",
    }
  }
  return {
    bg: "#ffffff",
    bg2: "#f3f3f4",
    fg: (a) => `rgba(24,24,27,${a})`,
    divider: "rgba(0,0,0,0.08)",
    tile: "rgba(0,0,0,0.03)",
    tileBorder: "rgba(0,0,0,0.1)",
    tileHl: "rgba(0,0,0,0.07)",
    tileHlBorder: "rgba(0,0,0,0.18)",
    shape: "rgba(0,0,0,0.03)",
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mockups
// ─────────────────────────────────────────────────────────────────────────────

const MOCKUP_HEIGHT = 260

function DataMockup({ c }: { c: MockupColors }) {
  const inputs = ["DOC / DOCX", "XLS / XLSX", "PPT / PPTX", "HWP / HWPX", "HTML", "PDF", "JPG / PNG"]
  const outputs: { label: string; hl: boolean }[] = [
    { label: "JSON", hl: true },
    { label: "Markdown", hl: false },
    { label: "Search Index", hl: false },
    { label: "RAG / AI Context", hl: true },
    { label: "Automation Workflows", hl: false },
  ]
  return (
    <div
      style={{
        height: MOCKUP_HEIGHT,
        background: c.bg,
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${c.divider}`,
        padding: "16px 18px",
      }}
    >
      <div
        className="uppercase"
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: c.fg(0.3),
          letterSpacing: "0.08em",
          marginBottom: 12,
        }}
      >
        Supported formats → Structured output
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 14,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            className="uppercase"
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: c.fg(0.3),
              letterSpacing: "0.06em",
              marginBottom: 2,
            }}
          >
            Inputs
          </div>
          {inputs.map((f) => (
            <div
              key={f}
              style={{
                fontSize: 10,
                color: c.fg(0.6),
                background: c.tile,
                border: `1px solid ${c.tileBorder}`,
                borderRadius: 5,
                padding: "4px 8px",
                textAlign: "center",
              }}
            >
              {f}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: 1, height: 60, background: c.divider }} />
          <div style={{ fontSize: 12, color: c.fg(0.4) }}>→</div>
          <div style={{ width: 1, height: 60, background: c.divider }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            className="uppercase"
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: c.fg(0.3),
              letterSpacing: "0.06em",
              marginBottom: 2,
            }}
          >
            Outputs
          </div>
          {outputs.map((o) => (
            <div
              key={o.label}
              style={{
                fontSize: 10,
                color: o.hl ? c.fg(0.9) : c.fg(0.55),
                background: o.hl ? c.tileHl : c.tile,
                border: `1px solid ${o.hl ? c.tileHlBorder : c.tileBorder}`,
                borderRadius: 5,
                padding: "4px 8px",
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RAGMockup({ c }: { c: MockupColors }) {
  const sources = ["Contract_v2.pdf · p.4", "Annex_B.pdf · p.11", "Policy.docx"]
  return (
    <div
      style={{
        height: MOCKUP_HEIGHT,
        background: c.bg,
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${c.divider}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: c.bg2,
          padding: "10px 14px",
          borderBottom: `1px solid ${c.divider}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            background: c.tile,
            border: `1px solid ${c.tileBorder}`,
            borderRadius: 6,
            padding: "5px 10px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            flex: 1,
          }}
        >
          <Search size={11} color={c.fg(0.4)} aria-hidden />
          <span style={{ fontSize: 11, color: c.fg(0.4) }}>Search knowledge base…</span>
        </div>
      </div>
      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
        }}
      >
        <div
          style={{
            background: c.tileHl,
            border: `1px solid ${c.tileHlBorder}`,
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: c.fg(0.8),
              marginBottom: 4,
              letterSpacing: "0.02em",
            }}
          >
            Grounded Answer · 3 sources
          </div>
          <div style={{ fontSize: 11, color: c.fg(0.6), lineHeight: 1.55 }}>
            The contract renewal clause requires a <strong style={{ color: c.fg(0.9) }}>30-day
            written notice</strong> before auto-renewal, per Annex B §4.2.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {sources.map((s) => (
            <div
              key={s}
              style={{
                fontSize: 10,
                color: c.fg(0.45),
                background: c.tile,
                border: `1px solid ${c.tileBorder}`,
                borderRadius: 5,
                padding: "4px 8px",
                whiteSpace: "nowrap",
              }}
            >
              {s}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 9,
            color: c.fg(0.35),
          }}
        >
          <span>Evidence-linked</span>
          <span>Confidence: 92%</span>
        </div>
      </div>
    </div>
  )
}

function ChatMockup({ c }: { c: MockupColors }) {
  const spaces = ["Finance Q3", "Legal", "HR Policy", "Tech Docs"]
  return (
    <div
      style={{
        height: MOCKUP_HEIGHT,
        background: c.bg,
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${c.divider}`,
        display: "flex",
      }}
    >
      <div
        style={{
          width: 110,
          background: c.bg2,
          padding: "12px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          borderRight: `1px solid ${c.divider}`,
        }}
      >
        <div
          className="uppercase"
          style={{
            fontSize: 9,
            color: c.fg(0.35),
            marginBottom: 4,
            letterSpacing: "0.06em",
            fontWeight: 600,
          }}
        >
          Spaces
        </div>
        {spaces.map((s, i) => (
          <div
            key={s}
            style={{
              fontSize: 10.5,
              color: i === 0 ? c.fg(0.9) : c.fg(0.45),
              background: i === 0 ? c.tileHl : "transparent",
              borderRadius: 5,
              padding: "4px 7px",
            }}
          >
            {s}
          </div>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "14px 14px",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              background: c.tileHl,
              border: `1px solid ${c.tileHlBorder}`,
              borderRadius: "10px 10px 3px 10px",
              padding: "7px 10px",
              maxWidth: "82%",
            }}
          >
            <div style={{ fontSize: 11, color: c.fg(0.85) }}>Summarize Q3 risk highlights</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <div
            style={{
              width: 22,
              height: 22,
              background: c.tileHl,
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 10, color: c.fg(0.85), fontWeight: 700 }}>M</span>
          </div>
          <div
            style={{
              background: c.tile,
              border: `1px solid ${c.tileBorder}`,
              borderRadius: "3px 10px 10px 10px",
              padding: "8px 10px",
              flex: 1,
            }}
          >
            <div style={{ fontSize: 11, color: c.fg(0.7), lineHeight: 1.55 }}>
              3 risks flagged: FX exposure <strong style={{ color: c.fg(0.9) }}>+12%</strong>,
              vendor concentration, margin compression.
            </div>
            <div style={{ fontSize: 10, color: c.fg(0.4), marginTop: 4 }}>2 sources cited</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmailMockup({ c }: { c: MockupColors }) {
  const emails = [
    { from: "Sarah K.", sub: "Contract review…" },
    { from: "David L.", sub: "Q3 report…" },
    { from: "Tanaka S.", sub: "翻訳お願いします" },
  ]
  const actions = ["Draft Reply", "Translate", "Ask Doc"]
  return (
    <div
      style={{
        height: MOCKUP_HEIGHT,
        background: c.bg,
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${c.divider}`,
        display: "flex",
      }}
    >
      <div
        style={{
          width: 140,
          borderRight: `1px solid ${c.divider}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "8px 12px",
            background: c.bg2,
            borderBottom: `1px solid ${c.divider}`,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: c.fg(0.7),
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Mail size={11} aria-hidden /> Inbox
          </div>
        </div>
        {emails.map((email, i) => (
          <div
            key={email.from}
            style={{
              padding: "8px 12px",
              borderBottom: `1px solid ${c.divider}`,
              background: i === 0 ? c.tileHl : "transparent",
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                fontWeight: i === 0 ? 600 : 500,
                color: c.fg(0.8),
              }}
            >
              {email.from}
            </div>
            <div style={{ fontSize: 10, color: c.fg(0.45), marginTop: 2 }}>{email.sub}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            background: c.tileHl,
            border: `1px solid ${c.tileHlBorder}`,
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <div
            className="uppercase"
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: c.fg(0.7),
              marginBottom: 4,
              letterSpacing: "0.06em",
            }}
          >
            AI Summary
          </div>
          <div style={{ fontSize: 11, color: c.fg(0.6), lineHeight: 1.55 }}>
            Renewal due Dec 15. Clause 4.2 requires legal sign-off before 30-day notice.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {actions.map((a) => (
            <div
              key={a}
              style={{
                fontSize: 10.5,
                background: c.tile,
                border: `1px solid ${c.tileBorder}`,
                borderRadius: 6,
                padding: "5px 9px",
                color: c.fg(0.6),
              }}
            >
              {a}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TranslatorMockup({ c }: { c: MockupColors }) {
  return (
    <div
      style={{
        height: MOCKUP_HEIGHT,
        background: c.bg,
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${c.divider}`,
      }}
    >
      <div
        style={{
          background: c.bg2,
          borderBottom: `1px solid ${c.divider}`,
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            background: c.tile,
            border: `1px solid ${c.tileBorder}`,
            borderRadius: 6,
            padding: "4px 9px",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: c.fg(0.75) }}>EN</span>
        </div>
        <div style={{ fontSize: 11, color: c.fg(0.35) }}>→</div>
        <div
          style={{
            background: c.tileHl,
            border: `1px solid ${c.tileHlBorder}`,
            borderRadius: 6,
            padding: "4px 9px",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: c.fg(0.9) }}>JA</span>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 10, color: c.fg(0.4) }}>
          Doc · Chat · Image · Voice
        </div>
      </div>
      <div style={{ display: "flex", height: "calc(100% - 36px)" }}>
        <div style={{ flex: 1, padding: "14px 14px", borderRight: `1px solid ${c.divider}` }}>
          <div
            className="uppercase"
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: c.fg(0.35),
              letterSpacing: "0.06em",
              marginBottom: 6,
            }}
          >
            Source
          </div>
          <div style={{ fontSize: 11.5, color: c.fg(0.72), lineHeight: 1.6 }}>
            The service agreement includes a standard 90-day warranty on all deliverables.
          </div>
        </div>
        <div style={{ flex: 1, padding: "14px 14px", background: c.shape }}>
          <div
            className="uppercase"
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: c.fg(0.35),
              letterSpacing: "0.06em",
              marginBottom: 6,
            }}
          >
            Target
          </div>
          <div style={{ fontSize: 11.5, color: c.fg(0.85), lineHeight: 1.6 }}>
            サービス契約には、すべての成果物に対する90日間の保証が含まれます。
          </div>
          <div style={{ fontSize: 10, color: c.fg(0.4), marginTop: 8 }}>Glossary applied</div>
        </div>
      </div>
    </div>
  )
}

function DocGenMockup({ c }: { c: MockupColors }) {
  const sections = ["✓ Exec Summary", "✓ Tech Approach", "✓ Team & Quals", "○ Pricing"]
  return (
    <div
      style={{
        height: MOCKUP_HEIGHT,
        background: c.bg,
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${c.divider}`,
        display: "flex",
      }}
    >
      <div
        style={{
          width: 130,
          borderRight: `1px solid ${c.divider}`,
          padding: "12px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 7,
          background: c.bg2,
        }}
      >
        <div
          style={{
            background: c.tileHl,
            border: `1px solid ${c.tileHlBorder}`,
            borderRadius: 5,
            padding: "5px 8px",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: c.fg(0.85) }}>RFP Response</div>
        </div>
        {sections.map((s) => (
          <div
            key={s}
            style={{
              fontSize: 10,
              color: s.startsWith("✓") ? c.fg(0.7) : c.fg(0.35),
            }}
          >
            {s}
          </div>
        ))}
        <div
          style={{
            marginTop: "auto",
            fontSize: 9,
            color: c.fg(0.35),
            letterSpacing: "0.06em",
          }}
          className="uppercase"
        >
          3 / 4 sections
        </div>
      </div>
      <div style={{ flex: 1, padding: "14px 14px", background: c.shape, overflow: "hidden" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: c.fg(0.85),
            marginBottom: 5,
          }}
        >
          1. Executive Summary
        </div>
        <div style={{ height: 1, background: c.divider, marginBottom: 8 }} />
        <div style={{ fontSize: 10.5, color: c.fg(0.55), lineHeight: 1.7 }}>
          This proposal outlines our AI transformation approach for the requested scope,
          leveraging proven enterprise workflows and MZO platform integrations…
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
          <div
            style={{
              height: 4,
              background: c.fg(0.5),
              borderRadius: 2,
              width: 72,
            }}
          />
          <div
            style={{
              height: 4,
              background: c.fg(0.18),
              borderRadius: 2,
              flex: 1,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function renderMockup(kind: ShowcaseEntry["preview"], c: MockupColors): ReactNode {
  switch (kind) {
    case "DATA":
      return <DataMockup c={c} />
    case "RAG":
      return <RAGMockup c={c} />
    case "CHAT":
      return <ChatMockup c={c} />
    case "EMAIL":
      return <EmailMockup c={c} />
    case "TRANSLATE":
      return <TranslatorMockup c={c} />
    case "DOCGEN":
      return <DocGenMockup c={c} />
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Product card (uniform horizontal layout for every product)
// ─────────────────────────────────────────────────────────────────────────────

type ProductCardProps = {
  index: number
  label: string
  href: string
  entry: ShowcaseEntry
  palette: Palette
  mockupColors: MockupColors
  reduceMotion: boolean
}

function ProductCard({
  index,
  label,
  href,
  entry,
  palette,
  mockupColors,
  reduceMotion,
}: ProductCardProps) {
  const Icon = entry.icon
  const ordinal = String(index + 1).padStart(2, "0")

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : index * 0.05 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <Link
        to={href}
        aria-label={`${label} — learn more`}
        className="group block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        style={{
          background: palette.cardBg,
          border: `1px solid ${palette.cardBorder}`,
          borderRadius: 16,
          overflow: "hidden",
          display: "block",
          transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = palette.cardBorderHover
          e.currentTarget.style.boxShadow = palette.cardBoxShadow
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = palette.cardBorder
          e.currentTarget.style.boxShadow = "none"
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr]" style={{ gap: 0 }}>
          <div
            className="lg:border-r"
            style={{
              padding: "36px 36px",
              borderRightColor: palette.cardDivider,
              borderRightWidth: 1,
              borderRightStyle: "solid",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: palette.iconWrapBg,
                  border: `1px solid ${palette.iconWrapBorder}`,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={16} color={palette.iconColor} strokeWidth={1.5} aria-hidden />
              </div>
              <div
                style={{
                  background: palette.categoryBg,
                  border: `1px solid ${palette.categoryBorder}`,
                  borderRadius: 100,
                  padding: "3px 10px",
                }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: palette.categoryText,
                    letterSpacing: "0.04em",
                  }}
                >
                  {entry.category}
                </span>
              </div>
              <span
                className="ml-auto"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: palette.smallLabel,
                  letterSpacing: "0.08em",
                }}
              >
                {ordinal}
              </span>
            </div>
            <h3
              className="text-balance"
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: palette.h3,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                marginBottom: 10,
              }}
            >
              {label}
            </h3>
            <p
              className="text-pretty"
              style={{
                fontSize: 15.5,
                fontWeight: 500,
                color: palette.tagline,
                marginBottom: 14,
                lineHeight: 1.55,
              }}
            >
              {entry.tagline}
            </p>
            <p
              className="text-pretty"
              style={{
                fontSize: 13.5,
                color: palette.body,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              {entry.description}
            </p>
            <span
              className="mt-auto"
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 500,
                color: palette.ctaText,
                background: palette.ctaBg,
                border: `1px solid ${palette.ctaBorder}`,
                borderRadius: 8,
                padding: "8px 18px",
              }}
            >
              Explore {label.replace(/^MZO\s+/, "")} <ArrowUpRight size={13} aria-hidden />
            </span>
          </div>

          <div
            style={{
              padding: "28px 32px",
              background: palette.cardRightBg,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {renderMockup(entry.preview, mockupColors)}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────────────

export function HomeProductsShowcase() {
  const reduceMotion = useReducedMotion() ?? false
  const isDark = useHtmlIsDark()
  const palette = paletteFor(isDark)
  const mockupColors = mockupColorsFor(isDark)

  const entries = productNav
    .map((p) => ({ ...p, entry: META_BY_HREF[p.href] }))
    .filter((p): p is (typeof productNav)[number] & { entry: ShowcaseEntry } => Boolean(p.entry))

  if (entries.length === 0) return null

  return (
    <section
      id="home-products"
      aria-labelledby="home-products-heading"
      className="scroll-mt-24"
      style={{
        background: palette.sectionBg,
        padding: "clamp(72px, 12vw, 120px) 32px",
        borderTop: `1px solid ${palette.borderY}`,
      }}
    >
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.65 }}
          viewport={{ once: true, margin: "-80px" }}
          style={{ marginBottom: 56 }}
        >
          <div
            className="uppercase"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: palette.overline,
              marginBottom: 16,
            }}
          >
            Product Portfolio
          </div>
          <h2
            id="home-products-heading"
            className="text-balance"
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: palette.heading,
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Six AI systems.
            <br />
            One coherent platform.
          </h2>
          <p
            className="text-pretty"
            style={{
              fontSize: 17,
              color: palette.lead,
              lineHeight: 1.65,
              maxWidth: 520,
            }}
          >
            Each product solves a distinct enterprise workflow challenge, built to deploy,
            integrate, and scale.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {entries.map((p, i) => (
            <ProductCard
              key={p.href}
              index={i}
              label={p.label}
              href={p.href}
              entry={p.entry}
              palette={palette}
              mockupColors={mockupColors}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
