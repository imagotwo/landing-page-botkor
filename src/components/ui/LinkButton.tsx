import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export const buttonStyles = (variant: ButtonVariant = "primary", size: "md" | "lg" = "md") =>
  cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-60",
    size === "lg" ? "h-13 px-7 text-base" : "h-11 px-5 text-sm",
    variant === "primary" &&
      "bg-accent text-accent-ink shadow-[0_0_0_1px_rgb(139_245_200/0.4),0_10px_40px_-10px_rgb(139_245_200/0.6)] hover:bg-accent-strong hover:shadow-[0_0_0_1px_rgb(139_245_200/0.6),0_14px_50px_-8px_rgb(139_245_200/0.8)] active:scale-[0.98]",
    variant === "secondary" &&
      "border border-line-strong bg-white/[0.03] text-fg backdrop-blur hover:border-white/30 hover:bg-white/[0.07]",
    variant === "ghost" && "text-muted hover:text-fg",
  );

type LinkButtonProps = ComponentPropsWithoutRef<"a"> & { variant?: ButtonVariant; size?: "md" | "lg" };

export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <a className={cn(buttonStyles(variant, size), className)} {...props} />;
}
