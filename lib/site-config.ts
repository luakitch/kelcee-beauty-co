export const siteConfig = {
  name: "Kelcee Beauty Co.",
  logo: {
    src: "/logo.jpg",
    alt: "Kelcee Beauty Co. — Hair, Lashes, Brows",
  },
  tagline: "Soft color. Sweet styles. Salon magic.",
  description:
    "A boutique hair studio specializing in lived-in color, soft styling, and that perfect pink-pastel glow.",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://instagram.com/kelceebeautyco",
  email: "hello@kelceebeautyco.com",
  phone: "(555) 123-4567",
  location: "Your City, ST",
  hours: {
    weekdays: "Tuesday – Friday: 10am – 6pm",
    saturday: "Saturday: 9am – 3pm",
    sunday: "Sunday & Monday: Closed",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const services = [
  {
    name: "Cut & Style",
    description:
      "Precision cuts tailored to your face shape, finished with a soft blowout or effortless waves.",
    price: "From $65",
  },
  {
    name: "Lived-In Color",
    description:
      "Balayage, highlights, and root melts that grow out beautifully — never harsh, always dreamy.",
    price: "From $150",
  },
  {
    name: "Gloss & Tone",
    description:
      "Refresh your color with a glossy finish that adds shine, dimension, and that salon-fresh feel.",
    price: "From $45",
  },
  {
    name: "Special Occasion",
    description:
      "Updos, soft curls, and styled looks for weddings, photoshoots, and your big moments.",
    price: "From $85",
  },
  {
    name: "Treatment & Repair",
    description:
      "Deep conditioning and bond-building treatments to keep your hair healthy and happy.",
    price: "From $35",
  },
  {
    name: "Consultation",
    description:
      "Not sure where to start? Book a complimentary consult to chat color, cut, and vibe.",
    price: "Free",
  },
] as const;
