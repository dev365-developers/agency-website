import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import MissionSection from "@/components/about/AboutMission";

export const metadata: Metadata = {
  title: "About dev365 — Our Mission",
  description:
    "Learn about dev365 and how we help businesses get professional websites with zero upfront cost.",
};

export default function AboutPage() {
  return (
    <main>
        <AboutHero />
        <MissionSection />
    </main>
  )
}