import { cache, Fragment, type ReactNode } from "react";
import type { Locale } from "@/lib/locale";
import type { DocPage } from "@/lib/docs-content";
import type { ContentFigure, ContentSource } from "@/lib/content-schema";

type PublishedLocale = {
  title: string;
  description: string;
  marker: string;
  bodyMarkdown?: string;
};

export type PublishedDocSummary = {
  slug: string;
  version: string;
  updatedAt: string;
  groupId: "get-started" | "core-concepts" | "scenario-guides" | "support";
  navOrder: number;
  revision: string;
  locales: Record<Locale, PublishedLocale>;
};

type PublishedVisual = Omit<ContentFigure, "src"> & { src: string; assetId: string; evidence?: Record<string, unknown> };

type PublishedDoc = PublishedDocSummary & {
  sources: ContentSource[];
  visuals: PublishedVisual[];
};

const h2 = "mt-10 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-2xl";
const p = "mt-4 text-[0.95rem] leading-8 text-[var(--muted)]";
const ul = "mt-4 list-disc space-y-2 pl-6 text-[0.95rem] leading-8 text-[var(--muted)]";
const ol = "mt-4 list-decimal space-y-2 pl-6 text-[0.95rem] leading-8 text-[var(--muted)]";
const tip = "mt-5 rounded-2xl border border-[rgba(239,123,67,0.25)] bg-[rgba(239,123,67,0.06)] px-4 py-3 text-sm leading-7 text-[var(--foreground)]";

function contentApiBase() {
  return (
    process.env.MOTICLAW_SITE_CONTENT_API_BASE_URL ||
    process.env.MOTICLAW_SITE_AUTH_API_BASE_URL ||
    process.env.MOTICLAW_CLOUD_BACKEND_URL ||
    "https://api.moticlaw.com"
  ).replace(/\/$/, "");
}

async function getJson(path: string) {
  try {
    const response = await fetch(`${contentApiBase()}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5_000),
    });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

export const getPublishedDocsIndex = cache(async (): Promise<PublishedDocSummary[]> => {
  const payload = await getJson("/v1/site-content/docs");
  return Array.isArray(payload?.items) ? payload.items : [];
});

export const getPublishedDoc = cache(async (slug: string): Promise<DocPage | undefined> => {
  const payload = await getJson(`/v1/site-content/docs/${encodeURIComponent(slug)}`);
  const doc = payload?.document as PublishedDoc | undefined;
  if (!doc?.locales?.zh?.bodyMarkdown || !doc?.locales?.en?.bodyMarkdown) return undefined;
  const visuals = doc.visuals.map(normalizeVisual);
  return {
    slug: doc.slug,
    revision: doc.revision,
    updatedAt: doc.updatedAt,
    version: doc.version,
    visuals,
    sources: doc.sources,
    title: { zh: doc.locales.zh.title, en: doc.locales.en.title },
    description: { zh: doc.locales.zh.description, en: doc.locales.en.description },
    content: {
      zh: renderRestrictedMarkdown(doc.locales.zh.bodyMarkdown, "zh", visuals),
      en: renderRestrictedMarkdown(doc.locales.en.bodyMarkdown, "en", visuals),
    },
  };
});

function normalizeVisual(visual: PublishedVisual): ContentFigure {
  if (visual.kind === "screenshot") {
    const evidence = visual.evidence ?? {};
    return {
      id: visual.id,
      kind: "screenshot",
      src: visual.src,
      width: visual.width,
      height: visual.height,
      alt: visual.alt,
      caption: visual.caption,
      capturedAt: String(evidence.capturedAt ?? ""),
      appVersion: String(evidence.appVersion ?? ""),
      dataMode: evidence.dataMode === "live-public" ? "live-public" : "synthetic",
      scenarioId: optionalString(evidence.scenarioId),
      fixtureVersion: optionalString(evidence.fixtureVersion),
      fixtureSha256: optionalString(evidence.fixtureSha256),
      productGitDirty: false,
      productGitSha: optionalString(evidence.productGitSha),
    };
  }
  return { ...visual, kind: "concept" };
}

function renderRestrictedMarkdown(markdown: string, locale: Locale, visuals: readonly ContentFigure[]): ReactNode {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(<h2 className={h2} key={`h-${index}`}>{renderInline(line.slice(3))}</h2>);
      index += 1;
      continue;
    }
    if (line === ":::tip") {
      const body: string[] = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== ":::") body.push(lines[index++].trim());
      index += 1;
      nodes.push(<div className={tip} key={`tip-${index}`}>{renderInline(body.join(" "))}</div>);
      continue;
    }
    const figureMatch = line.match(/^\{\{figure:([a-z0-9][a-z0-9-]{0,119})\}\}$/);
    if (figureMatch) {
      const figure = visuals.find((item) => item.id === figureMatch[1]);
      if (figure) nodes.push(<PublishedFigure figure={figure} locale={locale} key={`figure-${figure.id}`} />);
      index += 1;
      continue;
    }
    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^-\s+/.test(lines[index].trim())) items.push(lines[index++].trim().replace(/^-\s+/, ""));
      nodes.push(<ul className={ul} key={`ul-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ul>);
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) items.push(lines[index++].trim().replace(/^\d+\.\s+/, ""));
      nodes.push(<ol className={ol} key={`ol-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ol>);
      continue;
    }
    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index].trim())) paragraph.push(lines[index++].trim());
    nodes.push(<p className={p} key={`p-${index}`}>{renderInline(paragraph.join(" "))}</p>);
  }
  return <>{nodes}</>;
}

function isBlockStart(line: string) {
  return line.startsWith("## ") || line === ":::tip" || /^\{\{figure:/.test(line) || /^-\s+/.test(line) || /^\d+\.\s+/.test(line);
}

function renderInline(value: string): ReactNode[] {
  const pieces = value.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return pieces.map((piece, index) => {
    if (piece.startsWith("**") && piece.endsWith("**")) return <strong className="font-semibold text-[var(--foreground)]" key={index}>{piece.slice(2, -2)}</strong>;
    if (piece.startsWith("`") && piece.endsWith("`")) return <code key={index}>{piece.slice(1, -1)}</code>;
    return <Fragment key={index}>{piece}</Fragment>;
  });
}

function PublishedFigure({ figure, locale }: { figure: ContentFigure; locale: Locale }) {
  return (
    <figure
      id={figure.id}
      data-content-figure={figure.id}
      data-figure-kind={figure.kind}
      data-screenshot-data-mode={figure.kind === "screenshot" ? figure.dataMode : undefined}
      data-screenshot-app-version={figure.kind === "screenshot" ? figure.appVersion : undefined}
      className="my-8 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]"
    >
      <div className={figure.kind === "screenshot" ? "bg-[var(--surface-strong)]" : "aspect-video overflow-hidden"}>
        {/* eslint-disable-next-line @next/next/no-img-element -- API content assets are immutable runtime URLs. */}
        <img src={figure.src} width={figure.width} height={figure.height} alt={figure.alt[locale]} className={figure.kind === "screenshot" ? "block h-auto w-full object-contain" : "block h-full w-full object-cover"} />
      </div>
      <figcaption className="border-t border-[var(--line)] px-4 py-3 text-sm leading-6 text-[var(--muted)] sm:px-5">{figure.caption[locale]}</figcaption>
    </figure>
  );
}

function optionalString(value: unknown) {
  return typeof value === "string" && value ? value : undefined;
}
