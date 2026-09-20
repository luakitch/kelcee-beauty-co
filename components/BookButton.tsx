import { siteConfig } from "@/lib/site-config";

type BookButtonProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3 text-base",
  lg: "px-9 py-4 text-lg",
};

export function BookButton({ className = "", size = "md" }: BookButtonProps) {
  return (
    <a
      href={siteConfig.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-blush-500 font-medium text-white shadow-md transition hover:bg-blush-600 hover:shadow-lg ${sizeClasses[size]} ${className}`}
    >
      <InstagramIcon />
      Book on Instagram
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
