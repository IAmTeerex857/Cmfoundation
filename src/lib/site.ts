export const site = {
  name: "Chinwoke Mbadinuju Foundation",
  shortName: "CMF",
  tagline: "Uplifting Humanity, Advancing God's Work.",
  description:
    "The Chinwoke Mbadinuju Foundation preserves and shares a legacy of faith, knowledge and service through literature, educational assistance and practical acts of goodwill.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cm.foundation",
  founded: 2012,
  contact: {
    email: "hello@cm.foundation",
    phone: "+234 81 5675 2002",
    phoneHref: "tel:+2348156752002",
    officeName: "CMF Head Office",
    location: "Otunba Kayode Close, Asokoro, Abuja FCT",
    mapsUrl: "https://maps.app.goo.gl/x88tX91qnFFyN3Aw6?g_st=aw",
    mapsEmbedUrl: "https://www.google.com/maps?cid=10588573318859507519&output=embed",
  },
  contactPoints: [
    {
      title: "CMF Head Office",
      email: "hello@cm.foundation",
      phone: "+234 81 5675 2002",
      body: "General enquiries and Foundation matters.",
      icon: "building",
    },
    {
      title: "Partnerships & Collaboration",
      enquiry: "partnership",
      body: "For organisations, institutions and strategic partnerships.",
      icon: "handshake",
    },
    {
      title: "Media & Press",
      enquiry: "media",
      body: "For media enquiries, interviews and press materials.",
      icon: "document",
    },
    {
      title: "Events",
      enquiry: "events",
      body: "For information on upcoming events and past events.",
      icon: "calendar",
    },
  ],
  // The Foundation's social profiles, shown in the footer and on the contact page once they exist, e.g.
  //   { label: "Facebook", icon: "facebook", href: "https://facebook.com/<page>" }
  // Icons available: facebook, x, instagram, youtube, linkedin. Empty: no icons are shown.
  social: [] as { label: string; icon: "facebook" | "x" | "instagram" | "youtube" | "linkedin"; href: string }[],
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "The Founder", href: "/founder" },
  { label: "Literature", href: "/literature" },
  { label: "Our Work", href: "/our-work" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerExplore = [...nav, { label: "Support the Mission", href: "/support" }, { label: "Your Reader Account", href: "/reader" }] as const;

export const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Donation Policy", href: "/donation-policy" },
] as const;
