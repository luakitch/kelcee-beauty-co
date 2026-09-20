export const siteConfig = {
  name: "Kelcee Beauty Co.",
  logo: {
    src: "/logo.jpg",
    alt: "Kelcee Beauty Co. — Hair, Lashes, Brows",
  },
  tagline: "Hair, lashes & brows in Logansport, IN.",
  description:
    "Professional hair services — cuts, color, styling, and more.",
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL ??
    "https://book.squareup.com/appointments/1s5oteiurlqsjl/location/L4RM80YTMFAKH/services",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://instagram.com/kelceebeautyco",
  location: "Logansport, IN",
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
  { href: "/book", label: "Book" },
] as const;

export const services = [
  {
    name: "Cut & Style",
    description:
      "Precision cuts tailored to your face shape, finished with a blowout or styled finish.",
    price: "From $65",
  },
  {
    name: "Lived-In Color",
    description:
      "Balayage, highlights, and root melts designed to grow out naturally.",
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
      "Updos, curls, and styled looks for weddings, photoshoots, and special events.",
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
      "Not sure where to start? Book a complimentary consult to discuss your goals.",
    price: "Free",
  },
] as const;
