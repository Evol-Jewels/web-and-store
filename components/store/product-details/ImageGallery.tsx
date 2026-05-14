"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const handleThumbnailClick = (index: number) => {
    setMainImageIndex(index);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;

    const rect = mainImageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setZoomPos({ x, y });
    setShowZoom(true);
  }, []);

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const handleFullscreenNext = () => {
    setMainImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleFullscreenPrev = () => {
    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleFullscreenNext();
      } else if (e.key === "ArrowLeft") {
        handleFullscreenPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  return (
    <div className="w-full">
      {/* Desktop Layout - Main image and thumbnails side by side */}
      <div className="hidden lg:flex gap-4">
        {/* Thumbnails column */}
        <div className="flex flex-col gap-3 w-20">
          {images.map(
            (img, idx) =>
              img && (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`relative w-20 h-20 rounded overflow-hidden transition-all ${
                    mainImageIndex === idx
                      ? "ring-2 ring-gray-900"
                      : "ring-1 ring-evol-grey hover:ring-gray-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${productName} view ${idx + 1}`}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ),
          )}
        </div>

        {/* Main image */}
        <div className="flex-1">
          <div
            ref={mainImageRef}
            className="relative w-full aspect-square bg-evol-light-grey overflow-hidden group cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsFullscreen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mainImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full relative"
              >
                {images[mainImageIndex] && (
                  <>
                    <Image
                      src={images[mainImageIndex]}
                      alt={`${productName} main view`}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 55vw"
                      className="object-cover"
                      priority
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Zoom lens */}
            {showZoom && (
              <motion.div
                className="absolute top-4 right-4 w-44 h-44 border border-evol-grey bg-white bg-opacity-5 pointer-events-none"
                style={{
                  backgroundImage: `url(${images[mainImageIndex]})`,
                  backgroundPosition: `${(zoomPos.x / (mainImageRef.current?.offsetWidth || 1)) * 100}% ${(zoomPos.y / (mainImageRef.current?.offsetHeight || 1)) * 100}%`,
                  backgroundSize: "200%",
                  backgroundRepeat: "no-repeat",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}

            {/* Fullscreen button */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute bottom-4 right-4 p-2 bg-white rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Fullscreen gallery"
            >
              <Expand className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Main image on top, thumbnails horizontal below */}
      <div className="lg:hidden">
        {/* Main image */}
        <div
          className="w-full aspect-square bg-evol-light-grey overflow-hidden mb-3 rounded relative cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mainImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              {images[mainImageIndex] && (
                <>
                  <Image
                    src={images[mainImageIndex]}
                    alt={`${productName} main view`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="object-cover"
                    priority
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnails horizontal */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map(
            (img, idx) =>
              img && (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`relative shrink-0 w-16 h-16 rounded transition-all ${
                    mainImageIndex === idx
                      ? "ring-2 ring-gray-900"
                      : "ring-1 ring-evol-grey"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${productName} view ${idx + 1}`}
                    fill
                    unoptimized
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ),
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="
                absolute top-6 right-6 z-10
                p-3 rounded-full
                text-white
                bg-white/5
                border border-white/10
                backdrop-blur-md
                transition-all duration-300
                hover:bg-white/15
                hover:border-white/20
                hover:scale-105
                active:scale-95
                "
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main image */}
            <div
              className="relative w-11/12 h-5/6 max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={images[mainImageIndex]}
                    alt={`${productName} fullscreen`}
                    fill
                    unoptimized
                    sizes="90vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreenPrev();
                }}
                className="
                  absolute left-4 top-1/2 -translate-y-1/2
                  p-3 rounded-full
                  text-white
                  bg-white/5
                  border border-white/10
                  backdrop-blur-md
                  shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                  transition-all duration-300
                  hover:bg-white/15
                  hover:border-white/20
                  hover:scale-105
                  active:scale-95
                  "
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreenNext();
                }}
                className="
                  absolute right-4 top-1/2 -translate-y-1/2
                  p-3 rounded-full
                  text-white
                  bg-white/5
                  border border-white/10
                  backdrop-blur-md
                  shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                  transition-all duration-300
                  hover:bg-white/15
                  hover:border-white/20
                  hover:scale-105
                  active:scale-95
                  "
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                {mainImageIndex + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
