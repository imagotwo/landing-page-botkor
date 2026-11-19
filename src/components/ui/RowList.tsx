import type { FeatureItem } from "@/content/landing";
import { cn } from "@/lib/cn";
import { Check, IconBadge } from "./Icon";

/**
 * Lista editorial en filas (patrón "services list" de la referencia):
 * [ título H3 | descripción | detalle ] con bordes de 2 px y entrada por escala.
 */
export function RowList({ items, aside = "index", className }: { items: readonly FeatureItem[]; aside?: "index" | "tag" | "bullets"; className?: string }) {
  return (
    <ul className={cn("row-list", className)} role="list">
      {items.map((item, i) => (
        <li key={item.title} data-reveal="row" style={{ "--i": i } as React.CSSProperties}>
          <article className="group grid gap-x-10 gap-y-4 py-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)_minmax(0,0.6fr)] md:items-start md:py-9">
            <div className="flex items-start gap-4">
              <IconBadge name={item.icon} className="mt-0.5 hidden shrink-0 transition-transform duration-300 group-hover:-rotate-6 sm:inline-flex" />
              <h3 className="t-title text-fg">{item.title}</h3>
            </div>
            <p className="t-body text-muted">{item.description}</p>
            <div className="md:justify-self-end md:text-right">
              {aside === "index" ? (
                <span className="font-display text-sm font-semibold text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              ) : null}
              {aside === "tag" && item.tag ? (
                <span className="link-underline text-fg">
                  {item.tag}
                  <span aria-hidden="true" className="text-accent">+</span>
                </span>
              ) : null}
              {aside === "bullets" && item.bullets?.length ? (
                <ul className="space-y-2 md:inline-block md:text-left" role="list">
                  {item.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-fg">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.25} />
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
