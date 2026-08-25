import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/locale";
import { getDocPage } from "@/lib/docs-content";
import { DocsLayout } from "@/components/docs-layout";
import { resolveSeoLocale, type SeoSearchParams } from "@/components/seo-resource-locale";
import { getCanonicalPath, getLanguageAlternates, toAbsoluteSiteUrl } from "@/components/seo-resource-manifest";

type DocsParams = Promise<{ slug: string }>;
type DocsSearchParams = SeoSearchParams;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: DocsParams;
  searchParams: DocsSearchParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveSeoLocale(searchParams);
  const doc = slug === "index" ? undefined : getDocPage(slug);
  if (!doc) return {};

  const path = `/docs/${doc.slug}`;
  const title = `${doc.title[locale]} - MotiClaw Docs`;
  const canonical = getCanonicalPath(path, locale);
  const leadVisual = doc.visuals[0];

  return {
    title,
    description: doc.description[locale],
    alternates: {
      canonical,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "MotiClaw",
      title,
      description: doc.description[locale],
      modifiedTime: doc.updatedAt,
      images: leadVisual
        ? [{ url: leadVisual.src, width: leadVisual.width, height: leadVisual.height, alt: leadVisual.alt[locale] }]
        : [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MotiClaw" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: doc.description[locale],
      images: [leadVisual?.src ?? "/og-image.jpg"],
    },
  };
}

export default async function DocPage({
  params,
  searchParams,
}: {
  params: DocsParams;
  searchParams: DocsSearchParams;
}) {
  const { slug } = await params;
  const locale = await resolveSeoLocale(searchParams);
  const doc = slug === "index" ? undefined : getDocPage(slug);
  if (!doc) notFound();

  const canonicalUrl = toAbsoluteSiteUrl(getCanonicalPath(`/docs/${doc.slug}`, locale));
  const docsIndexUrl = toAbsoluteSiteUrl(getCanonicalPath("/docs", locale));
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: doc.title[locale],
      description: doc.description[locale],
      dateModified: doc.updatedAt,
      version: doc.version,
      inLanguage: locale === "zh" ? "zh-CN" : "en",
      url: canonicalUrl,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
      image: doc.visuals[0] ? `https://www.moticlaw.com${doc.visuals[0].src}` : undefined,
      author: { "@type": "Organization", name: "MotiClaw" },
      publisher: {
        "@type": "Organization",
        name: "MotiClaw",
        logo: { "@type": "ImageObject", url: "https://www.moticlaw.com/icon-512.png" },
      },
      citation: doc.sources.map((source) => ({
        "@type": "CreativeWork",
        name: source.title,
        url: source.url,
        dateAccessed: source.accessedAt,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "zh" ? "产品文档" : "Documentation",
          item: docsIndexUrl,
        },
        { "@type": "ListItem", position: 2, name: doc.title[locale], item: canonicalUrl },
      ],
    },
  ];

  return (
    <DocsLayout locale={locale} activeSlug={doc.slug}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
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
