import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Build `tel:` href from a display string like (+82) 2-555-0272 */
export function phoneToTelHref(display: string): string {
  const digits = display.replace(/\D/g, "")
  return `tel:+${digits}`
}
