"use client";

import Image from "next/image";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const { t } = useTranslation("common");

  const testimonials = [
    {
      id: 1,
      name: t("testimonials.testimonial_1.name"),
      avatar: "/public/avatar.png",
      text: t("testimonials.testimonial_1.text"),
      location: t("testimonials.testimonial_1.location"),
    },
    {
      id: 2,
      name: t("testimonials.testimonial_2.name"),
      avatar: "/public/avatar.png",
      text: t("testimonials.testimonial_2.text"),
      location: t("testimonials.testimonial_2.location"),
    },
    {
      id: 3,
      name: t("testimonials.testimonial_3.name"),
      avatar: "/public/avatar.png",
      text: t("testimonials.testimonial_3.text"),
      location: t("testimonials.testimonial_3.location"),
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-100 text-center mb-12">
          {t("home.what_our_community_says")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md relative"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="rounded-full border-4 border-white dark:border-gray-800 overflow-hidden">
                  {/* <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  /> */}
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="pt-8 text-center">
                <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-green-700 dark:text-green-300">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
