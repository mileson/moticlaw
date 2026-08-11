import { cookies } from "next/headers";
import { siteSessionCookieName, SiteAuthRequestError } from "@/lib/site-auth";

type JsonRecord = Record<string, unknown>;

export const billingResponseHeaders = {
  "Cache-Control": "no-store",
};

export async function requireSiteSessionToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(siteSessionCookieName)?.value?.trim() || "";
  if (!token) {
    throw new SiteAuthRequestError("Website session is not available.", {
      code: "site_auth_session_missing",
      status: 401,
    });
  }
  return token;
}

export function requireBillingSameOrigin(request: Request) {
  const requestUrl = new URL(request.url);
  const forwardedProto = optionalString(request.headers.get("x-forwarded-proto"))?.split(",")[0]?.trim();
  const forwardedHost = optionalString(request.headers.get("x-forwarded-host"))?.split(",")[0]?.trim();
  const host = forwardedHost || optionalString(request.headers.get("host"));
  const allowedOrigins = new Set([requestUrl.origin]);
  if (host) {
    allowedOrigins.add(`${forwardedProto || requestUrl.protocol.replace(":", "")}://${host}`);
  }
  const originHeader = optionalString(request.headers.get("origin"));
  const refererHeader = optionalString(request.headers.get("referer"));
  let callerOrigin: string | null = null;

  try {
    callerOrigin = originHeader
      ? new URL(originHeader).origin
      : refererHeader
        ? new URL(refererHeader).origin
        : null;
  } catch {
    callerOrigin = null;
  }

  if (!callerOrigin || !allowedOrigins.has(callerOrigin)) {
    throw new SiteAuthRequestError("This billing request is not allowed.", {
      code: "site_billing_origin_invalid",
      status: 403,
    });
  }
}

export function billingJson(payload: JsonRecord, status = 200) {
  return Response.json(payload, {
    headers: billingResponseHeaders,
    status,
  });
}

export function billingNotFound() {
  return billingJson(
    {
      ok: false,
      error: {
        code: "site_billing_action_not_found",
        message: "This billing action is not available.",
      },
    },
    404,
  );
}

export function handleBillingError(error: unknown) {
  if (error instanceof SiteAuthRequestError) {
    return billingJson(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      error.status,
    );
  }

  return billingJson(
    {
      ok: false,
      error: {
        code: "site_billing_http_502",
        message: "The billing service is temporarily unavailable.",
      },
    },
    502,
  );
}

export async function readBillingBody(request: Request) {
  try {
    const payload = await request.json();
    return payload && typeof payload === "object" && !Array.isArray(payload) ? (payload as JsonRecord) : {};
  } catch {
    return {};
  }
}

export function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
