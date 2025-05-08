import Image from "next/image"
import Link from "next/link"

const recentListings = [
  { id: "4", title: "Upcycled Coffee Table", image: "/placeholder.svg?height=100&width=100", location: "New York, NY" },
  {
    id: "5",
    title: "Eco-Friendly Water Bottle",
    image: "/placeholder.svg?height=100&width=100",
    location: "Los Angeles, CA",
  },
  {
    id: "6",
    title: "Handmade Ceramic Planter",
    image: "/placeholder.svg?height=100&width=100",
    location: "Chicago, IL",
  },
  {
    id: "7",
    title: "Recycled Plastic Outdoor Chair",
    image: "/placeholder.svg?height=100&width=100",
    location: "Houston, TX",
  },
]

export default function RecentListings() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4">Recent Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentListings.map((item) => (
          <Link key={item.id} href={`/product/${item.id}`} className="block">
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={100}
                height={100}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">{item.title}</h3>
                <p className="text-sm text-green-600 dark:text-green-400">{item.location}</p>
                <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-sm">
                  View Details
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

