import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  isNativeClientRedirectUri,
  normalizeClientRedirectUri,
  normalizeReturnToPath,
  readSiteAuthSession,
  requestSiteAuthJson,
  resolveTurnstileWidgetConfig,
  resolveTurnstileWidgetRegion,
  sessionCookieOptions,
  siteSessionCookieName,
  type SiteAuthClientRedirect,
  SiteAuthRequestError,
} from "@/lib/site-auth";

type JsonRecord = Record<string, unknown>;

type AuthSessionPayload = {
  session_token?: string;
  expires_at?: string;
};

type AuthRegisterCodePayload = {
  message?: string;
  email?: string;
  expires_at?: string;
  preview_code?: string | null;
};

type AuthAuthorizePayload = {
  authorization_url?: string;
  state?: string;
};

type WatchaOAuthContext = {
  state: string;
  clientRedirectUri: string | null;
  fallbackRedirectUri: string | null;
  returnToPath: string | null;
  locale: "en" | "zh" | null;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const watchaOAuthContextCookieName = "moticlaw_watcha_oauth_context";
const watchaOAuthContextMaxAgeSeconds = 10 * 60;
const responseHeaders = {
  "Cache-Control": "no-store",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  const forwardedHeaders = buildForwardedHeaders(request);

  if (action !== "oauth-watcha" && action !== "oauth-watcha-callback") {
    return json(
      {
        ok: false,
        error: {
          code: "site_auth_action_not_found",
          message: "This account action is not available.",
        },
      },
      404,
    );
  }

  try {
    if (action === "oauth-watcha") {
      return await startWatchaOAuth(request, forwardedHeaders);
    }
    return await completeWatchaOAuth(request, forwardedHeaders);
  } catch (error) {
    const code = error instanceof SiteAuthRequestError ? error.code : "site_auth_http_502";
    const context = (await readWatchaOAuthContext()) ?? contextFromRequest(request);
    return redirectToWatchaLogin(request, context, code);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  const body = await readBody(request);
  const forwardedHeaders = buildForwardedHeaders(request);
  const requestId = forwardedHeaders["x-request-id"] || null;

  try {
    if (action === "event") {
      logSiteAuthEvent(body, request, requestId);
      return json({ ok: true });
    }

    if (action === "login") {
      const clientRedirectUri = resolveClientRedirectUri(body);
      const fallbackRedirectUri = resolveFallbackRedirectUri(body);
      const turnstile = resolveTurnstileForwardContext(body, request);
      const result = await requestSiteAuthJson<AuthSessionPayload>("/v1/auth/login", {
        method: "POST",
        body: {
          email: optionalString(body.email) || "",
          password: optionalString(body.password) || "",
          channel: "web",
          turnstile_token: optionalString(body.turnstileToken ?? body.turnstile_token),
          turnstile_site_key: turnstile.siteKey,
        },
        headers: forwardedHeaders,
      });
      const cookieStore = await cookies();
      cookieStore.set(
        siteSessionCookieName,
        optionalString(result.session_token) || "",
        sessionCookieOptions(optionalString(result.expires_at) ?? null),
      );
      return json({
        ok: true,
        ...(clientRedirectUri ? {
          clientRedirect: buildClientRedirect(
            clientRedirectUri,
            fallbackRedirectUri,
            optionalString(result.session_token),
            optionalString(result.expires_at),
          ),
        } : {}),
      });
    }

    if (action === "register") {
      const turnstile = resolveTurnstileForwardContext(body, request);
      const result = await requestSiteAuthJson<AuthRegisterCodePayload>("/v1/auth/register/request-code", {
        method: "POST",
        body: {
          email: optionalString(body.email) || "",
          password: optionalString(body.password) || "",
          display_name: optionalString(body.displayName ?? body.display_name),
          channel: "web",
          turnstile_token: optionalString(body.turnstileToken ?? body.turnstile_token),
          turnstile_site_key: turnstile.siteKey,
        },
        headers: forwardedHeaders,
      });
      const cookieStore = await cookies();
      cookieStore.delete(siteSessionCookieName);
      return json({
        ok: true,
        message: optionalString(result.message) || "验证码已经发送，请先完成邮箱验证。",
        verification: {
          email: optionalString(result.email) || optionalString(body.email) || "",
          expiresAt: optionalString(result.expires_at) || null,
        },
        previewCode: optionalString(result.preview_code) ?? null,
      });
    }

    if (action === "register-resend") {
      const result = await requestSiteAuthJson<AuthRegisterCodePayload>("/v1/auth/register/resend", {
        method: "POST",
        body: {
          email: optionalString(body.email) || "",
          channel: "web",
        },
        headers: forwardedHeaders,
      });
      return json({
        ok: true,
        message: optionalString(result.message) || "验证码已经重新发送。",
        verification: {
          email: optionalString(result.email) || optionalString(body.email) || "",
          expiresAt: optionalString(result.expires_at) || null,
        },
        previewCode: optionalString(result.preview_code) ?? null,
      });
    }

    if (action === "register-verify") {
      const clientRedirectUri = resolveClientRedirectUri(body);
      const fallbackRedirectUri = resolveFallbackRedirectUri(body);
      const result = await requestSiteAuthJson<AuthSessionPayload>("/v1/auth/register/verify", {
        method: "POST",
        body: {
          email: optionalString(body.email) || "",
          code: optionalString(body.code) || "",
          channel: "web",
        },
        headers: forwardedHeaders,
      });
      const cookieStore = await cookies();
      cookieStore.set(
        siteSessionCookieName,
        optionalString(result.session_token) || "",
        sessionCookieOptions(optionalString(result.expires_at) ?? null),
      );
      if (clientRedirectUri) {
        return json({
          ok: true,
          clientRedirect: buildClientRedirect(
            clientRedirectUri,
            fallbackRedirectUri,
            optionalString(result.session_token),
            optionalString(result.expires_at),
          ),
        });
      }
      return json({
        ok: true,
        message: "账号已经创建好。现在可以继续使用 MotiClaw。",
      });
    }

    if (action === "forgot-password") {
      const turnstile = resolveTurnstileForwardContext(body, request);
      const result = await requestSiteAuthJson<{
        message?: string;
        preview_reset_url?: string | null;
      }>("/v1/auth/forgot-password", {
        method: "POST",
        body: {
          email: optionalString(body.email) || "",
          channel: "web",
          turnstile_token: optionalString(body.turnstileToken ?? body.turnstile_token),
          turnstile_site_key: turnstile.siteKey,
        },
        headers: forwardedHeaders,
      });
      return json({
        ok: true,
        message: optionalString(result.message) || "如果这个邮箱已经注册，我们会把重置链接发到邮箱里。",
        previewResetUrl: optionalString(result.preview_reset_url) ?? null,
      });
    }

    if (action === "reset-password") {
      const result = await requestSiteAuthJson<{
        message?: string;
      }>("/v1/auth/reset-password", {
        method: "POST",
        body: {
          token: optionalString(body.token) || "",
          new_password: optionalString(body.newPassword ?? body.new_password) || "",
        },
        headers: forwardedHeaders,
      });
      return json({
        ok: true,
        message: optionalString(result.message) || "密码已经更新。现在回到 MotiClaw Desktop，用新密码登录就可以了。",
      });
    }

    if (action === "logout") {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get(siteSessionCookieName)?.value?.trim() || "";
      if (sessionToken) {
        await requestSiteAuthJson("/v1/auth/logout", {
          method: "POST",
          token: sessionToken,
        }).catch(() => null);
      }
      cookieStore.delete(siteSessionCookieName);
      return json({ ok: true });
    }

    if (action === "handoff") {
      const clientRedirectUri = resolveClientRedirectUri(body);
      const fallbackRedirectUri = resolveFallbackRedirectUri(body);
      if (!clientRedirectUri) {
        return json(
          {
            ok: false,
            error: {
              code: "invalid_client_redirect_uri",
              message: "Client redirect URI is not allowed.",
            },
          },
          400,
        );
      }
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get(siteSessionCookieName)?.value?.trim() || "";
      const viewerSession = await readSiteAuthSession();
      if (!sessionToken || viewerSession.authenticated !== true) {
        cookieStore.delete(siteSessionCookieName);
        return json(
          {
            ok: false,
            error: {
              code: "site_auth_session_missing",
              message: "Website session is not available.",
            },
          },
          401,
        );
      }
      return json({
        ok: true,
        clientRedirect: buildClientRedirect(clientRedirectUri, fallbackRedirectUri, sessionToken, viewerSession.expiresAt),
      });
    }

    return json(
      {
        ok: false,
        error: {
          code: "site_auth_action_not_found",
          message: "This account action is not available.",
        },
      },
      404,
    );
  } catch (error) {
    if (error instanceof SiteAuthRequestError) {
      const turnstile = resolveTurnstileForwardContext(body, request);
      return json(
        {
          ok: false,
          error: {
            code: error.code,
            message: error.message,
            details: enrichErrorDetails(error.code, error.details, turnstile),
            request_id: error.requestId,
            error_id: error.errorId,
          },
        },
        error.status,
      );
    }

    return json(
      {
        ok: false,
        error: {
          code: "site_auth_http_502",
          message: "The account service is temporarily unavailable.",
        },
      },
      502,
    );
  }
}

function json(payload: JsonRecord, status = 200) {
  return Response.json(payload, {
    headers: responseHeaders,
    status,
  });
}

async function startWatchaOAuth(request: Request, forwardedHeaders: Record<string, string>) {
  const context = contextFromRequest(request);
  const result = await requestSiteAuthJson<AuthAuthorizePayload>("/v1/auth/oauth/watcha/authorize", {
    method: "POST",
    body: {
      mode: "external",
      client_redirect_uri: context.clientRedirectUri || undefined,
    },
    headers: forwardedHeaders,
  });
  const authorizationUrl = optionalString(result.authorization_url);
  const state = optionalString(result.state);
  if (!authorizationUrl || !state) {
    throw new SiteAuthRequestError("Watcha OAuth authorization URL is not available.", {
      code: "oauth_authorization_url_missing",
      status: 502,
    });
  }

  const response = NextResponse.redirect(authorizationUrl, 302);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(
    watchaOAuthContextCookieName,
    JSON.stringify({ ...context, state }),
    watchaOAuthCookieOptions(),
  );
  return response;
}

async function completeWatchaOAuth(request: Request, forwardedHeaders: Record<string, string>) {
  const requestUrl = new URL(request.url);
  const context = await readWatchaOAuthContext();
  if (!context) {
    return redirectToWatchaLogin(request, contextFromRequest(request), "oauth_state_invalid");
  }

  const providerError = optionalString(requestUrl.searchParams.get("error"));
  if (providerError) {
    return redirectToWatchaLogin(request, context, "oauth_access_denied");
  }

  const state = optionalString(requestUrl.searchParams.get("state"));
  if (!state || state !== context.state) {
    return redirectToWatchaLogin(request, context, "oauth_state_invalid");
  }

  const code = optionalString(requestUrl.searchParams.get("code"));
  if (!code) {
    return redirectToWatchaLogin(request, context, "oauth_code_missing");
  }

  const callbackQuery = new URLSearchParams({ code, state });
  const result = await requestSiteAuthJson<AuthSessionPayload>(`/v1/auth/oauth/watcha/callback?${callbackQuery.toString()}`, {
    headers: forwardedHeaders,
  });
  const sessionToken = optionalString(result.session_token);
  if (!sessionToken) {
    throw new SiteAuthRequestError("Website session is not available.", {
      code: "site_auth_session_missing",
      status: 502,
    });
  }

  const response = NextResponse.redirect(watchaOAuthSuccessUrl(request, context), 302);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(siteSessionCookieName, sessionToken, sessionCookieOptions(optionalString(result.expires_at)));
  response.cookies.delete(watchaOAuthContextCookieName);
  return response;
}

async function readWatchaOAuthContext(): Promise<WatchaOAuthContext | null> {
  const cookieStore = await cookies();
  return parseWatchaOAuthContext(cookieStore.get(watchaOAuthContextCookieName)?.value);
}

function parseWatchaOAuthContext(value: unknown): WatchaOAuthContext | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const raw = JSON.parse(value) as JsonRecord;
    const state = optionalString(raw.state);
    if (!state) return null;
    return {
      state,
      clientRedirectUri: normalizeClientRedirectUri(optionalString(raw.clientRedirectUri)),
      fallbackRedirectUri: normalizeClientRedirectUri(optionalString(raw.fallbackRedirectUri)),
      returnToPath: normalizeReturnToPath(optionalString(raw.returnToPath)),
      locale: normalizeLocale(optionalString(raw.locale)),
    };
  } catch {
    return null;
  }
}

