import type { Metadata } from "next";
import { headers } from "next/headers";
import { CompanyInfoPage } from "@/components/company-info-page";
import { detectLocale } from "@/lib/locale";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) { return typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined; }

async function localeOf(searchParams: SearchParams) {
  const [params, requestHeaders] = await Promise.all([searchParams, headers()]);
  return detectLocale([first(params.lang), requestHeaders.get("accept-language")].filter((value): value is string => Boolean(value)));
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const locale = await localeOf(searchParams);
  const title = locale === "zh" ? "联系 MotiClaw｜产品支持与合作" : "Contact MotiClaw | Product Support and Partnerships";
  const description = locale === "zh" ? "联系 MotiClaw 获取安装、产品使用、内容工作流或合作支持。" : "Contact MotiClaw for installation, product, content-workflow, or partnership support.";
  return { title, description, alternates: { canonical: `/contact?lang=${locale}`, languages: { "zh-CN": "/contact?lang=zh", en: "/contact?lang=en", "x-default": "/contact" } }, openGraph: { type: "website", url: "/contact", siteName: "MotiClaw", title, description } };
}

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  return <CompanyInfoPage kind="contact" locale={await localeOf(searchParams)} />;
}
