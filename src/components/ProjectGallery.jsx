import { useEffect, useRef, useState } from "react";
import { Arrow } from "./Editorial";
import useGalleryAutoplay from "../hooks/useGalleryAutoplay";

const number = (value) => String(value).padStart(2, "0");

export default function ProjectGallery({ id, label, items, variant, itemLabel, renderItem }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const [moving, setMoving] = useState(false);
  const [automaticMoving, setAutomaticMoving] = useState(false);
  const dragRef = useRef(null);
  const suppressClickUntil = useRef(0);
  const [position, setPosition] = useState({ active: 0, start: true, end: items.length < 2 });

  const nearestIndex = () => {
    const track = trackRef.current;
    const slides = [...track.children];
    // Track the leading slide, including when multiple archive cards share a view.
    return slides.reduce((nearest, slide, index) =>
      Math.abs(slide.offsetLeft - track.scrollLeft) <
      Math.abs(slides[nearest].offsetLeft - track.scrollLeft) ? index : nearest, 0);
  };

  const cancelMovement = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current.frame);
    animationRef.current = null;
    if (trackRef.current) delete trackRef.current.dataset.animating;
    setMoving(false);
    setAutomaticMoving(false);
  };

  const goTo = (index, automatic = false) => {
    const track = trackRef.current;
    const slide = track.children[Math.max(0, Math.min(items.length - 1, index))];
    if (!slide) return;
    cancelMovement();
    const target = Math.min(slide.offsetLeft, track.scrollWidth - track.clientWidth);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollTo({ left: target, behavior: "instant" });
      return;
    }
    const origin = track.scrollLeft;
    if (Math.abs(origin - target) < 2) return;
    track.dataset.animating = "true";
    setMoving(true);
    setAutomaticMoving(automatic);
    const animation = { frame: null, started: null, target };
    animationRef.current = animation;
    const animate = time => {
      if (animationRef.current !== animation) return;
      animation.started ??= time;
      const progress = Math.min(1, (time - animation.started) / 850);
      // A gentle ease-out, with native scrolling retained for touch gestures.
      const eased = 1 - (1 - progress) ** 4;
      track.scrollTo({ left: origin + (target - origin) * eased, behavior: "instant" });
      if (progress < 1) animation.frame = requestAnimationFrame(animate);
      else cancelMovement();
    };
    animation.frame = requestAnimationFrame(animate);
  };

  const autoplay = useGalleryAutoplay({
    rootRef, trackRef, animationRef, moving, count: items.length,
    onAdvance: () => goTo(position.end ? 0 : position.active + 1, true),
  });
  const navigate = index => { autoplay.reset(); goTo(index); };

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (!animationRef.current) return;
      const target = animationRef.current.target;
      cancelMovement();
      if (motion.matches) trackRef.current.scrollTo({ left: target, behavior: "instant" });
    };
    const hidden = () => { if (document.hidden) cancelMovement(); };
    motion.addEventListener("change", stop);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      motion.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", hidden);
      if (animationRef.current) cancelAnimationFrame(animationRef.current.frame);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = {
          active: nearestIndex(),
          start: track.scrollLeft <= 2,
          end: track.scrollLeft >= track.scrollWidth - track.clientWidth - 2,
        };
        setPosition(previous => previous.active === next.active && previous.start === next.start && previous.end === next.end ? previous : next);
      });
    };
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    update();
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [items]);

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    const track = trackRef.current;
    delete track.dataset.dragging;
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (drag.moved) {
      suppressClickUntil.current = performance.now() + 400;
      navigate(nearestIndex());
    }
  };

  if (!items.length) return null;
  return (
    <div className={`project-gallery project-gallery--${variant}`} id={id} ref={rootRef} data-autoplay={autoplay.playing ? "running" : "paused"} data-reduced-motion={autoplay.reduced} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="gallery-toolbar">
        <div className="gallery-reading" aria-live={autoplay.playing || automaticMoving ? "off" : "polite"} aria-atomic="true">
          <span className="gallery-progress">{number(position.active + 1)} / {number(items.length)}</span>
          <span className="gallery-timer" aria-hidden="true"><span key={`${autoplay.cycle}-${autoplay.playing}`} className={autoplay.playing ? "is-running" : ""} /></span>
          <span className="gallery-current-title">{items[position.active]?.title}</span>
        </div>
        <div className="gallery-navigation">
          <span className="gallery-hint" aria-hidden="true">Swipe / drag</span>
          <button type="button" className="gallery-autoplay-control" aria-label={autoplay.stopped ? "Resume automatic advance" : "Pause automatic advance"} aria-pressed={autoplay.stopped} disabled={autoplay.reduced} onClick={autoplay.toggle}>{autoplay.stopped ? <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="m5 3 7 5-7 5V3Z" stroke="currentColor" /></svg> : <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="1.5" /></svg>}</button>
          <button type="button" className="gallery-arrow gallery-arrow--previous" aria-label={`Previous ${itemLabel}`} aria-controls={`${id}-track`} disabled={position.start} onClick={() => navigate(position.active - 1)}><Arrow /></button>
          <button type="button" className="gallery-arrow gallery-arrow--next" aria-label={`Next ${itemLabel}`} aria-controls={`${id}-track`} disabled={position.end} onClick={() => navigate(position.active + 1)}><Arrow /></button>
        </div>
      </div>
      <div
        className="gallery-track"
        id={`${id}-track`}
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label={`${label}: use arrow keys to browse`}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          const destinations = { ArrowLeft: position.active - 1, ArrowRight: position.active + 1, Home: 0, End: items.length - 1 };
          if (event.key in destinations) {
            event.preventDefault();
            navigate(destinations[event.key]);
          }
        }}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          cancelMovement();
          autoplay.reset();
          if (event.pointerType !== "mouse" || event.button !== 0 || event.target.closest("button, summary, input, textarea, select")) return;
          dragRef.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, moved: false };
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag) return;
          const distance = event.clientX - drag.x;
          if (!drag.moved && (Math.abs(distance) < 6 || Math.abs(event.clientY - drag.y) > Math.abs(distance))) return;
          if (!drag.moved) {
            drag.moved = true;
            event.currentTarget.dataset.dragging = "true";
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          event.preventDefault();
          event.currentTarget.scrollLeft = drag.left - distance;
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onPointerLeave={() => {
          if (dragRef.current && !dragRef.current.moved) dragRef.current = null;
        }}
        onClickCapture={(event) => {
          if (event.detail > 0 && performance.now() < suppressClickUntil.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onWheel={() => { cancelMovement(); autoplay.reset(); }}
        onTouchStart={() => { cancelMovement(); autoplay.reset(); }}
      >
        {items.map((project, index) => (
          <div className="gallery-slide" key={project.id} role="group" aria-roledescription="slide" aria-current={position.active === index ? "true" : undefined} aria-label={`${index + 1} of ${items.length}: ${project.title}`}>
            {renderItem(project, index)}
          </div>
        ))}
      </div>
      {variant === "live" && <nav className="gallery-project-index" aria-label="Choose a live project">{items.map((project, index) => <button type="button" key={project.id} aria-label={`Show ${project.title}`} aria-current={position.active === index ? "true" : undefined} onClick={() => navigate(index)}><span>{number(project.order ?? index + 1)}</span> {project.indexTitle || project.title}</button>)}</nav>}
    </div>
  );
}
