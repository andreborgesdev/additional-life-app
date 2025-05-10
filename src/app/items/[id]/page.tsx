"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  User,
  Calendar,
  Flag,
  Share2,
  Copy,
  Facebook,
  MessageCircle,
  Mail,
} from "lucide-react";
import ProductActions from "@/src/components/product-actions";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
import ImageCarousel from "@/src/components/image-carousel";
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
import { useItem } from "@/src/hooks/use-item";
import { LoadingSpinner } from "@/src/components/ui/loading-spinner";

// This is mock data. In a real application, you'd fetch this from an API or database.
// const products = [
//   {
//     id: "1",
//     title: "Vintage Bicycle",
//     description:
//       "A well-maintained vintage bicycle from the 1980s. Perfect for collectors or those looking for a unique ride.",
//     images: [
//       "/placeholder.svg?height=400&width=600&text=Vintage+Bicycle+1",
//       "/placeholder.svg?height=400&width=600&text=Vintage+Bicycle+2",
//       "/placeholder.svg?height=400&width=600&text=Vintage+Bicycle+3",
//       "/placeholder.svg?height=400&width=600&text=Vintage+Bicycle+4",
//     ],
//     location: "Brooklyn, NY",
//     latitude: 40.6782,
//     longitude: -73.9442,
//     postedBy: "Jane Doe",
//     postedDate: "2024-02-23",
//     category: "Transportation",
//     email: "jane.doe@example.com",
//     phoneNumber: "+1234567890",
//   },
//   // Add more mock products as needed
// ];

export default function ProductPage({ params }: { params: { id: string } }) {
  const [isClient, setIsClient] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const { toast } = useToast();

  // Use the new hook to fetch item data
  const { data: product, isLoading, error } = useItem(params.id);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading product...</p>
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  }

  if (error) {
    return <p>Error loading product: {error.message}</p>;
  }

  if (!product) {
    notFound();
  }

  // Leaflet uses the default icon path from your server's root, so we need to update it
  // useEffect(() => {
  //   delete L.Icon.Default.prototype._getIconUrl;
  //   L.Icon.Default.mergeOptions({
  //     iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  //     iconUrl: "/leaflet/marker-icon.png",
  //     shadowUrl: "/leaflet/marker-shadow.png",
  //   });
  // }, []);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the report to your backend
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

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/items/${params.id}`; // Corrected URL path
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
        )}&app_id=YOUR_FACEBOOK_APP_ID`; // Replace YOUR_FACEBOOK_APP_ID
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

  const handleContact = (method: string) => {
    if (!product?.user || !product?.user) {
      toast({
        title: "Contact Information Missing",
        description: "The seller has not provided this contact information.",
        variant: "destructive",
      });
      return;
    }
    switch (method) {
      case "email":
        window.location.href = `mailto:${product.user}`;
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/${product.user.phoneNumber.replace(/[^0-9]/g, "")}`,
          "_blank",
          "noopener,noreferrer"
        );
        break;
      case "chat":
        toast({
          title: "Chat",
          description: "Chat functionality to be implemented.",
        });
        break;
    }
  };

  const imagesForCarousel = product.imageUrl ? [product.imageUrl] : [];

  // if (product.imageUrl) {
  //   imagesForCarousel.push(product.imageUrl);
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/items" // Corrected link to go back to the items listing page
        className="flex items-center text-green-600 hover:text-green-700 mb-4"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to listings
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <ImageCarousel
            images={imagesForCarousel}
            alt={product.title || "Product Image"}
          />
        </div>
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-4">
              {product.title}
            </h1>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
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
              <Dialog
                open={isReportDialogOpen}
                onOpenChange={setIsReportDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Report Item</DialogTitle>
                    <DialogDescription>
                      Please provide details about why you're reporting this
                      item. We'll review your report and take appropriate
                      action.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleReportSubmit}>
                    <div className="grid gap-4 py-4">
                      <RadioGroup
                        value={reportReason}
                        onValueChange={setReportReason}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="inappropriate"
                            id="inappropriate"
                          />
                          <Label htmlFor="inappropriate">
                            Inappropriate content
                          </Label>
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
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {product.description}
          </p>
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin size={20} className="mr-2" />
              <span>{product.address}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <User size={20} className="mr-2" />
              <span>Posted by {product.user}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar size={20} className="mr-2" />
              <span>
                Posted on {new Date(product.postedOn).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              Category
            </h2>
            <p className="text-green-600 dark:text-green-300">
              {product.category?.name}
            </p>
          </div>
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
              Contact the Owner
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleContact("email")}
                className="flex items-center"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button
                onClick={() => handleContact("whatsapp")}
                className="flex items-center"
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
              {/* Add other contact methods here */}
            </div>
          </div>
          <ProductActions productId={product.id?.toString() || ""} />
        </div>
      </div>
      {/* <div className="mt-8">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
          Location
        </h2>
        {isClient && (
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapContainer
              center={[product.latitude, product.longitude]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[product.latitude, product.longitude]}>
                <Popup>
                  {product.title} <br /> {product.location}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div> */}
    </div>
  );
}
