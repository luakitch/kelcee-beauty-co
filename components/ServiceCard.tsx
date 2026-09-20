import { BowAccent } from "@/components/BowAccent";

type ServiceCardProps = {
  name: string;
  description: string;
  price: string;
};

export function ServiceCard({ name, description, price }: ServiceCardProps) {
  return (
    <article className="group rounded-2xl border border-blush-200/80 bg-white/70 p-6 shadow-sm transition hover:border-blush-300 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <BowAccent
          size={28}
          className="shrink-0 text-blush-300 transition group-hover:text-blush-400"
        />
        <span className="rounded-full bg-blush-100 px-3 py-1 text-sm font-medium text-blush-700">
          {price}
        </span>
      </div>
      <h3 className="font-display text-xl font-semibold text-charcoal">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{description}</p>
    </article>
  );
}
