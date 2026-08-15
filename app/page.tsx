import BookingProvider from "@/components/BookingProvider";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Benefits from "@/components/Benefits";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Booking from "@/components/Booking";
import FAQ from "@/components/FAQ";
import LocationSection from "@/components/LocationSection";
import Instagram from "@/components/Instagram";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileCtaBar from "@/components/MobileCtaBar";

export default function Home() {
  return (
    <BookingProvider>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Portfolio />
        <Services />
        <Benefits />
        <About />
        <Testimonials />
        <Booking />
        <FAQ />
        <LocationSection />
        <Instagram />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileCtaBar />
    </BookingProvider>
  );
}
