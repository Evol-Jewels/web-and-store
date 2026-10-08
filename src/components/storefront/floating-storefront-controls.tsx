"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function FloatingStorefrontControls({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visiblePath, setVisiblePath] = useState<string | null>(null);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const updateVisibility = () => {
      const heroBounds = hero?.getBoundingClientRect();
      const visibleHeroHeight = heroBounds
        ? Math.max(
            0,
            Math.min(heroBounds.bottom, window.innerHeight) -
              Math.max(heroBounds.top, 0),
          )
        : 0;

      setVisiblePath(
        visibleHeroHeight < window.innerHeight / 2 ? pathname : null,
      );
    };

    const frame = window.requestAnimationFrame(updateVisibility);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [pathname]);

  if (visiblePath !== pathname) return null;

  return children;
}
