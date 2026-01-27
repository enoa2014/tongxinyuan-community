import { HeroSection } from "@/components/landing/HeroSection"
import { TrustStats } from "@/components/landing/TrustStats"
import { FeatureHighlights } from "@/components/landing/FeatureHighlights"
import { SupportCTA } from "@/components/landing/SupportCTA"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <TrustStats />
      <FeatureHighlights />
      <SupportCTA />
    </main>
  );
}
