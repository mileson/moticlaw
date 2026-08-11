import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import { seoResourceCopy } from "@/components/seo-resource-copy";
import {
  getCanonicalPath,
  getLanguageAlternates,
  getManifestVisual,
  siteContentRoutes,
  toAbsoluteSiteUrl,
  withLocaleQuery,
  type SiteRouteManifest,
} from "@/components/seo-resource-manifest";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderStatic } from "@/components/site-header-static";
import { localeToHtmlLang, type Locale } from "@/lib/locale";

export type SeoHubKind = "solutions" | "workflows" | "resources";

const hubCopy: Record<SeoHubKind, Record<Locale, {
  eyebrow: string;
  title: string;
  lead: string;
  description: string;
  sectionTitle: string;
  sectionLead: string;
}>> = {
  solutions: {
    zh: {
      eyebrow: "解决方案",
      title: "按你的工作方式，找到最先值得交给 AI 的那一段",
      lead: "不是先选一堆功能，而是先看你正在经营、交付、开发还是做内容，再找到一条结果可检查的起点。",
      description: "MotiClaw 解决方案中心：面向 FDE、AI 独立开发者、OPC、老板和超级个体，按真实工作方式选择本地 AI 伙伴的第一条落地路径。",
      sectionTitle: "四种常见起点",
      sectionLead: "每个入口都先说明适用边界，再连接真实产品工作台和一条可执行工作流。",
    },
    en: {
      eyebrow: "Solutions",
      title: "Find the first piece of work worth delegating to AI",
      lead: "Start with how you operate, deliver, build, or publish—not with a long feature list—then choose one reviewable path.",
      description: "MotiClaw solutions for FDEs, indie AI developers, operators, founders, and solo businesses choosing a first local AI partner workflow.",
      sectionTitle: "Four practical starting points",
      sectionLead: "Each route explains the fit, shows the product workbench, and connects to one executable workflow.",
    },
  },
  workflows: {
    zh: {
      eyebrow: "工作流",
      title: "把输入、执行和人工复核排成一条能长期跑的路径",
      lead: "工作流不是一上来追求全自动，而是让每一步都有输入、有结果、有负责人，也知道什么时候该停下来让人判断。",
      description: "MotiClaw 工作流中心：覆盖 AI 决策、内容日历、FDE 本地交付、客户交接、Agent Demo 到维护等可复核流程。",
      sectionTitle: "从一条小工作流开始",
      sectionLead: "按场景进入，先跑通最短路径；相关清单和选择指南只在需要时继续展开。",
    },
    en: {
      eyebrow: "Workflows",
      title: "Turn inputs, execution, and human review into a path that lasts",
      lead: "A workflow is not instant full automation. Every step needs an input, an outcome, an owner, and a clear point for human judgment.",
      description: "MotiClaw workflows for AI decisions, content calendars, local FDE delivery, client handoff, and the path from agent demo to maintenance.",
      sectionTitle: "Start with one small workflow",
      sectionLead: "Enter by scenario, run the shortest path first, and open playbooks or decision guides only when they add context.",
    },
  },
  resources: {
    zh: {
      eyebrow: "资源",
      title: "需要判断、上手或排障时，从正确的内容入口开始",
      lead: "博客负责帮你想清楚，产品文档负责带你完成，实操清单负责在交付和维护时不漏关键一步。",
      description: "MotiClaw 资源中心：汇总双语博客、产品文档、实操清单与选择指南，帮助 OPC、独立开发者和老板理解并使用本地 AI 伙伴。",
      sectionTitle: "按你现在要完成的事选择",
      sectionLead: "内容职责彼此分开，避免同一个问题被 Blog、Docs 和 SEO 页面重复解释。",
    },
    en: {
      eyebrow: "Resources",
      title: "Start from the right source when you need to decide, learn, or troubleshoot",
      lead: "The blog helps you think, documentation helps you complete a task, and playbooks keep delivery and maintenance from missing a critical step.",
      description: "MotiClaw resources including bilingual blog posts, product documentation, practical playbooks, and decision guides for local AI partner work.",
      sectionTitle: "Choose by what you need to do now",
      sectionLead: "Each content lane has one job, so Blog, Docs, and SEO pages do not repeat the same question.",
    },
  },
};

