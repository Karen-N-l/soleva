import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedSneakers from "../components/FeaturedSneakers";
import Categories from "../components/Categories";
import PromoSection from "../components/PromoSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedSneakers />
      <Categories />
      <PromoSection />
      <Footer />
    </main>
  );
}