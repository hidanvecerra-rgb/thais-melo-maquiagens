import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import BookingExperience from "@/components/BookingExperience";
import LocationSection from "@/components/LocationSection";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <BookingExperience />
      <LocationSection />
      <SiteFooter />
    </>
  );
}
