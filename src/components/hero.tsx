import Link from "next/link"
import { ArrowRight, Leaf, Recycle, Users } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative bg-green-50 dark:bg-green-900 overflow-hidden">
      <div className="absolute inset-0">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "rgba(74, 222, 128, 0.2)" }} />
              <stop offset="100%" style={{ stopColor: "rgba(34, 197, 94, 0.2)" }} />
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
      <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-28 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-green-800 dark:text-green-100 mb-6">
            Give a Second Life to Your Belongings
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-green-700 dark:text-green-200 mb-8">
            Join our community-driven marketplace where you can give away items you no longer need and find treasures
            others are sharing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/categories"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700 transition-colors duration-300"
            >
              Browse Items
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-100 dark:bg-green-800 dark:hover:bg-green-700 transition-colors duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex items-center transition-transform hover:scale-105 duration-300">
            <Leaf className="h-8 w-8 text-green-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">Eco-Friendly</h3>
              <p className="mt-2 text-green-600 dark:text-green-300">Reduce waste and help the environment</p>
            </div>
          </div>
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex items-center transition-transform hover:scale-105 duration-300">
            <Recycle className="h-8 w-8 text-green-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">Circular Economy</h3>
              <p className="mt-2 text-green-600 dark:text-green-300">Promote reuse and sustainable consumption</p>
            </div>
          </div>
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex items-center transition-transform hover:scale-105 duration-300">
            <Users className="h-8 w-8 text-green-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">Community-Driven</h3>
              <p className="mt-2 text-green-600 dark:text-green-300">Connect with like-minded individuals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

