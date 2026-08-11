type JsonRecord = Record<string, unknown>;
type BillingLocale = "en" | "zh";

export type SiteMembershipPlanHighlight = {
  label: string;
  labelI18n: Partial<Record<BillingLocale, string>>;
};

export type SiteMembershipBenefit = {
  benefitId: string;
  title: string;
  titleI18n: Partial<Record<BillingLocale, string>>;
  description: string;
  descriptionI18n: Partial<Record<BillingLocale, string>>;
};

export type SiteMembershipPlan = {
  planId: string;
  sortOrder: number;
  recommended: boolean;
  amountCents: number;
  currency: "CNY";
  points: number;
  bonusPoints: number;
  totalPoints: number;
  name: string;
  nameI18n: Partial<Record<BillingLocale, string>>;
  badge: string | null;
  badgeI18n: Partial<Record<BillingLocale, string>>;
  description: string;
  descriptionI18n: Partial<Record<BillingLocale, string>>;
  highlights: SiteMembershipPlanHighlight[];
  tier: string;
  durationDays: number;
  maxAgents: number | null;
};

export type SiteMembershipStatus = {
  tier: string;
  active: boolean;
  expiresAt: string | null;
  planId: string | null;
  maxAgents: number | null;
};

export type SitePointPlan = {
  planId: string;
  sortOrder: number;
  recommended: boolean;
  amountCents: number;
  currency: "CNY";
  points: number;
  bonusPoints: number;
  totalPoints: number;
  name: string;
  nameI18n: Partial<Record<BillingLocale, string>>;
  badge: string | null;
  badgeI18n: Partial<Record<BillingLocale, string>>;
  description: string;
  descriptionI18n: Partial<Record<BillingLocale, string>>;
};

export type SiteBillingCatalog = {
  revision: string | null;
  plans: SiteMembershipPlan[];
  benefits: SiteMembershipBenefit[];
};

export type SitePointsCatalog = {
  plans: SitePointPlan[];
};

export type SitePointsAccount = {
  remainingPoints: number;
  totalRechargedPoints: number;
  totalConsumedPoints: number;
  updatedAt: string | null;
};

export type SitePointLedgerEntry = {
  entryId: string;
  kind: "recharge" | "consume" | "adjustment";
  points: number;
  balanceAfter: number;
  sourceType: string;
  sourceId: string | null;
  orderNo: string | null;
  occurredAt: string;
  note: string;
  createdAt: string;
};

