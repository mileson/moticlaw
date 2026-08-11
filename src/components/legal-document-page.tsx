import { LegalDocumentHeader } from "@/components/legal-document-header";
import { legalDocumentCopy, legalDocumentPaths, type LegalDocumentKind } from "@/components/legal-document-copy";
import { localeToHtmlLang, type Locale } from "@/lib/locale";

export function LegalDocumentPage({
  kind,
  locale,
}: {
  kind: LegalDocumentKind;
  locale: Locale;
}) {
  const content = legalDocumentCopy[kind][locale];
  const otherKind: LegalDocumentKind = kind === "terms" ? "privacy" : "terms";
  const relatedItems = [
    { kind: "terms" as const, label: locale === "zh" ? "服务条款" : "Terms of Service" },
    { kind: "privacy" as const, label: locale === "zh" ? "隐私政策" : "Privacy Policy" },
  ];
  const titleLines =
    locale === "zh" && content.title.startsWith("MotiClaw ")
      ? ["MotiClaw", content.title.replace(/^MotiClaw\s+/, "")]
      : [content.title];

  return (
    <main lang={localeToHtmlLang(locale)} className="site-shell min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <LegalDocumentHeader
        kind={kind}
        locale={locale}
        homeLabel={content.backHome}
        loginLabel={content.backToLogin}
        languageLabel={content.languageLabel}
      />

      <div className="mx-auto flex min-h-screen w-full max-w-[1260px] flex-col px-5 pb-10 pt-[5.5rem] sm:px-8 sm:pb-12 sm:pt-[6.1rem] lg:px-10 lg:pb-14">
        <div className="mt-8 grid gap-12 lg:grid-cols-[180px_minmax(0,720px)] lg:gap-16 xl:grid-cols-[210px_minmax(0,760px)]">
          <aside className="text-[1rem] leading-8 text-[var(--muted)] lg:sticky lg:top-28 lg:pt-20">
            <div className="space-y-1">
              {relatedItems.map((item) => {
                const active = item.kind === kind;
                return (
                  <a
                    key={item.kind}
                    href={withLocaleQuery(legalDocumentPaths[item.kind], locale)}
                    className={`block transition ${active ? "text-[var(--foreground)]" : "hover:text-[var(--foreground)]"}`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </aside>

          <article className="max-w-[760px] pt-2 lg:pt-10">
            <div>
              <div className="text-[0.8rem] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">{content.eyebrow}</div>
              <h1 className="mt-5 text-[2.75rem] font-medium leading-[0.92] tracking-[-0.06em] text-[var(--foreground)] sm:text-[4rem]">
                {titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <div className="mt-4 text-[1.05rem] text-[var(--muted)] sm:text-[1.12rem]">
                {content.updatedLabel} {content.updatedAt}
              </div>
            </div>

            <div className="mt-12 space-y-10 text-[1rem] leading-8 text-[var(--foreground)]/92 sm:text-[1.04rem] sm:leading-9">
              <p>{content.subtitle}</p>
              <p>{content.intro}</p>

              {content.sections.map((section) => {
                const bullets = "bullets" in section ? section.bullets : undefined;

                return (
                  <section key={section.title} className="space-y-4 border-t border-[var(--line)] pt-8 first:border-t-0 first:pt-0">
                    <h2 className="text-[1.8rem] font-medium tracking-[-0.05em] text-[var(--foreground)] sm:text-[2.1rem]">{section.title}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {bullets ? (
                      <ul className="space-y-3 pl-6">
                        {bullets.map((bullet) => (
                          <li key={bullet} className="list-disc pl-1">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                );
              })}
            </div>

            <section className="mt-14 border-t border-[var(--line)] pt-8 text-[1rem] leading-8 text-[var(--muted)]">
              <div className="font-medium text-[var(--foreground)]">{content.contactTitle}</div>
              <p className="mt-2">{content.contactBody}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <a href="mailto:chaojifeng@shadowlaws.com" className="text-[var(--foreground)] transition hover:text-[var(--accent-strong)]">
                  {content.contactAction}
                </a>
                <a
                  href={withLocaleQuery(legalDocumentPaths[otherKind], locale)}
                  className="transition hover:text-[var(--foreground)]"
                >
                  {content.otherDocumentLabel}
                </a>
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}

function withLocaleQuery(path: string, locale: Locale) {
  const url = new URL(path, "https://www.moticlaw.com");
  url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}`;
}
