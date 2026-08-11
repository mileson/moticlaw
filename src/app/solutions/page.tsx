import type { Metadata } from "next";
import { buildSeoHubMetadata, SeoHubPage } from "@/components/seo-hub-page";
import { resolveSeoLocale, type SeoSearchParams } from "@/components/seo-resource-locale";

export async function generateMetadata({ searchParams }: { searchParams: SeoSearchParams }): Promise<Metadata> {
  return buildSeoHubMetadata("solutions", await resolveSeoLocale(searchParams));
}

export default async function SolutionsPage({ searchParams }: { searchParams: SeoSearchParams }) {
  return <SeoHubPage hub="solutions" locale={await resolveSeoLocale(searchParams)} />;
}
