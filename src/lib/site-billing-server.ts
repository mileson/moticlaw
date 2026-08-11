import { cookies } from "next/headers";
import {
  readSiteAuthSession,
  requestSiteAuthJson,
  siteSessionCookieName,
  type SiteAuthSession,
} from "@/lib/site-auth";
import {
  normalizeAccount,
  normalizeLedgerEntry,
  normalizeMembershipCatalog,
  normalizeMembershipStatus,
  normalizeOrder,
  normalizePointsCatalog,
  type SiteBillingCatalog,
  type SiteMembershipStatus,
  type SitePointLedgerEntry,
  type SitePointRechargeOrder,
  type SitePointsAccount,
  type SitePointsCatalog,
} from "@/lib/site-billing";

export type SiteMembershipInitialData = {
  session: Awaited<ReturnType<typeof readSiteAuthSession>>;
  catalog: SiteBillingCatalog;
  orders: SitePointRechargeOrder[];
  membershipStatus: SiteMembershipStatus | null;
  unavailable: boolean;
};

export type SitePointsInitialData = {
  session: Awaited<ReturnType<typeof readSiteAuthSession>>;
  catalog: SitePointsCatalog;
  account: SitePointsAccount | null;
  ledgerEntries: SitePointLedgerEntry[];
  orders: SitePointRechargeOrder[];
  unavailable: boolean;
};

export type SiteBillingInitialData = {
  session: Awaited<ReturnType<typeof readSiteAuthSession>>;
  catalog: SiteBillingCatalog;
  account: SitePointsAccount | null;
  ledgerEntries: SitePointLedgerEntry[];
  orders: SitePointRechargeOrder[];
  unavailable: boolean;
};

export async function readSiteMembershipInitialData(sessionOverride?: SiteAuthSession): Promise<SiteMembershipInitialData> {
  const session = sessionOverride ?? (await readSiteAuthSession());
  const [catalog, orders, membershipStatus] = await Promise.all([
    readMembershipCatalog().catch(() => ({ revision: null, plans: [], benefits: [] })),
    session.authenticated ? readMembershipOrdersData().catch(() => []) : [],
    session.authenticated ? readMembershipStatusData().catch(() => null) : null,
  ]);

  return {
    session,
    catalog,
    orders,
    membershipStatus,
    unavailable: catalog.plans.length === 0,
  };
}

export async function readSitePointsInitialData(sessionOverride?: SiteAuthSession): Promise<SitePointsInitialData> {
  const session = sessionOverride ?? (await readSiteAuthSession());
  const [catalog, accountData] = await Promise.all([
    readPointsCatalog().catch(() => ({ plans: [] })),
    session.authenticated
      ? readAccountPointsData().catch(() => ({ account: null, ledgerEntries: [], orders: [] }))
      : null,
  ]);

  return {
    session,
    catalog,
    account: accountData?.account ?? null,
    ledgerEntries: accountData?.ledgerEntries ?? [],
    orders: accountData?.orders ?? [],
    unavailable: catalog.plans.length === 0,
  };
}

export async function readSiteBillingInitialData(sessionOverride?: SiteAuthSession): Promise<SiteBillingInitialData> {
  const session = sessionOverride ?? (await readSiteAuthSession());
  const [catalog, accountData] = await Promise.all([
    readMembershipCatalog().catch(() => ({ revision: null, plans: [], benefits: [] })),
    session.authenticated
      ? readAccountPointsData().catch(() => ({ account: null, ledgerEntries: [], orders: [] }))
      : null,
  ]);

  return {
    session,
    catalog,
    account: accountData?.account ?? null,
    ledgerEntries: accountData?.ledgerEntries ?? [],
    orders: accountData?.orders ?? [],
    unavailable: catalog.plans.length === 0,
  };
}

export async function readMembershipCatalog(): Promise<SiteBillingCatalog> {
  const payload = await requestSiteAuthJson("/v1/billing/membership/catalog");
  return normalizeMembershipCatalog(payload);
}

export async function readPointsCatalog(): Promise<SitePointsCatalog> {
  const payload = await requestSiteAuthJson("/v1/billing/points/plans");
  return normalizePointsCatalog(payload);
}

async function readAccountPointsData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(siteSessionCookieName)?.value?.trim() || "";
  if (!token) return { account: null, ledgerEntries: [], orders: [] };
  const [ledgerPayload, ordersPayload] = await Promise.all([
    requestSiteAuthJson("/v1/billing/points/ledger?limit=8", { token }),
    requestSiteAuthJson("/v1/billing/points/orders", { token }),
  ]);
  return {
    account: normalizeAccount(ledgerPayload.account ?? ordersPayload.account),
    ledgerEntries: (Array.isArray(ledgerPayload.entries) ? ledgerPayload.entries : [])
      .map(normalizeLedgerEntry)
      .filter((entry): entry is SitePointLedgerEntry => Boolean(entry)),
    orders: (Array.isArray(ordersPayload.orders) ? ordersPayload.orders : [])
      .map(normalizeOrder)
      .filter((order): order is SitePointRechargeOrder => Boolean(order)),
  };
}

async function readMembershipOrdersData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(siteSessionCookieName)?.value?.trim() || "";
  if (!token) return [];
  const ordersPayload = await requestSiteAuthJson("/v1/billing/membership/orders", { token });
  return (Array.isArray(ordersPayload.orders) ? ordersPayload.orders : [])
    .map(normalizeOrder)
    .filter((order): order is SitePointRechargeOrder => Boolean(order));
}

async function readMembershipStatusData(): Promise<SiteMembershipStatus | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(siteSessionCookieName)?.value?.trim() || "";
  if (!token) return null;
  const payload = await requestSiteAuthJson("/v1/billing/membership/status", { token });
  return normalizeMembershipStatus(payload);
}
