import DemoWebsitesSection from "@/components/home/Demo";
import AgencyHero from "@/components/home/Hero";
import PricingSection from "@/components/home/Pricing";
import WhatsIncluded from "@/components/home/WhatsIncluded";
import WhoThisIsForSection from "@/components/home/WhoThisIsFor";
import WhySection from "@/components/home/WhyUs";
import HowItWorksSection from "@/components/home/Works";

export default function Home() {
  return (
    <main>
      <AgencyHero />
      <WhySection />
      <HowItWorksSection />
      <WhatsIncluded />
      <PricingSection />
      <DemoWebsitesSection />
      {/* <WhoThisIsForSection /> */}
    </main>
  )
}