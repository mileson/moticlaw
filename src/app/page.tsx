import type { Metadata } from "next";
import { headers } from "next/headers";
import { detectLocale, type Locale } from "@/lib/locale";
import { fetchLatestReleaseManifest } from "@/lib/release-manifest";
import { siteFaqJsonLd } from "@/lib/site-faq";
import { MotiClawLandingStatic } from "@/components/moticlaw-landing-static";

type HomeSearchParams = Promise<{ lang?: string }>;

const homeTitles: Record<Locale, string> = {
  zh: "MotiClaw 官网 - 本地 AI 伙伴与智能体控制平台",
  en: "MotiClaw - Local-First AI Partner & Agent Control Platform",
};

const homeDescriptions: Record<Locale, string> = {
  zh: "MotiClaw 是一个本地优先的 AI 伙伴与智能体控制平台，支持 macOS 与 Windows 下载部署。适合 FDE、老板、超级个体和 AI 独立开发者，用一个平台完成本地部署、Agent 管理和 AI 助手团队协作。",
  en: "MotiClaw is a local-first AI partner and agent control platform for macOS and Windows. Built for FDEs, founders, solo builders, and indie AI developers to deploy locally, manage agents, and run an AI assistant team from one place.",
};

function resolveHomeLocale(langParam: string | undefined, acceptLanguage: string | null): Locale {
  if (langParam === "en") return "en";
  if (langParam === "zh") return "zh";
  return detectLocale(acceptLanguage);
}

export async function generateMetadata({ searchParams }: { searchParams: HomeSearchParams }): Promise<Metadata> {
  const { lang } = await searchParams;
  const requestHeaders = await headers();
  const locale = resolveHomeLocale(lang, requestHeaders.get("accept-language"));
  const title = homeTitles[locale];
  const description = homeDescriptions[locale];
  // Self-referential canonical for explicit language variants (hreflang best practice).
  const canonical = lang === "zh" || lang === "en" ? `/?lang=${lang}` : "/";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "zh-CN": "/?lang=zh",
        en: "/?lang=en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? ["en_US"] : ["zh_CN"],
      url: "/",
      siteName: "MotiClaw",
      title,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MotiClaw" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function Home({ searchParams }: { searchParams: HomeSearchParams }) {
  const { lang } = await searchParams;
  const requestHeaders = await headers();
  const locale = resolveHomeLocale(lang, requestHeaders.get("accept-language"));
  const releaseManifest = await fetchLatestReleaseManifest();

  if (!releaseManifest) {
    throw new Error("Latest OSS release manifest is unavailable.");
  }

  const siteUrl = "https://www.moticlaw.com/";
  const siteDescription = homeDescriptions[locale];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: locale === "zh" ? "MotiClaw 官网" : "MotiClaw",
      alternateName: "MotiClaw",
      url: siteUrl,
      inLanguage: ["zh-CN", "en"],
      description: siteDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://www.moticlaw.com/#organization",
      name: "MotiClaw",
      url: siteUrl,
      logo: "https://www.moticlaw.com/icon-512.png",
    },
    siteFaqJsonLd(locale),
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "MotiClaw",
      url: siteUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "macOS, Windows",
      softwareVersion: releaseManifest.version,
      inLanguage: ["zh-CN", "en"],
      description: siteDescription,
      image: "https://www.moticlaw.com/icon-512.png",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CNY",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "本地优先，数据留在本机",
        "支持 Agent 团队安装、配置和日常运维",
        "支持 macOS 与 Windows 下载部署",
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <MotiClawLandingStatic locale={locale} releaseManifest={releaseManifest} />
    </>
  );
}
