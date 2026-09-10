
type JsonRecord = Record<string, unknown>;

export const watchaPayApplicationId = "app_01m19ryqycsy72qtwjhzdhf2r5";

export const watchaPayProductionTargets = {
  plus: {
    entitlementType: "duration",
    tier: "plus",
    skuId: "sku_01m1zkh5b0dnfjv7j9bs3qy2tz",
    entitlementId: "ent_01m1zkh5b0cmek37ezw1tvyfv9",
  },
  pro: {
    entitlementType: "duration",
    tier: "pro",
    skuId: "sku_01m232ppq9gx6mdbzsyrfhxf8b",
    entitlementId: "ent_01m232ppq97hxd5jnczdcdwhfm",
  },
  modelPoints: {
    entitlementType: "quota",
    product: "model_points",
    skuId: "sku_01m1zkmykm64zvb8wgawkzr9vh",
    entitlementId: "ent_01m1zkmykmk6pe45qwtwbhccr7",
  },
} as const;

export const watchaPaySandboxTargets = {
  plus: {
    entitlementType: "duration",
    tier: "plus",
    skuId: "sku_01m19s63j9khbwckhbz8wr6x84",
    entitlementId: "ent_01m19s63j9b190kmy94mc0jqdx",
  },
  pro: {
    entitlementType: "duration",
    tier: "pro",
    skuId: "sku_01m19s8ac2f69bbyx6qcmvcxr5",
    entitlementId: "ent_01m19s8ac2w1z23yr4pzzv05ez",
  },
  modelPoints: {
    entitlementType: "quota",
    product: "model_points",
    skuId: "sku_01m1c6z8wy5svr47d6q7e1zqkf",
    entitlementId: "ent_01m1c6z8wywgnm2pyc6y4y7kx2",
  },
} as const;

export const watchaPayQuotaPackages = [
  { id: "starter", points: 1_000, amountCents: 980 },
  { id: "advanced", points: 3_200, amountCents: 2_980 },
  { id: "team", points: 7_800, amountCents: 6_980 },
] as const;

export type WatchaPayTier = "plus" | "pro";
export type WatchaPayEnvironment = "production" | "sandbox";
export type WatchaPayAccessState = "granted" | "purchase_required" | "unavailable";

export type WatchaPayDurationTarget = {
  entitlementType: "duration";
  tier: WatchaPayTier;
  skuId: string;
  entitlementId: string;
};

export type WatchaPayQuotaTarget = {
  entitlementType: "quota";
  product: "model_points";
  skuId: string;
  entitlementId: string;
};

export type WatchaPayTarget = WatchaPayDurationTarget | WatchaPayQuotaTarget;

type WatchaPayPurchaseAccess = {
  access: WatchaPayAccessState;
  purchaseUrl: string | null;
  qrCodeUrl: string | null;
};

export type WatchaPayDurationEntitlementAccess = WatchaPayPurchaseAccess & {
  entitlementType: "duration";
};

export type WatchaPayQuotaEntitlementAccess = WatchaPayPurchaseAccess & {
  entitlementType: "quota";
  remaining: number;
};

export type WatchaPayEntitlementAccess = WatchaPayDurationEntitlementAccess | WatchaPayQuotaEntitlementAccess;

export type SiteWatchaPayAccess = WatchaPayDurationEntitlementAccess & {
  environment: WatchaPayEnvironment;
  kind: "membership";
  planId: string;
  tier: WatchaPayTier;
  skuId: string;
  syncApplied: boolean;
  syncReplayed: boolean;
};

export type SiteWatchaPayQuotaAccess = WatchaPayQuotaEntitlementAccess & {
  environment: WatchaPayEnvironment;
  kind: "points";
  planId: string;
  product: "model_points";
  skuId: string;
  syncApplied: boolean;
  syncReplayed: boolean;
  syncRemainingPoints: number | null;
};

export type WatchaPayAccessRequestConfig = {
  apiBaseUrl: string;
  apiKey: string;
};

export class WatchaPayError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, status = 502) {
    super(code);
    this.name = "WatchaPayError";
    this.code = code;
    this.status = status;
  }
}

export function normalizeWatchaPayEntitlementAccess(value: unknown): WatchaPayEntitlementAccess | null {
  const item = recordOf(value);
  const entitlement = recordOf(item?.entitlement);
  if (entitlement?.type === "duration") return normalizeWatchaPayDurationEntitlementAccess(value);
  if (entitlement?.type === "quota") return normalizeWatchaPayQuotaEntitlementAccess(value);
  return null;
}

export function normalizeWatchaPayDurationEntitlementAccess(value: unknown): WatchaPayDurationEntitlementAccess | null {
  const item = recordOf(value);
  const access = normalizeAccessState(item?.access);
  const entitlement = recordOf(item?.entitlement);
  if (!item || !access || entitlement?.type !== "duration") return null;

  const { purchaseUrl, qrCodeUrl } = normalizePurchaseLinks(item.purchase);
  if (access === "purchase_required" && !purchaseUrl && !qrCodeUrl) return null;

  return {
    access,
    entitlementType: "duration",
    purchaseUrl,
    qrCodeUrl,
  };
}

export function normalizeWatchaPayQuotaEntitlementAccess(value: unknown): WatchaPayQuotaEntitlementAccess | null {
  const item = recordOf(value);
  const access = normalizeAccessState(item?.access);
  const entitlement = recordOf(item?.entitlement);
  const remaining = nonNegativeInteger(entitlement?.remaining);
  if (!item || !access || entitlement?.type !== "quota" || remaining === null) return null;
  if (access === "granted" && remaining === 0) return null;
  if (access === "purchase_required" && remaining > 0) return null;

  const { purchaseUrl, qrCodeUrl } = normalizePurchaseLinks(item.purchase);
  if (access === "purchase_required" && !purchaseUrl && !qrCodeUrl) return null;

  return {
    access,
    entitlementType: "quota",
    remaining,
    purchaseUrl,
    qrCodeUrl,
  };
}

