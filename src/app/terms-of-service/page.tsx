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
  const title = locale === "zh" ? "服务条款 - MotiClaw" : "Terms of Service - MotiClaw";
  const description = locale === "zh"
    ? "阅读使用 MotiClaw 产品与服务所适用的条款和条件。"
    : "Read the terms and conditions that apply to MotiClaw products and services.";
  const langParam = firstString(rawSearchParams.lang);
  const canonical = langParam === "zh" || langParam === "en" ? `/terms-of-service?lang=${langParam}` : "/terms-of-service";
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "zh-CN": "/terms-of-service?lang=zh",
        en: "/terms-of-service?lang=en",
      },
    },
    openGraph: { title, description, url: "/terms-of-service", siteName: "MotiClaw" },
  };
}

export default async function TermsOfServicePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [rawSearchParams, requestHeaders] = await Promise.all([searchParams, headers()]);
  const requestedLanguage = firstString(rawSearchParams.lang);
  const locale = detectLocale(
    [requestedLanguage, requestHeaders.get("accept-language")].filter((value): value is string => typeof value === "string"),
  );

  return <LegalDocumentPage kind="terms" locale={locale} />;
}

function firstString(value: string | string[] | undefined) {
  return typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined;
}
