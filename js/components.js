/* ==========================================================================
   components.js — Shared header, footer & ambient background
   --------------------------------------------------------------------------
   Every page includes three empty mount points:
     <div id="site-header"></div>, <div id="ambient-mount"></div>,
     <div id="site-footer"></div>
   This file fills them from ONE template, so nav/footer edits happen here
   only, and every page stays in sync automatically.
   ========================================================================== */

/* Works out how deep the current page is nested (root vs. /about/, /services/,
   etc.) and returns the correct relative prefix ("" or "../") to get back to
   the site root — WITHOUT assuming the site is served from the domain root.
   This means the whole site keeps working correctly whether it's opened at
   http://localhost:8000/, or nested under something like
   http://127.0.0.1:5500/psych-portfolio/ (e.g. VS Code Live Server). */
function computeSiteBase() {
  const knownSubpages = ["about", "services", "booking", "contact", "privacy-policy", "terms-of-service"];
  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments[segments.length - 1] === "index.html") segments.pop();
  const last = segments[segments.length - 1];
  return knownSubpages.includes(last) ? "../" : "./";
}
window.SITE_BASE = computeSiteBase();

const NAV_LINKS = [
  { href: window.SITE_BASE, label: "Home" },
  { href: window.SITE_BASE + "about", label: "About" },
  { href: window.SITE_BASE + "services", label: "Services" },
  { href: window.SITE_BASE + "booking", label: "Booking" },
  { href: window.SITE_BASE + "contact", label: "Contact" },
];

function currentPage() {
  const knownSubpages = ["about", "services", "booking", "contact", "privacy-policy", "terms-of-service"];
  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments[segments.length - 1] === "index.html") segments.pop();
  const last = segments[segments.length - 1];
  return knownSubpages.includes(last) ? last : "home";
}

/* Matches a NAV_LINKS entry's href (which ends in "/" or "about/" etc.)
   against the currentPage() segment name, independent of the SITE_BASE
   prefix used to build it. */
function isActiveLink(href, page) {
  if (page === "home") return href === window.SITE_BASE;
  return href === window.SITE_BASE + page;
}

function renderAmbient() {
  const mount = document.getElementById("ambient-mount");
  if (!mount) return;

  mount.innerHTML = `
    <div class="ambient-orbs" aria-hidden="true">
      <div class="orb orb--1"></div>
      <div class="orb orb--2"></div>
      <div class="orb orb--3"></div>
    </div>
  `;
}

function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const page = currentPage();

  const desktopLinks = NAV_LINKS.map(
    (l) => `<a href="${l.href}" class="${isActiveLink(l.href, page) ? "is-active" : ""}">${l.label}</a>`
  ).join("");

  const mobileLinks = NAV_LINKS.map(
    (l) => `<a href="${l.href}" class="${isActiveLink(l.href, page) ? "is-active" : ""}">${l.label}</a>`
  ).join("");

  mount.innerHTML = `
    <header class="site-header">
      <div class="mobile-scrim" id="mobileScrim" aria-hidden="true"></div>
      <div class="wrap">
        <div class="nav-shell">
          <a href="${window.SITE_BASE}" class="brand" aria-label="${window.SITE_DATA.consultant.name} Home">
            <img src="${window.SITE_BASE}assets/kajal/portrait.jpg" alt="${window.SITE_DATA.consultant.name}" class="brand-mark" width="40" height="40" decoding="async" />
            <span class="brand-text">
              <strong>${window.SITE_DATA.consultant.name}</strong>
              <span>${window.SITE_DATA.consultant.title}</span>
            </span>
          </a>
          <nav class="nav-links" aria-label="Primary navigation">${desktopLinks}</nav>
          <div class="nav-cta">
            <a href="${window.SITE_BASE}booking" class="btn btn-primary">
              <span class="long">Let's talk →</span><span class="short">Talk</span>
            </a>
            <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mobilePanel" aria-label="Open menu">
              <svg id="navToggleIcon" viewBox="0 0 24 24" aria-hidden="true">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <nav class="mobile-panel" id="mobilePanel" aria-label="Mobile navigation">
          <div class="mobile-panel-head">
            <span class="mobile-panel-title">Menu</span>
            <button class="mobile-panel-close" id="mobilePanelClose" aria-label="Close menu">✕</button>
          </div>
          <div class="mobile-panel-links">${mobileLinks}</div>
          <a href="${window.SITE_BASE}booking" class="btn btn-primary btn-block mobile-panel-cta">
            Book Free Clarity Call →
          </a>
        </nav>
      </div>
    </header>
  `;

  const toggle = document.getElementById("navToggle");
  const closeBtn = document.getElementById("mobilePanelClose");
  const panel = document.getElementById("mobilePanel");
  const scrim = document.getElementById("mobileScrim");
  const icon = document.getElementById("navToggleIcon");

  function openMenu() {
    panel.classList.add("is-open");
    scrim.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    if (icon) {
      icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
    }
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    panel.classList.remove("is-open");
    scrim.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    if (icon) {
      icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
    }
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", () => {
    panel.classList.contains("is-open") ? closeMenu() : openMenu();
  });
  closeBtn.addEventListener("click", closeMenu);
  scrim.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) closeMenu();
  });
  panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  syncHeaderHeight();
}

