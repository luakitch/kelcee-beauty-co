export const siteConfig = {
  name: "Kelcee Beauty Co.",
  logo: {
    src: "/logo.jpg",
    alt: "Kelcee Beauty Co. — Hair, Lashes, Brows",
  },
  tagline: "Hair, lashes & brows in Logansport, IN.",
  description:
    "Cuts, color, styling, extensions, lashes, and brows at 1030 N Third St. Book online anytime.",
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL ??
    "https://book.squareup.com/appointments/1s5oteiurlqsjl/location/L4RM80YTMFAKH/services",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://instagram.com/kelceebeautyco",
  phone: "(574) 516-7066",
  address: {
    street: "1030 N Third St",
    city: "Logansport",
    state: "IN",
    zip: "46947",
  },
  location: "Logansport, IN",
  hours: {
    monday: "3:30pm – 9pm",
    tuesday: "3:30pm – 9pm",
    wednesday: "3:30pm – 9pm",
    thursday: "9:00am – 9pm",
    friday: "9:00am – 9pm",
    saturday: "9:00am – 9pm",
    sunday: "Closed",
  },
  bookingPolicies: {
    deposit:
      "A 35% deposit is collected when you book and applied to your total at checkout.",
    cancellation: [
      "24-hour notice is required to cancel or reschedule.",
      "Less than 24 hours' notice: 50% of the service fee applies.",
      "No-call / no-show: full service charge before rebooking.",
    ],
    depositRefund:
      "24-hour notice is required to cancel. Deposits are not refunded if you cancel with less than 24 hours' notice.",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/book", label: "Book" },
] as const;

export type Service = {
  name: string;
  description: string;
  price: string;
  duration: string;
  category: ServiceCategory;
};

export type ServiceCategory =
  | "Cuts & Styling"
  | "Color"
  | "Treatments"
  | "Extensions"
  | "Lashes & Brows"
  | "Add-ons";

export const serviceCategories: ServiceCategory[] = [
  "Cuts & Styling",
  "Color",
  "Treatments",
  "Extensions",
  "Lashes & Brows",
  "Add-ons",
];

/** Synced from Square Appointments — kelceebeauty.co */
export const services: Service[] = [
  {
    name: "Women's Haircut",
    description: "Shampoo, cut, and blow-dry style.",
    price: "$25",
    duration: "1 hr",
    category: "Cuts & Styling",
  },
  {
    name: "Women's Dry Cut",
    description: "Precision cut without a wash.",
    price: "$18",
    duration: "30 min",
    category: "Cuts & Styling",
  },
  {
    name: "Men's Cut",
    description: "Men's haircut and style.",
    price: "$20",
    duration: "30 min",
    category: "Cuts & Styling",
  },
  {
    name: "Kid's Cut",
    description: "Haircut for children.",
    price: "$15",
    duration: "40 min",
    category: "Cuts & Styling",
  },
  {
    name: "Bang Trim",
    description: "Quick fringe touch-up.",
    price: "$5",
    duration: "15 min",
    category: "Cuts & Styling",
  },
  {
    name: "Wash & Style",
    description: "Shampoo and styled finish.",
    price: "$20",
    duration: "1 hr 30 min",
    category: "Cuts & Styling",
  },
  {
    name: "Style (curls only)",
    description: "Heat styling — curls only, no cut or color.",
    price: "$10",
    duration: "10 min",
    category: "Cuts & Styling",
  },
  {
    name: "Hair Updo",
    description: "Formal or special-event updo styling.",
    price: "$50",
    duration: "1 hr",
    category: "Cuts & Styling",
  },
  {
    name: "Balayage",
    description: "Hand-painted highlights for a natural, blended look.",
    price: "$115",
    duration: "3 hr",
    category: "Color",
  },
  {
    name: "Full Highlight",
    description: "Full-head highlight service.",
    price: "$100",
    duration: "3 hr",
    category: "Color",
  },
  {
    name: "Partial Highlight",
    description: "Partial-head highlight service.",
    price: "$80",
    duration: "3 hr",
    category: "Color",
  },
  {
    name: "All-Over Color",
    description: "Single-process color from roots to ends.",
    price: "$90",
    duration: "2 hr 30 min",
    category: "Color",
  },
  {
    name: "Root Touch-Up",
    description: "Color refresh at the roots.",
    price: "$65",
    duration: "2 hr",
    category: "Color",
  },
  {
    name: "Mini Foil (10–15 foils)",
    description: "Partial foil highlights — 10 to 15 foils.",
    price: "$50",
    duration: "1 hr 30 min",
    category: "Color",
  },
  {
    name: "Money Piece",
    description: "Face-framing highlight around the front.",
    price: "$40",
    duration: "1 hr",
    category: "Color",
  },
  {
    name: "Glaze",
    description: "Semi-permanent color gloss for shine and tone.",
    price: "$30",
    duration: "1 hr",
    category: "Color",
  },
  {
    name: "Conditioning Treatment",
    description: "Deep conditioning to restore moisture and strength.",
    price: "$25",
    duration: "1 hr",
    category: "Treatments",
  },
  {
    name: "Malibu Treatment",
    description: "Clarifying treatment to remove buildup and hard-water minerals.",
    price: "$30",
    duration: "1 hr",
    category: "Treatments",
  },
  {
    name: "Hair Extensions",
    description: "Extension installation — consult recommended for custom pricing.",
    price: "$150",
    duration: "2 hr",
    category: "Extensions",
  },
  {
    name: "Hair Extensions Move-Up (per row)",
    description: "Maintenance move-up for existing extension rows.",
    price: "$40",
    duration: "1 hr",
    category: "Extensions",
  },
  {
    name: "Lash Lift & Tint",
    description: "Lift and tint for fuller-looking lashes.",
    price: "$50",
    duration: "1 hr",
    category: "Lashes & Brows",
  },
  {
    name: "Brow Wax & Tint",
    description: "Brow shaping with wax and tint.",
    price: "$18",
    duration: "15 min",
    category: "Lashes & Brows",
  },
  {
    name: "Tinsel (per bead)",
    description: "Hair tinsel applied per bead.",
    price: "$2",
    duration: "30 min",
    category: "Add-ons",
  },
];

export const featuredServiceNames = [
  "Women's Haircut",
  "Balayage",
  "Full Highlight",
  "Lash Lift & Tint",
  "Brow Wax & Tint",
  "Wash & Style",
] as const;

export function getFeaturedServices(): Service[] {
  return featuredServiceNames
    .map((name) => services.find((service) => service.name === name))
    .filter((service): service is Service => service !== undefined);
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return services.filter((service) => service.category === category);
}

export function getFullAddress(): string {
  const { street, city, state, zip } = siteConfig.address;
  return `${street}, ${city}, ${state} ${zip}`;
}

/** Ordered Mon–Sun for display components */
export const hoursSchedule = [
  { label: "Monday", hours: siteConfig.hours.monday },
  { label: "Tuesday", hours: siteConfig.hours.tuesday },
  { label: "Wednesday", hours: siteConfig.hours.wednesday },
  { label: "Thursday", hours: siteConfig.hours.thursday },
  { label: "Friday", hours: siteConfig.hours.friday },
  { label: "Saturday", hours: siteConfig.hours.saturday },
  { label: "Sunday", hours: siteConfig.hours.sunday },
] as const;

export function getMapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getFullAddress())}`;
}

export function getPhoneHref(): string {
  return `tel:${siteConfig.phone.replace(/\D/g, "")}`;
}
