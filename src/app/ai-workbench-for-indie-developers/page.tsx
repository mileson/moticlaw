import type { Metadata } from "next";
import { buildSeoResourceMetadata } from "@/components/seo-resource-copy";
import { resolveSeoLocale, type SeoSearchParams } from "@/components/seo-resource-locale";
import { SeoResourcePage } from "@/components/seo-resource-page";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SeoSearchParams;
}): Promise<Metadata> {
  const locale = await resolveSeoLocale(searchParams);
  return buildSeoResourceMetadata("indieDevelopers", locale);
}

export default async function AiWorkbenchForIndieDevelopersPage({
  searchParams,
}: {
  searchParams: SeoSearchParams;
}) {
  const locale = await resolveSeoLocale(searchParams);
  return <SeoResourcePage kind="indieDevelopers" locale={locale} />;
}
