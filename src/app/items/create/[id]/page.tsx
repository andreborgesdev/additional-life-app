"use client";

import { useEffect, useState, ChangeEvent, FormEvent, useMemo } from "react";
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
import { ArrowLeft, Loader2, Home } from "lucide-react";
import { uploadImage, deleteImage } from "@/src/lib/supabase/storage/client";
import { useCreateOrUpdateItem } from "@/src/hooks/items/use-create-or-update-item";
import { v4 as uuidv4 } from "uuid";
import { useUserByEmail } from "@/src/hooks/users/use-user-by-email";
import { conditionDetails } from "@/src/components/shared/detailed-item-card";

const MAX_IMAGES = 5;

interface ImageSource {
  id: string;
  type: "persisted" | "new";
  url?: string; // Blob URL for new, Supabase URL for persisted/uploaded
  file?: File;
  uploadError?: string;
}

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
  const [condition, setCondition] = useState<ItemRequest.condition | undefined>(
    undefined
  );
  const [formSelectedCategoryId, setFormSelectedCategoryId] = useState<
    string | null
  >(null);
  const [address, setAddress] = useState("");
  const [imageSources, setImageSources] = useState<ImageSource[]>([]);
  const [pickupPossible, setPickupPossible] = useState(false);
  const [shippingPossible, setShippingPossible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removedPersistedImageUrls, setRemovedPersistedImageUrls] = useState<
    string[]
  >([]);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const { session, isLoading: isLoadingSession } = useSession();

  const { data: allCategories, isLoading: isLoadingCategories } =
    useCategories();

  const { data: userData, isLoading: isLoadingUserData } = useUserByEmail(
    session?.user.email ?? null
  );

  const initialCategoryIdForSelector =
    isEditMode && itemDataFromHook
      ? itemDataFromHook.category?.id?.toString() ?? null
      : null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCondition(undefined);
    setFormSelectedCategoryId(null);
    setAddress("");
    setImageSources([]);
    setPickupPossible(false);
    setShippingPossible(false);
    setRemovedPersistedImageUrls([]);
    setIsFormInitialized(true);
  };

  const populateFormWithItemData = (itemData: any) => {
    setTitle(itemData.title);
    setDescription(itemData.description);
    setFormSelectedCategoryId(itemData.category.id);
    setCondition(itemData.condition);
    setAddress(itemData.address);

    const persistedSources: ImageSource[] = (itemData.imageUrls || []).map(
      (url: string) => ({
        id: url,
        type: "persisted",
        url: url,
      })
    );
    setImageSources(persistedSources);
    setRemovedPersistedImageUrls([]);
    setPickupPossible(itemData.isPickupPossible);
    setShippingPossible(itemData.isShippingPossible);
    setIsFormInitialized(true);
  };

  useEffect(() => {
    // TODO add this back when email verification is implemented
    // if (
    //   !isLoadingSession &&
    //   session &&
    //   !session.user.user_metadata.email_verified
    // ) {
    //   toast({
    //     title: "Email Verification Required",
    //     description:
    //       "Please verify your email address before creating an item. You are being redirected to your settings.",
    //     variant: "destructive",
    //   });
    //   router.replace("/users/settings");
    //   return;
    // }
    if (!isLoadingSession && !session) {
      router.replace("/auth/login");
      return;
    }
  }, [router, session, isLoadingSession]);

  useEffect(() => {
    if (isEditMode) {
      if (
        itemDataFromHook &&
        !isLoadingItemData &&
        session &&
        !isLoadingSession
      ) {
        if (itemDataFromHook.owner?.supabaseId !== session.user.id) {
          toast({
            title: "Unauthorized",
            description: "You are not authorized to edit this item.",
            variant: "destructive",
          });
          router.replace("/items");
          return;
        }
        populateFormWithItemData(itemDataFromHook);
      }
    } else {
      resetForm();
    }

    if (isEditMode && itemDataError && !isLoadingItemData) {
      console.error("Error loading product:", itemDataError);
      toast({
        title: "Error",
        description: "Unable to load product data. Please try again.",
        variant: "destructive",
      });
    }
  }, [
    isEditMode,
    itemDataFromHook,
    isLoadingItemData,
    itemDataError,
    session,
    isLoadingSession,
    productId,
    router,
    toast,
  ]);

  const imagePreviewsForUploader = useMemo(() => {
    return imageSources.map((source) => ({
      id: source.id,
      url: source.url || "",
    }));
  }, [imageSources]);

  useEffect(() => {
    return () => {
      imageSources.forEach((source) => {
        if (source.type === "new" && source.url?.startsWith("blob:")) {
          URL.revokeObjectURL(source.url);
        }
      });
    };
  }, [imageSources]);

  const handleRemoveImageById = (idToRemove: string) => {
    const sourceToRemove = imageSources.find((s) => s.id === idToRemove);

    if (sourceToRemove) {
      if (
        sourceToRemove.type === "new" &&
        sourceToRemove.url?.startsWith("blob:")
      ) {
        URL.revokeObjectURL(sourceToRemove.url);
      } else if (sourceToRemove.type === "persisted" && sourceToRemove.url) {
        setRemovedPersistedImageUrls((prev) => [...prev, sourceToRemove.url!]);
      }
    }

    setImageSources((prev) =>
      prev.filter((source) => source.id !== idToRemove)
    );
  };

  const handleAddFiles = (incomingFiles: File[]) => {
    const currentTotalImages = imageSources.length;
    if (currentTotalImages >= MAX_IMAGES) {
      toast({
        title: "Maximum images reached",
        description: `You cannot add more than ${MAX_IMAGES} images.`,
        variant: "destructive",
      });
      return;
    }

    const slotsAvailableForNew = MAX_IMAGES - currentTotalImages;
    const filesToConsider = incomingFiles.slice(0, slotsAvailableForNew);
    const newSources: ImageSource[] = [];

    for (const file of filesToConsider) {
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

      const isDuplicate = imageSources.some(
        (existing) =>
          existing.file?.name === file.name && existing.file?.size === file.size
      );
      if (isDuplicate) {
        toast({
          title: "Duplicate Image",
          description: `${file.name} has already been added.`,
          variant: "default",
        });
        continue;
      }
      newSources.push({
        id: uuidv4(),
        type: "new",
        file: file,
        url: URL.createObjectURL(file),
      });
    }

    if (newSources.length > 0) {
      setImageSources((prev) => [...prev, ...newSources]);
    }

    if (filesToConsider.length < incomingFiles.length) {
      toast({
        title: "Some images not added",
        description: `Maximum of ${MAX_IMAGES} images allowed. Some files were not added.`,
        variant: "default",
      });
    } else if (
      newSources.length < filesToConsider.length &&
      newSources.length > 0
    ) {
      toast({
        title: "Some images not added",
        description: "Some files were invalid, too large, or duplicates.",
        variant: "default",
      });
    }
  };

  const handleReorderImagesByIds = (draggedId: string, targetId: string) => {
    setImageSources((prevSources) => {
      const newSources = [...prevSources];
      const draggedItemIndex = newSources.findIndex((s) => s.id === draggedId);
      const targetItemIndex = newSources.findIndex((s) => s.id === targetId);

      if (draggedItemIndex === -1 || targetItemIndex === -1) return prevSources;

      const [draggedItem] = newSources.splice(draggedItemIndex, 1);
      newSources.splice(targetItemIndex, 0, draggedItem);
      return newSources;
    });
  };

  const handleSetMainImageById = (idToMakeMain: string) => {
    setImageSources((prevSources) => {
      const newSources = [...prevSources];
      const itemIndex = newSources.findIndex((s) => s.id === idToMakeMain);

      if (itemIndex === -1 || itemIndex === 0) return prevSources; // Already main or not found

      const [item] = newSources.splice(itemIndex, 1);
      newSources.unshift(item); // Move to the front
      return newSources;
    });
  };

  const uploadAndGetFinalUrls = async (): Promise<string[]> => {
    if (!session) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload images.",
        variant: "destructive",
      });
      throw new Error("User not authenticated for image upload.");
    }

    const sourcesToUpload = imageSources.filter(
      (s) => s.type === "new" && s.file && !s.url?.startsWith("https://")
    );
    if (sourcesToUpload.length > 0) {
      toast({
        title: `Uploading ${sourcesToUpload.length} new image(s)`,
        description: "Please wait...",
      });
    }

    const updatedSources = [...imageSources];
    let anUploadFailed = false;

    for (let i = 0; i < updatedSources.length; i++) {
      const source = updatedSources[i];

      if (source.type === "persisted") {
        continue;
      }

      if (
        source.type === "new" &&
        source.file &&
        (!source.url || source.url.startsWith("blob:"))
      ) {
        try {
          const result = await uploadImage({
            file: source.file,
            userId: session.user.id,
            bucket: "items-images",
          });
          if (result.error) {
            throw new Error(result.error.message || "Unknown upload error");
          }
          if (!result.imageUrl) {
            throw new Error("Image URL not returned from upload");
          }
          updatedSources[i] = {
            ...source,
            url: result.imageUrl,
            file: undefined,
          }; // Clear file after upload
        } catch (error: any) {
          console.error(`Failed to upload image ${source.file.name}:`, error);
          toast({
            title: "Image Upload Error",
            description: `Could not upload ${source.file.name}. ${error.message}`,
            variant: "destructive",
          });
          updatedSources[i] = { ...source, uploadError: error.message };
          anUploadFailed = true;
        }
      }
    }

    setImageSources(updatedSources); // Update state with new URLs or errors

    if (anUploadFailed) {
      toast({
        title: "Image Upload Failed",
        description:
          "Some new images failed to upload. Please review and try again.",
        variant: "destructive",
      });
      throw new Error("Image upload failed for some images.");
    }

    const finalUrls = updatedSources
      .map((s) => s.url)
      .filter((url) => !!url && !url.startsWith("blob:")) as string[];

    if (sourcesToUpload.length > 0 && !anUploadFailed) {
      toast({
        title: "New Images Uploaded",
        description: `${sourcesToUpload.length} new image(s) processed successfully.`,
      });
    }
    return finalUrls;
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
      !formSelectedCategoryId ||
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

    let finalImageUrls: string[] = [];
    try {
      finalImageUrls = await uploadAndGetFinalUrls();
      if (
        imageSources.length > 0 &&
        finalImageUrls.length === 0 &&
        !imageSources.every((s) => s.type === "persisted" && s.url)
      ) {
        // This case means uploads were attempted but all failed or no valid URLs remained.
        // The uploadAndGetFinalUrls function would have thrown if critical uploads failed.
        // If all images were 'new' and all failed, finalImageUrls would be empty.
        // If there were persisted images, they should be in finalImageUrls.
        // This check is a safeguard.
        if (imageSources.some((s) => s.type === "new" && !s.uploadError)) {
          // If some new images didn't even attempt upload or didn't error but no URL
          console.error(
            "Image processing resulted in no valid URLs for new images without explicit errors."
          );
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      return;
    }

    const itemPayload: ItemRequest = {
      title,
      description,
      condition: condition as ItemRequest.condition,
      categoryId: formSelectedCategoryId!,
      address,
      isPickupPossible: pickupPossible,
      isShippingPossible: shippingPossible,
      imageUrls: finalImageUrls.length > 0 ? finalImageUrls : undefined,
    };

    const { success, error: submissionError } = await useCreateOrUpdateItem(
      itemPayload,
      isEditMode,
      productId
    );

    if (success) {
      toast({
        title: "Success",
        description: `Your item has been ${
          isEditMode ? "updated" : "added"
        } successfully!`,
        variant: "success",
      });

      if (removedPersistedImageUrls.length > 0) {
        let deletionErrors = 0;
        for (const imageUrl of removedPersistedImageUrls) {
          try {
            const { error: deleteError } = await deleteImage(imageUrl);
            if (deleteError) {
              console.error(
                `Failed to delete image ${imageUrl}:`,
                deleteError.message
              );
              deletionErrors++;
            }
          } catch (e: any) {
            console.error(
              `Exception while deleting image ${imageUrl}:`,
              e.message
            );
            deletionErrors++;
          }
        }

        if (deletionErrors > 0) {
          toast({
            title: "Image Cleanup Issue",
            description: `${deletionErrors} image(s) could not be removed from storage. You may need to remove them manually.`,
            variant: "warning",
          });
        }
        setRemovedPersistedImageUrls([]);
      }

      if (!isEditMode) {
        setImageSources([]);
      }
      if (isEditMode && productId) {
        router.refresh();
      }
      router.push(`/items/published`);
    } else {
      toast({
        title: "Error Submitting Item",
        description:
          submissionError ||
          "An unexpected error occurred while saving the item.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const effectiveIsLoadingProduct = isEditMode ? isLoadingItemData : false;
  const showSkeleton =
    isLoadingSession ||
    isLoadingCategories ||
    effectiveIsLoadingProduct ||
    !isFormInitialized;

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
                imagePreviews={imagePreviewsForUploader}
                onFilesAdded={handleAddFiles}
                onRemoveImage={handleRemoveImageById}
                onReorderImages={handleReorderImagesByIds}
                onSetMainImage={handleSetMainImageById}
                maxImages={MAX_IMAGES}
                isSubmitting={isSubmitting}
                inputDisabled={
                  isSubmitting || imagePreviewsForUploader.length >= MAX_IMAGES
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
                  disabled={isSubmitting}
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
                  key={`condition-${condition || "empty"}`}
                  value={condition || ""}
                  onValueChange={(value: string) =>
                    setCondition(value as ItemRequest.condition)
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
                    {conditionDetails.map((conditionDetail) => (
                      <SelectItem
                        key={conditionDetail.key}
                        value={conditionDetail.key}
                      >
                        {conditionDetail.placeholder}
                      </SelectItem>
                    ))}
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
                  Delivery Options
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
