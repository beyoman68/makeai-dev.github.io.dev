import { AboutUs } from "@/components/home/about-us";
import { HomeHero } from "@/components/home/home-hero";
import { HomeProductsShowcase } from "@/components/home/home-products-showcase";

export function HomePage() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <HomeHero />
      <AboutUs />
      <HomeProductsShowcase />
    </main>
  );
}
