import { useSyncExternalStore } from "react"

function subscribeHtmlClass(onStoreChange: () => void) {
  const mo = new MutationObserver(onStoreChange)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  const mq = window.matchMedia("(prefers-color-scheme: dark)")
  mq.addEventListener("change", onStoreChange)
  return () => {
    mo.disconnect()
    mq.removeEventListener("change", onStoreChange)
  }
}

function getIsDarkFromDocument(): boolean {
  return document.documentElement.classList.contains("dark")
}

/**
 * True when `document.documentElement` has class `dark` (see `ThemeProvider`).
 * Server snapshot matches app default (`defaultTheme="dark"`).
 */
export function useHtmlIsDark() {
  return useSyncExternalStore(subscribeHtmlClass, getIsDarkFromDocument, () => true)
}
