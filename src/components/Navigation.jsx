import { useEffect, useRef, useState } from "react";
import { Arrow, Brand, ExternalLink } from "./Editorial";
import { contactUrl, navigationLinks, socialLinks } from "../data/socialLinks";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const previousOverflow = useRef("");
  const nextFocus = useRef(null);

  function openMenu() {
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current.showModal();
    setIsOpen(true);
    closeRef.current.focus();
  }

  function closeMenu() {
    document.body.style.overflow = previousOverflow.current;
    dialogRef.current.close();
    setIsOpen(false);
  }

  function restoreFocus() {
    document.body.style.overflow = previousOverflow.current;
    setIsOpen(false);
    const target =
      nextFocus.current ||
      (window.matchMedia("(min-width: 768px)").matches
        ? document.querySelector(".desktop-nav a")
        : triggerRef.current);
    target?.focus({ preventScroll: true });
    nextFocus.current = null;
  }

  function navigate(event, href) {
    event.preventDefault();
    const heading = document.querySelector(`${href} h2`);
    if (heading) heading.tabIndex = -1;
    nextFocus.current = heading;
    closeMenu();
    window.location.hash = href;
  }

  function trapFocus(event) {
    if (event.key !== "Tab") return;
    const focusable = [
      ...dialogRef.current.querySelectorAll("a[href], button"),
    ];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = (event) => {
      if (event.matches && dialogRef.current.open) closeMenu();
    };
    desktop.addEventListener("change", onResize);
    return () => {
      desktop.removeEventListener("change", onResize);
      if (dialogRef.current?.open)
        document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  return (
    <header className="site-header wrap">
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigationLinks.map((link) => (
          <a href={link.href} key={link.href} className={link.href === "#contact" ? "nav-contact" : undefined}>
            {link.label}
          </a>
        ))}
      </nav>
      <button
        ref={triggerRef}
        className="menu-toggle"
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={openMenu}
      >
        <span />
        <span />
      </button>
      <noscript>
        <style>
          {
            ".menu-toggle{display:none!important}.site-header noscript{width:100%}"
          }
        </style>
        <nav className="mobile-fallback-nav" aria-label="Mobile navigation">
          {navigationLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </noscript>
      <ExternalLink className="quick-contact" href={contactUrl} aria-label="Contact Zenim on WhatsApp (opens in a new tab)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16v12H9l-5 3V5Z" stroke="currentColor" strokeWidth="1.5" /><path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.5" /></svg>
        <span className="quick-contact-label" aria-hidden="true">LET’S TALK ↗</span>
      </ExternalLink>
      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="mobile-menu"
        aria-label="Navigation"
        onClose={restoreFocus}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onKeyDown={trapFocus}
      >
        <div className="menu-masthead">
          <span className="menu-brand">
            ZENIM<span>.</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            className="menu-close"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <span />
            <span />
          </button>
        </div>
        <p className="menu-index-label">The journal / Index</p>
        <nav className="menu-links" aria-label="Explore the portfolio">
          {[navigationLinks.find((link) => link.href === "#contact"), ...navigationLinks.filter((link) => link.href !== "#contact")].map((link, index) => (
            <a
              href={link.href}
              key={link.href}
              onClick={(event) => navigate(event, link.href)}
              style={{ "--menu-order": index }}
            >
              <span className="menu-link-number">0{index + 1}</span>
              <span>{link.label}</span>
              <Arrow />
            </a>
          ))}
        </nav>
        <div className="menu-bottom">
          <p>
            Ideas into useful
            <br />
            <em>places on the web.</em>
          </p>
          <div className="menu-socials">
            {socialLinks.map((link) => (
              <ExternalLink href={link.url} key={link.label}>
                {link.label} ↗
              </ExternalLink>
            ))}
          </div>
        </div>
      </dialog>
    </header>
  );
}
