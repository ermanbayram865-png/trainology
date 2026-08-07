import type { Metadata } from "next";

import FinalCTA from "@/components/home/FinalCTA";
import HeroSection from "@/components/home/HeroSection";
import MovementPreview from "@/components/home/MovementPreview";
import SciencePreview from "@/components/home/SciencePreview";
import ToolsShowcase from "@/components/home/ToolsShowcase";
import TrustSection from "@/components/home/TrustSection";
import ValueProposition from "@/components/home/ValueProposition";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ValueProposition />
      <ToolsShowcase />
      <MovementPreview />
      <SciencePreview />
      <TrustSection />
      <FinalCTA />
    </main>
  );
}
