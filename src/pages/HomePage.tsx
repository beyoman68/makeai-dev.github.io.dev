import { AboutUs } from "@/components/home/about-us";
import { HomeHero } from "@/components/home/home-hero";
import { ProblemSection } from "@/components/home/problemSection";
import { Products } from "@/components/home/products";

export function HomePage() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <HomeHero />
      <AboutUs />
      <ProblemSection />
      <Products />
    </main>
  );
}
