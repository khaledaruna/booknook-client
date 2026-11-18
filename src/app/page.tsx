import { HomeHero } from "@/components/home/HomeHero";
import { Cta } from "@/components/home/HomeCta";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <Cta />
      {/* Additional homepage sections will be added here. */}
    </main>
  );
}