import type { Metadata } from "next";
import { headers } from "next/headers";
import { LegalDocumentPage } from "@/components/legal-document-page";
import { detectLocale } from "@/lib/locale";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const [rawSearchParams, requestHeaders] = await Promise.all([searchParams, headers()]);
  const locale = detectLocale(
    [firstString(rawSearchParams.lang), requestHeaders.get("accept-language")].filter((value): value is string => typeof value === "string"),
  );
  const title = locale === "zh" ? "隐私政策 - MotiClaw" : "Privacy Policy - MotiClaw";
  const description = locale === "zh"
    ? "了解 MotiClaw 如何收集、使用和保护你的个人信息。"
    : "Learn how MotiClaw collects, uses, and protects your personal information.";
  const langParam = firstString(rawSearchParams.lang);
  const canonical = langParam === "zh" || langParam === "en" ? `/privacy?lang=${langParam}` : "/privacy";
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "zh-CN": "/privacy?lang=zh",
        en: "/privacy?lang=en",
      },
    },
    openGraph: { title, description, url: "/privacy", siteName: "MotiClaw" },
  };
}

export default async function PrivacyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [rawSearchParams, requestHeaders] = await Promise.all([searchParams, headers()]);
  const requestedLanguage = firstString(rawSearchParams.lang);
  const locale = detectLocale(
    [requestedLanguage, requestHeaders.get("accept-language")].filter((value): value is string => typeof value === "string"),
  );

  return <LegalDocumentPage kind="privacy" locale={locale} />;
}

function firstString(value: string | string[] | undefined) {
  return typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined;
}
