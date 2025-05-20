"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Pencil, Trash2, Eye, AlertCircle, MapPinIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { toast } from "@/src/hooks/use-toast";
import { useUserItems } from "@/src/hooks/items/use-user-items";
import { ItemResponse } from "@/src/lib/generated-api";

export default function ItemsPublishedPage() {
  const { data: items = [], isLoading, error, refetch } = useUserItems();
  const [itemToDelete, setItemToDelete] = useState<ItemResponse | null>(null);

  const handleDeleteItem = async (id: string | undefined) => {
    if (!id) return;

    // In a real application, you would call an API to delete the item
    // For now, we'll simulate and then refetch
    // Example: await apiClient.deleteItem(id);

    toast({
      title: "Item deleted",
      description: "Your item has been successfully removed.",
    });
    refetch(); // Refetch the items list
    setItemToDelete(null);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getItemStatusLabel = (status: ItemResponse.status | undefined) => {
    if (!status) return "Unknown";
    switch (status) {
      case "AVAILABLE":
        return "Available";
      case "TAKEN":
        return "Claimed";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2 text-red-700">
          Error loading items
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Listed Items</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage the items you've listed for others to claim
          </p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/items/create/new">List a New Item</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No items listed yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't listed any items for others to claim.
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/items/create/new">List Your First Item</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>
                      Listed on {formatDate(item.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      item.status === "AVAILABLE" ? "default" : "secondary"
                    }
                    className={
                      item.status === "AVAILABLE"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }
                  >
                    {getItemStatusLabel(item.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 mb-4">
                  <img
                    src={item.imageUrls?.[0] || "/placeholder.svg"}
                    alt={item.title || "Item image"}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">
                    {item.category?.name || "Uncategorized"}
                  </Badge>
                  <Badge variant="outline">{item.condition || "N/A"}</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {item.address?.city || item.address?.country || "Remote"}
                </div>
                {/* Views are not available in ItemResponse, so removed */}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/items/${item.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/items/create/${item.id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <AlertDialog
                    open={itemToDelete?.id === item.id}
                    onOpenChange={(open) => {
                      if (!open) setItemToDelete(null);
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setItemToDelete(item)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your listing for "
                          {itemToDelete?.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setItemToDelete(null)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteItem(itemToDelete?.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
