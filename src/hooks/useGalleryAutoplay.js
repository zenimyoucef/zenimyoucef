import { useCallback, useEffect, useRef, useState } from "react";

export default function useGalleryAutoplay({ rootRef, trackRef, animationRef, moving, count, onAdvance }) {
  const callbackRef = useRef(onAdvance);
  const [cycle, setCycle] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [pauses, setPauses] = useState({ hover: false, focus: false, gesture: false, hidden: true, reduced: true, offscreen: true });
  const reset = useCallback(() => setCycle(value => value + 1), []);
  const playing = count > 1 && !stopped && !moving && !Object.values(pauses).some(Boolean);

  useEffect(() => { callbackRef.current = onAdvance; }, [onAdvance]);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const pause = (key, value) => setPauses(previous => previous[key] === value ? previous : { ...previous, [key]: value });
    const visibility = () => pause("hidden", document.hidden);
    const motion = () => pause("reduced", preference.matches);
    const enter = event => { if (event.pointerType === "mouse" && finePointer.matches) pause("hover", true); };
    const leave = () => pause("hover", false);
    const focus = () => pause("focus", true);
    const blur = event => { if (!root.contains(event.relatedTarget)) pause("focus", false); };
    let mouseEngaged = false;
    const mouseDown = event => { if (event.pointerType === "mouse") { mouseEngaged = true; pause("gesture", true); } };
    const mouseUp = event => { if (event.pointerType === "mouse" && mouseEngaged) { mouseEngaged = false; pause("gesture", false); reset(); } };
    const touchStart = () => pause("gesture", true);
    const touchEnd = event => { if (!event.touches.length) { pause("gesture", false); reset(); } };
    let settleTimer;
    const scroll = () => {
      if (animationRef.current) return;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(reset, 150);
    };
    const observer = new IntersectionObserver(entries => pause("offscreen", !entries[0].isIntersecting || entries[0].intersectionRatio < .15), { threshold: .15 });
    observer.observe(root);
    visibility();
    motion();
    pause("focus", root.contains(document.activeElement));
    pause("hover", finePointer.matches && root.matches(":hover"));
    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointerleave", leave);
    root.addEventListener("focusin", focus);
    root.addEventListener("focusout", blur);
    root.addEventListener("pointerdown", mouseDown);
    window.addEventListener("pointerup", mouseUp);
    window.addEventListener("pointercancel", mouseUp);
    root.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchend", touchEnd, { passive: true });
    window.addEventListener("touchcancel", touchEnd, { passive: true });
    track.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", motion);
    return () => {
      clearTimeout(settleTimer);
      observer.disconnect();
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("focusin", focus);
      root.removeEventListener("focusout", blur);
      root.removeEventListener("pointerdown", mouseDown);
      window.removeEventListener("pointerup", mouseUp);
      window.removeEventListener("pointercancel", mouseUp);
      root.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchend", touchEnd);
      window.removeEventListener("touchcancel", touchEnd);
      track.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", motion);
    };
  }, [count, reset]);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (!document.hidden) callbackRef.current();
    }, 5000);
    return () => clearTimeout(timer);
  }, [playing, cycle]);

  return { playing, stopped, reduced: pauses.reduced, cycle, reset, toggle: () => { setStopped(value => !value); reset(); } };
}
