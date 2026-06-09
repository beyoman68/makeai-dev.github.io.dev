import { AboutUs } from "@/components/home/about-us";
import { HomeHero } from "@/components/home/home-hero";
import { problemSection } from "@/components/home/problemSection";
import { Products } from "@/components/home/products";

export function HomePage() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <HomeHero />
      <AboutUs />
      {problemSection()}
      <Products />
    </main>
  );
}
