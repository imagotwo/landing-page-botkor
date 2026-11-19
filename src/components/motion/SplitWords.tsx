import { Fragment } from "react";

/**
 * Divide un texto en palabras envueltas para animarlas (máscara + subida).
 * Server Component: el HTML conserva el texto íntegro con sus espacios,
 * así que SEO, lectores de pantalla y JSON-LD ven exactamente la misma frase.
 * Se divide por palabras (no por letras) para no romper la lectura en VoiceOver.
 */
export function SplitWords({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="split-w">
            <span style={{ "--wi": i + offset } as React.CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
