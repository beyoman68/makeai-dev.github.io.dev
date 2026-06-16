/** IA-driven nav targets; paths for future routing (same-origin). */

export const CONTACT_MAIL = "sales@makeai.cloud" as const;

/** Global Research hub — single page, no dropdown. */
export const researchHref = "/research" as const;

/** Solution — homepage platform section, no dropdown. */
export const solutionHref = "/solution" as const;

/** About → homepage `#about-us` section. */
export const companyNav = [{ label: "About", href: "/#about-us" }] as const;

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
  headquarters: "서울시 강남구 테헤란로1길 28-11 (5층)",
} as const;
