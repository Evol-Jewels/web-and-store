import type { createJewelScene } from "./jewel-scene";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
const ease = (value: number) => value * value * (3 - 2 * value);
const fade = (value: number, start: number, end: number) => ease(range(value, start, end));

export function animateHomeIntro(intro: HTMLElement) {
  const stage = intro.querySelector<HTMLElement>("[data-intro-stage]");
  const container = intro.querySelector<HTMLElement>("[data-jewel-scene]");
  const controls = intro.querySelectorAll<HTMLElement>("[data-hero] a");
  const panels = Array.from(intro.querySelectorAll<HTMLElement>("[data-panel]"));
  if (!stage || !container) return;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let scene: ReturnType<typeof createJewelScene> | undefined;
  let disposed = false;
  let frame = 0;
  let lastTime = 0;
  let current = 0;
  let target = 0;
  let start = 0;
  let distance = 1;
  let height = 1;
  let loading = false;

  function loadScene() {
    if (scene || loading || preference.matches) return;
    loading = true;
    void import("./jewel-scene").then(({ createJewelScene }) => {
      loading = false;
      if (disposed || preference.matches) return;
      try {
        scene = createJewelScene(container!);
        paint(current);
      } catch {
        intro.dataset.scene = "failed";
      }
    }).catch(() => {
      loading = false;
      if (!disposed) intro.dataset.scene = "failed";
    });
  }

  function paint(progress: number) {
    const travel = range(progress, 0, 0.16);
    const story = range(progress, 0.20, 0.94);
    const darkness = fade(story, 0.025, 0.145);
    const exit = fade(progress, 1, 1.1);
    intro.style.setProperty("--image-y", `${-travel * height}px`);
    intro.style.setProperty("--image-passed", `${travel * 100}%`);
    intro.style.setProperty("--controls-opacity", String(1 - fade(progress, 0.01, 0.075)));
    intro.style.setProperty("--darkness", String(darkness));
    intro.style.setProperty("--scene-opacity", String(darkness));
    intro.style.setProperty("--exit-opacity", String(exit));
    controls.forEach((control) => { control.inert = progress > 0.075; });
    const alpha: Record<string, number> = {
      origin: fade(story, 0.105, 0.14) * (1 - fade(story, 0.29, 0.355)),
      stone: fade(story, 0.31, 0.36) * (1 - fade(story, 0.43, 0.475)),
      encounter: fade(story, 0.52, 0.56) * (1 - fade(story, 0.66, 0.70)),
      gold: fade(story, 0.72, 0.75) * (1 - fade(story, 0.815, 0.85)),
      ending: fade(story, 0.935, 0.98) * (1 - exit),
    };
    panels.forEach((panel) => {
      const name = panel.dataset.panel!;
      const opacity = alpha[name] ?? 0;
      panel.style.opacity = String(opacity);
      panel.style.visibility = opacity > 0.01 ? "visible" : "hidden";
      panel.inert = opacity < 0.5;
      const rise = name === "origin" ? -(fade(story, 0.16, 0.27) * 0.27 + fade(story, 0.29, 0.355) * 0.35) * height : (1 - opacity) * 18;
      panel.style.transform = `translate3d(0, ${rise}px, 0)`;
    });
    if (scene && darkness > 0 && exit < 1) scene.render(story);
  }

  function tick(time: number) {
    const delta = lastTime ? Math.min(time - lastTime, 64) : 16.67;
    lastTime = time;
    current += (target - current) * (1 - Math.exp(-delta / 65));
    if (Math.abs(current - target) < 0.00003) current = target;
    paint(current);
    frame = current === target ? 0 : window.requestAnimationFrame(tick);
    if (!frame) lastTime = 0;
  }

  function update() {
    if (preference.matches) return;
    target = Math.max(0, Math.min(1.15, (window.scrollY - start) / distance));
    if (!frame && target !== current) frame = window.requestAnimationFrame(tick);
  }

  function measure() {
    if (preference.matches) return;
    start = intro.getBoundingClientRect().top + window.scrollY;
    height = stage!.clientHeight;
    distance = Math.max(1, intro.offsetHeight - height);
    current = target = Math.max(0, Math.min(1.15, (window.scrollY - start) / distance));
    paint(current);
  }

  function configure() {
    window.cancelAnimationFrame(frame);
    frame = lastTime = 0;
    if (preference.matches) {
      delete intro.dataset.motion;
      intro.removeAttribute("style");
      controls.forEach((control) => { control.inert = false; });
    } else {
      intro.dataset.motion = "enabled";
      measure();
      loadScene();
    }
  }

  function discover(event: MouseEvent) {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest("a[data-discover]")) return;
    event.preventDefault();
    if (preference.matches) {
      document.getElementById("collections")?.scrollIntoView();
    } else {
      window.scrollTo({ top: start + distance * 0.18, behavior: "smooth" });
    }
  }

  configure();
  const resize = new ResizeObserver(measure);
  resize.observe(intro);
  resize.observe(stage);
  preference.addEventListener("change", configure);
  window.addEventListener("scroll", update, { passive: true });
  intro.addEventListener("click", discover);

  return () => {
    disposed = true;
    window.cancelAnimationFrame(frame);
    resize.disconnect();
    preference.removeEventListener("change", configure);
    window.removeEventListener("scroll", update);
    intro.removeEventListener("click", discover);
    scene?.dispose();
  };
}
