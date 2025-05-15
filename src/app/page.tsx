import Hero from "@/src/components/hero";
import FeaturedItems from "@/src/components/featured-items";
import Categories from "@/src/components/categories";
import RecentListings from "@/src/components/recent-listings";
import StatsSection from "../components/stats-section";
import Cta from "../components/cta";
import Testimonials from "../components/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-900">
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <StatsSection />
        <Categories />
        <FeaturedItems />
        <RecentListings />
        <Testimonials />
      </main>
      <Cta />
    </div>
  );
}
