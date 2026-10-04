import { Arrow } from "./Editorial";

export default function Hero() {
  const base = import.meta.env.BASE_URL;
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-composition">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            Web developer &amp; designer <span aria-hidden="true">/</span>
            <span className="hero-byline">Zenim Youcef</span>
          </p>
          <h1 id="hero-heading" className="hero-title">
            <span className="line-mask">
              <span>Crafting</span>
            </span>
            <span className="line-mask">
              <span>digital products</span>
            </span>
            <span className="line-mask">
              <span>with code &amp;</span>
            </span>
            <span className="line-mask">
              <span>
                <em>intention.</em>
              </span>
            </span>
          </h1>
          <p className="hero-intro">
            I’m Zenim Youcef, a web developer and designer focused on building
            thoughtful, responsive digital experiences.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="button-primary">
              Get in touch <Arrow />
            </a>
            <a href="#work" className="text-link">
              View my work <Arrow />
            </a>
          </div>
        </div>
        <figure className="hero-art">
          <span className="vertical-caption" aria-hidden="true">
            FIELD RECORD / 01 — PERSPECTIVE
          </span>
          <div className="mountain-print">
            <picture>
              <source
                type="image/avif"
                srcSet={`${base}images/cinematic-640.avif 640w, ${base}images/cinematic-1024.avif 1024w, ${base}images/cinematic-1600.avif 1600w`}
                sizes="100vw"
              />
              <img
                src={`${base}images/cinematic-1600.webp`}
                srcSet={`${base}images/cinematic-640.webp 640w, ${base}images/cinematic-1024.webp 1024w, ${base}images/cinematic-1600.webp 1600w`}
                sizes="100vw"
                width="1536"
                height="1024"
                alt="Cinematic decorative collage of an anonymous figure looking toward alpine mountains"
                fetchPriority="high"
              />
            </picture>
          </div>
          <div className="code-stamp" aria-hidden="true">
            <span>Ideas</span>
            <span>Code</span>
            <span>People</span>
          </div>
          <figcaption>
            <span className="art-note">
              A little perspective
              <br />
              goes a long way.
            </span>
            <span className="photo-caption">
              FIELD NOTES — CODE &amp; DESIGN
            </span>
          </figcaption>
        </figure>
      </div>
      <div className="hero-footnote">
        <span>
          <span className="accent">01</span> / An introduction
        </span>
        <span className="hero-footnote-center">Ideas. Code. People.</span>
        <a href="#work">
          Scroll to explore <Arrow direction="up" className="scroll-arrow" />
        </a>
      </div>
    </section>
  );
}
