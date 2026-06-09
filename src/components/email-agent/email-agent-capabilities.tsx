import { motion, useReducedMotion } from "motion/react"
import { Building2, FileText, Globe, Layers, Shield, Zap } from "lucide-react"

const ease = [0.16, 1, 0.3, 1] as const

/** Mirrors `.dev/code/20260420_1600_mzo_email_agent/src/app/App.tsx` FEATURES + section layout. */
const CAPABILITIES = [
  {
    icon: FileText,
    title: "Attachment-Aware Intelligence",
    body: "MZO reasons over message text and business attachments—PDFs, Office files, spreadsheets, and decks—in one pass, so outputs reflect the full thread and file context.",
  },
  {
    icon: Zap,
    title: "No Context Switching",
    body: "Summaries, grounded Q&A, reply drafts, and translation run beside the active mail item. The add-in stays in Outlook—no copy-paste into a separate assistant console.",
  },
  {
    icon: Globe,
    title: "Multilingual Translation",
    body: "Translate bodies and attachment-backed content into the languages your regions need, with tone and structure suited to business correspondence.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    body: "Run on your infrastructure or in a private cloud. Aligns with Microsoft 365, on-premises Exchange, and data residency choices your security team already governs.",
  },
  {
    icon: Layers,
    title: "Extensible Architecture",
    body: "Connect MZO to ERP, CRM, and internal knowledge systems. Extend with workflows, domain-tuned models, and agent-style integrations your stack already supports.",
  },
  {
    icon: Building2,
    title: "Built for the Enterprise",
    body: "Role-based access, audit logging, SSO, and compliance controls scale with high-volume mail—consistent latency when every inbox is busy.",
  },
] as const

export function EmailAgentCapabilities() {
  const reduce = useReducedMotion() ?? false

  return (
    <section
      className="w-full bg-background py-16 text-foreground sm:py-20 lg:py-24 dark:bg-black dark:text-white"
      aria-labelledby="email-agent-capabilities-heading"
    >
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduce ? 0 : 0.65, ease }}
          className="mb-12 sm:mb-14"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-muted-foreground dark:text-white/35">
            Outlook-native capabilities
          </p>
          <h2
            id="email-agent-capabilities-heading"
            className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl sm:leading-[1.1] dark:text-white"
          >
            Grounded intelligence on mail and attachments,
            <br />
            <span className="text-muted-foreground dark:text-white/40">
              delivered inside the Outlook experience you standardize on.
            </span>
          </h2>
        </motion.div>

        <div className="overflow-hidden rounded-[14px] border border-border bg-background dark:border-white/[0.06] dark:bg-white/[0.06]">
          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3 dark:bg-white/[0.06]">
            {CAPABILITIES.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: reduce ? 0 : 0.5,
                    delay: reduce ? 0 : i * 0.06,
                    ease,
                  }}
                  className="flex flex-col gap-3.5 bg-background px-7 py-8 dark:bg-[#0c0c0c]"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 dark:border-white/[0.08] dark:bg-white/[0.05]">
                    <Icon className="size-4 text-foreground dark:text-white/60" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-[14.5px] font-medium tracking-tight text-foreground dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground dark:text-white/45">
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
