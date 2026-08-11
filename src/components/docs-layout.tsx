import type { ReactNode } from "react";
import type { Locale } from "@/lib/locale";
import { docsNav, getDocPage } from "@/lib/docs-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderStatic } from "@/components/site-header-static";

function docHref(slug: string, locale: Locale) {
  return slug === "index" ? `/docs?lang=${locale}` : `/docs/${slug}?lang=${locale}`;
}

export function DocsLayout({
  locale,
  activeSlug,
  children,
}: {
  locale: Locale;
  activeSlug: string;
  children: ReactNode;
}) {
  const orderedSlugs = docsNav.flatMap((group) => group.slugs);
  const activeIndex = orderedSlugs.indexOf(activeSlug);
  const previousSlug = activeIndex > 0 ? orderedSlugs[activeIndex - 1] : null;
  const nextSlug = activeIndex >= 0 && activeIndex < orderedSlugs.length - 1 ? orderedSlugs[activeIndex + 1] : null;
  const previousDoc = previousSlug ? getDocPage(previousSlug) : undefined;
  const nextDoc = nextSlug ? getDocPage(nextSlug) : undefined;
  const path = activeSlug === "index" ? "/docs" : `/docs/${activeSlug}`;

  const sidebar = (
    <nav aria-label={locale === "zh" ? "文档导航" : "Docs navigation"} className="space-y-6">
      {docsNav.map((group) => (
        <div key={group.title.en}>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{group.title[locale]}</p>
          <ul className="mt-2 space-y-1">
            {group.slugs.map((slug) => {
              const page = getDocPage(slug);
              if (!page) return null;
              const active = slug === activeSlug;
              return (
                <li key={slug}>
                  <a
                    href={docHref(slug, locale)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-1.5 text-sm transition ${
                      active
                        ? "bg-[rgba(239,123,67,0.1)] font-semibold text-[var(--accent-strong)]"
                        : "text-[var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {page.title[locale]}
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
              {previousDoc ? (
                <a
                  href={docHref(previousDoc.slug, locale)}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[rgba(228,145,92,0.32)]"
                >
                  <span className="block text-xs text-[var(--muted)]">{locale === "zh" ? "上一篇" : "Previous"}</span>
                  <span className="mt-1 block text-sm font-semibold text-[var(--foreground)]">{previousDoc.title[locale]}</span>
                </a>
              ) : (
                <span aria-hidden="true" />
              )}
              {nextDoc ? (
                <a
                  href={docHref(nextDoc.slug, locale)}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 text-right transition hover:border-[rgba(228,145,92,0.32)]"
                >
                  <span className="block text-xs text-[var(--muted)]">{locale === "zh" ? "下一篇" : "Next"}</span>
                  <span className="mt-1 block text-sm font-semibold text-[var(--foreground)]">{nextDoc.title[locale]}</span>
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
