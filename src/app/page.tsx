import Hero from "@/src/components/home/hero";
import FeaturedItems from "@/src/components/home/featured-items";
import Categories from "@/src/components/home/categories";
import RecentListings from "@/src/components/home/recent-listings";
import StatsSection from "../components/home/stats-section";
import Cta from "@/src/components/home/cta";
import Testimonials from "@/src/components/home/testimonials";

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
