import { ArrowRight, ArrowUpRight, CaretDown, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { seoResourceCopy, type SeoResourceKind } from "@/components/seo-resource-copy";
import {
  getBreadcrumbRoutes,
  getCanonicalPath,
  getManifestVisual,
  getSeoRelatedRoutes,
  getSeoRouteByKind,
  getSiteRouteById,
  toAbsoluteSiteUrl,
  withLocaleQuery,
  type SeoVisual,
  type SiteRouteManifest,
} from "@/components/seo-resource-manifest";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderStatic } from "@/components/site-header-static";
import { localeToHtmlLang, type Locale } from "@/lib/locale";

const siteUrl = "https://www.moticlaw.com";

type ContentVisual = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  kind?: "imagegen" | "screenshot";
};

type RenderableVisual = Omit<SeoVisual, "kind"> & { kind: "concept" | "screenshot" };

const pageTypeCopy: Record<Locale, Record<string, string>> = {
  zh: {
    conversion: "开始使用",
    "product-detail": "产品能力",
    "product-overview": "产品总览",
    "solution-hub": "解决方案",
    workflow: "工作流",
    playbook: "实操清单",
    comparison: "选择指南",
  },
  en: {
    conversion: "Get started",
    "product-detail": "Product capability",
    "product-overview": "Product overview",
    "solution-hub": "Solution",
    workflow: "Workflow",
    playbook: "Playbook",
    comparison: "Decision guide",
  },
};

