import type { FeatureItem } from "@/content/landing";
import { cn } from "@/lib/cn";
import { Check, IconBadge } from "./Icon";

interface FeatureCardProps {
  item: FeatureItem;
  /** "h3" solo cuando la jerarquía de la página lo exige; si no, el título es un <p> para no alterar el outline. */
  headingLevel?: "h3" | "p";
  className?: string;
}

export function FeatureCard({ item, headingLevel = "h3", className }: FeatureCardProps) {
  const Title = headingLevel;
  return (
    <article
      className={cn(
        "card-glow reveal flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface/80 p-6 transition-colors duration-300 hover:bg-surface-2 sm:p-7",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <IconBadge name={item.icon} />
        {item.tag ? (
          <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] tracking-wide text-muted">
            {item.tag}
          </span>
        ) : null}
      </div>
      <Title className="mt-6 text-lg font-semibold leading-snug text-fg">{item.title}</Title>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.description}</p>
      {item.bullets?.length ? (
        <ul className="mt-6 space-y-2.5 border-t border-line pt-5" role="list">
          {item.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-fg/90">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.25} />
              {b}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
