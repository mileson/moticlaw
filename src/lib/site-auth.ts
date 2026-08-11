import { cookies } from "next/headers";

type JsonRecord = Record<string, unknown>;

const defaultSiteAuthApiBaseUrl = "https://api.moticlaw.com";
const localTurnstileSiteKey = "1x00000000000000000000AA";
const desktopReturnProtocols = new Set(["moticlaw:", "moticlaw-dev:"]);

export const siteSessionCookieName = "moticlaw_site_session";
export type SiteAuthPageMode = "login" | "register" | "forgot-password" | "reset-password";
export type TurnstileWidgetRegion = "world" | "china";

export type TurnstileWidgetConfig = {
  siteKey: string | null;
  region: TurnstileWidgetRegion | null;
  countryCode: string | null;
};

export type SiteAuthAccount = {
  id: string;
  provider: string;
  displayName: string;
  email?: string | null;
  avatarUrl?: string | null;
  roles: string[];
};

export type SiteAuthSession = {
  authenticated: boolean;
  expiresAt: string | null;
  account: SiteAuthAccount | null;
};

export type SiteAuthClientRedirect = {
  action: string;
  method: "get" | "post";
  fields?: Record<string, string>;
  fallback?: SiteAuthClientRedirect | null;
};

export class SiteAuthRequestError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details: unknown;
  readonly requestId: string | null;
  readonly errorId: string | null;

  constructor(
    message: string,
    options: { code?: string; status?: number; details?: unknown; requestId?: string | null; errorId?: string | null } = {},
  ) {
    super(message);
    this.name = "SiteAuthRequestError";
    this.code = options.code || "site_auth_request_failed";
    this.status = options.status ?? 500;
    this.details = options.details ?? null;
    this.requestId = options.requestId ?? null;
    this.errorId = options.errorId ?? null;
  }
}

export async function requestSiteAuthJson<T extends JsonRecord = JsonRecord>(
  path: string,
  options: {
    method?: "GET" | "POST";
    body?: JsonRecord;
    headers?: Record<string, string>;
    token?: string | null;
  } = {},
): Promise<T> {
  const url = new URL(path, `${resolveSiteAuthApiBaseUrl()}/`);
  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    cache: "no-store",
    headers: {
      accept: "application/json",
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await safeJsonRecord(response);
  if (!response.ok || payload.ok === false) {
    const errorRecord = recordOf(payload.error) ?? payload;
    throw new SiteAuthRequestError(optionalString(errorRecord.message) || `site_auth_http_${response.status}`, {
      code: optionalString(errorRecord.code) || `site_auth_http_${response.status}`,
      status: response.status,
      details: errorRecord.details ?? null,
      requestId: optionalString(errorRecord.request_id ?? errorRecord.requestId),
      errorId: optionalString(errorRecord.error_id ?? errorRecord.errorId),
    });
  }

  return payload as T;
}

export async function readSiteAuthSession(): Promise<SiteAuthSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get(siteSessionCookieName)?.value?.trim() || "";
  if (!token) return unauthenticatedSession();

  try {
    const payload = await requestSiteAuthJson("/v1/auth/session", { token });
    return normalizeSiteAuthSession(payload);
  } catch {
    return unauthenticatedSession();
  }
}

export function sessionCookieOptions(expiresAt: string | null | undefined) {
  const expires = expiresAt ? new Date(expiresAt) : null;
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(expires && Number.isFinite(expires.getTime()) ? { expires } : {}),
  };
}

export function resolveTurnstileSiteKey() {
  return resolveTurnstileWidgetConfig().siteKey;
}

