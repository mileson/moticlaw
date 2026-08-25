import type { Metadata } from "next";
import { headers } from "next/headers";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { detectLocale, type Locale } from "@/lib/locale";
import { readMembershipCatalog } from "@/lib/site-billing-server";
import type { SiteMembershipPlan } from "@/lib/site-billing";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderStatic } from "@/components/site-header-static";

type PricingSearchParams = Promise<{ lang?: string }>;

const titles: Record<Locale, string> = {
  zh: "套餐价格 - MotiClaw 订阅定价",
  en: "Pricing - MotiClaw Plans",
};

const descriptions: Record<Locale, string> = {
  zh: "查看 MotiClaw 免费版、Plus 与 Pro 订阅套餐的托管模型额度、AI 伙伴数量与价格。本地优先，先免费上手，再按需升级。",
  en: "Compare MotiClaw Free, Plus, and Pro plans: hosted-model allowance, AI partner counts, and prices. Local-first - start free and upgrade when you need more.",
};

function resolveLocale(langParam: string | undefined, acceptLanguage: string | null): Locale {
  if (langParam === "en") return "en";
  if (langParam === "zh") return "zh";
  return detectLocale(acceptLanguage);
}

export async function generateMetadata({ searchParams }: { searchParams: PricingSearchParams }): Promise<Metadata> {
  const { lang } = await searchParams;
  const requestHeaders = await headers();
  const locale = resolveLocale(lang, requestHeaders.get("accept-language"));

  const canonical = lang === "zh" || lang === "en" ? `/pricing?lang=${lang}` : "/pricing";

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical,
      languages: {
        "zh-CN": "/pricing?lang=zh",
        en: "/pricing?lang=en",
        "x-default": "/pricing",
      },
    },
    openGraph: {
      type: "website",
      url: "/pricing",
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

const pageCopy = {
  zh: {
    eyebrow: "套餐价格",
    title: "先免费上手，再按需升级",
    body: "MotiClaw 桌面端免费下载使用，数据留在你自己的设备上。订阅套餐可按月或按年开通，提供更多托管模型额度，并提高可创建的 AI 伙伴数量上限。",
    freeName: "Free",
    freePrice: "¥0",
    freeUnit: "永久免费",
    freeBody: "本地优先的完整桌面端体验，适合先把 AI 伙伴团队跑起来。",
    freeHighlights: ["完整桌面端功能，本地数据不出设备", "默认可创建 8 个 AI 伙伴", "基础托管模型额度", "社区与飞书群支持"],
    billingPeriodLabel: "选择付费周期",
    monthlyLabel: "月付",
    annualLabel: "年付",
    perMonth: "/ 月",
    perYear: "/ 年",
    subscribeCta: "开通套餐",
    freeCta: "免费下载",
    faqTitle: "定价常见问题",
    faqs: [
      { q: "免费版和订阅套餐有什么区别？", a: "免费版包含完整的本地桌面端能力，数据留在你自己的设备上。订阅套餐主要提供更多托管模型额度，并提高可创建的 AI 伙伴数量上限。" },
      { q: "Plus 和 Pro 应该怎么选？", a: "Plus 和 Pro 提供不同的托管模型额度。日常使用可以选择 Plus，使用更频繁或任务更多时可以选择 Pro。" },
      { q: "如何付款？支持哪些支付方式？", a: "登录后在会员中心选择套餐，目前支持微信支付扫码付款，支付成功后立即生效。" },
      { q: "订阅到期后会发生什么？", a: "到期后自动回落到免费版额度，已有数据和 AI 伙伴不受影响，随时可以重新开通。" },
    ],
    compareNote: "所有套餐都包含完整桌面端功能；差异只在托管模型额度与 AI 伙伴数量。",
    unavailable: "套餐目录暂时不可用，请稍后再试，或直接前往会员中心查看。",
  },
  en: {
    eyebrow: "Pricing",
    title: "Start free, upgrade when you need more",
    body: "The MotiClaw desktop app is free to download, and your data stays on your device. Monthly and annual plans provide more hosted-model allowance and increase the AI partner cap.",
    freeName: "Free",
    freePrice: "¥0",
    freeUnit: "forever",
    freeBody: "The full local-first desktop experience - get your AI partner team running first.",
    freeHighlights: ["Full desktop features, data never leaves your device", "Create up to 8 AI partners", "Base hosted-model allowance", "Community & Feishu group support"],
    billingPeriodLabel: "Choose billing period",
    monthlyLabel: "Monthly",
    annualLabel: "Annual",
    perMonth: "/ mo",
    perYear: "/ yr",
    subscribeCta: "Subscribe",
    freeCta: "Download free",
    faqTitle: "Pricing FAQ",
    faqs: [
      { q: "What is the difference between Free and paid plans?", a: "Free includes the full local desktop experience with your data on your own device. Paid plans provide more hosted-model allowance and increase the AI partner cap." },
      { q: "How should I choose between Plus and Pro?", a: "Plus and Pro provide different hosted-model allowances. Choose Plus for everyday use, or Pro when you use MotiClaw more often or run more tasks." },
      { q: "How do I pay?", a: "Sign in and pick a plan in the membership center. WeChat Pay QR payment is currently supported, and orders take effect immediately after payment." },
      { q: "What happens when my subscription expires?", a: "Your account falls back to the Free allowance. Your data and AI partners are untouched, and you can re-subscribe anytime." },
    ],
    compareNote: "Every plan includes the full desktop feature set; plans only differ in hosted-model allowance and AI partner counts.",
    unavailable: "The plan catalog is temporarily unavailable. Please try again later or check the membership center.",
  },
} as const;

function formatMoney(amountCents: number) {
  const yuan = amountCents / 100;
  return `¥${Number.isInteger(yuan) ? yuan : yuan.toFixed(2)}`;
}

function planBillingUnit(durationDays: number, copy: { perMonth: string; perYear: string }) {
  return durationDays >= 300 ? copy.perYear : copy.perMonth;
}

export default async function PricingPage({ searchParams }: { searchParams: PricingSearchParams }) {
  const { lang } = await searchParams;
  const requestHeaders = await headers();
  const locale = resolveLocale(lang, requestHeaders.get("accept-language"));
  const copy = pageCopy[locale];

  const membershipCatalog = await readMembershipCatalog().catch(() => ({
    revision: null,
    plans: [] as SiteMembershipPlan[],
    benefits: [],
  }));

  const membershipPlans = [...membershipCatalog.plans].sort(compareMembershipPlans);
  const membershipHref = `/account/membership?lang=${locale}&view=plans`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="site-shell relative overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteHeaderStatic locale={locale} path="/pricing" />

      <div className="mx-auto w-full max-w-7xl px-4 pt-[6.5rem] pb-16 sm:px-8 lg:px-10">
        <header className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow-lg mb-3">{copy.eyebrow}</p>
          <h1 className="display text-4xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-5xl">{copy.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">{copy.body}</p>
        </header>

        <div
          className="pricing-period-switch mt-8"
          role="group"
          aria-label={copy.billingPeriodLabel}
          data-pricing-period-switch
        >
          <button
            type="button"
            className="pricing-period-option"
            aria-pressed="true"
            data-pricing-period-toggle="monthly"
            data-active="true"
          >
            {copy.monthlyLabel}
          </button>
          <button
            type="button"
            className="pricing-period-option"
            aria-pressed="false"
            data-pricing-period-toggle="annual"
            data-active="false"
          >
            {copy.annualLabel}
          </button>
        </div>

        <section
          className="pricing-plan-grid mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-label={copy.eyebrow}
          data-pricing-plan-grid
          data-pricing-period="monthly"
        >
          <article className="pricing-plan-card flex flex-col rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <div className="space-y-2 lg:min-h-30">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{copy.freeName}</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.freeBody}</p>
            </div>
            <p className="mt-5 flex items-baseline gap-2">
              <strong className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">{copy.freePrice}</strong>
              <span className="text-sm text-[var(--muted)]">{copy.freeUnit}</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2.5 text-sm leading-6 text-[var(--foreground)]">
              {copy.freeHighlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={16} weight="bold" className="mt-1 shrink-0 text-[var(--accent-strong)]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a href={`/?lang=${locale}&download=1`} className="btn-base btn-secondary mt-6 w-full justify-center py-3">
              {copy.freeCta}
            </a>
          </article>

          {membershipPlans.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[var(--line)] p-6 text-sm leading-6 text-[var(--muted)] md:col-span-1 lg:col-span-3">
              {copy.unavailable}
            </div>
          ) : (
            membershipPlans.map((plan) => {
              const badge = plan.badgeI18n[locale] || plan.badge;
              const billingPeriod = planBillingPeriod(plan.durationDays);
              return (
                <article
                  key={plan.planId}
                  className={`pricing-plan-card relative flex flex-col rounded-3xl border p-6 ${
                    plan.recommended
                      ? "border-[color-mix(in_srgb,var(--foreground)_32%,transparent)] bg-[var(--surface-strong)] shadow-[0_18px_44px_rgba(0,0,0,0.12)]"
                      : "border-[var(--line)] bg-[var(--surface)]"
                  }`}
                  data-pricing-plan-period={billingPeriod}
                  hidden={billingPeriod === "annual"}
                >
                  {badge ? (
                    <span className="absolute -top-3 left-6 rounded-full border border-[var(--line)] bg-[var(--foreground)] px-3 py-1 text-xs font-semibold text-[var(--background)] shadow-sm">
                      {badge}
                    </span>
                  ) : null}
                  <div className="space-y-2 lg:min-h-30">
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">{plan.nameI18n[locale] || plan.name}</h2>
                    <p className="text-sm leading-6 text-[var(--muted)]">{plan.descriptionI18n[locale] || plan.description}</p>
                  </div>
                  <p className="mt-5 flex items-baseline gap-2">
                    <strong className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">{formatMoney(plan.amountCents)}</strong>
                    <span className="text-sm text-[var(--muted)]">{planBillingUnit(plan.durationDays, copy)}</span>
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5 text-sm leading-6 text-[var(--foreground)]">
                    {plan.highlights.map((highlight, index) => (
                      <li key={`${plan.planId}-${index}`} className="flex items-start gap-2">
                        <Check size={16} weight="bold" className="mt-1 shrink-0 text-[var(--accent-strong)]" aria-hidden="true" />
                        <span>{highlight.labelI18n[locale] || highlight.label}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={membershipHref}
                    className={`btn-base mt-6 w-full justify-center py-3 ${plan.recommended ? "btn-primary" : "btn-secondary"}`}
                  >
                    {copy.subscribeCta}
                  </a>
                </article>
              );
            })
          )}
        </section>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">{copy.compareNote}</p>

        <section className="mx-auto mt-16 max-w-3xl" aria-label={copy.faqTitle}>
          <h2 className="text-center text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">{copy.faqTitle}</h2>
          <div className="mt-6 space-y-3">
            {copy.faqs.map((item) => (
              <article key={item.q} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-4">
                <h3 className="text-base font-medium text-[var(--foreground)]">{item.q}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter locale={locale} />
      <script src="/landing.js" defer></script>
    </main>
  );
}

function compareMembershipPlans(a: SiteMembershipPlan, b: SiteMembershipPlan) {
  const tierRank = (tier: string) => (tier === "plus" ? 0 : tier === "pro" ? 1 : 2);
  return tierRank(a.tier) - tierRank(b.tier) || a.durationDays - b.durationDays || a.sortOrder - b.sortOrder;
}

function planBillingPeriod(durationDays: number): "monthly" | "annual" {
  return durationDays >= 300 ? "annual" : "monthly";
}
