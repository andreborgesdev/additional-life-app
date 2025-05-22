"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SparklesText } from "../magicui/sparkles-text";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/items?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/items");
    }
  };

  return (
    <section className="relative bg-green-50 dark:bg-green-900 py-10 md:py-32">
      <div className="absolute inset-0">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="blob-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "rgba(74, 222, 128, 0.2)" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "rgba(34, 197, 94, 0.2)" }}
              />
            </linearGradient>
          </defs>
          <path fill="url(#blob-gradient)" d="M0,0 L100,0 L100,100 L0,100 Z">
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,0 C20,40 50,60 100,0 L100,100 L0,100 Z;
                M0,0 C30,30 70,70 100,0 L100,100 L0,100 Z;
                M0,0 C40,20 60,50 100,0 L100,100 L0,100 Z;
                M0,0 C20,40 50,60 100,0 L100,100 L0,100 Z
              "
            />
          </path>
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-800 dark:text-white mb-6">
            Give Your Belongings an{" "}
            <SparklesText className="text-green-800 dark:text-green-400">
              Additional Life
            </SparklesText>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10">
            Join our community-driven marketplace where you can share items you
            no longer need and find treasures others are sharing. Reduce waste,
            help the environment, and connect with your community.
          </p>
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden"
            >
              <div className="pl-4 pr-2 py-1 flex-shrink-0">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-300" />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                placeholder="What are you looking for?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-green-800 hover:bg-teal-600 text-white font-semibold transition-colors duration-300 focus:outline-none"
              >
                Search
              </button>
            </form>
            {/* <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Popular searches:{" "}
              <Link
                href="/items?q=furniture"
                className="text-teal-600 dark:text-teal-400 hover:underline"
              >
                Furniture
              </Link>
              ,{" "}
              <Link
                href="/items?q=books"
                className="text-teal-600 dark:text-teal-400 hover:underline"
              >
                Books
              </Link>
              ,{" "}
              <Link
                href="/items?q=electronics"
                className="text-teal-600 dark:text-teal-400 hover:underline"
              >
                Electronics
              </Link>
              ,{" "}
              <Link
                href="/items?q=kitchen"
                className="text-teal-600 dark:text-teal-400 hover:underline"
              >
                Kitchen
              </Link>
              ,{" "}
              <Link
                href="/items?q=garden"
                className="text-teal-600 dark:text-teal-400 hover:underline"
              >
                Garden
              </Link>
            </div> */}
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 rounded-full"
            >
              <Link href="/items">
                Browse Items
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link href="/items/create/new">Give Something Away</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
