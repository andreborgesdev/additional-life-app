"use client";

import React, { useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  priority?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt,
  priority = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    accessibility: true,
    arrows: false,
    autoplay: images.length > 1,
    autoplaySpeed: 3000,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
  };

  const sliderRef = React.useRef<Slider>(null);

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const goToSlide = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  if (images.length === 1) {
    return (
      <div className="w-full overflow-hidden">
        <div className="relative w-full max-h-[400px] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          <div className="aspect-[4/3] w-full relative flex items-center justify-center">
            <Image
              src={images[0] || "/placeholder.svg"}
              alt={alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={priority}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="relative w-full max-h-[400px] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <div className="aspect-[4/3] w-full">
          <Slider ref={sliderRef} {...settings}>
            {images.map((image, index) => (
              <div key={index} className="outline-none">
                <div className="aspect-[4/3] w-full relative flex items-center justify-center">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${alt} - Image ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={priority && index === 0}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {images.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full z-10 hover:bg-opacity-70 transition-all"
              onClick={goToPrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <button
              className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full z-10 hover:bg-opacity-70 transition-all"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 sm:mt-6">
          <div className="flex justify-center overflow-x-auto pb-2 px-2">
            <div className="flex space-x-2 sm:space-x-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all ${
                    currentSlide === index
                      ? "border-2 border-green-500 bg-gray-100 dark:bg-gray-800"
                      : "border-2 border-transparent bg-gray-100 dark:bg-gray-800 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={image}
                      alt={`${alt} - Thumbnail ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
