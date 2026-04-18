import { Hero } from "@/components/home/Hero";
import { TrustBanner } from "@/components/home/TrustBanner";
import { FeaturedSalons } from "@/components/home/FeaturedSalons";
import { WhyUs } from "@/components/home/WhyUs";
import { ImmersiveQuote } from "@/components/home/ImmersiveQuote";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Gallery } from "@/components/home/Gallery";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBanner />
      <FeaturedSalons />
      <WhyUs />
      <ImmersiveQuote />
      <HowItWorks />
      <Gallery />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
