import Image from "next/image";

import { stoneShapes } from "@/lib/catalog-filters";

export function StoneShapeIcon({ shape, className }: { shape: string; className?: string }) {
  if (!stoneShapes.some((value) => value === shape)) return null;

  return (
    <Image
      src={`/images/shapes/${shape.toLowerCase()}.svg`}
      alt=""
      aria-hidden="true"
      width={80}
      height={80}
      unoptimized
      className={className}
    />
  );
}
