import Image from "next/image"
import Link from "next/link"

const featuredItems = [
  { id: "1", title: "Vintage Bicycle", image: "/placeholder.svg?height=200&width=200" },
  { id: "2", title: "Wooden Bookshelf", image: "/placeholder.svg?height=200&width=200" },
  { id: "3", title: "Potted Plants", image: "/placeholder.svg?height=200&width=200" },
]

export default function FeaturedItems() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4">Featured Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredItems.map((item) => (
          <Link key={item.id} href={`/product/${item.id}`} className="block">
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={200}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">{item.title}</h3>
                <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                  View Item
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

