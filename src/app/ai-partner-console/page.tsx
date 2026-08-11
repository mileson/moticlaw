import type { Metadata } from "next";
import { headers } from "next/headers";
import { AiPartnerConsole } from "@/app/ai-partner-console/ai-partner-console";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderStatic } from "@/components/site-header-static";
import { detectLocale, localeToHtmlLang, type Locale } from "@/lib/locale";

type ConsoleSearchParams = Promise<Record<string, string | string[] | undefined>>;

const metadataCopy: Record<Locale, { title: string; description: string }> = {
  zh: {
    title: "MotiClaw AI 伙伴管理台 - 可体验原型",
    description: "体验一个浅色、高密度的 MotiClaw AI 伙伴管理台：筛选状态、搜索伙伴、查看渠道、任务、消耗、健康状态和最近活动。",
  },
  en: {
    title: "MotiClaw AI Partner Console - Interactive Prototype",
    description:
      "Try a light, dense MotiClaw AI partner console for filtering partners, searching status, reviewing channels, tasks, usage, health, and recent activity.",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: ConsoleSearchParams;
}): Promise<Metadata> {
  const locale = await resolveLocale(searchParams);
  const content = metadataCopy[locale];

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `/ai-partner-console?lang=${locale}`,
      languages: {
        "zh-CN": "/ai-partner-console?lang=zh",
        en: "/ai-partner-console?lang=en",
        "x-default": "/ai-partner-console",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? ["en_US"] : ["zh_CN"],
      url: "/ai-partner-console",
      siteName: "MotiClaw",
      title: content.title,
      description: content.description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MotiClaw" }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function AiPartnerConsolePage({
  searchParams,
}: {
  searchParams: ConsoleSearchParams;
}) {
  const locale = await resolveLocale(searchParams);

  return (
    <main lang={localeToHtmlLang(locale)} className="site-shell min-h-screen bg-[#f5f7f9] text-[#17212b]">
      <SiteHeaderStatic locale={locale} path="/ai-partner-console" variant="page" />
      <AiPartnerConsole locale={locale} />
      <SiteFooter locale={locale} />
      <script src="/landing.js" defer></script>
    </main>
  );
}

async function resolveLocale(searchParams: ConsoleSearchParams) {
  const [rawSearchParams, requestHeaders] = await Promise.all([searchParams, headers()]);
  const requestedLanguage = firstString(rawSearchParams.lang);
  return detectLocale(
    [requestedLanguage, requestHeaders.get("accept-language")].filter((value): value is string => typeof value === "string"),
  );
}

function firstString(value: string | string[] | undefined) {
  return typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined;
}
