"use client";

import type { ComponentPropsWithoutRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { buttonStyles, type ButtonVariant } from "@/components/ui/LinkButton";
import { cn } from "@/lib/cn";

type TrackedLinkProps = ComponentPropsWithoutRef<"a"> & {
  event: string;
  eventParams?: Record<string, string>;
  variant?: ButtonVariant;
  size?: "md" | "lg";
  unstyled?: boolean;
};

/** Enlace con tracking de clic. Es una isla cliente mínima: el resto de la sección sigue siendo RSC. */
export function TrackedLink({ event, eventParams, variant, size, unstyled, className, onClick, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      className={unstyled ? className : cn(buttonStyles(variant, size), className)}
      onClick={(e) => {
        trackEvent(event, eventParams);
        onClick?.(e);
      }}
    />
  );
}