export function resolveTurnstileWidgetConfig(options: { countryCode?: string | null } = {}): TurnstileWidgetConfig {
  const countryCode = normalizeCountryCode(options.countryCode);
  const siteKeys = resolveTurnstileWidgetSiteKeys();

  if (countryCode === "CN" && siteKeys.china) {
    return {
      siteKey: siteKeys.china,
      region: "china",
      countryCode,
    };
  }
  if (siteKeys.world) {
    return {
      siteKey: siteKeys.world,
      region: "world",
      countryCode,
    };
  }
  if (siteKeys.china) {
    return {
      siteKey: siteKeys.china,
      region: "china",
      countryCode,
    };
  }
  return {
    siteKey: null,
    region: null,
    countryCode,
  };
}

export function resolveTurnstileWidgetRegion(siteKey: unknown): TurnstileWidgetRegion | null {
  const normalizedSiteKey = optionalString(siteKey);
  if (!normalizedSiteKey) return null;
  const siteKeys = resolveTurnstileWidgetSiteKeys();
  if (siteKeys.china && normalizedSiteKey === siteKeys.china) return "china";
  if (siteKeys.world && normalizedSiteKey === siteKeys.world) return "world";
  return null;
}

export function resolveSiteAuthApiBaseUrl() {
  return (
    optionalString(process.env.MOTICLAW_SITE_AUTH_API_BASE_URL) ||
    optionalString(process.env.MOTICLAW_CLOUD_BACKEND_URL) ||
    defaultSiteAuthApiBaseUrl
  ).replace(/\/+$/, "");
}

export function unauthenticatedSession(): SiteAuthSession {
  return {
    authenticated: false,
    expiresAt: null,
    account: null,
  };
}

export function normalizeClientRedirectUri(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const parsed = new URL(value.trim());
    if (desktopReturnProtocols.has(parsed.protocol)) return parsed.toString();
    if ((parsed.protocol === "http:" || parsed.protocol === "https:") && ["127.0.0.1", "localhost", "::1"].includes(parsed.hostname)) {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}

export function isNativeClientRedirectUri(value: string): boolean {
  try {
    return desktopReturnProtocols.has(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function normalizeReturnToPath(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const raw = value.trim();
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  try {
    const parsed = new URL(raw, "https://www.moticlaw.com");
    if (parsed.origin !== "https://www.moticlaw.com") return null;
    if (["/login", "/register", "/forgot-password", "/reset-password"].includes(parsed.pathname)) return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

function normalizeSiteAuthSession(payload: JsonRecord): SiteAuthSession {
  if (payload.authenticated !== true) return unauthenticatedSession();

  const account = recordOf(payload.account);
  return {
    authenticated: true,
    expiresAt: optionalString(payload.expires_at ?? payload.expiresAt) ?? null,
    account: account
      ? {
          id: optionalString(account.id) || "",
          provider: optionalString(account.provider) || "email",
          displayName: optionalString(account.display_name ?? account.displayName ?? account.name) || "MotiClaw",
          email: optionalString(account.email) ?? null,
          avatarUrl: optionalString(account.avatar_url ?? account.avatarUrl) ?? null,
          roles: stringArray(account.roles),
        }
      : null,
  };
}

async function safeJsonRecord(response: Response): Promise<JsonRecord> {
  try {
    const payload = await response.json();
    return recordOf(payload) ?? {};
  } catch {
    return {};
  }
}

function recordOf(value: unknown): JsonRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : null;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

function normalizeCountryCode(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim().toUpperCase() : null;
}

function resolveTurnstileWidgetSiteKeys() {
  const world = optionalString(
    process.env.NEXT_PUBLIC_MOTICLAW_AUTH_TURNSTILE_SITE_KEY || process.env.MOTICLAW_AUTH_TURNSTILE_SITE_KEY,
  ) || (process.env.NODE_ENV === "production" ? null : localTurnstileSiteKey);
  const china = optionalString(
    process.env.NEXT_PUBLIC_MOTICLAW_AUTH_TURNSTILE_CHINA_SITE_KEY || process.env.MOTICLAW_AUTH_TURNSTILE_CHINA_SITE_KEY,
  );
  return { world, china };
}
