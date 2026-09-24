"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { animateHomeIntro } from "@/lib/home-intro-motion";

import styles from "./home-intro.module.css";
import { JewelStory } from "./jewel-story";

export function HomeIntro({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) return animateHomeIntro(ref.current);
  }, []);

  return (
    <div ref={ref} data-scroll-intro className={styles.intro}>
      <a href="#collections" className={styles.skipLink}>
        Skip to collections
      </a>
      <div data-intro-stage className={styles.stage}>{children}<JewelStory /></div>
    </div>
  );
}
