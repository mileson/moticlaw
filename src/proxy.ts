import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import siteRouteManifest from "@/data/site-routes.json";

type RequestLocale = "en" | "zh";

const deterministicSeoPaths = new Set(
  siteRouteManifest.routes
    .filter((route) => Boolean(route.kind) || route.pageType === "hub")
    .map((route) => route.path),
);

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-moticlaw-locale", resolveRequestLocale(request));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|webmanifest)$).*)"],
};

function resolveRequestLocale(request: NextRequest): RequestLocale {
  const explicitLocale = request.nextUrl.searchParams.get("lang");
  if (explicitLocale === "en" || explicitLocale === "zh") return explicitLocale;
  if (deterministicSeoPaths.has(request.nextUrl.pathname)) return "zh";

  const acceptedLanguages = request.headers.get("accept-language") ?? "";
  for (const candidate of acceptedLanguages.split(",")) {
    const normalized = candidate.trim().toLowerCase().split(";")[0];
    if (normalized === "en" || normalized.startsWith("en-")) return "en";
    if (normalized === "zh" || normalized.startsWith("zh-")) return "zh";
  }

  return "zh";
}
