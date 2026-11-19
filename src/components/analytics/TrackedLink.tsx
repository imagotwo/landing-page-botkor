"use client";

import type { ComponentPropsWithoutRef } from "react";
import { ButtonContent, buttonClass, type ButtonVariant } from "@/components/ui/LinkButton";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type TrackedLinkProps = ComponentPropsWithoutRef<"a"> & {
  event: string;
  eventParams?: Record<string, string>;
  variant?: ButtonVariant;
  block?: boolean;
  /** Sin estilo de botón: el consumidor controla el markup y las clases. */
  unstyled?: boolean;
};

/** Enlace con tracking de clic. Isla cliente mínima: la sección que lo contiene sigue siendo RSC. */
export function TrackedLink({ event, eventParams, variant, block, unstyled, className, onClick, children, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      className={unstyled ? className : cn(buttonClass(variant, block), className)}
      onClick={(e) => {
        trackEvent(event, eventParams);
        onClick?.(e);
      }}
    >
      {unstyled ? children : <ButtonContent>{children}</ButtonContent>}
    </a>
  );
}
