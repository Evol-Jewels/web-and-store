import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import styles from "./home-intro.module.css";

export function JewelStory() {
  return (
    <div className={styles.story} aria-label="From an element to an Evol ring">
      <div className={styles.darkSurface} />
      <div data-jewel-scene className={styles.scene} aria-hidden="true" />
      <Image className={styles.fallback} src="/images/home/editorial-rings.jpg" alt="Evol diamond rings" width={700} height={900} />
      <section data-panel="origin" className={styles.panel}>
        <h2>Everything begins with an element.</h2>
      </section>
      <section data-panel="stone" className={styles.panel}>
        <p>01 / The diamond</p><h2>Light, cultivated.</h2>
        <small>A lab-grown diamond.<br />Cut to reveal its brilliance.</small>
      </section>
      <section data-panel="encounter" className={styles.panel}>
        <h2>A thousand grains. One form.</h2><small>Gold gathers around light.</small>
      </section>
      <section data-panel="gold" className={styles.panel}>
        <p>02 / The gold</p><h2>A lasting warmth.</h2>
        <small>A continuous curve of gold.<br />Considered in every detail.</small>
      </section>
      <section data-panel="ending" className={styles.panel}>
        <p>Together, Evol</p><h2>Yours to<br />carry forward.</h2>
        <a href="#collections">Explore Evol <ArrowUpRight size={16} strokeWidth={1.25} /></a>
      </section>
      <div className={styles.exitSurface} />
    </div>
  );
}
