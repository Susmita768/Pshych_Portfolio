/* ==========================================================================
   main.js — Shared interactions used across pages
   ========================================================================== */

/* ---- Scroll reveal ---- */
function initScrollReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---- Areas grid (home page, built from data.js) ---- */
function initSpecialtyGrid() {
  const grid = document.getElementById("specialtyGrid");
  if (!grid) return;
  const items = window.SITE_DATA.areas;

  grid.innerHTML = items
    .map(
      (s, i) => `
    <article class="glass-card specialty-card" data-reveal style="transition-delay:${i * 60}ms">
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
    <div class="glass service-detail" data-reveal style="transition-delay:${i * 50}ms">
      <div>
        <div class="service-photo-frame">
          <img src="${window.SITE_BASE}${s.photo}" alt="${s.name}" />
        </div>
        <h3 style="margin-top:1.1rem;">${s.name}</h3>
        <p style="margin-top:0.6rem;"><strong>For:</strong> ${s.forText}</p>
      </div>
      <div class="helps-with">
        <h5>We'll focus on</h5>
        <ul class="check-list">
          ${s.focus.map((h) => `<li><span aria-hidden="true">•</span>${h}</li>`).join("")}
        </ul>
        <p class="gain-line"><strong>You'll gain:</strong> ${s.gain}</p>
        <a href="${window.SITE_BASE}booking?service=${s.slug}" class="btn btn-book" style="margin-top:1.3rem;">Book for this →</a>
      </div>
    </div>
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
    <div class="faq-item" data-index="${i}">
      <div class="faq-q" role="button" tabindex="0" aria-expanded="false">
        <h4>${f.q}</h4>
        <span class="chev" aria-hidden="true">+</span>
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
  if (!links.length) return;
  const wa = window.SITE_DATA.whatsapp;
  const params = new URLSearchParams(window.location.search);
  const context = params.get("service") || params.get("area");

  let message = wa.defaultMessage;
  if (context) {
    const label = context.replace(/-/g, " ");
    message = `Hi Kajal, I'd like to book my free 30-minute Clarity Call — I'm interested in ${label}.`;
  }

  const url = `https://wa.me/${wa.number}?text=${encodeURIComponent(message)}`;
  links.forEach((el) => el.setAttribute("href", url));
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const data = {
      title: form.title.value.trim(),
      name: form.name.value.trim(),
      address: form.address.value.trim(),
      mobile: form.mobile.value.trim(),
      altContact: form.altContact.value.trim(),
      email: form.email.value.trim(),
      occupation: form.occupation.value.trim(),
      dob: form.dob.value,
      maritalStatus: form.maritalStatus.value,
      spouseName: form.spouseName.value.trim(),
      numChildren: form.numChildren.value,
      childrenDetails: form.childrenDetails.value.trim(),
      referredBy: form.referredBy.value.trim(),
      valueSystem: form.valueSystem.value.trim(),
      fiveValues: form.fiveValues.value.trim(),
      currentlyAffecting: form.currentlyAffecting.value.trim(),
      copingWith: form.copingWith.value.trim(),
      supportNeeded: form.supportNeeded.value.trim(),
    };

    if (!data.name || !data.mobile || !data.email || !data.currentlyAffecting) {
      setStatus(status, "error", "Please fill in your name, mobile number, email, and what's currently affecting your life.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    const res = await window.WellnessAPI.submitContact(data);

    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";

    if (res.ok) {
      setStatus(status, "success", "Thank you — your message has been received. I'll reply within 1–2 business days.");
      form.reset();
    } else {
      setStatus(status, "error", res.error || "Something went wrong. Please try again.");
    }
  });
}

/* ---- Newsletter form ---- */
function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;
  const status = document.getElementById("newsletterStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email) return;
    const res = await window.WellnessAPI.subscribeNewsletter(email);
    if (res.ok) {
      setStatus(status, "success", "You're on the list — updates coming your way.");
      form.reset();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initSpecialtyGrid();
  initServicesDetail();
  initFAQ();
  initWhatsAppBooking();
  initContactForm();
  initNewsletterForm();

  // Re-run reveal observer for any content injected after initial load
  setTimeout(initScrollReveal, 50);
});
