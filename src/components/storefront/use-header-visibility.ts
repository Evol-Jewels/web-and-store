"use client";

import { useEffect, useState } from "react";

function initialState(pathname: string) {
  return { pathname, solid: pathname !== "/products", hidden: pathname === "/" };
}

export function useHeaderVisibility(pathname: string) {
  const [state, setState] = useState(() => initialState(pathname));

  useEffect(() => {
    let lastScroll = window.scrollY;
    let hidden = false;
    let frame = 0;

    function update() {
      frame = 0;
      const y = window.scrollY;
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const intro = document.querySelector<HTMLElement>("[data-scroll-intro]");
      let solid = true;

      if (pathname === "/") {
        hidden = Boolean(intro && intro.getBoundingClientRect().bottom > window.innerHeight * 0.75);
      } else if (hero) {
        solid = hero.getBoundingClientRect().bottom <= 88;
        hidden = false;
      } else if (pathname.startsWith("/products/")) {
        if (y < 64) {
          hidden = false;
          lastScroll = y;
        } else if (Math.abs(y - lastScroll) > 6) {
          hidden = y > lastScroll;
          lastScroll = y;
        }
      } else {
        hidden = false;
      }

      setState((previous) =>
        previous.pathname === pathname && previous.solid === solid && previous.hidden === hidden
          ? previous
          : { pathname, solid, hidden },
      );
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    schedule();
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return state.pathname === pathname ? state : initialState(pathname);
}
