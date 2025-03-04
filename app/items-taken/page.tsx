"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Item {
  id: string
  title: string
  description: string
  image: string
  takenDate: string
}

export default function ItemsTakenPage() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    // In a real application, you would fetch the user's taken items from an API
    const mockItems: Item[] = [
      {
        id: "1",
        title: "Vintage Camera",
        description: "A classic film camera from the 1970s.",
        image: "/placeholder.svg?height=200&width=200",
        takenDate: "2023-05-15",
      },
      {
        id: "2",
        title: "Acoustic Guitar",
        description: "Gently used acoustic guitar, perfect for beginners.",
        image: "/placeholder.svg?height=200&width=200",
        takenDate: "2023-06-02",
      },
      {
        id: "3",
        title: "Cooking Pots Set",
        description: "Set of high-quality cooking pots and pans.",
        image: "/placeholder.svg?height=200&width=200",
        takenDate: "2023-06-10",
      },
    ]
    setItems(mockItems)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Items Taken</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>Taken on: {item.takenDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <p>{item.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/product/${item.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

