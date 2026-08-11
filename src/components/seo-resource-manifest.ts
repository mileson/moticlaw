import manifestData from "@/data/site-routes.json";
import type { SeoResourceKind } from "@/components/seo-resource-copy";
import type { Locale } from "@/lib/locale";

export type SeoPageType =
  | "conversion"
  | "product-detail"
  | "product-overview"
  | "solution-hub"
  | "workflow"
  | "playbook"
  | "comparison";

type LocalizedText = Record<Locale, string>;

export type SiteRouteManifest = {
  id: string;
  kind?: SeoResourceKind;
  path: string;
  locales: Locale[];
  pageType: string;
  cluster: string;
  parentHub: string | null;
  navTier: number;
  indexPolicy: "index" | "noindex";
  sitemap: boolean;
  relatedIds?: string[];
  schemaTypes?: string[];
  layoutRecipe?: string;
  visualProfile?: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
  lastModified: string;
};

export type SeoVisual = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  kind: "concept" | "screenshot";
};

type NavigationItem = {
  id: string;
  label: LocalizedText;
  routeId: string;
};

type VisualProfile = {
  assetId: string;
  kind: "concept" | "screenshot";
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
  caption: LocalizedText;
};

type SiteContentManifest = {
  version: number;
  navigation: NavigationItem[];
  visualProfiles: Record<string, VisualProfile>;
  routes: SiteRouteManifest[];
};

export const siteContentManifest = manifestData as SiteContentManifest;
export const siteContentRoutes = siteContentManifest.routes;

const routeById = new Map(siteContentRoutes.map((route) => [route.id, route]));
const routeByKind = new Map(
  siteContentRoutes
    .filter((route): route is SiteRouteManifest & { kind: SeoResourceKind } => Boolean(route.kind))
    .map((route) => [route.kind, route]),
);

export function getSiteRouteById(id: string) {
  return routeById.get(id) ?? null;
}

export function getSeoRouteByKind(kind: SeoResourceKind) {
  const route = routeByKind.get(kind);
  if (!route) throw new Error(`SEO route manifest is missing kind: ${kind}`);
  return route;
}

export function getSeoRelatedRoutes(kind: SeoResourceKind) {
  const route = getSeoRouteByKind(kind);
  return (route.relatedIds ?? [])
    .map((id) => routeById.get(id))
    .filter((item): item is SiteRouteManifest & { kind: SeoResourceKind } => Boolean(item?.kind));
}

export function getSeoNavigation(locale: Locale) {
  return siteContentManifest.navigation.map((item) => {
    const route = routeById.get(item.routeId);
    if (!route) throw new Error(`SEO navigation points to an unknown route: ${item.routeId}`);
    return {
      id: item.id,
      label: item.label[locale],
      path: route.path,
      href: withLocaleQuery(route.path, locale),
    };
  });
}

export function getActiveSeoNavigationId(path: string) {
  const route = siteContentRoutes.find((item) => item.path === path);
  if (!route) return null;
  if (["pricing"].includes(route.id)) return "pricing";
  if (["solutions"].includes(route.id) || route.pageType === "solution-hub") return "solutions";
  if (["workflows"].includes(route.id) || ["workflow", "playbook", "comparison"].includes(route.pageType)) return "workflows";
  if (["resources", "blog", "docs"].includes(route.id) || route.pageType === "content-index") return "resources";
  return ["home", "legal", "account"].includes(route.pageType) ? null : "product";
}

export function getIndexableSiteRoutes() {
  return siteContentRoutes.filter((route) => route.indexPolicy === "index" && route.sitemap);
}

export function getMonitoredSiteRoutes() {
  return getIndexableSiteRoutes();
}

export function getBreadcrumbRoutes(kind: SeoResourceKind) {
  const result: SiteRouteManifest[] = [];
  const visited = new Set<string>();
  let current: SiteRouteManifest = getSeoRouteByKind(kind);
  while (current.parentHub && !visited.has(current.parentHub)) {
    visited.add(current.parentHub);
    const parent = routeById.get(current.parentHub);
    if (!parent) break;
    result.unshift(parent);
    current = parent;
  }
  return result;
}

export function getManifestVisual(kind: SeoResourceKind, locale: Locale): SeoVisual {
  const route = getSeoRouteByKind(kind);
  const profileId = route.visualProfile;
  const profile = profileId ? siteContentManifest.visualProfiles[profileId] : null;
  if (!profile) throw new Error(`SEO route ${route.id} is missing a visual profile.`);

  const base = {
    src: profile.src,
    alt: profile.alt[locale],
    caption: profile.caption[locale],
    width: profile.width,
    height: profile.height,
    kind: profile.kind,
  } as const;

  return base;
}

export function getCanonicalPath(path: string, locale: Locale) {
  if (locale === "zh") return path;
  const url = new URL(path, "https://www.moticlaw.com");
  url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}`;
}

export function getLanguageAlternates(path: string) {
  return {
    "zh-CN": path,
    en: getCanonicalPath(path, "en"),
    "x-default": path,
  };
}

export function withLocaleQuery(path: string, locale: Locale, extraParams?: Record<string, string>) {
  const url = new URL(path, "https://www.moticlaw.com");
  url.searchParams.set("lang", locale);
  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) url.searchParams.set(key, value);
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

export function toAbsoluteSiteUrl(path: string) {
  return new URL(path, "https://www.moticlaw.com").toString();
}
