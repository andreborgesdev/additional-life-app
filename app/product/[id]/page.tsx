import { notFound } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, MapPin, User, Calendar } from "lucide-react"
import Link from "next/link"
import ProductActions from "@/components/product-actions"

// This is mock data. In a real application, you'd fetch this from an API or database.
const products = [
  {
    id: "1",
    title: "Vintage Bicycle",
    description:
      "A well-maintained vintage bicycle from the 1980s. Perfect for collectors or those looking for a unique ride.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Brooklyn, NY",
    postedBy: "Jane Doe",
    postedDate: "2024-02-23",
    category: "Transportation",
  },
  // Add more mock products as needed
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-green-600 hover:text-green-700 mb-4">
        <ArrowLeft className="mr-2" size={20} />
        Back to listings
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            width={600}
            height={400}
            className="rounded-lg shadow-md"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin size={20} className="mr-2" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <User size={20} className="mr-2" />
              <span>Posted by {product.postedBy}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar size={20} className="mr-2" />
              <span>Posted on {new Date(product.postedDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Category</h2>
            <p className="text-green-600">{product.category}</p>
          </div>
          <ProductActions productId={product.id} />
        </div>
      </div>
    </div>
  )
}

