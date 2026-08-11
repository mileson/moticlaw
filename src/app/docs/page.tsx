import type { Metadata } from "next";
import { headers } from "next/headers";
import { detectLocale, type Locale } from "@/lib/locale";
import { getDocPage } from "@/lib/docs-content";
import { DocsLayout } from "@/components/docs-layout";

type DocsSearchParams = Promise<{ lang?: string }>;

function resolveLocale(langParam: string | undefined, acceptLanguage: string | null): Locale {
  if (langParam === "en") return "en";
  if (langParam === "zh") return "zh";
  return detectLocale(acceptLanguage);
}

export async function generateMetadata({ searchParams }: { searchParams: DocsSearchParams }): Promise<Metadata> {
  const { lang } = await searchParams;
  const requestHeaders = await headers();
  const locale = resolveLocale(lang, requestHeaders.get("accept-language"));
  const doc = getDocPage("index");
  const title = locale === "zh" ? "产品文档 - MotiClaw" : "Documentation - MotiClaw";

  const canonical = lang === "zh" || lang === "en" ? `/docs?lang=${lang}` : "/docs";

  return {
    title,
    description: doc?.description[locale],
    alternates: {
      canonical,
      languages: {
        "zh-CN": "/docs?lang=zh",
        en: "/docs?lang=en",
        "x-default": "/docs",
      },
    },
    openGraph: {
      type: "website",
      url: "/docs",
      siteName: "MotiClaw",
      title,
      description: doc?.description[locale],
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MotiClaw" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: doc?.description[locale],
      images: ["/og-image.jpg"],
    },
  };
}

export default async function DocsIndexPage({ searchParams }: { searchParams: DocsSearchParams }) {
  const { lang } = await searchParams;
  const requestHeaders = await headers();
  const locale = resolveLocale(lang, requestHeaders.get("accept-language"));
  const doc = getDocPage("index")!;
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: doc.title[locale],
    description: doc.description[locale],
    url: "https://www.moticlaw.com/docs",
    isPartOf: { "@type": "WebSite", name: "MotiClaw", url: "https://www.moticlaw.com" },
  };

  return (
    <DocsLayout locale={locale} activeSlug="index">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c") }}
      />
      <header>
        <p className="section-eyebrow-lg mb-3">{locale === "zh" ? "产品文档" : "Documentation"}</p>
        <h1 className="display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">{doc.title[locale]}</h1>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">{doc.description[locale]}</p>
        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          {locale === "zh" ? "更新于 " : "Updated "}
          <time dateTime={doc.updatedAt}>{formatDate(doc.updatedAt, locale)}</time>
          <span aria-hidden="true"> · </span>
          {locale === "zh" ? `文档版本 ${doc.version}` : `Doc version ${doc.version}`}
        </p>
      </header>
      {doc.content[locale]}
    </DocsLayout>
  );
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}