export function SeoResourcePage({ kind, locale }: { kind: SeoResourceKind; locale: Locale }) {
  const content = seoResourceCopy[kind][locale];
  const route = getSeoRouteByKind(kind);
  const relatedItems = getSeoRelatedRoutes(kind).map((item) => ({
    route: item,
    href: withLocaleQuery(item.path, locale),
    content: seoResourceCopy[item.kind][locale],
  }));
  const manifestVisual = getManifestVisual(kind, locale);
  const productCaseVisual = content.visuals?.productCase;
  if (productCaseVisual && productCaseVisual.src !== manifestVisual.src) {
    throw new Error(`SEO product-case visual for ${kind} has drifted from its manifest profile.`);
  }
  const visual = normalizeVisual(productCaseVisual ?? manifestVisual);
  const sectionLinks = content.sections.map((section, index) => ({
    id: `section-${index + 1}`,
    title: section.title,
  }));
  const breadcrumbs = getBreadcrumbRoutes(kind);
  const jsonLd = buildJsonLd({ kind, locale, route, breadcrumbs });

  return (
    <div lang={localeToHtmlLang(locale)} className="site-shell min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeaderStatic locale={locale} path={route.path} variant="seo" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <main data-seo-page-type={route.pageType} data-seo-cluster={route.cluster}>
        <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10 lg:pt-36">
          <Breadcrumbs kind={kind} locale={locale} parents={breadcrumbs} />

          <section className="grid gap-10 pb-12 pt-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-14 lg:pb-16 lg:pt-12">
            <div className="min-w-0">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                <span aria-hidden="true" className="h-px w-8 bg-[var(--accent-strong)]" />
                {pageTypeCopy[locale][route.pageType] ?? content.eyebrow}
              </p>
              <h1
                className="mt-5 max-w-3xl text-[2.45rem] font-semibold leading-[1.03] tracking-[-0.045em] text-[var(--foreground)] sm:text-[3.55rem] lg:text-[4.15rem]"
                style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
              >
                {content.title}
              </h1>
              <p className="mt-6 max-w-2xl text-[1.02rem] leading-8 text-[var(--muted)] sm:text-[1.12rem]">
                {content.lead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={withLocaleQuery(content.primaryCta.path, locale, content.primaryCta.params)} className="btn-base btn-primary">
                  {content.primaryCta.label}
                  <ArrowRight size={17} weight="bold" aria-hidden="true" />
                </a>
                <a href={withLocaleQuery(content.secondaryCta.path, locale, content.secondaryCta.params)} className="btn-base btn-secondary">
                  {content.secondaryCta.label}
                </a>
              </div>
            </div>

            <div className="min-w-0" data-seo-product-evidence>
              <SeoVisualFigure visual={visual} priority />
              <div className="mt-4 flex flex-col gap-3 border-l-2 border-[var(--accent-strong)] pl-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
                  {evidenceLead(route, visual.kind, locale)}
                </p>
                <a
                  href={withLocaleQuery("/ai-partner-console", locale)}
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--accent-strong)] transition hover:opacity-75"
                >
                  {locale === "zh" ? "进入互动预览" : "Open interactive preview"}
                  <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>

          <section aria-label={locale === "zh" ? "关键判断" : "Key decisions"} className="grid border-y border-[var(--line)] md:grid-cols-3">
            {content.highlightCards.map((item, index) => (
              <article
                key={item.title}
                className={`py-6 md:px-7 md:py-8 ${index > 0 ? "border-t border-[var(--line)] md:border-l md:border-t-0" : ""}`}
              >
                <p className="text-[0.7rem] font-semibold tabular-nums tracking-[0.16em] text-[var(--accent-strong)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 text-[1.02rem] font-semibold text-[var(--foreground)]">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
              </article>
            ))}
          </section>

          {content.visuals?.hero ? (
            <section className="border-b border-[var(--line)] py-10 sm:py-14">
              <SeoVisualFigure visual={normalizeVisual(content.visuals.hero)} />
            </section>
          ) : null}

          <section className="grid gap-8 py-16 lg:grid-cols-[minmax(12rem,0.32fr)_minmax(0,0.68fr)] lg:gap-16 lg:py-24">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                {locale === "zh" ? "从这里开始" : "Start here"}
              </p>
              <h2 className="mt-3 max-w-sm text-[1.9rem] font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)] sm:text-[2.3rem]">
                {content.stepsTitle}
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--muted)]">
                {locale === "zh"
                  ? "先把输入、执行和人工复核排成一条清楚路径，再决定是否继续扩大。"
                  : "Put inputs, execution, and human review into one clear path before expanding it."}
              </p>
            </header>

            <ol className="border-t border-[var(--line)]">
              {content.steps.map((item, index) => (
                <li key={item.title} className="grid gap-4 border-b border-[var(--line)] py-6 sm:grid-cols-[4rem_minmax(0,1fr)] sm:py-8">
                  <span className="text-sm font-semibold tabular-nums tracking-[0.12em] text-[var(--accent-strong)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[1.15rem] font-semibold text-[var(--foreground)]">{item.title}</h3>
                    <p className="mt-2 max-w-2xl text-[0.95rem] leading-7 text-[var(--muted)]">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {content.visuals?.example ? (
            <section className="border-y border-[var(--line)] py-10 sm:py-14">
              <SeoVisualFigure visual={normalizeVisual(content.visuals.example)} />
            </section>
          ) : null}

          <section className="grid gap-10 py-16 lg:grid-cols-[minmax(12rem,0.28fr)_minmax(0,0.72fr)] lg:gap-20 lg:py-24">
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                {locale === "zh" ? "本页内容" : "On this page"}
              </p>
              <nav aria-label={locale === "zh" ? "本页目录" : "On this page"} className="mt-5 hidden border-l border-[var(--line)] lg:block">
                {sectionLinks.map((item, index) => (
                  <a key={item.id} href={`#${item.id}`} className="block py-2 pl-4 text-sm leading-5 text-[var(--muted)] transition hover:border-l hover:border-[var(--accent-strong)] hover:text-[var(--foreground)]">
                    <span className="mr-2 text-[0.7rem] tabular-nums text-[var(--accent-strong)]">{String(index + 1).padStart(2, "0")}</span>
                    {item.title}
                  </a>
                ))}
              </nav>
            </aside>

            <article className="min-w-0">
              {content.sections.map((section, index) => (
                <section key={section.title} id={`section-${index + 1}`} className="scroll-mt-32 border-t border-[var(--line)] py-9 first:pt-0 first:border-t-0 sm:py-12">
                  <h2 className="max-w-3xl text-[1.65rem] font-semibold leading-tight tracking-[-0.035em] text-[var(--foreground)] sm:text-[2.05rem]">
                    {section.title}
                  </h2>
                  <div className="mt-5 max-w-3xl space-y-5 text-[1rem] leading-8 text-[var(--foreground)]/90">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                  {section.bullets ? (
                    <ul className="mt-6 max-w-3xl border-y border-[var(--line)]">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 border-b border-[var(--line)] py-4 text-[0.95rem] leading-7 text-[var(--muted)] last:border-b-0">
                          <CheckCircle className="mt-1 shrink-0 text-[var(--accent-strong)]" size={18} weight="duotone" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </article>
          </section>

          <section className="grid gap-8 border-y border-[var(--line)] py-14 lg:grid-cols-[minmax(12rem,0.28fr)_minmax(0,0.72fr)] lg:gap-20 lg:py-20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">FAQ</p>
              <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">{content.faqTitle}</h2>
            </header>
            <div className="border-t border-[var(--line)]">
              {content.faqs.map((item) => (
                <details key={item.question} className="group border-b border-[var(--line)] py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-[1.02rem] font-semibold leading-7 text-[var(--foreground)] marker:content-none">
                    <span>{item.question}</span>
                    <CaretDown className="mt-1 shrink-0 text-[var(--accent-strong)] transition group-open:rotate-180" size={18} weight="bold" aria-hidden="true" />
                  </summary>
                  <p className="max-w-2xl pb-1 pt-4 text-sm leading-7 text-[var(--muted)]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="py-16 lg:py-24" data-seo-related-count={relatedItems.length}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                  {locale === "zh" ? "下一步" : "Next"}
                </p>
                <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-[2.35rem]">
                  {locale === "zh" ? "沿着当前问题继续" : "Continue from this question"}
                </h2>
              </div>
              <a href={withLocaleQuery(resolveHubPath(route), locale)} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-strong)] transition hover:opacity-75">
                {locale === "zh" ? "查看所属内容中心" : "Open the content hub"}
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </a>
            </div>

            <ol className="mt-8 border-t border-[var(--line)]">
              {relatedItems.map((item, index) => (
                <li key={item.route.id}>
                  <a href={item.href} className="group grid gap-3 border-b border-[var(--line)] py-6 transition sm:grid-cols-[4rem_minmax(0,0.35fr)_minmax(0,0.65fr)_auto] sm:items-center sm:gap-6 hover:border-[var(--accent-strong)]">
                    <span className="text-xs font-semibold tabular-nums tracking-[0.14em] text-[var(--accent-strong)]">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="text-[1.05rem] font-semibold text-[var(--foreground)]">{item.content.navLabel}</h3>
                    <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">{item.content.metadataDescription}</p>
                    <ArrowRight className="hidden text-[var(--accent-strong)] transition-transform group-hover:translate-x-1 sm:block" size={18} weight="bold" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-6 border-y border-[var(--line)] py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:py-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                {locale === "zh" ? "把第一步跑起来" : "Run the first step"}
              </p>
              <h2 className="mt-3 max-w-2xl text-[1.7rem] font-semibold leading-tight tracking-[-0.035em] text-[var(--foreground)] sm:text-[2.1rem]">
                {locale === "zh" ? "先交出一段重复工作，再从真实结果决定要不要扩大。" : "Delegate one repeated task, then decide from a real result whether to expand."}
              </h2>
            </div>
            <a href={withLocaleQuery(content.primaryCta.path, locale, content.primaryCta.params)} className="btn-base btn-primary">
              {content.primaryCta.label}
              <ArrowRight size={17} weight="bold" aria-hidden="true" />
            </a>
          </section>
        </div>
      </main>

      <SiteFooter locale={locale} />
      <script src="/landing.js" defer></script>
    </div>
  );
}

function SeoVisualFigure({ visual, priority = false }: { visual: RenderableVisual; priority?: boolean }) {
  return (
    <figure
      data-seo-visual
      data-seo-visual-kind={visual.kind}
      className="overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)] shadow-[0_20px_55px_rgba(0,0,0,0.12)]"
    >
      <Image
        src={visual.src}
        alt={visual.alt}
        width={visual.width}
        height={visual.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes="(max-width: 1024px) 100vw, 58vw"
        className={`block h-auto max-h-[32rem] w-full bg-[var(--surface-strong)] ${visual.kind === "screenshot" ? "object-contain" : "object-cover"}`}
      />
      <figcaption className="border-t border-[var(--line)] px-4 py-3 text-xs leading-5 text-[var(--muted)] sm:px-5 sm:text-sm sm:leading-6">
        {visual.caption}
      </figcaption>
    </figure>
  );
}

function Breadcrumbs({ kind, locale, parents }: { kind: SeoResourceKind; locale: Locale; parents: SiteRouteManifest[] }) {
  const current = seoResourceCopy[kind][locale];
  const items = [
    { id: "home", label: locale === "zh" ? "首页" : "Home", path: "/" },
    ...parents.map((route) => ({ id: route.id, label: routeLabel(route, locale), path: route.path })),
  ];
  return (
    <nav aria-label={locale === "zh" ? "面包屑" : "Breadcrumb"} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted)]">
      {items.map((item) => (
        <span key={item.id} className="inline-flex items-center gap-2">
          <a href={withLocaleQuery(item.path, locale)} className="transition hover:text-[var(--foreground)]">{item.label}</a>
          <span aria-hidden="true" className="opacity-50">/</span>
        </span>
      ))}
      <span aria-current="page" className="text-[var(--foreground)]">{current.navLabel}</span>
    </nav>
  );
}

function buildJsonLd({
  kind,
  locale,
  route,
  breadcrumbs,
}: {
  kind: SeoResourceKind;
  locale: Locale;
  route: SiteRouteManifest;
  breadcrumbs: SiteRouteManifest[];
}) {
  const content = seoResourceCopy[kind][locale];
  const canonicalUrl = toAbsoluteSiteUrl(getCanonicalPath(route.path, locale));
  const schemaTypes = new Set(route.schemaTypes ?? ["WebPage", "BreadcrumbList"]);
  const breadcrumbElements = [
    { name: locale === "zh" ? "MotiClaw 首页" : "MotiClaw home", path: "/" },
    ...breadcrumbs.map((item) => ({ name: routeLabel(item, locale), path: item.path })),
    { name: content.navLabel, path: route.path },
  ].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: toAbsoluteSiteUrl(getCanonicalPath(item.path, locale)),
  }));

  const graph: Record<string, unknown>[] = [
    {
      "@type": schemaTypes.has("Article") ? "Article" : "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: content.metadataTitle,
      headline: content.metadataTitle,
      description: content.metadataDescription,
      inLanguage: localeToHtmlLang(locale),
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#software` },
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ];

  if (schemaTypes.has("SoftwareApplication")) {
    graph.push({
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "MotiClaw",
      url: siteUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "macOS, Windows",
      description: content.metadataDescription,
    });
  }

  if (schemaTypes.has("HowTo")) {
    graph.push({
      "@type": "HowTo",
      "@id": `${canonicalUrl}#howto`,
      name: content.stepsTitle,
      inLanguage: localeToHtmlLang(locale),
      step: content.steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.body,
      })),
    });
  }

  if (schemaTypes.has("FAQPage")) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: content.faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  graph.push({ "@type": "BreadcrumbList", "@id": `${canonicalUrl}#breadcrumb`, itemListElement: breadcrumbElements });
  return { "@context": "https://schema.org", "@graph": graph };
}

function normalizeVisual(visual: ContentVisual | SeoVisual): RenderableVisual {
  return {
    ...visual,
    kind: visual.kind === "screenshot" ? "screenshot" : "concept",
  };
}

function evidenceLead(route: SiteRouteManifest, kind: RenderableVisual["kind"], locale: Locale) {
  if (locale === "zh") {
    if (kind === "screenshot") return "先看真实工作台如何承接状态、任务和人工复核，再决定这套方式是否适合你。";
    if (route.pageType === "workflow") return "这张能力图帮助你先看清工作如何流动；真正接入前，仍从最小一步和可复核结果开始。";
    return "这张能力图先说明产品如何进入工作；具体页面和状态以互动预览与真实截图为准。";
  }
  if (kind === "screenshot") return "See how the real workbench carries status, tasks, and human review before deciding whether the approach fits.";
  if (route.pageType === "workflow") return "Use this capability view to understand the flow, then start with one small step and a reviewable result.";
  return "Use this capability view to understand how the product enters the work; the interactive preview and verified screenshots remain the product truth.";
}

function routeLabel(route: SiteRouteManifest, locale: Locale) {
  if (route.kind) return seoResourceCopy[route.kind][locale].navLabel;
  const staticLabels: Record<string, LocalizedLabel> = {
    solutions: { zh: "解决方案", en: "Solutions" },
    workflows: { zh: "工作流", en: "Workflows" },
    resources: { zh: "资源", en: "Resources" },
    pricing: { zh: "定价", en: "Pricing" },
    blog: { zh: "博客", en: "Blog" },
    docs: { zh: "产品文档", en: "Documentation" },
  };
  return staticLabels[route.id]?.[locale] ?? route.id;
}

type LocalizedLabel = Record<Locale, string>;

function resolveHubPath(route: SiteRouteManifest) {
  if (["workflow", "playbook", "comparison"].includes(route.pageType)) return "/workflows";
  if (route.pageType === "solution-hub") return "/solutions";
  if (["content-index", "guide"].includes(route.pageType)) return "/resources";
  const parent = route.parentHub ? getSiteRouteById(route.parentHub) : null;
  if (parent?.id === "solutions") return "/solutions";
  return "/capabilities";
}
