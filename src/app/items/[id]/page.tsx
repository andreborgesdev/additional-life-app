"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Flag,
  Share2,
  Copy,
  Facebook,
  MessageCircle,
  Clock,
  MapPinHouse,
  Truck,
  Edit,
  Mail,
  Phone,
  Tag,
} from "lucide-react";
import ImageCarousel from "@/src/components/shared/image-carousel";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useToast } from "@/src/hooks/use-toast";
import { useItem } from "@/src/hooks/items/use-item";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useSession } from "../../auth-provider";
import { motion } from "framer-motion";
import { Badge } from "@/src/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { conditionDetails } from "@/src/components/shared/detailed-item-card";
import { Separator } from "@/src/components/ui/separator";
import { getTimeAgo } from "@/src/utils/date-utils";
import { useUser } from "@/src/hooks/users/use-user";
import MapCaller from "@/src/components/ui/map-caller";
import {
  convertToLatLng,
  getCoordinatesForItem,
  parseAddressToCoordinates,
} from "@/src/utils/location-utils";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ItemPage({ params }: { params: { id: string } }) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [itemCoordinates, setItemCoordinates] = useState<[number, number]>([
    47.3769, 8.5417,
  ]);
  const { toast } = useToast();
  const { session } = useSession();
  const router = useRouter();

  const {
    data: item,
    isLoading: isLoadingItemData,
    error,
  } = useItem(params.id);

  useEffect(() => {
    if (item) {
      parseAddressToCoordinates(item.address).then((coords) => {
        setItemCoordinates(convertToLatLng(coords));
      });
    }
  }, [item]);

  const { data: ownerData, isLoading: isLoadingOwnerData } = useUser(
    item?.owner.id
  );

  if (isLoadingItemData) {
    return <ProductSkeleton />;
  }

  if (error) {
    return <p>Error loading product: {error.message}</p>;
  }

  if (!item) {
    notFound();
  }

  const isOwner = session?.user?.id === item.owner?.supabaseId;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Report submitted:", {
      reason: reportReason,
      description: reportDescription,
    });
    setIsReportDialogOpen(false);
    setReportReason("");
    setReportDescription("");
    toast({
      title: "Report Submitted",
      description: "Thank you for your report. We will review it shortly.",
    });
  };

  const handleIAmInterested = () => {
    router.push(`/auth/login`);
  };

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/items/${params.id}`;
    let shareUrl = "";

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "The product link has been copied to your clipboard.",
        });
        return;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "messenger":
        shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
          url
        )}&app_id=YOUR_FACEBOOK_APP_ID`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          url
        )}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleContact = (method: "EMAIL" | "PHONE" | "WHATSAPP") => {
    if (!ownerData) {
      toast({
        title: "Contact Information Missing",
        description: "Unable to retrieve contact information.",
        variant: "destructive",
      });
      return;
    }

    switch (method) {
      case "EMAIL":
        if (ownerData.email) {
          window.location.href = `mailto:${ownerData.email}?subject=Additional Life: Interested in: ${item?.title}`;
        } else {
          toast({
            title: "Email Not Available",
            description: "The owner has not provided an email address.",
            variant: "destructive",
          });
        }
        break;
      case "PHONE":
        if (ownerData.phoneNumber) {
          window.location.href = `tel:${ownerData.phoneNumber}`;
        } else {
          toast({
            title: "Phone Not Available",
            description: "The owner has not provided a phone number.",
            variant: "destructive",
          });
        }
        break;
      case "WHATSAPP":
        if (ownerData.phoneNumber) {
          const cleanPhone = ownerData.phoneNumber.replace(/[^0-9]/g, "");
          const message = encodeURIComponent(
            `Hi! I'm interested in your item: ${item?.title}`
          );
          window.open(
            `https://wa.me/${cleanPhone}?text=${message}`,
            "_blank",
            "noopener,noreferrer"
          );
        } else {
          toast({
            title: "WhatsApp Not Available",
            description:
              "The owner has not provided a phone number for WhatsApp.",
            variant: "destructive",
          });
        }
        break;
    }
  };

  const handleChatClick = () => {
    router.push(`/chat/${session?.user.id}/${item.owner?.id}/${item.id}`);
  };

  const handleEditClick = () => {
    router.push(`/items/create/${item.id}`);
  };

  const imagesForCarousel = item.imageUrls;

  const ActionButtons = () => (
    <>
      {isOwner && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditClick}
          className="px-6 md:px-10"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="px-6 md:px-10">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => handleShare("copy")}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleShare("facebook")}>
            <Facebook className="mr-2 h-4 w-4" />
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleShare("messenger")}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Share on Messenger
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleShare("whatsapp")}>
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Share on WhatsApp
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="px-6 md:px-10">
            <Flag className="mr-2 h-4 w-4" />
            Report
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report Item</DialogTitle>
            <DialogDescription>
              Please provide details about why you're reporting this item. We'll
              review your report and take appropriate action.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReportSubmit}>
            <div className="grid gap-4 py-4">
              <RadioGroup value={reportReason} onValueChange={setReportReason}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inappropriate" id="inappropriate" />
                  <Label htmlFor="inappropriate">Inappropriate content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spam" id="spam" />
                  <Label htmlFor="spam">Spam or misleading</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prohibited" id="prohibited" />
                  <Label htmlFor="prohibited">Prohibited item</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
              <div className="grid gap-2">
                <Label htmlFor="description">Additional details</Label>
                <Textarea
                  id="description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Please provide any additional information about your report."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit Report</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );

  const ContactButtons = () => {
    if (isLoadingOwnerData) {
      return (
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    if (!ownerData?.contactOptions || ownerData.contactOptions.length === 0) {
      return (
        <Button className="w-full" onClick={handleChatClick}>
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat with Owner
        </Button>
      );
    }

    const contactButtons = ownerData.contactOptions.map((option) => {
      switch (option) {
        case "EMAIL":
          return (
            <Button
              key="email"
              variant="outline"
              className="flex-1"
              onClick={() => handleContact("EMAIL")}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          );
        case "PHONE":
          return (
            <Button
              key="phone"
              variant="outline"
              className="flex-1"
              onClick={() => handleContact("PHONE")}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
          );
        case "WHATSAPP":
          return (
            <Button
              key="whatsapp"
              variant="outline"
              className="flex-1"
              onClick={() => handleContact("WHATSAPP")}
            >
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </Button>
          );
      }
    });

    return (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">{contactButtons}</div>
        <Button className="w-full" onClick={handleChatClick}>
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat with Owner
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden">
      <Link
        href="/items"
        className="flex items-center text-green-600 hover:text-green-700 mb-4"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to listings
      </Link>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full min-w-0"
        >
          <ImageCarousel
            images={imagesForCarousel}
            alt={item.title || "Product Image"}
            priority={true}
          />
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={slideUp}>
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
              {item.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 flex-shrink-0" />
                {item.category?.name}
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              >
                Condition:{" "}
                {
                  conditionDetails.find((c) => c.key === item.condition)
                    ?.placeholder
                }
              </Badge>
            </div>

            <div className="flex justify-between space-x-2 mb-4">
              <ActionButtons />
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={item.owner?.avatarUrl} />
              <AvatarFallback>
                {(item.owner?.name || "U").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {item.owner?.name}
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="mr-1 h-4 w-4" />
                <span>Posted {getTimeAgo(item.createdAt)}</span>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            Description
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {item.description}
          </p>
          <Separator className="my-4" />
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin size={20} className="mr-2" />
              <span>{item.address}</span>
            </div>
            {item.isPickupPossible && (
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <MapPinHouse size={20} className="mr-2" />
                <span>Pickup Available</span>
              </div>
            )}
            {item.isShippingPossible && (
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Truck size={20} className="mr-2" />
                <span>Shipping Available</span>
              </div>
            )}
          </div>
          {session ? (
            <div>
              <div className="space-y-4 mb-6">
                <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
                  Contact the Owner
                </h2>
              </div>
              <ContactButtons />
            </div>
          ) : (
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleIAmInterested}
            >
              I am interested in this item!
            </Button>
          )}
        </motion.div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
          Location
        </h2>
        <div className="h-[400px] rounded-lg overflow-hidden">
          <MapCaller posix={itemCoordinates} zoom={13} />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          {item.address}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Note: Map shows approximate location. Contact the owner for exact
          pickup details.
        </p>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-6 w-40 mb-4" /> {/* Back to listings skeleton */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Image Carousel Skeleton */}
        <div>
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>

        {/* Right Column: Product Details Skeleton */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-10 w-3/4" /> {/* Title */}
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20 rounded" />{" "}
              {/* Edit button skeleton */}
              <Skeleton className="h-8 w-20 rounded" /> {/* Share button */}
              <Skeleton className="h-8 w-20 rounded" /> {/* Report button */}
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" /> {/* Description line 1 */}
          <Skeleton className="h-4 w-5/6 mb-2" /> {/* Description line 2 */}
          <Skeleton className="h-4 w-4/6 mb-6" /> {/* Description line 3 */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-2 rounded-full" />
              <Skeleton className="h-5 w-1/2" /> {/* Location */}
            </div>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-2 rounded-full" />
              <Skeleton className="h-5 w-2/3" /> {/* Posted by */}
            </div>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-2 rounded-full" />
              <Skeleton className="h-5 w-1/3" /> {/* Posted on */}
            </div>
          </div>
          <div className="p-4 rounded-lg mb-6 bg-gray-100 dark:bg-gray-800">
            <Skeleton className="h-6 w-1/3 mb-2" /> {/* Category title */}
            <Skeleton className="h-4 w-1/2" /> {/* Category name */}
          </div>
          <div>
            <Skeleton className="h-8 w-1/2 mb-4" />{" "}
            {/* Contact title / I am interested button */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-24 rounded" />{" "}
              {/* Contact button 1 */}
              <Skeleton className="h-10 w-24 rounded" />{" "}
              {/* Contact button 2 */}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  );
}
