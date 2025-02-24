import Link from "next/link"
import {
  Recycle,
  Truck,
  Shirt,
  Book,
  Coffee,
  Tv,
  Sofa,
  Utensils,
  Briefcase,
  Palette,
  Leaf,
  Dumbbell,
} from "lucide-react"

const categories = [
  { name: "Furniture", icon: Sofa, slug: "furniture" },
  { name: "Clothing", icon: Shirt, slug: "clothing" },
  { name: "Books", icon: Book, slug: "books" },
  { name: "Electronics", icon: Tv, slug: "electronics" },
  { name: "Home & Garden", icon: Leaf, slug: "home-and-garden" },
  { name: "Sports & Outdoors", icon: Dumbbell, slug: "sports-and-outdoors" },
  { name: "Kitchen & Dining", icon: Utensils, slug: "kitchen-and-dining" },
  { name: "Office Supplies", icon: Briefcase, slug: "office-supplies" },
  { name: "Art & Crafts", icon: Palette, slug: "art-and-crafts" },
  { name: "Toys & Games", icon: Coffee, slug: "toys-and-games" },
  { name: "Automotive", icon: Truck, slug: "automotive" },
  { name: "Miscellaneous", icon: Recycle, slug: "miscellaneous" },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-8">Browse Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer"
          >
            <category.icon size={48} className="text-green-600 dark:text-green-400 mb-4" />
            <span className="text-green-800 dark:text-green-200 font-medium text-center">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

