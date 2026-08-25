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
  const title = locale === "zh" ? "关于 MotiClaw｜本地内容创作 AI 工作台" : "About MotiClaw | Local AI Content Creation Workspace";
  const description = locale === "zh" ? "了解 MotiClaw 的产品定位、本地优先原则与创作者信息。" : "Learn about MotiClaw, its local-first principles, and the creator behind the product.";
  return { title, description, alternates: { canonical: `/about?lang=${locale}`, languages: { "zh-CN": "/about?lang=zh", en: "/about?lang=en", "x-default": "/about" } }, openGraph: { type: "website", url: "/about", siteName: "MotiClaw", title, description } };
}

export default async function AboutPage({ searchParams }: { searchParams: SearchParams }) {
  return <CompanyInfoPage kind="about" locale={await localeOf(searchParams)} />;
}
