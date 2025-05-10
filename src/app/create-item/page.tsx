"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ItemCreationForm from "@/src/components/item-creation-form";
import { useSession } from "../auth-provider";

export default function CreateProductPage() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [router, session]);

  return (
    <div className="container mx-auto px-4 py-8">
      {session && (
        <>
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-8">
            Add a New Item
          </h1>
          <ItemCreationForm />
        </>
      )}
    </div>
  );
}
