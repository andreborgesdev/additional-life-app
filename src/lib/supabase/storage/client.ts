import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import useSupabaseBrowser from "../supabase-browser-client";

function getStorage() {
  const { storage } = useSupabaseBrowser();
  return storage;
}

type UploadProps = {
  file: File;
  userId: string;
  bucket: string;
  folder?: string;
};

export const uploadImage = async ({ file, bucket, folder, userId }: UploadProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}${userId}/${uuidv4()}.${fileExtension}`;

  try {
    file = await imageCompression(file, {
      maxSizeMB: 1,
    });
  } catch (error) {
    console.error(error);
    return { imageUrl: "", error: "Image compression failed" };
  }

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).upload(path, file);

  if (error) {
    return { imageUrl: "", error: "Image upload failed" };
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${
    data?.path
  }`;

  return { imageUrl, error: "" };
};

export const deleteImage = async (imageUrl: string) => {
  const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
  const firstSlashIndex = bucketAndPathString.indexOf("/");

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).remove([path]);

  return { data, error };
};
