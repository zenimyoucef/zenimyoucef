import { Arrow, Brand, ExternalLink, SectionLabel } from "./Editorial";
import { contactUrl, socialLinks } from "../data/socialLinks";

export default function Contact() {
  return (
    <div className="contact-background">
      <section
        className="contact-section wrap"
        id="contact"
        aria-labelledby="contact-heading"
      >
        <SectionLabel number="06" light>
          Let’s connect
        </SectionLabel>
        <div className="contact-composition" data-reveal>
          <h2 id="contact-heading">
            Let’s build
            <br />
            something
            <br /> <em>good.</em>
          </h2>
          <div className="contact-copy">
            <figure className="contact-fragment" aria-hidden="true">
              <img
                src={`${import.meta.env.BASE_URL}images/mountain-640.webp`}
                width="640"
                height="424"
                alt=""
                loading="lazy"
              />
              <figcaption>FIELD RECORD / 01 — REVISITED</figcaption>
            </figure>
            <p>
              Have a project, an idea, or just want to say hi? I’d love to hear
              from you.
            </p>
            <ExternalLink href={contactUrl} className="conversation-link">
              Start a conversation{" "}
              <span className="circle-arrow">
                <Arrow />
              </span>
            </ExternalLink>
            <div className="social-links">
              {socialLinks.map((link) => (
                <ExternalLink href={link.url} key={link.label}>
                  {link.label}
                  <Arrow />
                </ExternalLink>
              ))}
            </div>
            <p className="contact-note">say hello.</p>
          </div>
        </div>
      </section>
      <footer className="footer wrap">
        <div className="footer-brand">
          <Brand />
          <p>
            Web developer &amp; designer
            <br />
            <span>Algeria / Available worldwide</span>
          </p>
        </div>
        <div className="footer-meta">
          <span>© 2026 Zenim Youcef</span>
          <a href="#top" className="back-to-top">
            Back to top <Arrow direction="up" />
          </a>
        </div>
      </footer>
    </div>
  );
}