const resourceCopy: Record<string, Record<Locale, { title: string; description: string; label: string }>> = {
  blog: {
    zh: { title: "博客：先把问题想清楚", description: "用真实工作场景、来源和产品案例，拆开一个人经营、开发和交付时会遇到的判断。", label: "判断与案例" },
    en: { title: "Blog: think the problem through", description: "Use real work, sources, and product cases to examine decisions in solo operations, building, and delivery.", label: "Ideas and cases" },
  },
  docs: {
    zh: { title: "产品文档：照着完成一件事", description: "从开始前准备、编号步骤到完成标准和排障，让你知道现在能做什么、下一步怎么走。", label: "上手与排障" },
    en: { title: "Documentation: complete a task", description: "Move from prerequisites and numbered steps to completion checks and troubleshooting with a clear next action.", label: "Setup and troubleshooting" },
  },
};

export function buildSeoHubMetadata(hub: SeoHubKind, locale: Locale): Metadata {
  const copy = hubCopy[hub][locale];
  const path = `/${hub}`;
  const canonical = getCanonicalPath(path, locale);
  return {
    title: `${copy.eyebrow} - MotiClaw`,
    description: copy.description,
    alternates: { canonical, languages: getLanguageAlternates(path) },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? ["en_US"] : ["zh_CN"],
      url: canonical,
      siteName: "MotiClaw",
      title: `${copy.eyebrow} - MotiClaw`,
      description: copy.description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MotiClaw" }],
    },
    robots: { index: true, follow: true },
  };
}

