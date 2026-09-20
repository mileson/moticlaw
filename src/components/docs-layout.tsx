import type { ReactNode } from "react";
import type { Locale } from "@/lib/locale";
import { docsNav, getDocPage } from "@/lib/docs-content";
import { getPublishedDocsIndex } from "@/lib/site-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderStatic } from "@/components/site-header-static";
import { getCanonicalPath } from "@/components/seo-resource-manifest";

function docHref(slug: string, locale: Locale) {
  return getCanonicalPath(slug === "index" ? "/docs" : `/docs/${slug}`, locale);
}

export async function DocsLayout({
  locale,
  activeSlug,
  children,
}: {
  locale: Locale;
  activeSlug: string;
  children: ReactNode;
}) {
  const published = await getPublishedDocsIndex();
  const publishedBySlug = new Map(published.map((doc) => [doc.slug, doc]));
  const nav = docsNav.map((group) => ({ ...group, slugs: [...group.slugs] }));
  const groupIndexes = new Map([
    ["get-started", 0],
    ["core-concepts", 1],
    ["scenario-guides", 2],
    ["support", 3],
  ]);
  for (const doc of published) {
    if (nav.some((group) => group.slugs.includes(doc.slug))) continue;
    const group = nav[groupIndexes.get(doc.groupId) ?? 1];
    group.slugs.push(doc.slug);
    group.slugs.sort((left, right) => (publishedBySlug.get(left)?.navOrder ?? 10_000) - (publishedBySlug.get(right)?.navOrder ?? 10_000));
  }
  const docTitle = (slug: string) => {
    const dynamicDoc = publishedBySlug.get(slug);
    return dynamicDoc
      ? { zh: dynamicDoc.locales.zh.title, en: dynamicDoc.locales.en.title }
      : getDocPage(slug)?.title;
  };
  const orderedSlugs = nav.flatMap((group) => group.slugs);
  const activeIndex = orderedSlugs.indexOf(activeSlug);
  const previousSlug = activeIndex > 0 ? orderedSlugs[activeIndex - 1] : null;
  const nextSlug = activeIndex >= 0 && activeIndex < orderedSlugs.length - 1 ? orderedSlugs[activeIndex + 1] : null;
  const previousTitle = previousSlug ? docTitle(previousSlug) : undefined;
  const nextTitle = nextSlug ? docTitle(nextSlug) : undefined;
  const path = activeSlug === "index" ? "/docs" : `/docs/${activeSlug}`;

  const sidebar = (
    <nav aria-label={locale === "zh" ? "文档导航" : "Docs navigation"} className="space-y-6">
      {nav.map((group) => (
        <div key={group.title.en}>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{group.title[locale]}</p>
          <ul className="mt-2 space-y-1">
            {group.slugs.map((slug) => {
              const title = docTitle(slug);
              if (!title) return null;
              const active = slug === activeSlug;
              return (
                <li key={slug}>
                  <a
                    href={docHref(slug, locale)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-1.5 text-sm transition ${
                      active
                        ? "bg-[rgba(0,0,0,0.1)] font-semibold text-[var(--accent-strong)]"
                        : "text-[var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {title[locale]}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <main lang={locale === "zh" ? "zh-CN" : "en"} className="site-shell relative overflow-x-hidden">
      <SiteHeaderStatic locale={locale} path={path} />

      <div className="mx-auto w-full max-w-7xl px-4 pt-[5.5rem] pb-16 sm:px-8 lg:px-10">
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">{sidebar}</div>
          </aside>

          <details className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 lg:hidden">
            <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--foreground)] [&::-webkit-details-marker]:hidden">
              {locale === "zh" ? "文档目录" : "Docs menu"}
            </summary>
            <div className="mt-4">{sidebar}</div>
          </details>

          <div className="min-w-0">
            {children}

            <nav className="mt-12 grid gap-3 sm:grid-cols-2" aria-label={locale === "zh" ? "上一篇 / 下一篇" : "Previous / next"}>
              {previousSlug && previousTitle ? (
                <a
                  href={docHref(previousSlug, locale)}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[rgba(0,0,0,0.32)]"
                >
                  <span className="block text-xs text-[var(--muted)]">{locale === "zh" ? "上一篇" : "Previous"}</span>
                  <span className="mt-1 block text-sm font-semibold text-[var(--foreground)]">{previousTitle[locale]}</span>
                </a>
              ) : (
                <span aria-hidden="true" />
              )}
              {nextSlug && nextTitle ? (
                <a
                  href={docHref(nextSlug, locale)}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 text-right transition hover:border-[rgba(0,0,0,0.32)]"
                >
                  <span className="block text-xs text-[var(--muted)]">{locale === "zh" ? "下一篇" : "Next"}</span>
                  <span className="mt-1 block text-sm font-semibold text-[var(--foreground)]">{nextTitle[locale]}</span>
                </a>
              ) : null}
            </nav>
          </div>
        </div>
      </div>

      <SiteFooter locale={locale} />
      <script src="/landing.js" defer></script>
    </main>
  );
}
