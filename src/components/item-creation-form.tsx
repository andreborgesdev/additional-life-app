"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "@/src/hooks/use-toast";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"; // Map features commented out for now
import "leaflet/dist/leaflet.css";
// import L from "leaflet";

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
];

// function LocationMarker({
//   position,
//   setPosition,
// }: {
//   position: [number, number];
//   setPosition: (pos: [number, number]) => void;
// }) {
//   const map = useMapEvents({
//     click(e) {
//       setPosition([e.latlng.lat, e.latlng.lng]);
//     },
//   });

//   return position === null ? null : <Marker position={position}></Marker>;
// }
import type { CategoryDto } from "../lib/generated-api";
import { ItemRequest } from "../lib/generated-api";

export default function ItemCreationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>(""); // Store category ID
  const [address, setAddress] = useState(""); // Renamed from location to address
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]); // Default position
  const [image, setImage] = useState<File | null>(null); // Image handling remains basic
  // const [isClient, setIsClient] = useState(false); // Related to map, commented out
  const router = useRouter();
  const [allCategories, setAllCategories] = useState<CategoryDto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // setIsClient(true); // Related to map
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setAllCategories(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Could not load categories.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
    // delete L.Icon.Default.prototype._getIconUrl;
    // L.Icon.Default.mergeOptions({
    //   iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    //   iconUrl: "/leaflet/marker-icon.png",
    //   shadowUrl: "/leaflet/marker-shadow.png",
    // });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title || !description || !categoryId || !address) {
      // Removed position from validation for now
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const selectedCat = allCategories.find(
      (cat) => cat.id === parseInt(categoryId)
    );

    if (!selectedCat) {
      toast({
        title: "Error",
        description: "Selected category is invalid.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const itemData: ItemRequest = {
      title,
      description,
      categoryId: selectedCat.id, // Ensure categoryId is a number
      address,
      // latitude: position[0], // Map feature
      // longitude: position[1], // Map feature
      itemType: ItemRequest.itemType.INTERNAL, // Default to INTERNAL
      // imageUrl: "", // Optional: Handle image upload and URL separately
      // conditionDescription: "", // Optional
      // pickupInstructions: "", // Optional
    };

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create item");
      }

      toast({
        title: "Success",
        description: "Your item has been added successfully!",
      });

      router.push("/"); // Redirect to home page or items page
    } catch (error: any) {
      console.error("Failed to submit product:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={categoryId}
          onValueChange={setCategoryId}
          required
          disabled={isSubmitting || isLoadingCategories}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                isLoadingCategories
                  ? "Loading categories..."
                  : "Select a category"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {!isLoadingCategories &&
              allCategories.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.id?.toString() ?? ""} // Ensure value is a string
                >
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="address">Address / Pickup Location</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter pickup address or general location"
          required
          disabled={isSubmitting}
        />
      </div>
      {/* <div> // Map features commented out for now
        <Label>Select Location on Map (Optional)</Label>
        {isClient && (
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
        )}
      </div> */}
      <div>
        <Label htmlFor="image">Image (Optional)</Label>
        <Input
          id="image"
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          accept="image/*"
          disabled={isSubmitting}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || isLoadingCategories}
      >
        {isSubmitting ? "Adding Item..." : "Add Item"}
      </Button>
    </form>
  );
}
