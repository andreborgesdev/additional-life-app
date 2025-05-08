import Image from "next/image"
import { Leaf, Recycle, Users, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="bg-green-50 dark:bg-green-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-100 text-center mb-8">
          About Additional Life
        </h1>

        <div className="max-w-3xl mx-auto bg-white dark:bg-green-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            At Additional Life, our mission is to create a sustainable, community-driven marketplace that extends the
            life of everyday items. We believe in the power of sharing and reusing to reduce waste, conserve resources,
            and build stronger communities.
          </p>
          <div className="flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=200&width=400"
              alt="People sharing items"
              width={400}
              height={200}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-green-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">Our Vision</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We envision a world where the act of giving and sharing becomes second nature. A world where communities
            thrive on mutual support, where waste is minimized, and where every item finds its purpose. Through
            Additional Life, we aim to foster a global network of generous individuals committed to sustainability and
            community building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Leaf className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">Eco-Friendly</h3>
            <p className="text-gray-600 dark:text-gray-400">Reducing waste and promoting reuse of items</p>
          </div>
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Recycle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">Circular Economy</h3>
            <p className="text-gray-600 dark:text-gray-400">Fostering a sustainable cycle of giving and receiving</p>
          </div>
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">Community-Driven</h3>
            <p className="text-gray-600 dark:text-gray-400">Building stronger, more connected neighborhoods</p>
          </div>
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Heart className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">Generosity</h3>
            <p className="text-gray-600 dark:text-gray-400">Encouraging a culture of giving and sharing</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            Join Us in Making a Difference
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Whether you have items to give away or are looking for something you need, Additional Life is here to
            connect you with your community. Together, we can create a more sustainable and generous world, one item at
            a time.
          </p>
          <a
            href="/categories"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300"
          >
            Start Sharing Today
          </a>
        </div>
      </div>
    </div>
  )
}

