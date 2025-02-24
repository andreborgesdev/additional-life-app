import Link from "next/link"
import { Recycle, Truck, Shirt, Book, Coffee, Tv } from "lucide-react"

const categories = [
  { name: "Furniture", icon: Tv, slug: "furniture" },
  { name: "Clothing", icon: Shirt, slug: "clothing" },
  { name: "Books", icon: Book, slug: "books" },
  { name: "Electronics", icon: Coffee, slug: "electronics" },
  { name: "Home & Garden", icon: Truck, slug: "home-and-garden" },
  { name: "Sports & Outdoors", icon: Recycle, slug: "sports-and-outdoors" },
]

export default function Categories() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4">Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="bg-white dark:bg-green-800 rounded-lg shadow-md p-4 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer"
          >
            <category.icon size={32} className="text-green-600 dark:text-green-400 mb-2" />
            <span className="text-green-800 dark:text-green-200 font-medium text-center">{category.name}</span>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/categories"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
        >
          View All Categories
        </Link>
      </div>
    </section>
  )
}