export function normalizeSiteWatchaPayAccess(value: unknown): SiteWatchaPayAccess | null {
  const item = recordOf(value);
  const official = normalizeWatchaPayDurationEntitlementAccess(item);
  const planId = optionalString(item?.plan_id ?? item?.planId);
  const tier = normalizeTier(item?.tier);
  const skuId = optionalString(item?.sku_id ?? item?.skuId);
  const environment = normalizeEnvironment(item?.environment);
  const sync = normalizeSync(item?.sync);
  const expectedTarget = environment === "production"
    ? watchaPayProductionTargets[tier ?? "plus"]
    : environment === "sandbox"
      ? watchaPaySandboxTargets[tier ?? "plus"]
      : null;
  if (
    !official
    || !environment
    || item?.kind !== "membership"
    || !planId
    || !tier
    || skuId !== expectedTarget?.skuId
    || (official.access === "granted" && !sync.applied && !sync.replayed)
  ) return null;
  return {
    ...official,
    environment,
    kind: "membership",
    planId,
    tier,
    skuId,
    syncApplied: sync.applied,
    syncReplayed: sync.replayed,
  };
}

export function normalizeSiteWatchaPayQuotaAccess(value: unknown): SiteWatchaPayQuotaAccess | null {
  const item = recordOf(value);
  const official = normalizeWatchaPayQuotaEntitlementAccess(item);
  const planId = optionalString(item?.plan_id ?? item?.planId);
  const skuId = optionalString(item?.sku_id ?? item?.skuId);
  const environment = normalizeEnvironment(item?.environment);
  const sync = normalizeSync(item?.sync);
  const expectedTarget = environment === "production"
    ? watchaPayProductionTargets.modelPoints
    : environment === "sandbox"
      ? watchaPaySandboxTargets.modelPoints
      : null;
  if (
    !official
    || !environment
    || item?.kind !== "points"
    || !planId
    || skuId !== expectedTarget?.skuId
    || (official.access === "granted" && !sync.applied && !sync.replayed)
    || (official.access === "granted" && sync.remainingPoints === null)
  ) {
    return null;
  }
  return {
    ...official,
    environment,
    kind: "points",
    planId,
    product: "model_points",
    skuId,
    syncApplied: sync.applied,
    syncReplayed: sync.replayed,
    syncRemainingPoints: sync.remainingPoints,
  };
}

export function buildWatchaPayAccessRequest({
  config,
  target,
  userId,
  returnUrl,
}: {
  config: WatchaPayAccessRequestConfig;
  target: WatchaPayTarget;
  userId: string;
  returnUrl?: string | null;
}) {
  const apiKey = optionalString(config.apiKey);
  const entitlementId = optionalString(target.entitlementId);
  const normalizedUserId = optionalString(userId);
  const normalizedReturnUrl = optionalHttpUrl(returnUrl);
  if (!apiKey || !entitlementId) {
    throw new WatchaPayError("watcha_pay_not_configured", 503);
  }
  if (!normalizedUserId || new TextEncoder().encode(normalizedUserId).byteLength > 256) {
    throw new WatchaPayError("watcha_pay_user_invalid", 400);
  }
  if (returnUrl && !normalizedReturnUrl) {
    throw new WatchaPayError("watcha_pay_return_url_invalid", 400);
  }

  const url = new URL("/v1/entitlements/access", `${normalizeApiBaseUrl(config.apiBaseUrl)}/`);
  return {
    url: url.toString(),
    init: {
      method: "POST",
      cache: "no-store" as const,
      redirect: "error" as const,
      headers: {
        accept: "application/json",
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        entitlement_id: entitlementId,
        user_id: normalizedUserId,
        ...(normalizedReturnUrl ? { return_url: normalizedReturnUrl } : {}),
      }),
    },
  };
}

function normalizeApiBaseUrl(value: unknown) {
  const normalized = optionalString(value);
  if (!normalized) return "https://pay.watcha.cn";
  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "https:") throw new Error("https_required");
    return parsed.origin;
  } catch {
    throw new WatchaPayError("watcha_pay_not_configured", 503);
  }
}

function normalizeAccessState(value: unknown): WatchaPayAccessState | null {
  if (value === "granted" || value === "purchase_required" || value === "unavailable") return value;
  return null;
}

function normalizeEnvironment(value: unknown): WatchaPayEnvironment | null {
  return value === "production" || value === "sandbox" ? value : null;
}

function normalizeSync(value: unknown) {
  const item = recordOf(value);
  return {
    applied: item?.applied === true,
    replayed: item?.replayed === true,
    remainingPoints: nonNegativeInteger(item?.remaining_points ?? item?.remainingPoints),
  };
}

function normalizeTier(value: unknown): WatchaPayTier | null {
  if (value === "plus" || value === "pro") return value;
  return null;
}

function optionalHttpUrl(value: unknown) {
  const normalized = optionalString(value);
  if (!normalized) return null;
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function optionalHttpsUrl(value: unknown) {
  const normalized = optionalString(value);
  if (!normalized) return null;
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function normalizePurchaseLinks(value: unknown) {
  const purchase = recordOf(value);
  return {
    purchaseUrl: optionalHttpsUrl(purchase?.url),
    qrCodeUrl: optionalHttpsUrl(purchase?.qr_code_url ?? purchase?.qrCodeUrl),
  };
}

function nonNegativeInteger(value: unknown) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function recordOf(value: unknown): JsonRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : null;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
