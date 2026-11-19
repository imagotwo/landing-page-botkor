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

/** Icono lineal en el color de acento de la superficie. Decorativo (aria-hidden). */
export function IconBadge({ name, className }: { name: IconName; className?: string }) {
  const Cmp = ICONS[name];
  return (
    <span aria-hidden="true" className={cn("icon-box", className)}>
      <Cmp />
    </span>
  );
}

export { ArrowRight, Check };
