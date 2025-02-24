import ProductCreationForm from "@/components/product-creation-form"

export default function CreateProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-8">Add a New Item</h1>
      <ProductCreationForm />
    </div>
  )
}

