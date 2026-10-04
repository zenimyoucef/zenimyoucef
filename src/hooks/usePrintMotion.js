import { useEffect } from "react";

// The print moves by a few pixels, only with a fine pointer and full motion.
export default function usePrintMotion() {
  useEffect(() => {
    const allowed = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const mountain = document.querySelector(".mountain-print");
    const frame = document.querySelector(".featured-media");
    let animation;
    const scroll = () => {
      if (animation) return;
      animation = requestAnimationFrame(() => {
        animation = undefined;
        const bounds = mountain.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < innerHeight)
          mountain.style.setProperty(
            "--mountain-shift",
            `${Math.min(9, Math.max(-9, scrollY * 0.018))}px`,
          );
      });
    };
    const move = (event) => {
      const bounds = frame.getBoundingClientRect();
      frame.style.setProperty(
        "--pointer-x",
        `${((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 7}px`,
      );
      frame.style.setProperty(
        "--pointer-y",
        `${((event.clientY - bounds.top - bounds.height / 2) / bounds.height) * 7}px`,
      );
      frame.style.setProperty("--pointer-scale", "1.015");
    };
    const reset = () => frame.removeAttribute("style");
    const detach = () => {
      window.removeEventListener("scroll", scroll);
      frame.removeEventListener("pointermove", move);
      frame.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(animation);
      animation = undefined;
      mountain.style.removeProperty("--mountain-shift");
      reset();
    };
    const setup = () => {
      detach();
      if (!allowed.matches) return;
      window.addEventListener("scroll", scroll, { passive: true });
      frame.addEventListener("pointermove", move);
      frame.addEventListener("pointerleave", reset);
    };
    setup();
    allowed.addEventListener("change", setup);
    return () => {
      detach();
      allowed.removeEventListener("change", setup);
    };
  }, []);
}
