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
  MapPinIcon,
  Archive,
  Check,
  Calendar,
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
import { useUpdateItemStatus } from "@/src/hooks/items/use-update-item-as-taken";
import { useDeleteItem } from "@/src/hooks/items/use-delete-item";
import { ItemResponse, ItemStatusRequest } from "@/src/lib/generated-api";
import { conditionDetails } from "@/src/components/shared/detailed-item-card";
import { formatDate } from "@/src/utils/date-utils";
import { useTranslation } from "react-i18next";

interface ItemCardProps {
  item: ItemResponse;
  onRefetch: () => void;
}

export function PublishedItemCard({ item, onRefetch }: ItemCardProps) {
  const { t } = useTranslation("common");
  const [itemToDelete, setItemToDelete] = useState<ItemResponse | null>(null);
  const [itemToChangeStatus, setItemToChangeStatus] =
    useState<ItemResponse | null>(null);

  const { mutate: changeItemStatusMutation, isPending: isChangingStatus } =
    useUpdateItemStatus();
  const { mutate: deleteItemMutation, isPending: isDeletingItem } =
    useDeleteItem();

  const handleDeleteItem = async (id: string | undefined) => {
    if (!id) return;

    deleteItemMutation(id, {
      onSuccess: () => {
        onRefetch();
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
          onRefetch();
          setItemToChangeStatus(null);
        },
        onError: () => {
          setItemToChangeStatus(null);
        },
      }
    );
  };

  const getItemStatusConfig = (status: ItemResponse.status | undefined) => {
    if (status === ItemResponse.status.TAKEN) {
      return {
        label: t("item_status.taken"),
        variant: "secondary" as const,
        className:
          "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
      };
    }
    return {
      label: t("item_status.available"),
      variant: "default" as const,
      className:
        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    };
  };

  const statusConfig = getItemStatusConfig(item.status);
  const conditionLabel = conditionDetails.find(
    (c) => c.key === item.condition
  )?.placeholder;
  const isLoading = isChangingStatus || isDeletingItem;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-md">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={item.imageUrls?.[0]}
            alt={item.title || t("forms.item_image")}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute top-3 right-3">
          <Badge
            variant={statusConfig.variant}
            className={statusConfig.className}
          >
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      <CardHeader className="space-y-3 pb-4">
        <div>
          <CardTitle className="text-xl font-semibold leading-tight mb-2 line-clamp-2">
            {item.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {t("item_details.listed")} {formatDate(item.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{item.address}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-background">
            {item.category?.name || t("forms.uncategorized")}
          </Badge>
          {conditionLabel && (
            <Badge variant="outline" className="bg-background">
              {conditionLabel}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {item.description}
        </p>
      </CardContent>

      <CardFooter className="pt-0 flex-col gap-3">
        <div className="flex gap-2 w-full">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={isLoading}
          >
            <Link href={`/items/${item.id}`}>
              <Eye className="h-4 w-4 mr-1.5" />
              {t("actions.view")}
            </Link>
          </Button>
          {item.status === ItemResponse.status.AVAILABLE && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={isLoading}
            >
              <Link href={`/items/create/${item.id}`}>
                <Pencil className="h-4 w-4 mr-1.5" />
                {t("actions.edit")}
              </Link>
            </Button>
          )}
        </div>

        <div className="flex gap-2 w-full">
          {item.status === ItemResponse.status.AVAILABLE ? (
            <AlertDialog
              open={itemToChangeStatus?.id === item.id}
              onOpenChange={(open) => {
                if (!open && !isChangingStatus) setItemToChangeStatus(null);
              }}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/20"
                  onClick={() => setItemToChangeStatus(item)}
                  disabled={isLoading}
                >
                  <Archive className="h-4 w-4 mr-1.5" />
                  {isChangingStatus && itemToChangeStatus?.id === item.id
                    ? t("loading_states.marking")
                    : t("actions.mark_as_taken")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("dialogs.mark_item_taken_title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("dialogs.mark_item_taken_description", {
                      title: itemToChangeStatus?.title,
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setItemToChangeStatus(null)}
                    disabled={isChangingStatus}
                  >
                    {t("actions.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmItemTaken}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    disabled={isChangingStatus}
                  >
                    {isChangingStatus
                      ? t("loading_states.confirming")
                      : t("actions.confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog
              open={itemToChangeStatus?.id === item.id}
              onOpenChange={(open) => {
                if (!open && !isChangingStatus) setItemToChangeStatus(null);
              }}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
                  onClick={() => setItemToChangeStatus(item)}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 mr-1.5" />
                  {isChangingStatus && itemToChangeStatus?.id === item.id
                    ? t("loading_states.making_available")
                    : t("actions.mark_as_available")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("dialogs.mark_item_available_title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("dialogs.mark_item_available_description", {
                      title: itemToChangeStatus?.title,
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setItemToChangeStatus(null)}
                    disabled={isChangingStatus}
                  >
                    {t("actions.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmItemAvailable}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isChangingStatus}
                  >
                    {isChangingStatus
                      ? t("loading_states.confirming")
                      : t("actions.confirm")}
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
                className="flex-1"
                onClick={() => setItemToDelete(item)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                {isDeletingItem && itemToDelete?.id === item.id
                  ? t("loading_states.deleting")
                  : t("actions.delete")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("dialogs.delete_item_title")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("dialogs.delete_item_description", {
                    title: itemToDelete?.title,
                  })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setItemToDelete(null)}
                  disabled={isDeletingItem}
                >
                  {t("actions.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteItem(itemToDelete?.id)}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={isDeletingItem}
                >
                  {isDeletingItem && itemToDelete?.id === item.id
                    ? t("loading_states.deleting")
                    : t("actions.delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
