"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { PhotoUploader } from "@/src/components/shared/photo-uploader";
import { useItem } from "@/src/hooks/items/use-item";
import { ItemRequest } from "@/src/lib/generated-api";
import { useToast } from "@/src/hooks/use-toast";
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
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { CategorySelector } from "@/src/components/items/category-selector";
import { useSession } from "@/src/app/auth-provider";
import { useRouter, useParams } from "next/navigation";
import { useCategories } from "@/src/hooks/use-categories";
import Link from "next/link";
import { ArrowLeft, Loader2, Home } from "lucide-react"; // Added Home icon
import { uploadImage } from "@/src/lib/supabase/storage/client";
import { useUserBySupabaseId } from "@/src/hooks/use-user-by-supabase-id";
import { useCreateOrUpdateItem } from "@/src/hooks/items/use-create-or-update-item";

const MAX_IMAGES = 5;
const conditionOptions = Object.values(ItemRequest.condition);

export default function CreateProductPage() {
  const router = useRouter();
  const params = useParams();
  const idFromParams = params?.id;
  const itemIdFromUrl =
    typeof idFromParams === "string" && idFromParams !== "new"
      ? idFromParams
      : null;
  const isEditMode = itemIdFromUrl !== null;
  const productId = itemIdFromUrl;

  const { toast } = useToast();

  const {
    data: itemDataFromHook,
    isLoading: isLoadingItemData,
    error: itemDataError,
  } = useItem(productId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState<ItemRequest.condition | "">("");
  const [formSelectedCategoryId, setFormSelectedCategoryId] = useState<
    string | null
  >(null);
  const [address, setAddress] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [pickupPossible, setPickupPossible] = useState(false);
  const [shippingPossible, setShippingPossible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session, isLoading: isLoadingSession } = useSession();
  const [uploadedImageLinks, setUploadedImageLinks] = useState<string[]>([]);
  const { data: allCategories, isLoading: isLoadingCategories } =
    useCategories();

  const { data: userData, isLoading: isLoadingUserData } = useUserBySupabaseId(
    session?.user?.id ?? null
  );

  const initialCategoryIdForSelector =
    itemDataFromHook?.category?.id?.toString() ?? null;

  useEffect(() => {
    if (!isLoadingSession && !session) router.replace("/user/login");
  }, [router, session, isLoadingSession]);

  useEffect(() => {
    if (isEditMode && itemDataFromHook && !isLoadingItemData) {
      setTitle(itemDataFromHook.title || "");
      setDescription(itemDataFromHook.description || "");
      if (itemDataFromHook.category?.id) {
        setFormSelectedCategoryId(itemDataFromHook.category.id.toString());
      }

      setCondition((itemDataFromHook.condition as ItemRequest.condition) || "");
      setAddress(itemDataFromHook.address || "");
      if (itemDataFromHook.imageUrls) {
        setInitialImageUrl(itemDataFromHook.imageUrls);
        setUploadedImageLinks(itemDataFromHook.imageUrls);
      }
      setPickupPossible(itemDataFromHook.pickupPossible || false);
      setShippingPossible(itemDataFromHook.shippingPossible || false);
    }
    if (isEditMode && itemDataError) {
      console.error("Error loading product:", itemDataError);
      toast({
        title: "Error",
        description: "Unable to load product data. Please try again.",
        variant: "destructive",
      });
    }
  }, [isEditMode, itemDataFromHook, isLoadingItemData, itemDataError, toast]);

  useEffect(() => {
    let newUrls: string[] = [];
    if (images.length > 0) {
      newUrls = images.map((file: File) => URL.createObjectURL(file)); // Added File type
      setImagePreviewUrls(newUrls);
    } else if (initialImageUrl) {
      newUrls = [initialImageUrl];
      setImagePreviewUrls(newUrls);
    } else {
      setImagePreviewUrls([]);
    }

    return () => {
      if (images.length > 0) {
        // Check if it was images that created the URLs
        newUrls.forEach((url: string) => {
          // Added string type
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
      }
    };
  }, [images, initialImageUrl]);

  const handleRemoveImage = (indexToRemove: number) => {
    if (images.length > 0 && indexToRemove < images.length) {
      setImages((prevImages) =>
        prevImages.filter((_, index) => index !== indexToRemove)
      );
      setUploadedImageLinks([]); // Clear cache when images change
    } else if (images.length === 0 && initialImageUrl && indexToRemove === 0) {
      setInitialImageUrl(null);
      setUploadedImageLinks([]); // Clear cache if the initial image is removed
    }
  };

  const handleAddFiles = (newFiles: File[]) => {
    const currentImageCount =
      images.length +
      (initialImageUrl &&
      !images.find((img: File) => img.name === initialImageUrl) // Added File type
        ? 1
        : 0);
    const availableSlots = MAX_IMAGES - currentImageCount;

    if (availableSlots <= 0 && newFiles.length > 0) {
      toast({
        title: "Maximum images reached",
        description: `You can upload a maximum of ${MAX_IMAGES} images. Please remove some images if you want to add new ones.`,
        variant: "destructive",
      });
      return;
    }

    const filesToProcess = newFiles.slice(0, availableSlots);
    const uniqueNewFiles: File[] = [];

    for (const file of filesToProcess) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB.`,
          variant: "destructive",
        });
        continue;
      }

      const isDuplicateInState = images.some(
        (
          existingFile: File // Added File type
        ) =>
          existingFile.name === file.name &&
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified
      );

      if (isDuplicateInState) {
        toast({
          title: "Duplicate Image",
          description: `${file.name} has already been added.`,
          variant: "default", // Changed from destructive
        });
        continue;
      }
      uniqueNewFiles.push(file);
    }

    const filesToAdd = uniqueNewFiles;

    if (
      filesToAdd.length > 0 &&
      images.length + filesToAdd.length > MAX_IMAGES
    ) {
      // This case should ideally be caught by availableSlots earlier,
      // but as a safeguard if uniqueNewFiles processing changes counts.
      toast({
        title: "Some images not added",
        description: `Maximum of ${MAX_IMAGES} images allowed. ${
          images.length + filesToAdd.length - MAX_IMAGES
        } images could not be added.`,
        variant: "default",
      });
      // Take only what fits
      const numThatFit = MAX_IMAGES - images.length;
      setImages((prevImages: File[]) => [
        ...prevImages,
        ...filesToAdd.slice(0, numThatFit),
      ]);
      setUploadedImageLinks([]);
      return;
    }

    if (
      filesToAdd.length < newFiles.length &&
      filesToAdd.length > 0 &&
      newFiles.length > filesToProcess.length
    ) {
      toast({
        title: "Some images not added",
        description: `Maximum of ${MAX_IMAGES} images allowed or duplicates were found. ${filesToAdd.length} of ${newFiles.length} selected images were processed.`,
        variant: "default",
      });
    }

    if (filesToAdd.length > 0) {
      setImages((prevImages: File[]) => [...prevImages, ...filesToAdd]);
      setUploadedImageLinks([]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!pickupPossible && !shippingPossible) {
      toast({
        title: "Error",
        description:
          "Please select at least one availability option (Pickup or Shipping).",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (
      !title ||
      !description ||
      !formSelectedCategoryId || // Use formSelectedCategoryId
      !address ||
      !condition
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields, including category.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const uploadedImageUrls = await uploadImages();

    const itemPayload: ItemRequest = {
      title,
      description,
      condition: condition as ItemRequest.condition,
      categoryId: formSelectedCategoryId,
      address,
      pickupPossible,
      shippingPossible,
      imageUrls: uploadedImageUrls,
    };

    const { success, error } = await useCreateOrUpdateItem(
      itemPayload,
      isEditMode,
      productId
    );

    if (success) {
      toast({
        title: "Success",
        description: "Your item has been added successfully!",
      });
      setUploadedImageLinks([]);
      router.push("/");
    } else {
      toast({
        title: "Error Submitting Item",
        description:
          error || "An unexpected error occurred while saving the item.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const uploadImages = async (): Promise<string[]> => {
    let currentImageUrlsForPayload: string[] = [];
    if (images.length > 0) {
      if (uploadedImageLinks.length > 0) {
        currentImageUrlsForPayload = [...uploadedImageLinks];
        toast({
          title: "Using Cached Images",
          description: "Using previously uploaded image links.",
          variant: "default",
        });
      } else {
        // No cached links, proceed to upload
        if (!session) {
          toast({
            title: "Authentication Error",
            description: "You must be logged in to upload an image.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        toast({
          title: `Uploading ${images.length} Image(s)`,
          description: "Please wait...",
        });

        const uploadPromises = images.map((file) =>
          uploadImage({
            file: file,
            userId: session.user.id,
            bucket: "items-images",
            folder: undefined,
          }).then((result: any) => ({ ...result, fileName: file.name }))
        );

        const results = await Promise.allSettled(uploadPromises);
        let anUploadFailed = false;
        const successfullyUploadedInThisAttempt: string[] = [];

        results.forEach((result) => {
          if (result.status === "fulfilled") {
            const uploadResult = result.value as any & {
              fileName: string;
              imageUrl?: string;
              error?: any;
            };
            if (uploadResult.error) {
              console.error(
                `Failed to upload image ${uploadResult.fileName}:`,
                uploadResult.error
              );
              toast({
                title: "Image Upload Error",
                description: `Could not upload ${uploadResult.fileName}. ${uploadResult.error}`,
                variant: "destructive",
              });
              anUploadFailed = true;
            } else if (uploadResult.imageUrls) {
              successfullyUploadedInThisAttempt.push(uploadResult.imageUrls);
            }
          } else {
            console.error("An upload promise was rejected:", result.reason);
            toast({
              title: "Image Upload Error",
              description: `An unexpected error occurred during upload.`,
              variant: "destructive",
            });
            anUploadFailed = true;
          }
        });

        if (anUploadFailed) {
          setIsSubmitting(false);
          setUploadedImageLinks([]);
          toast({
            title: "Image Upload Failed",
            description:
              "Some or all images failed to upload. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (successfullyUploadedInThisAttempt.length > 0) {
          setUploadedImageLinks([...successfullyUploadedInThisAttempt]);
          currentImageUrlsForPayload = [...successfullyUploadedInThisAttempt];
          toast({
            title: "Images Uploaded",
            description: `${successfullyUploadedInThisAttempt.length} image(s) uploaded successfully.`,
          });
        }
        // Placeholder for when image upload is not available:
        console.warn(
          "Image upload functionality is currently disabled/commented out."
        );
        toast({
          title: "Image Upload Skipped",
          description:
            "Image upload is temporarily disabled. Proceeding without image upload.",
          variant: "default",
        });
        // Simulate successful upload for dev purposes if needed, or handle as error:
        // currentImageUrlsForPayload = images.map(f => `mock_url_for_${f.name}`);
        // setUploadedImageLinks(currentImageUrlsForPayload);
      }
    }

    return currentImageUrlsForPayload;
  };

  const effectiveIsLoadingProduct = isEditMode ? isLoadingItemData : false;
  const showSkeleton =
    isLoadingSession || isLoadingCategories || effectiveIsLoadingProduct;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href={isEditMode ? "/items/published" : "/items"}
            className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isEditMode ? "Back to my items" : "Back to browsing"}
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {isEditMode ? "Edit Your Item" : "Give Away an Item"}
            </h1>
            <Label
              htmlFor="category"
              className="text-gray-700 dark:text-gray-300"
            >
              Share items you no longer need with your community.
            </Label>
          </div>

          {showSkeleton ? (
            <ItemFormSkeleton />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <PhotoUploader
                imagePreviewUrls={imagePreviewUrls}
                onFilesAdded={handleAddFiles}
                onRemoveImage={handleRemoveImage}
                maxImages={MAX_IMAGES}
                isSubmitting={isSubmitting}
                inputDisabled={
                  isSubmitting || imagePreviewUrls.length >= MAX_IMAGES
                }
              />

              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="What are you giving away?"
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  } // Typed event
                  className="bg-white dark:bg-gray-950"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item, including any important details about its condition, size, etc."
                  value={description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                  } // Typed event
                  className="min-h-[120px] bg-white dark:bg-gray-950"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category" // Changed htmlFor to "category" for consistency
                  className="text-gray-700 dark:text-gray-300"
                >
                  Category
                </Label>
                <CategorySelector
                  allCategories={allCategories}
                  isLoadingAllCategories={isLoadingCategories}
                  initialCategoryId={initialCategoryIdForSelector}
                  onCategorySelected={setFormSelectedCategoryId}
                  closeOnSelect={true}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="condition"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Condition
                </Label>
                <Select
                  value={condition}
                  onValueChange={
                    (value: string) =>
                      setCondition(value as ItemRequest.condition) // Typed value
                  }
                  required
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="condition"
                    className="bg-white dark:bg-gray-950"
                  >
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map(
                      (
                        cond: ItemRequest.condition // Typed cond
                      ) => (
                        <SelectItem key={cond} value={cond}>
                          {cond.charAt(0).toUpperCase() +
                            cond.slice(1).toLowerCase().replace(/_/g, " ")}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Location
                </Label>
                {!isEditMode && userData?.address && !isLoadingUserData && (
                  <div className="mb-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 w-full sm:w-auto justify-center"
                      onClick={() => setAddress(userData.address!)}
                    >
                      <Home className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>Use saved: {userData.address}</span>
                    </Button>
                  </div>
                )}
                <Input
                  id="location"
                  placeholder="Where can the item be picked up?"
                  value={address}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAddress(e.target.value)
                  } // Typed event
                  className="bg-white dark:bg-gray-950"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-gray-700 dark:text-gray-300">
                  Availability
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pickupPossible"
                    checked={pickupPossible}
                    onCheckedChange={(
                      checked: boolean | "indeterminate" // Typed checked
                    ) => setPickupPossible(Boolean(checked))}
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor="pickupPossible"
                    className="font-normal text-gray-700 dark:text-gray-300"
                  >
                    Pickup Possible
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shippingPossible"
                    checked={shippingPossible}
                    onCheckedChange={(
                      checked: boolean | "indeterminate" // Typed checked
                    ) => setShippingPossible(Boolean(checked))}
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor="shippingPossible"
                    className="font-normal text-gray-700 dark:text-gray-300"
                  >
                    Shipping Possible
                  </Label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(isEditMode ? "/items/published" : "/items")
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : isEditMode ? (
                    "Update Item"
                  ) : (
                    "Create Listing"
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Tips for a Successful Donation
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Take clear, well-lit photos of your item</li>
              <li>Be honest about the condition</li>
              <li>Include all relevant details and measurements</li>
              <li>Respond promptly to inquiries</li>
              <li>Be specific about pick-up arrangements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex justify-end space-x-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
