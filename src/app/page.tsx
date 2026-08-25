import type { Metadata } from "next";
import { headers } from "next/headers";
import { detectLocale, type Locale } from "@/lib/locale";
import { fetchLatestReleaseManifest } from "@/lib/release-manifest";
import { siteFaqJsonLd } from "@/lib/site-faq";
import { MotiClawLandingStatic } from "@/components/moticlaw-landing-static";

type HomeSearchParams = Promise<{ lang?: string }>;

const homeTitles: Record<Locale, string> = {
  zh: "MotiClaw｜本地内容创作 AI 工作台",
  en: "MotiClaw | Local AI Content Creation Workspace",
};

const homeDescriptions: Record<Locale, string> = {
  zh: "MotiClaw 是本地内容创作 AI 工作台，把灵感、素材、创作与发布收进一个本地工作空间，让 AI 完成大部分内容创作执行，数据默认留在你的设备上。",
  en: "MotiClaw is a local AI content creation workspace that brings ideas, source material, creation, and publishing into one place while your data stays on your device.",
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
  const founderId = "https://www.moticlaw.com/#founder";
  const organizationId = "https://www.moticlaw.com/#organization";
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "MotiClaw",
      alternateName: "MotiClaw",
      url: siteUrl,
      inLanguage: ["zh-CN", "en"],
      description: siteDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: "MotiClaw",
      url: siteUrl,
      logo: "https://www.moticlaw.com/icon-512.png",
      sameAs: ["https://x.com/Mileson07"],
      founder: { "@id": founderId },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "chaojifeng@shadowlaws.com",
        url: "https://www.moticlaw.com/contact",
        availableLanguage: ["zh-CN", "en"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": founderId,
      name: "超级峰",
      url: "https://www.moticlaw.com/about",
      sameAs: ["https://x.com/Mileson07"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://www.moticlaw.com/#webpage",
      url: siteUrl,
      name: homeTitles[locale],
      description: siteDescription,
      inLanguage: locale === "zh" ? "zh-CN" : "en",
      datePublished: "2026-08-18",
      dateModified: "2026-08-18",
      author: { "@id": founderId },
      publisher: { "@id": organizationId },
      about: { "@id": organizationId },
    },
    siteFaqJsonLd(locale),
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "MotiClaw",
      url: siteUrl,
      applicationCategory: "MultimediaApplication",
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
        "统一整理灵感、素材与创作任务",
        "用 AI 协助完成内容创作与发布准备",
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
