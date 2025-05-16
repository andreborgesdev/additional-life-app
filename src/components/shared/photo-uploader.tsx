"use client";

import React, { useState, useCallback } from "react";
import { Upload, XCircle } from "lucide-react";
import { Label } from "@/src/components/ui/label";

interface PhotoUploaderProps {
  imagePreviewUrls: string[];
  onFilesAdded: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  maxImages: number;
  isSubmitting: boolean;
  inputDisabled: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  imagePreviewUrls,
  onFilesAdded,
  onRemoveImage,
  maxImages,
  isSubmitting,
  inputDisabled,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!inputDisabled) {
        setIsDragging(true);
      }
    },
    [inputDisabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (inputDisabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onFilesAdded(Array.from(files));
      }
    },
    [onFilesAdded, inputDisabled]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inputDisabled) return;
      const files = e.target.files;
      if (files && files.length > 0) {
        onFilesAdded(Array.from(files));
        e.target.value = "";
      }
    },
    [onFilesAdded, inputDisabled]
  );

  return (
    <div className="space-y-2">
      <Label
        htmlFor="photo-upload-main-input"
        className="text-gray-700 dark:text-gray-300"
      >
        Item Photo
      </Label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging && !inputDisabled
            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
            : "border-gray-300 dark:border-gray-600"
        } transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {imagePreviewUrls.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={url + index} className="relative aspect-square group">
                  <img
                    src={url}
                    alt={`Item preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-md border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-100 transition-opacity"
                    aria-label="Remove image"
                    disabled={isSubmitting}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {imagePreviewUrls.length < maxImages && (
                <label
                  htmlFor="file-upload-more"
                  className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md transition-colors ${
                    inputDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:border-green-500 dark:hover:border-green-400"
                  }`}
                >
                  <Upload className="h-6 w-6 text-gray-400 dark:text-gray-500 mb-1" />{" "}
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
                    disabled={inputDisabled}
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              {imagePreviewUrls.length} image
              {imagePreviewUrls.length === 1 ? "" : "s"} selected. You can add
              up to {maxImages} images per item.
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
