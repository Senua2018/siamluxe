import { HeroWithLoader } from "@/components/home/HeroWithLoader";
import { TrustBanner } from "@/components/home/TrustBanner";
import { LotusSection } from "@/components/home/LotusSection";
import { FeaturedSalons } from "@/components/home/FeaturedSalons";
import { WhyUs } from "@/components/home/WhyUs";
import { ImmersiveQuote } from "@/components/home/ImmersiveQuote";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Gallery } from "@/components/home/Gallery";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/home/FinalCTA";
import { createClient } from "@/lib/supabase/server";
import { getFeaturedSalons } from "@/lib/supabase/queries";

export default async function HomePage() {
  const supabase = await createClient();
  const featured = (await getFeaturedSalons(supabase)).map((s) => ({
    ...s,
    photos: s.salon_photos,
  }));

  return (
    <>
      <HeroWithLoader />
      <LotusSection />
      <TrustBanner />
      <FeaturedSalons salons={featured} />
      <WhyUs />
      <ImmersiveQuote />
      <HowItWorks />
      <Gallery />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
