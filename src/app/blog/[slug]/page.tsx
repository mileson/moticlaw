import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import type { Locale } from "@/lib/locale";
import { getBlogPost, resolveBlogPostSlug } from "@/lib/blog-posts";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderStatic } from "@/components/site-header-static";
import { resolveSeoLocale, type SeoSearchParams } from "@/components/seo-resource-locale";
import { getCanonicalPath, getLanguageAlternates, toAbsoluteSiteUrl } from "@/components/seo-resource-manifest";

type BlogPostParams = Promise<{ slug: string }>;
type BlogSearchParams = SeoSearchParams;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: BlogPostParams;
  searchParams: BlogSearchParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveSeoLocale(searchParams);
  const canonicalSlug = resolveBlogPostSlug(slug);
  const post = getBlogPost(canonicalSlug);
  if (!post) return {};

  const title = `${post.title[locale]} - MotiClaw Blog`;
  const description = post.description[locale];
  const path = `/blog/${post.slug}`;
  const canonical = getCanonicalPath(path, locale);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "MotiClaw",
      title,
      description,
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      images: [{ url: post.cover.src, width: post.cover.width, height: post.cover.height, alt: post.cover.alt[locale] }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.cover.src],
    },
  };
}

function formatDate(value: string, locale: Locale) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: BlogPostParams;
  searchParams: BlogSearchParams;
}) {
  const { slug } = await params;
  const locale = await resolveSeoLocale(searchParams);
  const canonicalSlug = resolveBlogPostSlug(slug);
  if (canonicalSlug !== slug) {
    redirect(getCanonicalPath(`/blog/${canonicalSlug}`, locale));
  }

  const post = getBlogPost(canonicalSlug);
  if (!post) notFound();

  const relatedPosts = post.relatedSlugs
    .map((relatedSlug) => getBlogPost(resolveBlogPostSlug(relatedSlug)))
    .filter((item): item is NonNullable<typeof item> => item !== undefined && item.slug !== post.slug)
    .slice(0, 4);
  const canonicalUrl = toAbsoluteSiteUrl(getCanonicalPath(`/blog/${post.slug}`, locale));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title[locale],
    description: post.description[locale],
    datePublished: post.date,
    dateModified: post.updatedAt,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    image: `https://www.moticlaw.com${post.cover.src}`,
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    keywords: post.tags[locale],
    relatedLink: relatedPosts.map((item) => toAbsoluteSiteUrl(getCanonicalPath(`/blog/${item.slug}`, locale))),
    author: { "@type": "Organization", name: "MotiClaw" },
    publisher: { "@type": "Organization", name: "MotiClaw", logo: { "@type": "ImageObject", url: "https://www.moticlaw.com/icon-512.png" } },
  };

  return (
    <main lang={locale === "zh" ? "zh-CN" : "en"} className="site-shell relative overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteHeaderStatic locale={locale} path={`/blog/${post.slug}`} />

      <article className="mx-auto w-full max-w-3xl px-4 pt-[6.5rem] pb-16 sm:px-8">
        <nav className="text-sm text-[var(--muted)]" aria-label="Breadcrumb">
          <a href={getCanonicalPath("/blog", locale)} className="font-medium transition hover:text-[var(--accent-strong)]">
            {locale === "zh" ? "← 返回博客" : "← Back to blog"}
          </a>
        </nav>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            {post.updatedAt !== post.date ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {locale === "zh" ? "更新于 " : "Updated "}
                  <time dateTime={post.updatedAt}>{formatDate(post.updatedAt, locale)}</time>
                </span>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} {locale === "zh" ? "分钟阅读" : "min read"}</span>
            {post.tags[locale].map((tag) => (
              <span key={tag} className="rounded-full border border-[var(--line)] px-2 py-0.5">{tag}</span>
            ))}
          </div>
          <h1 className="display mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
            {post.title[locale]}
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">{post.description[locale]}</p>
        </header>

        <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--line)]">
          <Image
            src={post.cover.src}
            width={post.cover.width}
            height={post.cover.height}
            sizes="(max-width: 768px) calc(100vw - 2rem), 768px"
            alt={post.cover.alt[locale]}
            priority
            className="block h-auto w-full"
          />
        </div>

        <div className="mt-2">{post.content[locale]}</div>

        <div className="mt-12 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 text-center">
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {locale === "zh" ? "3 分钟，让第一个 AI 伙伴上岗" : "Get your first AI partner working in 3 minutes"}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {locale === "zh"
              ? "免费下载 MotiClaw 桌面端。工作数据默认留在本机；仅你主动接入的渠道与模型调用按任务所需出网。"
              : "Download MotiClaw for free. Work data stays local by default; only the channels and model calls you connect use the network when a task needs them."}
          </p>
          <a href={`/?lang=${locale}&download=1`} className="btn-base btn-primary mt-4 inline-flex justify-center px-6 py-3">
            {locale === "zh" ? "免费下载" : "Download free"}
          </a>
        </div>

        {relatedPosts.length > 0 ? (
          <aside className="mt-12">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">{locale === "zh" ? "继续阅读" : "Keep reading"}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((item) => (
                <a
                  key={item.slug}
                  href={getCanonicalPath(`/blog/${item.slug}`, locale)}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[rgba(0,0,0,0.32)]"
                >
                  <span className="block text-sm font-semibold leading-6 text-[var(--foreground)]">{item.title[locale]}</span>
                  <span className="mt-2 block text-xs leading-5 text-[var(--muted)]">{item.description[locale]}</span>
                </a>
              ))}
            </div>
          </aside>
        ) : null}
      </article>

      <SiteFooter locale={locale} />
      <script src="/landing.js" defer></script>
    </main>
  );
}