function contextFromRequest(request: Request): WatchaOAuthContext {
  const requestUrl = new URL(request.url);
  return {
    state: "",
    clientRedirectUri: normalizeClientRedirectUri(requestUrl.searchParams.get("client_redirect_uri")),
    fallbackRedirectUri: normalizeClientRedirectUri(requestUrl.searchParams.get("fallback_redirect_uri")),
    returnToPath: normalizeReturnToPath(requestUrl.searchParams.get("return_to")),
    locale: normalizeLocale(requestUrl.searchParams.get("lang")),
  };
}

function normalizeLocale(value: unknown): "en" | "zh" | null {
  return value === "en" || value === "zh" ? value : null;
}

function watchaOAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: watchaOAuthContextMaxAgeSeconds,
  };
}

function watchaOAuthSuccessUrl(request: Request, context: WatchaOAuthContext) {
  const origin = resolvePublicOrigin(request);
  if (!context.clientRedirectUri && context.returnToPath) {
    const target = new URL(context.returnToPath, origin);
    if (context.locale) target.searchParams.set("lang", context.locale);
    return target;
  }
  if (!context.clientRedirectUri) {
    const target = new URL("/login", origin);
    if (context.locale) target.searchParams.set("lang", context.locale);
    return target;
  }
  return watchaLoginUrl(request, context);
}

