import { Hero } from "@/components/hero/Hero";
import { AboutSection } from "@/components/sections/AboutSection";
import { AppsSection } from "@/components/sections/AppsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/ui/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <AppsSection />
      <ContactSection />
      <Footer />
    </>
  );
}
