import Image from "next/image";
import type { ContentFigure } from "@/lib/content-schema";
import type { Locale } from "@/lib/locale";

type ContentFigureViewProps = {
  locale: Locale;
  priority?: boolean;
} & (
  | { figure: ContentFigure; visual?: never }
  | { visual: ContentFigure; figure?: never }
);

export function ContentFigureView(props: ContentFigureViewProps) {
  const { locale, priority = false } = props;
  const figure: ContentFigure = "visual" in props && props.visual ? props.visual : props.figure!;
  const isScreenshot = figure.kind === "screenshot";

  return (
    <figure
      id={figure.id}
      data-content-figure={figure.id}
      data-figure-kind={figure.kind}
      data-screenshot-data-mode={isScreenshot ? figure.dataMode : undefined}
      data-screenshot-app-version={isScreenshot ? figure.appVersion : undefined}
      className="my-8 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]"
    >
      <div
        className={`relative overflow-hidden ${
          isScreenshot ? "bg-[var(--surface-strong)]" : "aspect-video"
        }`}
      >
        <Image
          src={figure.src}
          width={figure.width}
          height={figure.height}
          sizes="(max-width: 768px) calc(100vw - 2rem), 768px"
          alt={figure.alt[locale]}
          priority={priority}
          className={isScreenshot ? "block h-auto w-full object-contain" : "block h-full w-full object-cover"}
        />
      </div>
      <figcaption className="border-t border-[var(--line)] px-4 py-3 text-sm leading-6 text-[var(--muted)] sm:px-5">
        {figure.caption[locale]}
      </figcaption>
    </figure>
  );
}
