type GlimmerOverlayProps = {
  className?: string;
};

/** Decorative light sweep — hidden from assistive tech. */
export function GlimmerOverlay({ className = "" }: GlimmerOverlayProps) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <span className="sale-glimmer-beam absolute inset-y-0 -left-1/2 w-[85%]" />
    </span>
  );
}