export function SeoHubPage({ hub, locale }: { hub: SeoHubKind; locale: Locale }) {
  const copy = hubCopy[hub][locale];
  const route = siteContentRoutes.find((item) => item.id === hub);
  if (!route) throw new Error(`SEO hub is missing from manifest: ${hub}`);
  const visual = getManifestVisual("agentManagementWorkbench", locale);
  const entries = getHubEntries(hub);
  const jsonLd = buildHubJsonLd(hub, locale, copy, entries);

  return (
    <div lang={localeToHtmlLang(locale)} className="site-shell min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeaderStatic locale={locale} path={route.path} variant="seo" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <main data-seo-hub={hub}>
        <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10 lg:pt-36">
          <nav aria-label={locale === "zh" ? "面包屑" : "Breadcrumb"} className="text-xs text-[var(--muted)]">
            <a href={withLocaleQuery("/", locale)} className="transition hover:text-[var(--foreground)]">{locale === "zh" ? "首页" : "Home"}</a>
            <span className="mx-2 opacity-50" aria-hidden="true">/</span>
            <span aria-current="page" className="text-[var(--foreground)]">{copy.eyebrow}</span>
          </nav>

          <section className="grid gap-10 pb-16 pt-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-14 lg:pb-20">
            <div>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                <span aria-hidden="true" className="h-px w-8 bg-[var(--accent-strong)]" />
                {copy.eyebrow}
              </p>
              <h1 className="mt-5 max-w-3xl text-[2.5rem] font-semibold leading-[1.03] tracking-[-0.045em] text-[var(--foreground)] sm:text-[3.65rem] lg:text-[4.25rem]">
                {copy.title}
              </h1>
              <p className="mt-6 max-w-2xl text-[1.04rem] leading-8 text-[var(--muted)] sm:text-[1.14rem]">{copy.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#hub-index" className="btn-base btn-primary">
                  {locale === "zh" ? "选择一个入口" : "Choose a starting point"}
                  <ArrowRight size={17} weight="bold" aria-hidden="true" />
                </a>
                <a href={withLocaleQuery("/ai-partner-console", locale)} className="btn-base btn-secondary">
                  {locale === "zh" ? "先看产品预览" : "Preview the product"}
                </a>
              </div>
            </div>

            <div data-seo-product-evidence>
              <figure className="overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)] shadow-[0_20px_55px_rgba(0,0,0,0.12)]">
                <Image src={visual.src} alt={visual.alt} width={visual.width} height={visual.height} loading="eager" sizes="(max-width: 1024px) 100vw, 58vw" className="block h-auto max-h-[32rem] w-full object-contain" />
                <figcaption className="border-t border-[var(--line)] px-4 py-3 text-xs leading-5 text-[var(--muted)] sm:px-5 sm:text-sm sm:leading-6">{visual.caption}</figcaption>
              </figure>
              <a href={withLocaleQuery("/ai-partner-console", locale)} className="mt-4 inline-flex items-center gap-2 border-l-2 border-[var(--accent-strong)] pl-4 text-sm font-semibold text-[var(--accent-strong)] transition hover:opacity-75">
                {locale === "zh" ? "打开可操作的管理台预览" : "Open the interactive console preview"}
                <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </a>
            </div>
          </section>

          <section id="hub-index" className="scroll-mt-32 border-t border-[var(--line)] py-14 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[minmax(12rem,0.3fr)_minmax(0,0.7fr)] lg:gap-16">
              <header>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">{copy.eyebrow}</p>
                <h2 className="mt-3 max-w-sm text-[1.9rem] font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)] sm:text-[2.35rem]">{copy.sectionTitle}</h2>
                <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--muted)]">{copy.sectionLead}</p>
              </header>

              <ol className="border-t border-[var(--line)]" data-seo-hub-count={entries.length}>
                {entries.map((entry, index) => {
                  const entryCopy = getEntryCopy(entry, locale);
                  return (
                    <li key={entry.id}>
                      <a href={withLocaleQuery(entry.path, locale)} className="group grid gap-3 border-b border-[var(--line)] py-7 transition sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-6 hover:border-[var(--accent-strong)]">
                        <span className="text-xs font-semibold tabular-nums tracking-[0.14em] text-[var(--accent-strong)]">{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">{entryCopy.label}</p>
                          <h3 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.025em] text-[var(--foreground)]">{entryCopy.title}</h3>
                          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">{entryCopy.description}</p>
                        </div>
                        <ArrowRight className="mt-7 hidden text-[var(--accent-strong)] transition-transform group-hover:translate-x-1 sm:block" size={18} weight="bold" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <section className="grid gap-6 border-y border-[var(--line)] py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:py-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">{locale === "zh" ? "先看真实产品" : "See the real product"}</p>
              <h2 className="mt-3 max-w-2xl text-[1.7rem] font-semibold leading-tight tracking-[-0.035em] text-[var(--foreground)] sm:text-[2.1rem]">
                {locale === "zh" ? "内容负责帮你选路，产品预览负责让你判断这条路是否真的跑得起来。" : "Content helps you choose a path; the product preview helps you judge whether it can really run."}
              </h2>
            </div>
            <a href={withLocaleQuery("/ai-partner-console", locale)} className="btn-base btn-primary">
              {locale === "zh" ? "进入互动预览" : "Open interactive preview"}
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

function getHubEntries(hub: SeoHubKind) {
  if (hub === "solutions") return siteContentRoutes.filter((route) => route.kind && route.pageType === "solution-hub");
  if (hub === "workflows") return siteContentRoutes.filter((route) => route.kind && ["workflow", "playbook", "comparison"].includes(route.pageType));
  const resourceIds = new Set(["blog", "docs", "fde-client-handoff-playbook", "indie-agent-demo-to-maintenance", "ai-employee-vs-hiring-assistant"]);
  return siteContentRoutes.filter((route) => resourceIds.has(route.id));
}

function getEntryCopy(route: SiteRouteManifest, locale: Locale) {
  if (route.kind) {
    const content = seoResourceCopy[route.kind][locale];
    return { title: content.navLabel, description: content.metadataDescription, label: pageTypeLabel(route.pageType, locale) };
  }
  const fallback = resourceCopy[route.id]?.[locale];
  if (fallback) return fallback;
  return { title: route.id, description: route.path, label: pageTypeLabel(route.pageType, locale) };
}

function pageTypeLabel(pageType: string, locale: Locale) {
  const labels: Record<Locale, Record<string, string>> = {
    zh: { "solution-hub": "解决方案", workflow: "工作流", playbook: "实操清单", comparison: "选择指南", "content-index": "内容入口" },
    en: { "solution-hub": "Solution", workflow: "Workflow", playbook: "Playbook", comparison: "Decision guide", "content-index": "Content" },
  };
  return labels[locale][pageType] ?? pageType;
}

function buildHubJsonLd(
  hub: SeoHubKind,
  locale: Locale,
  copy: (typeof hubCopy)[SeoHubKind][Locale],
  entries: SiteRouteManifest[],
) {
  const path = `/${hub}`;
  const canonical = toAbsoluteSiteUrl(getCanonicalPath(path, locale));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `${copy.eyebrow} - MotiClaw`,
        description: copy.description,
        inLanguage: localeToHtmlLang(locale),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: entries.map((entry, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: toAbsoluteSiteUrl(getCanonicalPath(entry.path, locale)),
            name: getEntryCopy(entry, locale).title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: locale === "zh" ? "MotiClaw 首页" : "MotiClaw home", item: toAbsoluteSiteUrl("/") },
          { "@type": "ListItem", position: 2, name: copy.eyebrow, item: canonical },
        ],
      },
    ],
  };
}
