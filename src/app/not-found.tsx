import { LinkButton } from "@/components/ui/LinkButton";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="text-3xl font-semibold">Esta página no existe</h1>
      <LinkButton href="/creacion-paginas-web-profesionales">Volver a botkor</LinkButton>
    </main>
  );
}
