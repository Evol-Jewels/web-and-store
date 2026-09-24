import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import styles from "./home-intro.module.css";

export function HomeHero() {
  return (
    <section data-hero className={styles.hero} aria-labelledby="home-title">
      <Image
        src="/images/home/hero-meadow.png"
        alt="Wildflowers on a sunlit hill beneath a blue, cloud-filled sky"
        fill
        preload
        sizes="(max-aspect-ratio: 1475/1067) 139vh, 100vw"
        className={styles.heroImage}
      />
      <div className={styles.heroTop}>
        <Link href="/products" className={styles.textLink}>
          Explore the collection <ArrowUpRight size={15} strokeWidth={1.25} />
        </Link>
      </div>
      <div className={styles.wordmark}>
        <h1 id="home-title">Evol Jewels</h1>
      </div>
      <div className={`${styles.wordmark} ${styles.paperWordmark}`} aria-hidden="true">
        <span>Evol Jewels</span>
      </div>
      <Image
        src="/images/home/hero-meadow-foreground.png"
        alt=""
        aria-hidden="true"
        fill
        preload
        sizes="(max-aspect-ratio: 1475/1067) 139vh, 100vw"
        className={styles.heroForeground}
      />
      <div className={styles.heroBottom}>
        <a href="#collections" data-discover className={styles.scrollCue}>
          <span>Scroll to discover</span>
          <ArrowDown size={20} strokeWidth={1} />
        </a>
      </div>
    </section>
  );
}
