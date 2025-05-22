import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Leaf, Recycle, Users, Heart } from "lucide-react";

export default function Cta() {
  return (
    <section className="py-16 bg-green-600 dark:bg-green-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Join Our Community?
        </h2>
        <p className="text-green-100 max-w-2xl mx-auto mb-8">
          Start giving your items a second life today. Join thousands of people
          who are reducing waste and building stronger communities through
          sharing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Leaf className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              Eco-Friendly
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Reducing waste and promoting reuse of items
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Recycle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              Circular Economy
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Fostering a sustainable cycle of giving and receiving
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              Community-Driven
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Building stronger, more connected neighborhoods
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Heart className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              Generosity
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Encouraging a culture of giving and sharing
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-white text-green-700 hover:bg-green-50 rounded-full"
          >
            <Link href="/users/register">Sign Up Now</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white hover:bg-green-700 rounded-full"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
