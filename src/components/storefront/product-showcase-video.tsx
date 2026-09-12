"use client";

import { useEffect, useRef } from "react";

import type { ProductVideo } from "@/types/product";

function orderedVideoSources(sources: ProductVideo["sources"]) {
  return [...sources].sort((left, right) => {
    const leftIsHls = left.mimeType === "application/x-mpegURL";
    const rightIsHls = right.mimeType === "application/x-mpegURL";

    if (leftIsHls !== rightIsHls) return leftIsHls ? -1 : 1;
    return right.width * right.height - left.width * left.height;
  });
}

export function ProductShowcaseVideo({
  productTitle,
  video,
}: {
  productTitle: string;
  video: ProductVideo;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void element.play().catch(() => undefined);
        } else {
          element.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover object-center"
      aria-label={video.altText || `${productTitle} product video`}
      poster={video.previewImage?.url}
      autoPlay
      controls
      loop
      muted
      playsInline
      preload="metadata"
    >
      {orderedVideoSources(video.sources).map((source) => (
        <source key={source.url} src={source.url} type={source.mimeType} />
      ))}
      Your browser does not support product video playback.
    </video>
  );
}
