"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCreationForm from "@/src/components/product-creation-form";

export default function CreateProductPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (!loggedIn) {
      router.push("/login");
    }
  }, [router]);

  if (!isLoggedIn) {
    return null; // or you could return a loading spinner here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-8">
        Add a New Item
      </h1>
      <ProductCreationForm />
    </div>
  );
}
