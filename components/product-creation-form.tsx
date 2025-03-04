"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

const categories = [
  "Furniture",
  "Clothing",
  "Books",
  "Electronics",
  "Home & Garden",
  "Sports & Outdoors",
  "Kitchen & Dining",
  "Office Supplies",
  "Art & Crafts",
  "Toys & Games",
  "Automotive",
  "Miscellaneous",
]

function LocationMarker({
  position,
  setPosition,
}: { position: [number, number]; setPosition: (pos: [number, number]) => void }) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })

  return position === null ? null : <Marker position={position}></Marker>
}

export default function ProductCreationForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09])
  const [image, setImage] = useState<File | null>(null)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !category || !location || !position) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    console.log("Submitting product:", {
      title,
      description,
      category,
      location,
      latitude: position[0],
      longitude: position[1],
      image,
    })

    toast({
      title: "Success",
      description: "Your item has been added successfully!",
    })

    // Redirect to home page after successful submission
    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the item's title"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the item you're giving away"
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase().replace(/ & /g, "-")}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your location"
          required
        />
      </div>
      <div>
        <Label>Select Location on Map</Label>
        {isClient && (
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} accept="image/*" />
      </div>
      <Button type="submit" className="w-full">
        Add Item
      </Button>
    </form>
  )
}

