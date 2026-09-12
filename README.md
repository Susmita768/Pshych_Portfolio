# Kajal Kumari — Life & Clarity Coaching Portfolio (Frontend)

A premium, glassmorphic, calm-first portfolio site for a life coaching
practice. Pure HTML/CSS/JS — no build step, no dependencies.

## ⚠️ Clean URLs — must be served by a web server, and not all servers give slash-free URLs

This site uses folder-based routing (`about/index.html`, etc.) with
**root-relative paths** everywhere. Getting `/about` to load *without*
Node/Apache/Netlify adding a trailing slash requires the server to
rewrite `/about` → `about/index.html` internally — plain directory
listing servers can't do that, they can only redirect (`/about` →
`/about/`), which is a different, slash-having URL.

- **It will NOT work correctly if you just double-click `index.html`**
  and open it via `file://` — root-relative paths starting with `/`
  only resolve correctly when served by an actual web server.
- **VS Code "Live Server" and Python's `python3 -m http.server`
  do NOT support this rewrite.** Both will show `/about/` (with the
  slash) in the address bar for this project's structure — that's a
  limitation of those tools, not a bug in the site. Neither reads
  `.htaccess`, `_redirects`, or `serve.json`.
- **To test slash-free URLs locally**, run `npx serve` from this
  folder instead — it reads `serve.json` (included) and will serve
  `/about`, `/services`, `/booking`, `/contact` with no trailing
  slash, matching production.
- **In production:** Netlify reads `_redirects` and Apache reads
  `.htaccess` (both included) to do the same internal rewrite, so
  `/about` etc. resolve with no trailing slash and no redirect on
  those hosts. Vercel needs an equivalent `vercel.json` rewrites
  block, which isn't included yet — ask if you deploy there.

## Pages

| URL          | File                  | Purpose                                            |
|--------------|------------------------|-----------------------------------------------------|
| `/`          | `index.html`           | Home — hero, "What Is Life Coaching?", areas we can explore |
| `/about/`    | `about/index.html`     | Kajal's story & certifications — **bio text pending, photos/certs are real** |
| `/services/` | `services/index.html`  | The 4 coaching packages (Self-Love & Confidence, Career, Corporate, Relationship) |
| `/booking/`  | `booking/index.html`   | WhatsApp booking CTA + FAQ                            |
| `/contact/`  | `contact/index.html`   | Contact form + contact details                        |

## Structure

```
psych-portfolio/
├── index.html                       # Home (root)
├── about/index.html
├── services/index.html
├── booking/index.html
├── contact/index.html
├── .htaccess                        # Apache: legacy .html → clean URL redirects
├── _redirects                       # Netlify: same, for Netlify hosting
├── css/
│   ├── style.css      # design tokens (client's color palette), base styles, nav, footer, forms
│   └── pages.css      # hero, cards, booking CTA, FAQ, contact, about
├── js/
│   ├── data.js         # ALL site content (areas, services, FAQs, WhatsApp number...)
│   ├── api.js           # ⭐ the ONE file to edit to connect a real backend (contact form / newsletter only)
│   ├── components.js    # shared header/footer, injected on every page
│   └── main.js           # scroll reveal, area/services grids, FAQ, WhatsApp links, contact form
└── assets/
    ├── kajal/            # Kajal's real photos (portrait, about-portrait, cta-photo, etc.)
    ├── certificates/      # Real certificate scans
    └── services/          # Service-package photos
```

## Booking flow

Booking is handled entirely through WhatsApp. `booking/index.html` has a
button with the `data-whatsapp-cta` attribute; `main.js`
(`initWhatsAppBooking`) builds the `wa.me` link from `SITE_DATA.whatsapp`
in `js/data.js`.

**Before launch:** open `js/data.js` and replace the placeholder
`whatsapp.number` with the real business WhatsApp number (country code +
number, no spaces/symbols).

## What to swap before launch

- **WhatsApp number** — `js/data.js` → `whatsapp.number` (currently a
  placeholder).
- **About page bio** — `about/index.html` has a clearly-marked placeholder
  note. Replace it with Kajal's real, full story once received.
- **Contact details** — footer (`js/components.js`) and
  `contact/index.html` currently use a placeholder email/WhatsApp number.
- **Content** — areas, services, and FAQs all live in `js/data.js` in one
  place.

## Connecting a real backend

The contact form and newsletter signup go through **`js/api.js`** and
nothing else. To go live:

1. Open `js/api.js`.
2. Set `CONFIG.API_BASE_URL` to your server's URL.
3. Set `CONFIG.USE_MOCK = false`.
4. Each function (`submitContact`, `subscribeNewsletter`, `fetchServices`)
   already has a commented-out `fetch()` call with the suggested REST
   contract — uncomment it and delete the mock block above it.

Until then, the contact form runs fully standalone: messages are stored in
`localStorage` (`mock_contacts`) so you can test the flow with zero backend.

## Notes on design

- Color palette: charcoal (#4A4A4A), light grey (#CBCBCB), pale cream
  (#FFFFE3), and dusty blue (#6D8196) — the client's provided combination.
  Every other shade in the CSS is a tint or shade of these four.
- Typography: Fraunces (display) + Plus Jakarta Sans (body/UI).
- Respects `prefers-reduced-motion`, has visible focus states, and a skip
  link on every page.
- Fully responsive: single-column collapse under ~900px, mobile nav drawer
  under ~860px. Mobile also disables `backdrop-filter`/blur effects for
  smoother scrolling on lower-powered devices.
