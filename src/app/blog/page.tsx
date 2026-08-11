import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { detectLocale, type Locale } from "@/lib/locale";
import { blogPosts } from "@/lib/blog-posts";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderStatic } from "@/components/site-header-static";

type BlogSearchParams = Promise<{ lang?: string }>;

const titles: Record<Locale, string> = {
  zh: "博客 - MotiClaw 本地 AI 伙伴实践与产品动态",
  en: "Blog - MotiClaw Local AI Partner Practices & Updates",
};

const descriptions: Record<Locale, string> = {
  zh: "MotiClaw 官方博客：本地 AI 伙伴的上手指南、最佳实践、本地优先架构解读与产品动态，面向 FDE、老板、超级个体和 AI 独立开发者。",
  en: "The official MotiClaw blog: getting-started guides, best practices, local-first architecture deep dives, and product updates for FDEs, founders, solo operators, and indie AI developers.",
};

function resolveLocale(langParam: string | undefined, acceptLanguage: string | null): Locale {
  if (langParam === "en") return "en";
  if (langParam === "zh") return "zh";
  return detectLocale(acceptLanguage);
}

export async function generateMetadata({ searchParams }: { searchParams: BlogSearchParams }): Promise<Metadata> {
  const { lang } = await searchParams;
  const requestHeaders = await headers();
  const locale = resolveLocale(lang, requestHeaders.get("accept-language"));

  const canonical = lang === "zh" || lang === "en" ? `/blog?lang=${lang}` : "/blog";

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical,
      languages: {
        "zh-CN": "/blog?lang=zh",
        en: "/blog?lang=en",
        "x-default": "/blog",
      },
    },
    openGraph: {
      type: "website",
      url: "/blog",
      siteName: "MotiClaw",
      title: titles[locale],
      description: descriptions[locale],
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MotiClaw" }],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale],
      description: descriptions[locale],
      images: ["/og-image.jpg"],
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

export default async function BlogIndexPage({ searchParams }: { searchParams: BlogSearchParams }) {
  const { lang } = await searchParams;
  const requestHeaders = await headers();
  const locale = resolveLocale(lang, requestHeaders.get("accept-language"));
  const posts = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: titles[locale],
    url: "https://www.moticlaw.com/blog",
    description: descriptions[locale],
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title[locale],
      datePublished: post.date,
      dateModified: post.updatedAt,
      url: `https://www.moticlaw.com/blog/${post.slug}`,
      image: `https://www.moticlaw.com${post.cover.src}`,
    })),
  };

  return (
    <main lang={locale === "zh" ? "zh-CN" : "en"} className="site-shell relative overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteHeaderStatic locale={locale} path="/blog" />

      <div className="mx-auto w-full max-w-5xl px-4 pt-[6.5rem] pb-16 sm:px-8 lg:px-10">
        <header className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow-lg mb-3">{locale === "zh" ? "博客" : "Blog"}</p>
          <h1 className="display text-4xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-5xl">
            {locale === "zh" ? "本地 AI 伙伴的实践笔记" : "Field notes on local AI partners"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">{descriptions[locale]}</p>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}?lang=${locale}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] transition hover:-translate-y-0.5 hover:border-[rgba(228,145,92,0.32)] hover:shadow-[0_16px_36px_rgba(23,20,17,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(239,123,67,0.35)]"
            >
              <span className="block aspect-[1200/630] overflow-hidden bg-[var(--surface-strong)]">
                <Image
                  src={post.cover.src}
                  width={post.cover.width}
                  height={post.cover.height}
                  sizes="(max-width: 767px) calc(100vw - 2rem), 480px"
                  alt={post.cover.alt[locale]}
                  className="block h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </span>
              <span className="flex flex-1 flex-col p-5">
                <span className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingMinutes} {locale === "zh" ? "分钟阅读" : "min read"}</span>
                  {post.tags[locale].map((tag) => (
                    <span key={tag} className="rounded-full border border-[var(--line)] px-2 py-0.5">{tag}</span>
                  ))}
                </span>
                <span className="mt-3 text-lg font-semibold leading-7 tracking-[-0.02em] text-[var(--foreground)]">{post.title[locale]}</span>
                <span className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{post.description[locale]}</span>
                <span className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-strong)] transition group-hover:opacity-85">
                  {locale === "zh" ? "阅读全文" : "Read more"}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <SiteFooter locale={locale} />
      <script src="/landing.js" defer></script>
    </main>
  );
}
