import { HomeCapabilities } from "@/components/home/home-capabilities"
import { HomeHero } from "@/components/home/home-hero"
import { HomeProductsShowcase } from "@/components/home/home-products-showcase"

export function HomePage() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <HomeHero />
      <HomeCapabilities />
      <HomeProductsShowcase />
    </main>
  )
}
