import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { useLocation } from "react-router-dom"

import { BackToHome } from "@/components/back-to-home"
import { footerContact } from "@/lib/nav-config"

const ease = [0.16, 1, 0.3, 1] as const

/** Milestones (newest first). Sync with `.dev/md/20260417_1405_company-menu-planning-and-content.md` §6. */
const HISTORY_BY_YEAR = [
  {
    year: "2026",
    items: [
      "Mar 2026–Present — Built an AI-powered item database for KODATA.",
    ],
  },
  {
    year: "2025",
    items: [
      "Dec 2025 — Delivered Docu-Analyzer to the Korea Nuclear Environment Corporation.",
      "Nov 2025–Dec 2025 — Built an Azure OpenAI-based plant catalog service for the KIST Natural Products Research Institute.",
      "Nov 2025 — Built a RAG system for the Patent Research Institute.",
      "Sep 2025–Nov 2025 — Built an Azure OpenAI intermediary service for Korea Credit Data / Innovation Finance.",
      "Sep 2025 — Delivered an on-device translator for the Korean National Police Agency (pilot project).",
      "Jul 2025–Dec 2025 — Performed the 2nd-phase enhancement of the Korean Register portal.",
    ],
  },
  {
    year: "2024",
    items: [
      "Dec 2024–Jan 2025 — Developed a private / enterprise LLM for LG Electronics.",
      "Jun 2024–Oct 2024 — Developed multiple services based on Microsoft Azure OpenAI.",
    ],
  },
  {
    year: "2023",
    items: [
      "Nov 2023–Present — Developed a Microsoft Azure OpenAI-based ChatGPT Orchestrator and carried out multiple PoCs (Proofs of Concept).",
    ],
  },
  {
    year: "2022",
    items: [
      "Sep 2022–2023 — Built a claims automation service for Korea Food for the Hungry International.",
    ],
  },
  {
    year: "2021",
    items: [
      "Sep 2021–Jan 2022 — Built the NC Dinos Smart Stadium (MS Chatbot, Teams, Cognitive Services including face recognition).",
      "Mar 2021 — Built the Dongyang Moolsan vendor portal and MS Dynamics 365 ERP (procurement, sales, vendor management), and also the Ananti vendor portal.",
      "Mar 2021 — Built a Power BI system for Korea Food for the Hungry International (SISS, Power BI).",
    ],
  },
  {
    year: "2020",
    items: [
      "Sep 2020–Jan 2021 — Provided an app service for self-management of Parkinson’s patients for the Yonsei Severance College of Nursing.",
      "Apr 2020 — Provided an app service for self-management of HIV patients for the Yonsei Severance College of Nursing.",
      "Apr 2020 — Developed the interface for Haptic LaSor at Yonsei Severance (Galaxy Watch with 12 sensors).",
    ],
  },
  {
    year: "2019",
    items: [
      "Jan 2019–Apr 2019 — Advanced the Rehab system for Wonkwang University / Soonchunhyang University / Paik Hospital.",
      "2019 — Conducted a clinical project for Moyamoya disease patients with the Yonsei Severance College of Nursing.",
    ],
  },
  {
    year: "2018",
    items: [
      "Jan 2018–Dec 2018 — Conducted a clinical study on 순간 stress measurement with the Gyeonggi Provincial Police Agency and the Yonsei Severance College of Nursing.",
      "Jan 2018–Dec 2018 — Worked on Rehab (cardiac rehabilitation) for Wonkwang University Hospital.",
      "2018 — Worked on PHR (Personal Health Record) for Konyang University Hospital.",
    ],
  },
  {
    year: "2017",
    items: [
      "Jun 2017 — Built the KRA Winny World customer portal (web/app), including location-tracking admission tickets and horse management.",
      "Apr 2017–Dec 2017 — Worked on SEMS (Smart Emergency Medical Services) (integrated control service, e-Triage, etc.; project under the Fire Safety Technology R&D Program / Ministry of the Interior and Safety).",
    ],
  },
  {
    year: "2015",
    items: [
      "Jun 2015–Jun 2018 — Participated in the “Global Healthcare Validation (Wearable Devices)” project (NIA / Ministry of Science, ICT and Future Planning).",
      "Oct 2015–Dec 2015 — Participated in the “NFC Smart Tag-based Emergency Response Medical Safety Network (HL7)” project (NIPA / Ministry of Science, ICT and Future Planning).",
      "Jan 2015–Mar 2015 — Worked on a PHR pilot service (Yonsei Severance, Seodaemun-gu Office, Mapo-gu Office, Eunpyeong-gu Office, etc.; Hyundai Motor Chung Mong-Koo Foundation).",
    ],
  },
  {
    year: "2014",
    items: [
      "Apr 2014–Dec 2015 — Worked on Saudi Aramco CRM, Bayer CropScience (MS Dynamics CRM), and the Samsung Electronics promotion system, including CRM and point-management system consulting.",
    ],
  },
] as const

const HERO_HEADLINE =
  "Building Real-World AI for the Future of Work" as const
const HERO_SUB =
  "We turn advanced AI into practical systems that help people and organizations work smarter." as const

const MAP_EMBED_HEADQUARTERS =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.4314029818956!2d127.31523297643962!3d37.544898672044184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35634b5fc237b3a9%3A0x51009e18d04ca364!2s165%20Yangsu-ro%2C%20Yangseo-myeon%2C%20Yangpyeong%2C%20Gyeonggi-do!5e0!3m2!1sen!2skr!4v1776992955716!5m2!1sen!2skr" as const

