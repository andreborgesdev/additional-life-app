import Hero from "@/src/components/hero";
import FeaturedItems from "@/src/components/featured-items";
import Categories from "@/src/components/categories";
import RecentListings from "@/src/components/recent-listings";

export default function Home() {
  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-900">
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <FeaturedItems />
        <Categories />
        <RecentListings />
      </main>
    </div>
  );
}
