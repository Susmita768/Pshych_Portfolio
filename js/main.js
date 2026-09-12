/* ==========================================================================
   main.js — Shared interactions used across pages
   ========================================================================== */

/* ---- Editorial Section Choreography ---- */
function primeSection(section) {
  if (!section) return;
  section.classList.remove("is-revealed", "is-visible");
  const children = section.querySelectorAll(
    ".reveal-heading, .reveal-eyebrow, .reveal-text, .reveal-card, .reveal-cta, .hero-actions, .hero-badge, .specialty-card, .service-detail, .booking-path-card, .booking-single-card, .roadmap-step, .faq-item, .contact-form-card, .contact-info-card, .trust-strip, .reflective-panel, .cta-banner, .hero-portrait, .about-portrait, .btn-connect, [data-reveal]"
  );
  children.forEach((el) => {
    el.classList.remove("is-revealed", "is-visible");
  });
}

function choreographSection(section, baseDelay = 0) {
  if (!section) return;

  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReduced) {
    section.classList.add("is-revealed", "is-visible");
    section.querySelectorAll(
      ".reveal-heading, .reveal-eyebrow, .reveal-text, .reveal-card, .reveal-cta, .hero-actions, .hero-badge, .specialty-card, .service-detail, .booking-path-card, .booking-single-card, .roadmap-step, .faq-item, .contact-form-card, .contact-info-card, .trust-strip, .reflective-panel, .cta-banner, .hero-portrait, .about-portrait, .btn-connect, [data-reveal]"
    ).forEach((el) => el.classList.add("is-revealed", "is-visible"));
    return;
  }

  // Mark container as revealed
  section.classList.add("is-revealed", "is-visible");

  // 1. Eyebrows and badges: 0ms + baseDelay
  const eyebrows = section.querySelectorAll(".reveal-eyebrow, .hero-badge, .section-head .eyebrow, .about-body .eyebrow");
  eyebrows.forEach((el) => {
    setTimeout(() => el.classList.add("is-revealed", "is-visible"), baseDelay);
  });

  // 2. Headings rising from clipped mask: 80ms + baseDelay
  const headings = section.querySelectorAll(
    ".reveal-heading, .section-head h1, .section-head h2, .section-head h3, .hero-copy h1, .about-body h1, .about-body h2, .orientation-title"
  );
  headings.forEach((el) => {
    setTimeout(() => el.classList.add("is-revealed", "is-visible"), baseDelay + 80);
  });

  // 3. Supporting paragraphs and lede text: 150ms + baseDelay
  const texts = section.querySelectorAll(
    ".reveal-text, .section-head p, .hero-lead, .hero-sub, .lede, .about-body p, .orientation-subtitle, .orientation-note, .reassurance-note"
  );
  texts.forEach((el) => {
    setTimeout(() => el.classList.add("is-revealed", "is-visible"), baseDelay + 150);
  });

  // 4. Cards, compound items, grid items, and portraits: 220ms + idx * 70ms stagger
  const cards = section.querySelectorAll(
    ".reveal-card, .specialty-card, .service-detail, .booking-path-card, .booking-single-card, .roadmap-step, .faq-item, .contact-form-card, .contact-info-card, .hero-portrait, .about-portrait, .trust-strip, .reflective-panel, .philosophy-col, .certificate-item, .graduation-photo-wrap"
  );
  cards.forEach((card, idx) => {
    setTimeout(() => card.classList.add("is-revealed", "is-visible"), baseDelay + 220 + idx * 70);
  });

  // 5. CTAs, buttons, and stats settling smoothly after cards
  const actions = section.querySelectorAll(".reveal-cta, .hero-actions, .hero-stats, .cta-banner, .btn-primary, .btn-secondary, .btn-connect");
  const ctaDelay = baseDelay + 220 + Math.min(cards.length, 5) * 70 + 60;
  actions.forEach((el) => {
    setTimeout(() => el.classList.add("is-revealed", "is-visible"), ctaDelay);
  });
}

/* ---- Scroll reveal observer ---- */
function initScrollReveal() {
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sections = document.querySelectorAll("section.wrap, .page-hero, [data-reveal]");
  if (!sections.length) return;

  if (isReduced || !("IntersectionObserver" in window)) {
    sections.forEach((s) => choreographSection(s, 0));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          choreographSection(entry.target, 0);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  sections.forEach((s) => {
    if (!s.classList.contains("is-revealed")) {
      observer.observe(s);
    }
  });
}

/* ---- Page Arrival Reveal (Entry choreography on page load) ---- */
function initPageArrivalReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (!window.location.hash) {
    const hero = document.querySelector(".hero, .page-hero, .about-section, main > section:first-of-type");
    if (hero) {
      primeSection(hero);
      setTimeout(() => {
        choreographSection(hero, 40);
      }, 50);
    }
  }
}

