import { HomeHero } from "@/components/home/HomeHero";
import { NewArrivals } from "@/components/home/NewArrivals";
import { HomeFeatures } from "@/components/home/HomeFeatures";

import { Cta } from "@/components/home/HomeCta";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <NewArrivals />
      <HomeFeatures />
      <Cta />
      {/* Additional homepage sections will be added here. */}
    </main>
  );
}