export type SitePointRechargeOrder = {
  orderId: string;
  outTradeNo: string;
  planId: string;
  status: string;
  provider: string;
  description: string;
  amountCents: number;
  currency: string;
  points: number;
  codeUrl: string | null;
  tradeState: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function normalizeMembershipCatalog(value: unknown): SiteBillingCatalog {
  const item = recordOf(value);
  return {
    revision: optionalString(item?.revision),
    plans: (Array.isArray(item?.plans) ? item?.plans : [])
      .map(normalizeMembershipPlan)
      .filter((plan): plan is SiteMembershipPlan => Boolean(plan))
      .sort((a, b) => a.sortOrder - b.sortOrder),
    benefits: (Array.isArray(item?.benefits) ? item?.benefits : [])
      .map(normalizeMembershipBenefit)
      .filter((benefit): benefit is SiteMembershipBenefit => Boolean(benefit)),
  };
}

export function normalizePointsCatalog(value: unknown): SitePointsCatalog {
  const item = recordOf(value);
  return {
    plans: (Array.isArray(item?.plans) ? item?.plans : [])
      .map(normalizePointPlan)
      .filter((plan): plan is SitePointPlan => Boolean(plan))
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export function normalizeMembershipPlan(value: unknown): SiteMembershipPlan | null {
  const item = recordOf(value);
  const planId = optionalString(item?.plan_id ?? item?.planId);
  if (!item || !planId) return null;
  const maxAgentsValue = Object.prototype.hasOwnProperty.call(item, "max_agents") ? item.max_agents : item.maxAgents;
  return {
    planId,
    sortOrder: numberOf(item.sort_order ?? item.sortOrder),
    recommended: item.recommended === true,
    amountCents: numberOf(item.amount_cents ?? item.amountCents),
    currency: "CNY",
    points: numberOf(item.points),
    bonusPoints: numberOf(item.bonus_points ?? item.bonusPoints),
    totalPoints: numberOf(item.total_points ?? item.totalPoints),
    name: stringOf(item.name) || planId,
    nameI18n: localeTextMap(item.name_i18n ?? item.nameI18n),
    badge: optionalString(item.badge),
    badgeI18n: localeTextMap(item.badge_i18n ?? item.badgeI18n),
    description: stringOf(item.description),
    descriptionI18n: localeTextMap(item.description_i18n ?? item.descriptionI18n),
    highlights: (Array.isArray(item.highlights) ? item.highlights : [])
      .map(normalizeMembershipHighlight)
      .filter((highlight): highlight is SiteMembershipPlanHighlight => Boolean(highlight)),
    tier: optionalString(item.tier) ?? "free",
    durationDays: numberOf(item.duration_days ?? item.durationDays) || 30,
    maxAgents: maxAgentsOf(maxAgentsValue, 8),
  };
}

export function normalizeMembershipStatus(value: unknown): SiteMembershipStatus {
  const item = recordOf(value);
  const maxAgentsValue = item && Object.prototype.hasOwnProperty.call(item, "max_agents") ? item.max_agents : item?.maxAgents;
  return {
    tier: optionalString(item?.tier) ?? "free",
    active: item?.active === true,
    expiresAt: optionalString(item?.expires_at ?? item?.expiresAt),
    planId: optionalString(item?.plan_id ?? item?.planId),
    maxAgents: maxAgentsOf(maxAgentsValue, 8),
  };
}

export function normalizeMembershipBenefit(value: unknown): SiteMembershipBenefit | null {
  const item = recordOf(value);
  const benefitId = optionalString(item?.benefit_id ?? item?.benefitId);
  if (!item || !benefitId) return null;
  return {
    benefitId,
    title: stringOf(item.title),
    titleI18n: localeTextMap(item.title_i18n ?? item.titleI18n),
    description: stringOf(item.description),
    descriptionI18n: localeTextMap(item.description_i18n ?? item.descriptionI18n),
  };
}

export function normalizePointPlan(value: unknown): SitePointPlan | null {
  const item = recordOf(value);
  const planId = optionalString(item?.plan_id ?? item?.planId);
  if (!item || !planId) return null;
  return {
    planId,
    sortOrder: numberOf(item.sort_order ?? item.sortOrder),
    recommended: item.recommended === true,
    amountCents: numberOf(item.amount_cents ?? item.amountCents),
    currency: "CNY",
    points: numberOf(item.points),
    bonusPoints: numberOf(item.bonus_points ?? item.bonusPoints),
    totalPoints: numberOf(item.total_points ?? item.totalPoints),
    name: stringOf(item.name) || planId,
    nameI18n: localeTextMap(item.name_i18n ?? item.nameI18n),
    badge: optionalString(item.badge),
    badgeI18n: localeTextMap(item.badge_i18n ?? item.badgeI18n),
    description: stringOf(item.description),
    descriptionI18n: localeTextMap(item.description_i18n ?? item.descriptionI18n),
  };
}

export function normalizeMembershipHighlight(value: unknown): SiteMembershipPlanHighlight | null {
  const item = recordOf(value);
  const label = stringOf(item?.label);
  if (!item || !label) return null;
  return {
    label,
    labelI18n: localeTextMap(item.label_i18n ?? item.labelI18n),
  };
}

export function normalizeAccount(value: unknown): SitePointsAccount | null {
  const item = recordOf(value);
  if (!item) return null;
  return {
    remainingPoints: numberOf(item.remaining_points ?? item.remainingPoints),
    totalRechargedPoints: numberOf(item.total_recharged_points ?? item.totalRechargedPoints),
    totalConsumedPoints: numberOf(item.total_consumed_points ?? item.totalConsumedPoints),
    updatedAt: optionalString(item.updated_at ?? item.updatedAt),
  };
}

export function normalizeLedgerEntry(value: unknown): SitePointLedgerEntry | null {
  const item = recordOf(value);
  const kind = normalizeLedgerKind(item?.kind);
  if (!item || !kind) return null;
  return {
    entryId: stringOf(item.entry_id ?? item.entryId),
    kind,
    points: numberOf(item.points),
    balanceAfter: numberOf(item.balance_after ?? item.balanceAfter),
    sourceType: stringOf(item.source_type ?? item.sourceType),
    sourceId: optionalString(item.source_id ?? item.sourceId),
    orderNo: optionalString(item.order_no ?? item.orderNo),
    occurredAt: stringOf(item.occurred_at ?? item.occurredAt),
    note: stringOf(item.note),
    createdAt: stringOf(item.created_at ?? item.createdAt),
  };
}

export function normalizeOrder(value: unknown): SitePointRechargeOrder | null {
  const item = recordOf(value);
  const planId = optionalString(item?.plan_id ?? item?.planId);
  if (!item || !planId) return null;
  return {
    orderId: stringOf(item.order_id ?? item.orderId),
    outTradeNo: stringOf(item.out_trade_no ?? item.outTradeNo),
    planId,
    status: stringOf(item.status),
    provider: stringOf(item.provider),
    description: stringOf(item.description),
    amountCents: numberOf(item.amount_cents ?? item.amountCents),
    currency: stringOf(item.currency) || "CNY",
    points: numberOf(item.points),
    codeUrl: optionalString(item.code_url ?? item.codeUrl),
    tradeState: optionalString(item.trade_state ?? item.tradeState),
    paidAt: optionalString(item.paid_at ?? item.paidAt),
    expiresAt: optionalString(item.expires_at ?? item.expiresAt),
    createdAt: stringOf(item.created_at ?? item.createdAt),
    updatedAt: stringOf(item.updated_at ?? item.updatedAt),
  };
}

function normalizeLedgerKind(value: unknown): SitePointLedgerEntry["kind"] | null {
  if (value === "recharge" || value === "consume" || value === "adjustment") return value;
  return null;
}

function recordOf(value: unknown): JsonRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : null;
}

function stringOf(value: unknown) {
  return typeof value === "string" ? value : "";
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberOf(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function maxAgentsOf(value: unknown, fallback: number | null) {
  if (value === null) return null;
  const maxAgents = numberOf(value);
  return maxAgents > 0 ? maxAgents : fallback;
}

function localeTextMap(value: unknown): Partial<Record<BillingLocale, string>> {
  const item = recordOf(value);
  return {
    en: optionalString(item?.en) ?? undefined,
    zh: optionalString(item?.zh) ?? undefined,
  };
}