/* ---- Smooth Glide Anchor Navigation & Continuous Reveal ---- */
function initAnchorNavigation() {
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function findAnchorTarget(hash) {
    if (!hash || hash === "#" || hash === "#main") return null;

    try {
      const direct = document.querySelector(hash);
      if (direct) return direct;
    } catch (e) {}

    const clean = hash.replace("#", "").toLowerCase();
    if (clean === "areas" || clean === "specialties") {
      return document.getElementById("specialties") || document.getElementById("specialtyGrid");
    }
    if (clean === "services") {
      return document.getElementById("services") || document.getElementById("servicesDetail") || document.getElementById("specialties");
    }
    if (clean === "faq") {
      return document.getElementById("faq") || document.getElementById("faqList");
    }
    if (clean === "booking") {
      return document.getElementById("booking") || document.querySelector(".booking-path-grid") || document.querySelector(".cta-banner");
    }
    if (clean === "contact") {
      return document.getElementById("contact") || document.getElementById("contactForm") || document.querySelector(".contact-grid");
    }
    if (clean === "about") {
      return document.getElementById("about") || document.querySelector(".about-grid") || document.querySelector(".reflective-panel");
    }
    return null;
  }

  function getTargetScrollY(target) {
    const header = document.querySelector(".site-header");
    const headerH = header ? header.offsetHeight : 70;
    const rect = target.getBoundingClientRect();
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    return Math.max(0, Math.round(rect.top + currentScrollY - (headerH + 20)));
  }

  function smoothGlide(targetY, onApproaching, onSettled) {
    if (isReduced) {
      window.scrollTo(0, targetY);
      if (onApproaching) onApproaching();
      if (onSettled) onSettled();
      return;
    }

    const startY = window.pageYOffset || document.documentElement.scrollTop;
    const distance = targetY - startY;

    if (Math.abs(distance) < 8) {
      if (onApproaching) onApproaching();
      if (onSettled) onSettled();
      return;
    }

    // Duration scales with distance for an unhurried, luxury glide: 640ms to 880ms
    const duration = Math.min(880, Math.max(640, Math.abs(distance) * 0.46));
    let startTime = null;
    let approachingFired = false;

    // Quartic ease-out deceleration curve
    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(currentTime) {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeVal = easeOutQuart(progress);

      window.scrollTo(0, Math.round(startY + distance * easeVal));

      // Trigger reveal as destination approaches viewport (38% progress)
      if (progress >= 0.38 && !approachingFired) {
        approachingFired = true;
        if (onApproaching) onApproaching();
      }

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        if (!approachingFired && onApproaching) onApproaching();
        if (onSettled) onSettled();
      }
    }

    requestAnimationFrame(step);
  }

  function executeSectionGlideAndReveal(target, hash) {
    const targetY = getTargetScrollY(target);

    // Prime the section to unrevealed state so the reveal is cleanly visible
    primeSection(target);

    if (history.pushState && hash) {
      history.pushState(null, "", hash);
    }

    // Smoothly glide to the target and fire the reveal sequence on approach
    smoothGlide(
      targetY,
      () => {
        choreographSection(target, 0);
      },
      () => {
        target.classList.add("is-revealed", "is-visible");
      }
    );
  }

  // Intercept anchor clicks
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href*='#']");
    if (!link) return;

    const hrefAttr = link.getAttribute("href");
    if (!hrefAttr || hrefAttr === "#") return;

    let targetUrl;
    try {
      targetUrl = new URL(link.href, window.location.href);
    } catch (err) {
      return;
    }

    // Only intercept if on the same page with a hash
    if (targetUrl.pathname === window.location.pathname && targetUrl.hash) {
      const target = findAnchorTarget(targetUrl.hash);
      if (target) {
        e.preventDefault();

        // Close mobile panel if open
        const mobilePanel = document.getElementById("mobilePanel");
        const mobileScrim = document.getElementById("mobileScrim");
        const navToggle = document.getElementById("navToggle");
        if (mobilePanel && mobilePanel.classList.contains("is-open")) {
          mobilePanel.classList.remove("is-open");
          if (mobileScrim) mobileScrim.classList.remove("is-open");
          if (navToggle) navToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }

        executeSectionGlideAndReveal(target, targetUrl.hash);
      }
    }
  });

  // Handle hash on page load/arrival
  if (window.location.hash) {
    const initialTarget = findAnchorTarget(window.location.hash);
    if (initialTarget) {
      setTimeout(() => {
        executeSectionGlideAndReveal(initialTarget, window.location.hash);
      }, 180);
    }
  }
}

