/* ==========================================================================
   data.js — Static site content
   --------------------------------------------------------------------------
   Placeholder/dummy content for Kajal Kumari, Life & Clarity Coach. The bio on
   the About page and the testimonials below are placeholders — swap in
   real copy, real client stories (with permission), and the real WhatsApp
   number before this site goes live. Once a backend exists,
   `WellnessAPI.fetchServices()` can source this from an endpoint instead.
   ========================================================================== */

window.SITE_DATA = {
  consultant: {
    name: "Kajal Kumari",
    title: "Life & Clarity Coach",
    tagline: "Life Coaching Practice",
  },

  // Official client WhatsApp number for booking and contact
  // Format: country code + number, no spaces or symbols.
  whatsapp: {
    number: "917808235383",
    defaultMessage: "Hi Kajal, I'd like to book my free 30-minute Clarity Call.",
  },

  // Home page — "Areas We Can Explore Together"
  areas: [
    {
      icon: "01",
      name: "Finding Clarity",
      slug: "clarity",
      desc: "Understand what you truly want and make decisions with greater confidence.",
      ctaText: "Let's talk",
    },
    {
      icon: "02",
      name: "Managing Overthinking & Worry",
      slug: "overthinking",
      desc: "Step out of repetitive thought patterns and create more mental space.",
      ctaText: "Let's talk",
    },
    {
      icon: "03",
      name: "Building Confidence & Self-Worth",
      slug: "confidence",
      desc: "Develop a stronger and more compassionate relationship with yourself.",
      ctaText: "Let's talk",
    },
    {
      icon: "04",
      name: "Navigating Stress & Emotional Overwhelm",
      slug: "stress",
      desc: "Understand what is weighing on you and respond with greater awareness.",
      ctaText: "Let's talk",
    },
    {
      icon: "05",
      name: "Moving Beyond Fear & Self-Doubt",
      slug: "fear-doubt",
      desc: "Recognize what holds you back and begin making choices with more courage.",
      ctaText: "Let's talk",
    },
    {
      icon: "06",
      name: "Improving Relationships & Communication",
      slug: "relationships",
      desc: "Understand your needs, boundaries, and patterns in relationships.",
      ctaText: "Let's talk",
    },
    {
      icon: "07",
      name: "Breaking Limiting Patterns",
      slug: "patterns",
      desc: "Recognize recurring behaviors and beliefs that may no longer serve you.",
      ctaText: "Let's talk",
    },
    {
      icon: "08",
      name: "Creating Work-Life Balance",
      slug: "balance",
      desc: "Build a way of living that gives space to both your ambitions and your wellbeing.",
      ctaText: "Let's talk",
    },
    {
      icon: "09",
      name: "Setting Aligned Goals",
      slug: "goals",
      desc: "Move toward goals that reflect who you are and what genuinely matters to you.",
      ctaText: "Let's talk",
    },
  ],

  // Services page — coaching packages
  services: [
    {
      icon: "01",
      name: "Self-Love & Confidence Coaching",
      slug: "self-love-confidence",
      photo: "assets/services/self-love-confidence-coaching.jpg",
      forText: "Self-doubt, low confidence, people-pleasing, and difficulty trusting yourself.",
      focus: ["Self-worth & confidence", "Fear and self-doubt", "Boundaries", "Positive self-awareness"],
      gain: "Greater confidence, self-trust, and a healthier relationship with yourself.",
    },
    {
      icon: "02",
      name: "Career Coaching",
      slug: "career",
      photo: "assets/services/career-coaching.jpg",
      forText: "Students and professionals feeling uncertain, stuck, or at a career crossroads.",
      focus: ["Career clarity & decisions", "Strengths, values & goals", "Career transitions", "Professional confidence"],
      gain: "Direction, confidence, and clarity about your next step.",
    },
    {
      icon: "03",
      name: "Corporate Coaching",
      slug: "corporate",
      photo: "assets/services/corporate-coaching.jpg",
      forText: "Professionals and leaders navigating workplace pressure, change, or communication challenges.",
      focus: ["Workplace confidence", "Communication", "Leadership & decision-making", "Stress and work-life balance"],
      gain: "Greater self-awareness, confidence, and effectiveness at work.",
    },
    {
      icon: "04",
      name: "Relationship Coaching",
      slug: "relationship",
      photo: "assets/services/relationship-coaching.jpg",
      forText: "Anyone wanting healthier, more fulfilling relationships.",
      focus: ["Communication", "Boundaries", "Relationship patterns", "Understanding your needs"],
      gain: "Greater clarity, healthier communication, and more intentional relationships.",
    },
  ],

  faqs: [
    {
      q: "What happens after I book a session?",
      a: "Once you message on WhatsApp, we'll find a time that works for you and confirm the details there. You'll get a reminder ahead of your session.",
    },
    {
      q: "Is the first session really free?",
      a: "Yes — the 30-minute Clarity Call is completely free, with no obligation. It's simply a chance to talk things through and see if coaching feels right for you.",
    },
    {
      q: "Are sessions online or in person?",
      a: "All sessions are conducted online, so you can join from wherever feels most comfortable for you.",
    },
    {
      q: "What if I'm not sure what I need help with?",
      a: "That's completely alright. Many clients start with the free Clarity Call simply to talk things through and figure it out together.",
    },
    {
      q: "Is everything I share confidential?",
      a: "Yes. Everything shared in our sessions stays private and confidential.",
    },
    {
      q: "Can I reschedule my session?",
      a: "Yes — just message on WhatsApp ahead of time and we'll find a new time that works for you.",
    },
    {
      q: "Who is coaching for?",
      a: "Coaching is for teens, working professionals, and couples — anyone who feels stuck, lacks clarity, or wants more confidence in their choices.",
    },
    {
      q: "How is life coaching different from therapy or medical treatment?",
      a: "Life coaching is forward-looking and developmental. We focus on building self-awareness, clarifying personal values, untangling overthinking, and establishing aligned action in your daily life, career, and relationships. Coaching is not clinical psychiatric care, medical treatment, or therapy.",
    },
  ],
};
