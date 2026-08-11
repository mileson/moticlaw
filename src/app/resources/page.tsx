import type { Metadata } from "next";
import { buildSeoHubMetadata, SeoHubPage } from "@/components/seo-hub-page";
import { resolveSeoLocale, type SeoSearchParams } from "@/components/seo-resource-locale";

export async function generateMetadata({ searchParams }: { searchParams: SeoSearchParams }): Promise<Metadata> {
  return buildSeoHubMetadata("resources", await resolveSeoLocale(searchParams));
}

export default async function ResourcesPage({ searchParams }: { searchParams: SeoSearchParams }) {
  return <SeoHubPage hub="resources" locale={await resolveSeoLocale(searchParams)} />;
}