/* ---- Areas grid (home page, built from data.js) ---- */
function initSpecialtyGrid() {
  const grid = document.getElementById("specialtyGrid");
  if (!grid) return;
  const items = window.SITE_DATA.areas;

  grid.innerHTML = items
    .map(
      (s, i) => `
    <article class="glass-card specialty-card reveal-card" data-reveal style="transition-delay:${i * 65}ms">
      <div class="icon-badge" aria-hidden="true">${s.icon}</div>
      <h4>${s.name}</h4>
      <p>${s.desc}</p>
      <a href="${window.SITE_BASE}booking?area=${s.slug}" class="card-cta" aria-label="${s.ctaText} — book a session about ${s.name}">
        <span>${s.ctaText}</span>
        <span aria-hidden="true" class="card-cta-arrow">→</span>
      </a>
    </article>
  `
    )
    .join("");
}

/* ---- Full services list (services.html) ---- */
function initServicesDetail() {
  const container = document.getElementById("servicesDetail");
  if (!container) return;
  const items = window.SITE_DATA.services;

  container.innerHTML = items
    .map(
      (s, i) => `
    <article class="glass service-detail reveal-card" data-reveal style="transition-delay:${i * 65}ms">
      <div>
        <div class="service-photo-frame">
          <img src="${window.SITE_BASE}${s.photo}" alt="${s.name} coaching session" />
        </div>
        <span class="eyebrow" style="margin-top:1.25rem;">Coaching Program 0${i + 1}</span>
        <h3 style="margin-top:0.4rem;font-size:clamp(1.3rem, 1.8vw, 1.7rem);">${s.name}</h3>
        <p style="margin-top:0.6rem;font-size:0.95rem;line-height:1.6;"><strong>Ideal for:</strong> ${s.forText}</p>
      </div>
      <div class="helps-with">
        <h5>Key Focus Areas</h5>
        <ul class="check-list">
          ${s.focus.map((h) => `<li><span class="check-icon" aria-hidden="true">✓</span><span>${h}</span></li>`).join("")}
        </ul>
        <div class="gain-line">
          <strong>Outcome:</strong> ${s.gain}
        </div>
        <a href="${window.SITE_BASE}booking?service=${s.slug}" class="btn btn-book" style="margin-top:1.4rem;" aria-label="Book a free clarity call for ${s.name}">
          Book Clarity Call for This →
        </a>
      </div>
    </article>
  `
    )
    .join("");
}

/* ---- FAQ accordion ---- */
function initFAQ() {
  const faqList = document.getElementById("faqList");
  if (!faqList) return;

  faqList.innerHTML = window.SITE_DATA.faqs
    .map(
      (f, i) => `
    <div class="faq-item reveal-card" data-index="${i}" data-reveal style="transition-delay: ${i * 55}ms">
      <div class="faq-q" role="button" tabindex="0" aria-expanded="false">
        <h4>${f.q}</h4>
        <span class="faq-toggle-icon chev" aria-hidden="true">
          <svg class="faq-svg" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <line class="faq-line-h" x1="3.5" y1="8" x2="12.5" y2="8" />
            <line class="faq-line-v" x1="8" y1="3.5" x2="8" y2="12.5" />
          </svg>
        </span>
      </div>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>
  `
    )
    .join("");

  faqList.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");

    function toggle() {
      const isOpen = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", String(isOpen));
      a.style.maxHeight = isOpen ? a.scrollHeight + "px" : "0px";
    }

    q.addEventListener("click", toggle);
    q.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });
}

