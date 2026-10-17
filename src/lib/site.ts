export const site = {
  name: "Chinwoke Mbadinuju Foundation",
  shortName: "CMF",
  tagline: "Ideas. People. Communities. A Better Tomorrow.",
  description:
    "The Chinwoke Mbadinuju Foundation advances Christian literature, education and community development while preserving a legacy of faith, knowledge and service.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cm.foundation",
  founded: 2012,
  contact: {
    email: "hello@cm.foundation",
    phone: "+234 81 5675 2002",
    phoneHref: "tel:+2348156752002",
    hours: "Mon – Fri, 9:00am – 5:00pm (WAT)",
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
      email: "partnerships@cm.foundation",
      body: "For organisations, institutions and strategic partnerships.",
      icon: "handshake",
    },
    {
      title: "Media & Press",
      email: "media@cm.foundation",
      body: "For media enquiries, interviews and press materials.",
      icon: "document",
    },
    {
      title: "Events",
      email: "events@cm.foundation",
      body: "For information on upcoming events and past events.",
      icon: "calendar",
    },
  ],
  // TODO(client): replace with the Foundation's real profile URLs.
  social: [
    { label: "Facebook", icon: "facebook", href: "https://facebook.com/" },
    { label: "X", icon: "x", href: "https://x.com/" },
    { label: "Instagram", icon: "instagram", href: "https://instagram.com/" },
    { label: "YouTube", icon: "youtube", href: "https://youtube.com/" },
    { label: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/" },
  ],
} as const;

export const nav = [
  { label: "About", href: "/about" },
  { label: "The Founder", href: "/founder" },
  { label: "Literature", href: "/literature" },
  { label: "Our Work", href: "/our-work" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerExplore = [{ label: "Home", href: "/" }, ...nav, { label: "Support the Mission", href: "/support" }] as const;

export const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Donation Policy", href: "/donation-policy" },
] as const;
