/* ==========================================================================
   api.js — Backend integration layer
   --------------------------------------------------------------------------
   This is the ONLY file that should talk to a server. Every form/action in
   the site calls a function from `WellnessAPI` below instead of using
   fetch() directly, so wiring up a real backend later means editing THIS
   FILE ONLY — no other file needs to change.

   HOW TO CONNECT A REAL BACKEND:
   1. Set `CONFIG.API_BASE_URL` to your API's root (e.g. "https://api.yourdomain.com").
   2. Set `CONFIG.USE_MOCK = false`.
   3. Each function below already contains a commented-out `fetch(...)` call
      with the suggested REST contract (method, path, body, response shape).
      Uncomment it and delete the mock block above it.
   4. If you use an auth token / API key, add it in `buildHeaders()`.
   ========================================================================== */

const CONFIG = {
  // Root URL of your future backend API. Example: "https://api.kajalk.com"
  API_BASE_URL: "https://api.example.com/v1",

  // While true, every "API" call below resolves locally (localStorage +
  // simulated network delay) so the whole UI is fully testable with zero
  // backend. Flip to false once API_BASE_URL is live.
  USE_MOCK: true,

  // Simulated latency for mock responses, purely so loading states are visible.
  MOCK_DELAY_MS: 700,
};

function buildHeaders(extra = {}) {
  return {
    "Content-Type": "application/json",
    // "Authorization": `Bearer ${window.localStorage.getItem('auth_token') || ''}`,
    ...extra,
  };
}

function mockDelay(payload) {
  return new Promise((resolve) => setTimeout(() => resolve(payload), CONFIG.MOCK_DELAY_MS));
}

function readMockStore(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch (e) {
    return [];
  }
}

function writeMockStore(key, records) {
  window.localStorage.setItem(key, JSON.stringify(records));
}

