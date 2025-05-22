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
import {
  Pencil,
  Trash2,
  Eye,
  AlertCircle,
  MapPinIcon,
  Archive,
  Check,
} from "lucide-react";
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
import { useUpdateItemStatus } from "@/src/hooks/items/use-update-item-as-taken";
import { useDeleteItem } from "@/src/hooks/items/use-delete-item";
import { ItemResponse, ItemStatusRequest } from "@/src/lib/generated-api";
import { conditionDetails } from "@/src/components/shared/detailed-item-card";
import { formatDate } from "@/src/utils/date-utils";

export default function ItemsPublishedPage() {
  const { data: items, isLoading, error, refetch } = useUserItems();
  const [itemToDelete, setItemToDelete] = useState<ItemResponse | null>(null);
  const [itemToChangeStatus, setItemToChangeStatus] =
    useState<ItemResponse | null>(null);

  const orderedItems = items
    ?.filter((item) => item.status !== ItemResponse.status.DELETED)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

  const { mutate: changeItemStatusMutation, isPending: isChangingStatus } =
    useUpdateItemStatus();
  const { mutate: deleteItemMutation, isPending: isDeletingItem } =
    useDeleteItem();

  const handleDeleteItem = async (id: string | undefined) => {
    if (!id) return;

    deleteItemMutation(id, {
      onSuccess: () => {
        refetch();
        setItemToDelete(null);
      },
      onError: () => {
        setItemToDelete(null);
      },
    });
  };

  const handleConfirmItemTaken = () => {
    return handleConfirmChangeStatus(ItemResponse.status.TAKEN);
  };

  const handleConfirmItemAvailable = () => {
    return handleConfirmChangeStatus(ItemResponse.status.AVAILABLE);
  };

  const handleConfirmChangeStatus = (status: ItemResponse.status) => {
    if (!itemToChangeStatus?.id) return;

    const requestBody: ItemStatusRequest = {
      status: status,
    };

    changeItemStatusMutation(
      { itemId: itemToChangeStatus.id, requestBody },
      {
        onSuccess: () => {
          refetch();
          setItemToChangeStatus(null);
        },
        onError: () => {
          setItemToChangeStatus(null);
        },
      }
    );
  };

  const getItemStatusLabel = (status: ItemResponse.status | undefined) => {
    if (status === ItemResponse.status.TAKEN) return "Taken";
    return "Available";
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
        <Button
          asChild
          className="bg-green-600 hover:bg-green-700"
          disabled={isChangingStatus || isDeletingItem}
        >
          <Link href="/items/create/new">List a New Item</Link>
        </Button>
      </div>

      {isLoading ? (
        <ItemsPublishedSkeleton />
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
          {orderedItems.map((item) => (
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
                      item.status === ItemResponse.status.AVAILABLE
                        ? "default"
                        : "secondary"
                    }
                    className={
                      item.status === ItemResponse.status.AVAILABLE
                        ? "bg-green-500"
                        : item.status === ItemResponse.status.TAKEN
                        ? "bg-gray-500"
                        : "bg-yellow-500"
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
                  <Badge variant="outline">
                    {
                      conditionDetails.find((c) => c.key === item.condition)
                        ?.placeholder
                    }
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {item.address}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.description && item.description.length > 250
                    ? `${item.description.substring(0, 250)}...`
                    : item.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    disabled={isChangingStatus || isDeletingItem}
                  >
                    <Link href={`/items/${item.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  {item.status === ItemResponse.status.AVAILABLE && (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        disabled={isChangingStatus || isDeletingItem}
                      >
                        <Link href={`/items/create/${item.id}`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <AlertDialog
                        open={itemToChangeStatus?.id === item.id}
                        onOpenChange={(open) => {
                          if (!open && !isChangingStatus)
                            setItemToChangeStatus(null);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setItemToChangeStatus(item)}
                            disabled={isChangingStatus || isDeletingItem}
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            {isChangingStatus &&
                            itemToChangeStatus?.id === item.id
                              ? "Marking..."
                              : "Mark as Taken"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to mark "
                              {itemToChangeStatus?.title}" as taken? This item
                              will no longer be available for others.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setItemToChangeStatus(null)}
                              disabled={isChangingStatus}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleConfirmItemTaken}
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={isChangingStatus}
                            >
                              {isChangingStatus ? "Confirming..." : "Confirm"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                  {item.status === ItemResponse.status.TAKEN && (
                    <AlertDialog
                      open={itemToChangeStatus?.id === item.id}
                      onOpenChange={(open) => {
                        if (!open && !isChangingStatus)
                          setItemToChangeStatus(null);
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setItemToChangeStatus(item)}
                          disabled={isChangingStatus || isDeletingItem}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          {isChangingStatus &&
                          itemToChangeStatus?.id === item.id
                            ? "Making available..."
                            : "Mark as Available"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to mark "
                            {itemToChangeStatus?.title}" as available? This item
                            will be available for others.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setItemToChangeStatus(null)}
                            disabled={isChangingStatus}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleConfirmItemAvailable}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={isChangingStatus}
                          >
                            {isChangingStatus ? "Confirming..." : "Confirm"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <AlertDialog
                    open={itemToDelete?.id === item.id}
                    onOpenChange={(open) => {
                      if (!open && !isDeletingItem) setItemToDelete(null);
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setItemToDelete(item)}
                        disabled={isDeletingItem || isChangingStatus}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeletingItem && itemToDelete?.id === item.id
                          ? "Deleting..."
                          : "Delete"}
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
                          disabled={isDeletingItem}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteItem(itemToDelete?.id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isDeletingItem}
                        >
                          {isDeletingItem && itemToDelete?.id === item.id
                            ? "Deleting..."
                            : "Delete"}
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

function ItemsPublishedSkeleton() {
  return (
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
  );
}
