import { LandingNavbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { MethodologySection } from "@/components/landing/methodology-section";
import { PillarsSection } from "@/components/landing/pillars-section";
import { PhilosophySection } from "@/components/landing/philosophy-section";
import { Footer } from "@/components/landing/footer";
import { ModalProvider } from "@/components/landing/access-modal";
import { ScrollToTop } from "@/components/landing/scroll-to-top";

export default function LandingPage() {
  return (
    <ModalProvider>
      <main className="min-h-dvh overflow-x-hidden bg-[#030712]">
        <LandingNavbar />
        <HeroSection />
        <MethodologySection />
        <PillarsSection />
        <PhilosophySection />
        <Footer />
        <ScrollToTop />
      </main>
    </ModalProvider>
  );
}