function redirectToWatchaLogin(request: Request, context: WatchaOAuthContext, errorCode: string) {
  const response = NextResponse.redirect(watchaLoginUrl(request, context, errorCode), 302);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.delete(watchaOAuthContextCookieName);
  return response;
}

function watchaLoginUrl(request: Request, context: WatchaOAuthContext, errorCode?: string) {
  const target = new URL("/login", resolvePublicOrigin(request));
  if (context.locale) target.searchParams.set("lang", context.locale);
  if (context.clientRedirectUri) target.searchParams.set("client_redirect_uri", context.clientRedirectUri);
  if (context.fallbackRedirectUri) target.searchParams.set("fallback_redirect_uri", context.fallbackRedirectUri);
  if (context.returnToPath) target.searchParams.set("return_to", context.returnToPath);
  if (errorCode) {
    target.searchParams.set("oauth_error", errorCode);
  } else {
    target.searchParams.set("provider", "watcha");
  }
  return target;
}

function resolvePublicOrigin(request: Request) {
  const forwardedProto = optionalString(request.headers.get("x-forwarded-proto"));
  const forwardedHost = optionalString(request.headers.get("x-forwarded-host"));
  const directHost = optionalString(request.headers.get("host"));
  const protocol = forwardedProto === "https" || forwardedProto === "http" ? forwardedProto : new URL(request.url).protocol.replace(/:$/, "");
  const host = forwardedHost || directHost || new URL(request.url).host;
  if (host === "www.moticlaw.com" || host === "moticlaw.com") {
    return `${protocol === "http" ? "http" : "https"}://${host}`;
  }
  if (process.env.NODE_ENV !== "production" && (host.startsWith("localhost:") || host.startsWith("127.0.0.1:"))) {
    return `${protocol || "http"}://${host}`;
  }
  return "https://www.moticlaw.com";
}

