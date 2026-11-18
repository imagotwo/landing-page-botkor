import { FeatureCard } from "@/components/ui/FeatureCard";
import { Section } from "@/components/ui/Section";
import { innovation } from "@/content/landing";

/** 6. Innovación tecnológica — solo H2 (los títulos de tarjeta son <p> para respetar la jerarquía exigida). */
export function Innovation() {
  return (
    <Section
      id={innovation.id}
      eyebrow={innovation.eyebrow}
      title={innovation.h2}
      intro={innovation.intro}
      className="border-y border-line bg-surface/30"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {innovation.items.map((item) => (
          <FeatureCard key={item.title} item={item} headingLevel="p" />
        ))}
      </div>
    </Section>
  );
}
