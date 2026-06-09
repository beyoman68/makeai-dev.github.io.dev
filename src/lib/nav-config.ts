/** IA-driven nav targets; paths for future routing (same-origin). */

export const CONTACT_MAIL = "ask@mazelone.com" as const

/** Global Research hub — single page, no dropdown. */
export const researchHref = "/research" as const

/** Solution — homepage platform section, no dropdown. */
export const solutionHref = "/solution" as const

/** About → `/company/about` (top of page). Page still exposes `#about-us` | `#history` for deep links. No `#career` here. Career: `/company/career`. */
export const companyNav = [
  { label: "About", href: "/company/about" },
  { label: "Career", href: "/company/career" },
] as const

export const productNav = [
  { label: "MZO RAG Platform", href: "/products/rag-platform" },
  { label: "MZO Chat Platform", href: "/products/chat-platform" },
  { label: "MZO Email Agent", href: "/products/email-agent" },
  { label: "MZO AI Translator", href: "/products/ai-translator" },
  { label: "MZO Document Generator", href: "/products/docu-generator" },
] as const

export const solutionNav = [
  { label: "Make AIOps", href: "/solution/make-aiops" },
  { label: "Make Money", href: "/solution/make-money" },
  { label: "Docu. Analyzer", href: "/solution/docu-analyzer" },
  { label: "AX 진단 툴", href: "/solution/ax-tool" },
] as const

export const footerContact = {
  phones: [{ n: "(+82) 10-5260-4172", role: "Business" }] as const,
  email: CONTACT_MAIL,
  headquarters:
    "165 Yangsu-ro, Yangseo-myeon, Yangpyeong-gun, Gyeonggi-do, Republic of Korea",
  seoulOffice:
    "4th Floor, 161 Hakdong-ro, Gangnam District, Seoul, Republic of Korea",
} as const