const WellnessAPI = {
  /**
   * Submit a new booking.
   * @param {Object} data - { concern, duration, date, time, name, email, phone, notes }
   * @returns {Promise<{ ok: boolean, bookingId?: string, error?: string }>}
   */
  async submitBooking(data) {
    if (CONFIG.USE_MOCK) {
      const records = readMockStore("mock_bookings");
      const bookingId = "BK-" + Date.now().toString(36).toUpperCase();
      records.push({ ...data, bookingId, createdAt: new Date().toISOString(), status: "pending_confirmation" });
      writeMockStore("mock_bookings", records);
      return mockDelay({ ok: true, bookingId });
    }

    // --- REAL BACKEND CONTRACT -------------------------------------------
    // POST {API_BASE_URL}/bookings
    // body: { concern, duration, date, time, name, email, phone, notes }
    // response 201: { bookingId, status }
    //
    // try {
    //   const res = await fetch(`${CONFIG.API_BASE_URL}/bookings`, {
    //     method: "POST",
    //     headers: buildHeaders(),
    //     body: JSON.stringify(data),
    //   });
    //   if (!res.ok) throw new Error(`Booking failed (${res.status})`);
    //   const json = await res.json();
    //   return { ok: true, bookingId: json.bookingId };
    // } catch (err) {
    //   return { ok: false, error: err.message };
    // }
  },

  /**
   * Fetch available time slots for a given date + duration.
   * Falls back to a deterministic mock schedule so the wizard always has data.
   * @param {string} dateISO - "YYYY-MM-DD"
   * @param {number} durationMinutes
   * @returns {Promise<{ ok: boolean, slots: {time: string, available: boolean}[] }>}
   */
  async fetchAvailability(dateISO, durationMinutes) {
    if (CONFIG.USE_MOCK) {
      const baseSlots = ["09:00", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
      // Deterministic "randomness" from the date string, so it's stable per day.
      const seed = dateISO.split("-").reduce((a, c) => a + parseInt(c, 10), 0);
      const slots = baseSlots.map((time, i) => ({
        time,
        available: (seed + i) % 4 !== 0,
      }));
      return mockDelay({ ok: true, slots });
    }

    // --- REAL BACKEND CONTRACT -------------------------------------------
    // GET {API_BASE_URL}/availability?date=YYYY-MM-DD&duration=30
    // response 200: { slots: [{ time: "09:00", available: true }, ...] }
    //
    // try {
    //   const url = `${CONFIG.API_BASE_URL}/availability?date=${dateISO}&duration=${durationMinutes}`;
    //   const res = await fetch(url, { headers: buildHeaders() });
    //   if (!res.ok) throw new Error(`Could not load availability (${res.status})`);
    //   const json = await res.json();
    //   return { ok: true, slots: json.slots };
    // } catch (err) {
    //   return { ok: false, slots: [], error: err.message };
    // }
  },

  /**
   * Submit the contact / orientation form directly to Formspree via AJAX.
   * Endpoint: https://formspree.io/f/xyeyvqqz
   * @param {Object} data - Complete key-value pairs from the form
   * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
   */
  async submitContact(data) {
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xyeyvqqz";
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status === 429) {
        return {
          ok: false,
          status: 429,
          error: "Too many requests right now. Please wait a few minutes and try again.",
        };
      }

      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        return { ok: true, data: json };
      }

      let errorMsg = "Unable to send your details right now. Please try again or reach out directly.";
      try {
        const errJson = await res.json();
        if (errJson && errJson.errors && Array.isArray(errJson.errors) && errJson.errors.length > 0) {
          errorMsg = errJson.errors.map((e) => e.message || e.field).join(", ");
        } else if (errJson && errJson.error) {
          errorMsg = errJson.error;
        }
      } catch (parseErr) {
        // fallback
      }
      return { ok: false, error: errorMsg };
    } catch (networkErr) {
      return {
        ok: false,
        error: "A network error occurred. Please check your connection and try again.",
      };
    }
  },



  /**
   * Process payment for a booking (card / UPI) or record a "pay at session" choice.
   * @param {Object} data - { bookingId, method: "card"|"upi"|"later", amount, cardName?, cardLast4?, upiId? }
   * @returns {Promise<{ ok: boolean, transactionId?: string, error?: string }>}
   */
  async processPayment(data) {
    if (CONFIG.USE_MOCK) {
      if (data.method === "later") {
        return mockDelay({ ok: true, transactionId: null });
      }
      const records = readMockStore("mock_payments");
      const transactionId = "TXN-" + Date.now().toString(36).toUpperCase();
      records.push({ ...data, transactionId, createdAt: new Date().toISOString() });
      writeMockStore("mock_payments", records);
      return mockDelay({ ok: true, transactionId });
    }

    // --- REAL BACKEND CONTRACT -------------------------------------------
    // POST {API_BASE_URL}/payments
    // body: { bookingId, method, amount, cardName?, cardLast4?, upiId? }
    // NOTE: never send full card/CVV numbers to your own backend directly —
    // integrate a PCI-compliant processor (Stripe, Razorpay, etc.) on the
    // frontend via their hosted fields/SDK, then send only the resulting
    // payment token here.
    // response 201: { transactionId, status }
    //
    // try {
    //   const res = await fetch(`${CONFIG.API_BASE_URL}/payments`, {
    //     method: "POST",
    //     headers: buildHeaders(),
    //     body: JSON.stringify(data),
    //   });
    //   if (!res.ok) throw new Error(`Payment failed (${res.status})`);
    //   const json = await res.json();
    //   return { ok: true, transactionId: json.transactionId };
    // } catch (err) {
    //   return { ok: false, error: err.message };
    // }
  },

  /**
   * Fetch the list of specialties/services. Currently reads the static
   * array in js/data.js — swap for a real endpoint once services are
   * managed from a CMS/admin panel.
   */
  async fetchServices() {
    if (CONFIG.USE_MOCK) {
      return mockDelay({ ok: true, services: window.SITE_DATA?.specialties || [] });
    }

    // --- REAL BACKEND CONTRACT -------------------------------------------
    // GET {API_BASE_URL}/services
    // response 200: { services: [...] }
    //
    // try {
    //   const res = await fetch(`${CONFIG.API_BASE_URL}/services`, { headers: buildHeaders() });
    //   if (!res.ok) throw new Error(`Could not load services (${res.status})`);
    //   const json = await res.json();
    //   return { ok: true, services: json.services };
    // } catch (err) {
    //   return { ok: false, services: [], error: err.message };
    // }
  },
};

window.WellnessAPI = WellnessAPI;
window.APP_CONFIG = CONFIG;
