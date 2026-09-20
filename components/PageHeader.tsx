import { BowDivider } from "@/components/BowAccent";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-charcoal sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-charcoal/70">{description}</p>
      )}
      <BowDivider className="mt-8" />
    </div>
  );
}