async function readBody(request: Request) {
  try {
    const payload = await request.json();
    return payload && typeof payload === "object" && !Array.isArray(payload) ? (payload as JsonRecord) : {};
  } catch {
    return {};
  }
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function resolveClientRedirectUri(body: JsonRecord) {
  return normalizeClientRedirectUri(optionalString(body.clientRedirectUri ?? body.client_redirect_uri));
}

function resolveFallbackRedirectUri(body: JsonRecord) {
  return normalizeClientRedirectUri(optionalString(body.fallbackRedirectUri ?? body.fallback_redirect_uri));
}

function buildClientRedirect(
  clientRedirectUri: string,
  fallbackRedirectUri: string | null,
  sessionToken: string | null,
  expiresAt: string | null,
): SiteAuthClientRedirect {
  const primaryRedirectUri = clientRedirectUri || fallbackRedirectUri;
  if (!primaryRedirectUri) {
    throw new SiteAuthRequestError("Client redirect URI is not allowed.", {
      code: "invalid_client_redirect_uri",
      status: 400,
    });
  }

  const fields = {
    session_token: sessionToken || "",
    ...(expiresAt ? { expires_at: expiresAt } : {}),
  };
  if (isNativeClientRedirectUri(primaryRedirectUri)) {
    const action = new URL(primaryRedirectUri);
    action.searchParams.set("session_token", sessionToken || "");
    if (expiresAt) action.searchParams.set("expires_at", expiresAt);
    return {
      action: action.toString(),
      method: "get",
      fallback:
        fallbackRedirectUri && fallbackRedirectUri !== primaryRedirectUri
          ? {
              action: fallbackRedirectUri,
              method: "post",
              fields,
            }
          : null,
    };
  }

  return {
    action: primaryRedirectUri,
    method: "post",
    fields,
  };
}

function buildForwardedHeaders(request: Request) {
  const headers: Record<string, string> = {};
  const clientIp = resolveIncomingClientIp(request);
  if (clientIp) headers["x-forwarded-for"] = clientIp;
  const userAgent = optionalString(request.headers.get("user-agent"));
  if (userAgent) headers["user-agent"] = userAgent;
  const countryCode = optionalString(request.headers.get("cf-ipcountry"));
  if (countryCode) headers["cf-ipcountry"] = countryCode;
  headers["x-request-id"] = optionalString(request.headers.get("x-request-id")) || crypto.randomUUID();
  return headers;
}

function resolveIncomingClientIp(request: Request) {
  const forwardedFor = optionalString(request.headers.get("x-forwarded-for"));
  if (forwardedFor) {
    const firstHop = forwardedFor.split(",")[0];
    const normalized = normalizeForwardedIp(firstHop);
    if (normalized) return normalized;
  }
  return normalizeForwardedIp(request.headers.get("x-real-ip"));
}

function normalizeForwardedIp(value: string | null) {
  if (!value) return null;
  const candidate = value.trim().replace(/^for=/i, "").replace(/^\"|\"$/g, "").replace(/^\[|\]$/g, "");
  return candidate || null;
}

function logSiteAuthEvent(body: JsonRecord, request: Request, requestId: string | null) {
  const kind = optionalString(body.kind);
  if (kind === "turnstile") {
    logTurnstileEvent(body, request, requestId);
    return;
  }
  logDesktopReturnEvent(body, request, requestId);
}

function logDesktopReturnEvent(body: JsonRecord, request: Request, requestId: string | null) {
  const eventName = optionalString(body.event) || "unknown";
  const redirect = body.redirect && typeof body.redirect === "object" ? summarizeRedirectTarget(body.redirect as JsonRecord) : null;
  const detail = optionalString(body.detail);
  const errorCode = optionalString(body.errorCode ?? body.error_code);
  const log = eventName.includes("failed") || eventName.includes("blocked") ? console.warn : console.info;
  log("site auth desktop return event", {
    event: eventName,
    mode: optionalString(body.mode) || "unknown",
    requestId,
    clientIp: resolveIncomingClientIp(request),
    detail,
    errorCode,
    redirect,
    loopbackPermission: optionalString(body.loopbackPermission ?? body.loopback_permission),
    visibilityState: optionalString(body.visibilityState ?? body.visibility_state),
  });
}

function logTurnstileEvent(body: JsonRecord, request: Request, requestId: string | null) {
  const eventName = optionalString(body.event) || "unknown";
  const errorCode = optionalString(body.errorCode ?? body.error_code);
  const retryCount = optionalNumber(body.retry_count ?? body.retryCount);
  const scriptLoadMs = optionalNumber(body.script_load_ms ?? body.scriptLoadMs);
  const exhausted = body.exhausted === true;
  const turnstile = resolveTurnstileForwardContext(body, request);
  const log = errorCode || exhausted ? console.warn : console.info;
  log("site auth turnstile event", {
    event: eventName,
    mode: optionalString(body.mode) || "unknown",
    requestId,
    clientIp: resolveIncomingClientIp(request),
    countryCode: turnstile.countryCode,
    turnstileRegion: turnstile.region,
    scriptLoadMs,
    errorCode,
    retryCount,
    exhausted,
    detail: optionalString(body.detail),
  });
}

function summarizeRedirectTarget(body: JsonRecord) {
  const action = optionalString(body.action);
  if (!action) return null;
  try {
    const url = new URL(action);
    return {
      method: optionalString(body.method) || "unknown",
      protocol: url.protocol,
      host: url.host || null,
      pathname: url.pathname || null,
      hasFallback: body.hasFallback === true || body.has_fallback === true,
    };
  } catch {
    return {
      method: optionalString(body.method) || "unknown",
      protocol: "invalid",
      host: null,
      pathname: null,
      hasFallback: body.hasFallback === true || body.has_fallback === true,
    };
  }
}

function optionalNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function resolveTurnstileForwardContext(body: JsonRecord, request: Request) {
  const fallback = resolveTurnstileWidgetConfig({
    countryCode: request.headers.get("cf-ipcountry"),
  });
  const siteKey = optionalString(body.turnstileSiteKey ?? body.turnstile_site_key) || fallback.siteKey;
  return {
    siteKey,
    region: resolveTurnstileWidgetRegion(siteKey) ?? fallback.region,
    countryCode: fallback.countryCode,
  };
}

function enrichErrorDetails(
  code: string,
  details: unknown,
  turnstile: ReturnType<typeof resolveTurnstileForwardContext>,
) {
  if (!code.startsWith("turnstile_")) {
    return details;
  }
  const record = details && typeof details === "object" && !Array.isArray(details) ? { ...(details as JsonRecord) } : {};
  if (!record.country_code && turnstile.countryCode) {
    record.country_code = turnstile.countryCode;
  }
  if (!record.widget_region && turnstile.region) {
    record.widget_region = turnstile.region;
  }
  return Object.keys(record).length > 0 ? record : null;
}
