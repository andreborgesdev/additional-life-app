"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ItemCreationForm from "@/src/components/item-creation-form";
import { useSession } from "../../auth-provider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateProductPage() {
  const router = useRouter();
  const session = useSession();
  const params = useParams();
  const productId = params?.id as string;
  const isEditMode = productId !== "new";

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [router, session]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href={isEditMode ? "/items-published" : "/items"}
            className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isEditMode ? "Back to my items" : "Back to browsing"}
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-8">
          Add a New Item
        </h1>
        <ItemCreationForm />
      </div>
    </div>
  );
}
