import Link from "next/link"
import { ArrowRight, Leaf, Recycle, Users } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative bg-green-50 dark:bg-green-900 overflow-hidden">
      <div className="absolute inset-0">
        <svg className="absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#4ADE80"
            fillOpacity="0.2"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10">
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
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700"
            >
              Browse Items
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-100 dark:bg-green-800 dark:hover:bg-green-700"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex items-center">
            <Leaf className="h-8 w-8 text-green-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">Eco-Friendly</h3>
              <p className="mt-2 text-green-600 dark:text-green-300">Reduce waste and help the environment</p>
            </div>
          </div>
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex items-center">
            <Recycle className="h-8 w-8 text-green-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">Circular Economy</h3>
              <p className="mt-2 text-green-600 dark:text-green-300">Promote reuse and sustainable consumption</p>
            </div>
          </div>
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex items-center">
            <Users className="h-8 w-8 text-green-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">Community-Driven</h3>
              <p className="mt-2 text-green-600 dark:text-green-300">Connect with like-minded individuals</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/3 sm:translate-x-1/4 lg:translate-x-0 pointer-events-none">
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-80 xl:h-80 opacity-30 sm:opacity-40 lg:opacity-50 dark:opacity-20 dark:sm:opacity-25 dark:lg:opacity-30"
        >
          <path
            d="M150 25C150 25 179.746 66.4214 194.454 96.967C209.163 127.513 208.452 150 208.452 150C208.452 150 179.746 133.579 165.037 103.033C150.329 72.4874 150 50 150 50"
            stroke="#22C55E"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M150 275C150 275 120.254 233.579 105.546 203.033C90.8374 172.487 91.5478 150 91.5478 150C91.5478 150 120.254 166.421 134.963 196.967C149.671 227.513 150 250 150 250"
            stroke="#22C55E"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M25 150C25 150 66.4214 120.254 96.967 105.546C127.513 90.8374 150 91.5478 150 91.5478C150 91.5478 133.579 120.254 103.033 134.963C72.4874 149.671 50 150 50 150"
            stroke="#22C55E"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M275 150C275 150 233.579 179.746 203.033 194.454C172.487 209.163 150 208.452 150 208.452C150 208.452 166.421 179.746 196.967 165.037C227.513 150.329 250 150 250 150"
            stroke="#22C55E"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="150" cy="150" r="20" fill="#22C55E" />
        </svg>
      </div>
    </section>
  )
}

