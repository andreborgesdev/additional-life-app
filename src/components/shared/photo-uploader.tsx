"use client";

import React, { useState, useCallback } from "react";
import { Upload, XCircle, Star } from "lucide-react";
import { Label } from "@/src/components/ui/label";

interface ImagePreview {
  id: string;
  url: string;
}

interface PhotoUploaderProps {
  imagePreviews: ImagePreview[];
  onFilesAdded: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  onReorderImages: (draggedId: string, targetId: string) => void;
  onSetMainImage: (id: string) => void;
  maxImages: number;
  isSubmitting: boolean;
  inputDisabled: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  imagePreviews,
  onFilesAdded,
  onRemoveImage,
  onReorderImages,
  onSetMainImage,
  maxImages,
  isSubmitting,
  inputDisabled,
}) => {
  const [isDraggingOverContainer, setIsDraggingOverContainer] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const mainImageId = imagePreviews[0]?.id;

  const handleDragOverContainer = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!inputDisabled) {
        setIsDraggingOverContainer(true);
      }
    },
    [inputDisabled]
  );

  const handleDragLeaveContainer = useCallback(() => {
    setIsDraggingOverContainer(false);
  }, []);

  const handleDropOnContainer = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingOverContainer(false);
      if (inputDisabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const filesArray = Array.from(files);
        const remainingSlots = maxImages - imagePreviews.length;
        if (remainingSlots > 0) {
          const filesToAdd = filesArray.slice(0, remainingSlots);
          if (filesToAdd.length > 0) {
            onFilesAdded(filesToAdd);
          }
        }
      }
    },
    [onFilesAdded, inputDisabled, maxImages, imagePreviews.length]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inputDisabled) return;
      const files = e.target.files;
      if (files && files.length > 0) {
        const filesArray = Array.from(files);
        const remainingSlots = maxImages - imagePreviews.length;
        if (remainingSlots > 0) {
          const filesToAdd = filesArray.slice(0, remainingSlots);
          if (filesToAdd.length > 0) {
            onFilesAdded(filesToAdd);
          }
        }
        e.target.value = "";
      }
    },
    [onFilesAdded, inputDisabled, maxImages, imagePreviews.length]
  );

  const handleDragStartItem = (
    e: React.DragEvent<HTMLDivElement>,
    id: string
  ) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedItemId(id);
  };

  const handleDragOverItem = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDropOnItem = (
    e: React.DragEvent<HTMLDivElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId && draggedId !== targetId) {
      onReorderImages(draggedId, targetId);
    }
    setDraggedItemId(null);
  };

  const handleDragEndItem = () => {
    setDraggedItemId(null);
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor="photo-upload-main-input"
        className="text-gray-700 dark:text-gray-300"
      >
        Item Photos (first photo is main)
      </Label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          isDraggingOverContainer && !inputDisabled
            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
            : "border-gray-300 dark:border-gray-600"
        } transition-colors`}
        onDragOver={handleDragOverContainer}
        onDragLeave={handleDragLeaveContainer}
        onDrop={handleDropOnContainer}
      >
        {imagePreviews.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 mb-4">
              {imagePreviews.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStartItem(e, item.id)}
                  onDragOver={handleDragOverItem}
                  onDrop={(e) => handleDropOnItem(e, item.id)}
                  onDragEnd={handleDragEndItem}
                  className={`relative aspect-square group cursor-grab ${
                    draggedItemId === item.id ? "opacity-50" : ""
                  } ${
                    item.id === mainImageId
                      ? "border-4 border-green-500 dark:border-green-400 rounded-md"
                      : "border border-gray-200 dark:border-gray-700 rounded-md"
                  }`}
                >
                  <img
                    src={item.url}
                    alt={`Item preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-sm" // rounded-sm for inner image with outer border
                  />
                  {item.id === mainImageId && (
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1" fill="white" />
                      Main
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveImage(item.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-80 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                    disabled={isSubmitting}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                  {item.id !== mainImageId && (
                    <button
                      type="button"
                      onClick={() => onSetMainImage(item.id)}
                      className="absolute bottom-1 right-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 opacity-80 group-hover:opacity-100 transition-opacity"
                      aria-label="Set as main image"
                      title="Set as main image"
                      disabled={isSubmitting}
                    >
                      <Star className="h-3 w-3" fill="white" />
                    </button>
                  )}
                </div>
              ))}
              {imagePreviews.length < maxImages && (
                <label
                  htmlFor="file-upload-more"
                  className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md transition-colors ${
                    inputDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:border-green-500 dark:hover:border-green-400"
                  }`}
                >
                  <Upload className="h-6 w-6 text-gray-400 dark:text-gray-500 mb-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Add more
                  </span>
                  <input
                    id="file-upload-more"
                    name="file-upload-more"
                    type="file"
                    className="sr-only"
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    onChange={handleFileChange}
                    disabled={
                      inputDisabled || imagePreviews.length >= maxImages
                    }
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              {imagePreviews.length} image
              {imagePreviews.length === 1 ? "" : "s"} selected. You can add up
              to {maxImages} images. Drag to reorder.
            </p>
          </>
        ) : (
          <div className="py-4">
            <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <label
              htmlFor="photo-upload-main-input"
              className={
                inputDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }
            >
              <span className="text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300">
                Click to upload
              </span>{" "}
              or drag and drop
              <input
                id="photo-upload-main-input"
                name="file-upload"
                type="file"
                className="sr-only"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleFileChange}
                disabled={inputDisabled}
              />
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG or JPEG (MAX. 5MB each, up to {maxImages} images)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
