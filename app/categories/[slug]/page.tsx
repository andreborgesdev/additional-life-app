import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

// This is mock data. In a real application, you'd fetch this from an API or database.
const categories = [
  { name: "Furniture", slug: "furniture" },
  { name: "Clothing", slug: "clothing" },
  { name: "Books", slug: "books" },
  { name: "Electronics", slug: "electronics" },
  { name: "Home & Garden", slug: "home-and-garden" },
  { name: "Sports & Outdoors", slug: "sports-and-outdoors" },
  { name: "Kitchen & Dining", slug: "kitchen-and-dining" },
  { name: "Office Supplies", slug: "office-supplies" },
  { name: "Art & Crafts", slug: "art-and-crafts" },
  { name: "Toys & Games", slug: "toys-and-games" },
  { name: "Automotive", slug: "automotive" },
  { name: "Miscellaneous", slug: "miscellaneous" },
]

const items = [
  {
    id: "1",
    title: "Vintage Bicycle",
    image: "/placeholder.svg?height=200&width=200",
    category: "sports-and-outdoors",
  },
  { id: "2", title: "Wooden Bookshelf", image: "/placeholder.svg?height=200&width=200", category: "furniture" },
  { id: "3", title: "Potted Plants", image: "/placeholder.svg?height=200&width=200", category: "home-and-garden" },
  { id: "4", title: "Upcycled Coffee Table", image: "/placeholder.svg?height=200&width=200", category: "furniture" },
  {
    id: "5",
    title: "Eco-Friendly Water Bottle",
    image: "/placeholder.svg?height=200&width=200",
    category: "kitchen-and-dining",
  },
  {
    id: "6",
    title: "Handmade Ceramic Planter",
    image: "/placeholder.svg?height=200&width=200",
    category: "home-and-garden",
  },
  {
    id: "7",
    title: "Recycled Plastic Outdoor Chair",
    image: "/placeholder.svg?height=200&width=200",
    category: "furniture",
  },
  { id: "8", title: "Vintage Record Player", image: "/placeholder.svg?height=200&width=200", category: "electronics" },
]

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug)
  const categoryItems = items.filter((item) => item.category === params.slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/categories" className="flex items-center text-green-600 hover:text-green-700 mb-4">
        <ArrowLeft className="mr-2" size={20} />
        Back to categories
      </Link>
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-8">{category.name}</h1>
      {categoryItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryItems.map((item) => (
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
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No items found in this category.</p>
      )}
    </div>
  )
}

