import { siteConfig } from "@/lib/site-config";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg" | "hero";
  showName?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
  hero: "h-36 w-36 sm:h-44 sm:w-44",
} as const;

export function BrandLogo({
  size = "md",
  showName = true,
  className = "",
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={siteConfig.logo.src}
        alt={siteConfig.logo.alt}
        className={`${sizeClasses[size]} rounded-full object-cover shadow-sm ring-2 ring-blush-200/80`}
      />
      {showName && (
        <span
          className={`font-display font-semibold tracking-wide text-charcoal ${
            size === "hero"
              ? "sr-only"
              : size === "lg"
                ? "text-2xl"
                : size === "md"
                  ? "text-xl sm:text-2xl"
                  : "text-lg"
          }`}
        >
          {siteConfig.name}
        </span>
      )}
    </div>
  );
}
