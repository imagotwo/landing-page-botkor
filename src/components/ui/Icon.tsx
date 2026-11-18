import {
  ArrowRight, Building2, Check, Code2, Cpu, Database, Factory, GraduationCap, Globe, Headset, HeartPulse,
  Layers, Plug, RefreshCw, ScanSearch, Search, ShieldCheck, ShoppingCart, SlidersHorizontal, Smartphone,
  Sparkles, Store, Target, TrendingUp, Workflow, Zap, type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/content/landing";
import { cn } from "@/lib/cn";

const ICONS: Record<IconName, LucideIcon> = {
  building: Building2, cart: ShoppingCart, target: Target, plug: Plug, workflow: Workflow, layers: Layers,
  code: Code2, scan: ScanSearch, shield: ShieldCheck, trending: TrendingUp, refresh: RefreshCw, headset: Headset,
  zap: Zap, smartphone: Smartphone, search: Search, sliders: SlidersHorizontal, heart: HeartPulse, store: Store,
  factory: Factory, graduation: GraduationCap, cpu: Cpu, globe: Globe, database: Database, sparkles: Sparkles,
};

/** Icono dentro de una "pastilla" con borde sutil. Decorativo: oculto para lectores de pantalla. */
export function IconBadge({ name, className }: { name: IconName; className?: string }) {
  const Cmp = ICONS[name];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-xl border border-line-strong bg-gradient-to-b from-white/[0.08] to-white/[0.02] text-accent",
        className,
      )}
    >
      <Cmp className="size-5" strokeWidth={1.75} />
    </span>
  );
}

export { ArrowRight, Check };