/* ---- WhatsApp booking links (booking.html + any ?service=/?area= links) ---- */
function initWhatsAppBooking() {
  const links = document.querySelectorAll("[data-whatsapp-cta]");
  const wa = window.SITE_DATA.whatsapp;
  const params = new URLSearchParams(window.location.search);
  const context = params.get("service") || params.get("area");

  let defaultMsg = wa.defaultMessage;
  if (context) {
    const label = context.replace(/-/g, " ");
    defaultMsg = `Hi Kajal, I'd like to book my free 30-minute Clarity Call — I'm interested in ${label}.`;

    // If there is a context display mount on the booking page, show it
    const contextNotice = document.getElementById("bookingContextNotice");
    if (contextNotice) {
      contextNotice.innerHTML = `
        <div class="booking-context-tag" data-reveal>
          <span>Selected focus:</span> <strong>${label.charAt(0).toUpperCase() + label.slice(1)}</strong>
        </div>
      `;
    }
  }

  links.forEach((el) => {
    const customMsg = el.getAttribute("data-whatsapp-msg");
    const msg = customMsg || defaultMsg;
    const url = `https://wa.me/${wa.number}?text=${encodeURIComponent(msg)}`;
    el.setAttribute("href", url);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
}

/* ---- Certificate Lightbox ---- */
function initCertificateLightbox() {
  const modal = document.getElementById("certModal");
  if (!modal) return;
  const modalImg = document.getElementById("certModalImg");
  const modalCaption = document.getElementById("certModalCaption");
  const closeBtn = document.getElementById("certModalClose");

  function openModal(src, alt) {
    if (!modalImg || !modal) return;
    modalImg.src = src;
    modalImg.alt = alt || "Certificate";
    if (modalCaption) modalCaption.textContent = alt || "";
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".certificate-item, .graduation-photo-wrap, [data-cert-view]").forEach((el) => {
    el.addEventListener("click", () => {
      const img = el.querySelector("img") || el;
      if (img && img.src) {
        openModal(img.src, img.alt);
      }
    });
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "View larger certificate");
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const img = el.querySelector("img") || el;
        if (img && img.src) openModal(img.src, img.alt);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) closeModal();
  });
}

/* ---- Generic form status helper ---- */
function setStatus(el, type, message) {
  if (!el) return;
  el.textContent = message;
  el.className = `status-msg is-visible status-msg--${type}`;
}

/* ---- Contact form ---- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const status = document.getElementById("contactStatus");
  let isSubmitting = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions if already in-flight
    if (isSubmitting) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : "Send Orientation Message";

    // Gather all form fields using FormData so every named input/select/textarea is captured
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = typeof value === "string" ? value.trim() : value;
    });

    if (!data._subject) {
      data._subject = "New Orientation Inquiry — Kajal Kumari Life Coaching";
    }

    // Step 1: Validation
    if (!data.name || !data.mobile || !data.email || !data.currentlyAffecting) {
      setStatus(
        status,
        "error",
        "Please fill in your preferred name, mobile number, email address, and what's currently affecting your life."
      );
      const requiredFields = ["name", "mobile", "email", "currentlyAffecting"];
      for (const fieldName of requiredFields) {
        if (!data[fieldName] && form[fieldName]) {
          form[fieldName].focus();
          break;
        }
      }
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setStatus(status, "error", "Please enter a valid email address.");
      if (form.email) form.email.focus();
      return;
    }

    const phoneDigits = data.mobile.replace(/[^0-9]/g, "");
    if (phoneDigits.length < 6) {
      setStatus(status, "error", "Please enter a valid mobile number.");
      if (form.mobile) form.mobile.focus();
      return;
    }

    // Clear any previous error status
    if (status) {
      status.className = "status-msg";
      status.textContent = "";
    }

    // Step 2: Set loading state and lock submit button
    isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
      submitBtn.textContent = "Sending…";
    }

    // Send complete data to Formspree via AJAX
    const res = await window.WellnessAPI.submitContact(data);

    // Step 3: Handle Result
    if (res.ok) {
      // Show brief success confirmation on button
      if (submitBtn) {
        submitBtn.textContent = "✓ Message Sent";
      }
      setStatus(
        status,
        "success",
        "Thank you! Your details have been received successfully. Connecting you to WhatsApp…"
      );

      // Display the premium frosted glass success popup overlay
      const modal = document.getElementById("contactSuccessModal");
      if (modal) {
        modal.classList.add("is-active");
        modal.setAttribute("aria-hidden", "false");
      }

      // Reuse existing single source of truth for business WhatsApp number
      const waNumber = (window.SITE_DATA && window.SITE_DATA.whatsapp && window.SITE_DATA.whatsapp.number) || "919120192847";
      const waMsg = "Hi Kajal, I’ve just submitted the form on your website and would love to connect. Please let me know the next steps when convenient. Thank you!";
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`;

      // Allow 1.8 seconds for customer to read confirmation, then automatically redirect in the same tab
      setTimeout(() => {
        window.location.href = waUrl;
      }, 1800);
    } else {
      // Formspree failed or network error: restore button, preserve form values, show error
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
        submitBtn.textContent = originalBtnText;
      }
      setStatus(
        status,
        "error",
        res.error || "Unable to send your details right now. Please try again or reach out directly."
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSpecialtyGrid();
  initServicesDetail();
  initFAQ();
  initWhatsAppBooking();
  initCertificateLightbox();
  initContactForm();
  initScrollReveal();
  initAnchorNavigation();
  initPageArrivalReveal();

  // Re-run reveal observer for any content injected after initial load
  setTimeout(initScrollReveal, 80);
});
