import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** `content` = 1152 px (lectura) · `wide` = 1400 px (header, paneles, footer). */
export function Container({ className, size = "content", ...props }: ComponentPropsWithoutRef<"div"> & { size?: "content" | "wide" }) {
  return <div className={cn(size === "wide" ? "container-wide" : "container-content", className)} {...props} />;
}
