export function Arrow({ direction = "right", className = "" }) {
  return (
    <svg
      className={`arrow-icon ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={direction === "up" ? { transform: "rotate(-90deg)" } : undefined}
    >
      <path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Zenim Youcef, back to top">
      ZENIM<span>.</span>
    </a>
  );
}

export function SectionLabel({ number, children, light = false }) {
  return (
    <div
      className={`section-label ${light ? "section-label--light" : ""}`}
      data-reveal
    >
      <span className="section-number">{number}</span>
      <span className="label-slash" aria-hidden="true">
        /
      </span>
      <span>{children}</span>
      <span className="label-rule" aria-hidden="true" />
    </div>
  );
}

export function ProjectImage({ project, featured = false }) {
  const base = import.meta.env.BASE_URL;
  const sizes = project.status === "live"
    ? "(max-width: 767px) 85vw, 55vw"
    : featured
    ? "(max-width: 1023px) 85vw, 45vw"
    : "(max-width: 767px) 80vw, (max-width: 1199px) 42vw, 28vw";
  const sourceSet = (format) =>
    [640, 960, 1280]
      .map(
        (width) =>
          `${base}images/${project.image}-${width}.${format} ${width}w`,
      )
      .join(", ");
  return (
    <picture>
      <source type="image/avif" srcSet={sourceSet("avif")} sizes={sizes} />
      <img
        src={`${base}images/${project.image}-1280.webp`}
        srcSet={sourceSet("webp")}
        sizes={sizes}
        alt={project.imageAlt}
        width="1440"
        height="950"
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

export function ExternalLink({ href, children, className = "", ...props }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