/* Keeps the fixed header from ever overlapping page content, regardless of
   how tall it renders at a given viewport/font size. */
function syncHeaderHeight() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  let lastH = 0;
  let ticking = false;

  const apply = () => {
    const h = header.offsetHeight + 10;
    if (Math.abs(h - lastH) >= 1) {
      lastH = h;
      document.documentElement.style.setProperty("--header-h", h + "px");
    }
  };

  apply();

  window.addEventListener("resize", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        apply();
        // Ensure mobile menu properly resets if resized to desktop
        if (window.innerWidth > 820) {
          const panel = document.getElementById("mobilePanel");
          const scrim = document.getElementById("mobileScrim");
          const toggle = document.getElementById("navToggle");
          if (panel && panel.classList.contains("is-open")) {
            panel.classList.remove("is-open");
            if (scrim) scrim.classList.remove("is-open");
            if (toggle) toggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  const year = new Date().getFullYear();

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-shell">
          <div class="footer-grid">
            <div class="footer-col footer-col--brand">
              <div class="footer-brand-row">
                <img src="${window.SITE_BASE}assets/kajal/portrait.jpg" alt="${window.SITE_DATA.consultant.name}" class="footer-photo" width="52" height="52" loading="lazy" decoding="async" />
                <span class="brand-text">
                  <strong>${window.SITE_DATA.consultant.name}</strong>
                  <span>${window.SITE_DATA.consultant.title}</span>
                </span>
              </div>
              <p class="footer-tagline">A calm, confidential space to gain clarity, confidence, and move forward with intention.</p>
              <a href="mailto:Feelheard2@gmail.com">Feelheard2@gmail.com</a>
              <a href="https://wa.me/917808235383" target="_blank" rel="noopener noreferrer">+91 78082 35383 (WhatsApp)</a>
              <p class="footer-address">Online mind & clarity coaching<br/>Available worldwide</p>
            </div>
            <div class="footer-col">
              <h5>Navigation</h5>
              ${NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join("")}
            </div>
            <div class="footer-col">
              <h5>Get Started</h5>
              <a href="${window.SITE_BASE}booking">Book a Clarity Call</a>
              <a href="${window.SITE_BASE}services">Coaching Services</a>
              <a href="${window.SITE_BASE}booking#faq">Frequently Asked Questions</a>
              <a href="${window.SITE_BASE}contact">Orientation & Contact Form</a>
            </div>
            <div class="footer-col footer-col--legal">
              <h5>Legal & Safety</h5>
              <a href="${window.SITE_BASE}privacy-policy">Privacy Policy</a>
              <a href="${window.SITE_BASE}terms-of-service">Terms of Service</a>
              <a href="${window.SITE_BASE}contact">Client Inquiries</a>
            </div>
          </div>

          <div class="footer-disclaimer">
            <strong>Coaching Disclaimer:</strong> Coaching provided by Kajal Kumari is focused on personal growth, self-worth, decision-making, and emotional clarity. It is not medical diagnosis, psychiatric care, or clinical psychotherapy. If you are experiencing a mental health emergency, please reach out to licensed healthcare or emergency services.
          </div>

          <div class="footer-bottom">
            <span>© ${year} ${window.SITE_DATA.consultant.name}. All rights reserved.</span>
            <div class="footer-bottom-links">
              <a href="${window.SITE_BASE}privacy-policy">Privacy Policy</a>
              <a href="${window.SITE_BASE}terms-of-service">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Certificate Lightbox Modal Mount -->
    <div id="certModal" class="cert-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Certificate Viewer">
      <div class="cert-modal-dialog">
        <button class="cert-modal-close" id="certModalClose" aria-label="Close certificate viewer">✕</button>
        <img src="" alt="" class="cert-modal-img" id="certModalImg" />
        <div class="cert-modal-caption" id="certModalCaption"></div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderAmbient();
  renderHeader();
  renderFooter();
});
