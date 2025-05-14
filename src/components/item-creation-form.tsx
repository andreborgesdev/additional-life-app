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
import { Checkbox } from "@/src/components/ui/checkbox";
import { toast } from "@/src/hooks/use-toast";
import "leaflet/dist/leaflet.css";

import type { CategoryDto } from "../lib/generated-api";
import { ItemRequest } from "../lib/generated-api";
import { Combobox } from "./ui/combobox";
import { useSession } from "../app/auth-provider";
import useSupabaseBrowser from "@/src/lib/supabase/supabase-browser";
import { uploadImage } from "../lib/supabase/storage/client";

const conditionOptions = Object.values(ItemRequest.condition);

export default function ItemCreationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState<ItemRequest.condition | "">("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [pickupPossible, setPickupPossible] = useState(false);
  const [deliveryPossible, setDeliveryPossible] = useState(false);
  const router = useRouter();
  const [allCategories, setAllCategories] = useState<CategoryDto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useSession();
  const supabase = useSupabaseBrowser();

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!image) {
      setImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setImagePreviewUrl(objectUrl);

    // Clean up the object URL
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title || !description || !categoryId || !address || !condition) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const selectedCat = allCategories.find(
      (cat) => cat.id?.toString() === categoryId // Compare with string categoryId
    );

    if (!selectedCat || typeof selectedCat.id !== "number") {
      toast({
        title: "Error",
        description: "Selected category is invalid.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    let uploadedImageUrl: string | undefined = undefined;
    if (image) {
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to upload an image.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      try {
        toast({
          title: "Uploading Image",
          description: "Please wait...",
        });
        const { imageUrl } = await uploadImage({
          file: image,
          userId: session.user.id,
          bucket: "items-images",
          folder: undefined,
        });
        uploadedImageUrl = imageUrl;
        toast({
          title: "Image Uploaded",
          description: "Image uploaded successfully.",
        });
      } catch (uploadError: any) {
        console.error("Failed to upload image:", uploadError);
        toast({
          title: "Image Upload Error",
          description: uploadError.message || "Could not upload image.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    const itemData: ItemRequest = {
      title,
      description,
      condition: condition as ItemRequest.condition,
      categoryId: selectedCat.id,
      address: address,
      pickupPossible: pickupPossible,
      deliveryPossible: deliveryPossible,
      imageUrl: uploadedImageUrl,
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

      router.push("/");
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
        <Label htmlFor="condition">Condition</Label>
        <Select
          value={condition}
          onValueChange={(value) =>
            setCondition(value as ItemRequest.condition)
          }
          required
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select item condition" />
          </SelectTrigger>
          <SelectContent>
            {conditionOptions.map((cond) => (
              <SelectItem key={cond} value={cond}>
                {cond.charAt(0) +
                  cond.slice(1).toLowerCase().replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Combobox
          items={allCategories.map((cat) => ({
            value: cat.id?.toString() ?? "",
            label: cat.name ?? "Unnamed Category",
          }))}
          value={categoryId}
          onValueChange={setCategoryId}
          placeholder={
            isLoadingCategories ? "Loading categories..." : "Select a category"
          }
          disabled={isSubmitting || isLoadingCategories}
          searchPlaceholder="Search category..."
          emptyPlaceholder="No category found."
        />
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
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="pickupPossible"
            checked={pickupPossible}
            onCheckedChange={(checked) => setPickupPossible(Boolean(checked))}
            disabled={isSubmitting}
          />
          <Label htmlFor="pickupPossible" className="font-normal">
            Pickup Possible
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="deliveryPossible"
            checked={deliveryPossible}
            onCheckedChange={(checked) => setDeliveryPossible(Boolean(checked))}
            disabled={isSubmitting}
          />
          <Label htmlFor="deliveryPossible" className="font-normal">
            Delivery Possible
          </Label>
        </div>
      </div>
      <div>
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          accept="image/*"
          disabled={isSubmitting}
        />
        {imagePreviewUrl && (
          <div className="mt-4">
            <Label>Image Preview</Label>
            <img
              src={imagePreviewUrl}
              alt="Image preview"
              className="mt-2 max-h-60 w-auto rounded border"
            />
          </div>
        )}
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
