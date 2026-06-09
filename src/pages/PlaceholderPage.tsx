import { useLocation, useParams } from "react-router-dom"

import { BackToHome } from "@/components/back-to-home"

/** Products / Solutions detail pages — placeholder until content exists. */
export function PlaceholderPage() {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const segment = slug ?? pathname.split("/").filter(Boolean).pop() ?? "page"

  const title = segment
    .split("-")
    .map((w) => {
      const lower = w.toLowerCase()
      if (lower === "ai") {
        return "AI"
      }
      if (lower === "rag") {
        return "RAG"
      }
      if (lower === "docu") {
        return "Document"
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    })
    .join(" ")

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {pathname.startsWith("/products") ? "Products" : "Solution"}
      </p>
      <h1 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        This page is under construction.
      </p>
      <BackToHome className="mt-8" />
    </main>
  )
}
