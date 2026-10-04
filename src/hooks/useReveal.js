import { useEffect } from "react";

export default function useReveal() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    const revealAll = () =>
      document.querySelectorAll("[data-reveal]").forEach((element) => {
        element.classList.remove("reveal-pending");
        element.classList.add("is-visible");
      });
    const setup = () => {
      observer?.disconnect();
      if (preference.matches || !("IntersectionObserver" in window)) {
        revealAll();
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.remove("reveal-pending");
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
      );
      document.querySelectorAll("[data-reveal]").forEach((element) => {
        // Content is visible in server HTML and without JS. Only prepare
        // offscreen elements; in-page links cannot land on hidden headings.
        if (element.getBoundingClientRect().top > window.innerHeight)
          element.classList.add("reveal-pending");
        observer.observe(element);
      });
    };
    setup();
    preference.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", setup);
      revealAll();
    };
  }, []);
}
