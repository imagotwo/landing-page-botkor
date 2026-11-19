import { ArrowRight } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "dark" | "brand" | "light" | "outline";

/** Clases del botón del sistema (definido en src/styles/components.css). */
export const buttonClass = (variant: ButtonVariant = "dark", block = false) =>
  cn("btn", variant !== "dark" && `btn--${variant}`, block && "btn--block");

/** Contenido estándar: etiqueta + caja de icono que se expande en hover. */
export function ButtonContent({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <>
      <span className="btn__label">{children}</span>
      <span className="btn__icon" aria-hidden="true">
        {icon ?? <ArrowRight strokeWidth={2.25} />}
      </span>
    </>
  );
}

type LinkButtonProps = ComponentPropsWithoutRef<"a"> & { variant?: ButtonVariant; block?: boolean };

export function LinkButton({ variant, block, className, children, ...props }: LinkButtonProps) {
  return (
    <a className={cn(buttonClass(variant, block), className)} {...props}>
      <ButtonContent>{children}</ButtonContent>
    </a>
  );
}
