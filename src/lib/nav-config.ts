/** IA-driven nav targets; paths for future routing (same-origin). */

export const CONTACT_MAIL = "jhcho@makeai.cloud" as const;

/** Global Research hub — single page, no dropdown. */
export const researchHref = "/research" as const;

/** Solution — homepage platform section, no dropdown. */
export const solutionHref = "/solution" as const;

/** About → `/company/about` (top of page). Page still exposes `#about-us` | `#history` for deep links. No `#career` here. Career: `/company/career`. */
export const companyNav = [
  { label: "About", href: "/company/about" },
  { label: "Career", href: "/company/career" },
] as const;

export const productNav = [
  { label: "RAG Platform", href: "/products/rag-platform" },
  { label: "Chat Platform", href: "/products/chat-platform" },
  { label: "Email Agent", href: "/products/email-agent" },
  { label: "AI Translator", href: "/products/ai-translator" },
  { label: "Document Generator", href: "/products/docu-generator" },
] as const;

export const solutionNav = [
  { label: "Make AIOps", href: "/solution/make-aiops" },
  { label: "Make Money", href: "/solution/make-money" },
  { label: "Document Analyzer", href: "/solution/docu-analyzer" },
  { label: "AX 진단 툴", href: "/solution/ax-tool" },
] as const;

export const footerContact = {
  phones: [{ n: "(+82) 10-9174-3516" }] as const,
  email: CONTACT_MAIL,
  headquarters: "서울시 강남구 학동로 161 (건일빌딩 4층)",
} as const;