const MAP_EMBED_AI_LAB =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.7598737343264!2d127.02574137643836!3d37.51358127205238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3efccb2b9ff%3A0x345c2aae93ad4363!2s161%20Hakdong-ro%2C%20Gangnam%20District%2C%20Seoul!5e0!3m2!1sen!2skr!4v1776992805770!5m2!1sen!2skr" as const

/**
 * About page — `/company/about`: Hero + #about-us, #history, #locations (addresses + maps). Career is `/company/career`.
 */
export function CompanyPage() {
  const { hash, pathname } = useLocation()
  const reduce = useReducedMotion() ?? false

  const inView = {
    initial: reduce ? false : ({ opacity: 0, y: 18 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduce ? 0 : 0.65, ease },
  } as const

  React.useLayoutEffect(() => {
    const id = hash.replace(/^#/, "")
    if (!id) {
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [hash, pathname])

  return (
    <main className="flex w-full flex-1 flex-col">
      <section
        aria-labelledby="company-hero-heading"
        className="w-full border-b border-border px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-20 sm:pt-12 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <motion.h1
            id="company-hero-heading"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.85,
              delay: reduce ? 0 : 0.12,
              ease,
            }}
            className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {HERO_HEADLINE}
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.7,
              delay: reduce ? 0 : 0.28,
              ease,
            }}
            className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
          >
            {HERO_SUB}
          </motion.p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <motion.section
        id="about-us"
        aria-labelledby="about-us-heading"
        className="scroll-mt-24 pt-12"
        {...inView}
      >
        <h2
          id="about-us-heading"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          About us
        </h2>
        <div className="mt-6 space-y-6 text-sm leading-7 text-muted-foreground">
          <p>
            Mazelone is an AI company that turns complex, messy, real-world
            data into systems people can actually use.
          </p>
          <p>
            We build practical AI solutions that help organizations work with
            documents, language, images, and knowledge more intelligently. From
            multimodal understanding to agent-based retrieval and
            domain-specific AI systems, our focus is not on technology for its
            own sake, but on making AI useful in production.
          </p>
          <p>
            We believe the future of work will be shaped by AI that understands
            how people really work — across documents, conversations, images,
            regulations, and operational knowledge. Our role is to make that
            intelligence reliable, usable, and deployable in the environments
            where it matters most.
          </p>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              Our mission
            </h3>
            <p className="mt-3">
              At Mazelone, our mission is to bridge advanced AI research and real
              business execution.
            </p>
            <p className="mt-4">
              We design AI systems that go beyond demos: systems that can
              understand complex enterprise data, retrieve the right information,
              support better decisions, and fit into real workflows. By combining
              strong research capability with product-minded engineering, we
              help companies adopt AI in ways that are grounded, scalable, and
              impactful.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              What we do
            </h3>
            <p className="mt-3">
              Our work centers on building AI for real operational environments.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                Multimodal AI systems that understand text, documents, and
                images together
              </li>
              <li>
                Agent-based RAG and knowledge systems for complex enterprise use
                cases
              </li>
              <li>
                Document intelligence pipelines that transform unstructured data
                into usable knowledge
              </li>
              <li>
                Domain-specific AI services designed for security, accuracy, and
                operational fit
              </li>
              <li>
                Production-ready AI architectures that organizations can actually
                deploy and maintain
              </li>
            </ul>
            <p className="mt-4">
              We are especially interested in problems where data is large,
              messy, multimodal, and difficult to operationalize — because that is
              where useful AI creates the most value.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              How we work
            </h3>
            <p className="mt-3">
              At Mazelone, we care about more than model quality. We care about
              whether AI works in practice.
            </p>
            <p className="mt-4">
              We work with a strong sense of ownership, technical depth, and
              execution. We value clarity over hype, real impact over demos, and
              collaboration over silos. Our goal is to build systems that are
              not only intelligent, but trustworthy, maintainable, and aligned
              with the realities of users and businesses.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              Our belief
            </h3>
            <p className="mt-3">
              AI should not stay in research papers or isolated prototypes.
            </p>
            <p className="mt-4">
              It should help people do meaningful work better — with less
              friction, more accuracy, and greater confidence. Mazelone exists to
              build that kind of AI: practical, reliable, and ready for the real
              world.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="history"
        aria-labelledby="history-heading"
        className="scroll-mt-24 pt-16"
        {...inView}
      >
        <h2
          id="history-heading"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          History
        </h2>
        <div className="mt-6 space-y-10">
          {HISTORY_BY_YEAR.map(({ year, items }, idx) => (
            <motion.div
              key={year}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: reduce ? 0 : 0.5,
                delay: reduce ? 0 : idx * 0.06,
                ease,
              }}
            >
              <h3 className="text-base font-semibold text-foreground">{year}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
                {items.map((text, i) => (
                  <li key={`${year}-${i}`}>{text}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="locations"
        aria-labelledby="locations-heading"
        className="scroll-mt-24 pt-16"
        {...inView}
      >
        <h2
          id="locations-heading"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Locations
        </h2>
        <div className="mt-6 flex flex-col gap-12">
          <div>
            <h3 className="text-base font-semibold text-foreground">Headquarters</h3>
            <address className="mt-3 not-italic text-sm leading-relaxed text-muted-foreground">
              {footerContact.headquarters}
            </address>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title="Mazelone headquarters location"
                src={MAP_EMBED_HEADQUARTERS}
                width="100%"
                height={420}
                className="block w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">AI Lab</h3>
            <address className="mt-3 not-italic text-sm leading-relaxed text-muted-foreground">
              {footerContact.seoulOffice}
            </address>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title="Mazelone AI Lab location"
                src={MAP_EMBED_AI_LAB}
                width="100%"
                height={320}
                className="block w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div {...inView}>
        <BackToHome />
      </motion.div>
      </div>
    </main>
  )
}
