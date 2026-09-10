"use client";

import {
  ArrowClockwise,
  CheckCircle,
  Crown,
  CreditCard,
  Lightning,
  ListChecks,
  Receipt,
  Sparkle,
  WarningCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BillingShell,
  CopyOrderButton,
  Feedback,
  findPendingOrderForPlan,
  formatDateTime,
  formatInteger,
  formatMoney,
  includedPointsLabel,
  isReadyPaymentOrder,
  localizedPlanName,
  ModalShell,
  OrdersTable,
  PaymentModalSkeleton,
  RecordEmpty,
  requestBilling,
  resolveBillingError,
  SectionHeading,
} from "@/components/site-billing-shared";
import { sitePointsCopy } from "@/components/site-points-copy";
import type { Locale } from "@/lib/locale";
import type { SiteAuthSession } from "@/lib/site-auth";
import {
  normalizeAccount,
  normalizeLedgerEntry,
  normalizeOrder,
  type SitePointLedgerEntry,
  type SitePointRechargeOrder,
  type SitePointsAccount,
  type SitePointsCatalog,
} from "@/lib/site-billing";
import {
  normalizeSiteWatchaPayQuotaAccess,
  watchaPayQuotaPackages,
  type SiteWatchaPayQuotaAccess,
} from "@/lib/site-watcha-pay";

type ApiResult = {
  ok?: boolean;
  account?: unknown;
  entries?: unknown[];
  orders?: unknown[];
  order?: unknown;
};

type PaymentNotice = { kind: "success" | "error" | "info"; title: string; body?: string };

export function SitePointsPage({
  locale,
  loginHref,
  viewerSession,
  initialCatalog,
  initialAccount,
  initialLedgerEntries,
  initialOrders,
  watchaPayConfigured,
  watchaReturnPlanId,
  unavailable,
}: {
  locale: Locale;
  loginHref: string;
  viewerSession: SiteAuthSession;
  initialCatalog: SitePointsCatalog;
  initialAccount: SitePointsAccount | null;
  initialLedgerEntries: SitePointLedgerEntry[];
  initialOrders: SitePointRechargeOrder[];
  watchaPayConfigured: boolean;
  watchaReturnPlanId: string | null;
  unavailable: boolean;
}) {
  const content = sitePointsCopy[locale];
  const [catalog] = useState(() => ({
    ...initialCatalog,
    plans: [...initialCatalog.plans].sort((a, b) => a.sortOrder - b.sortOrder),
  }));
  const [account, setAccount] = useState(initialAccount);
  const [ledgerEntries, setLedgerEntries] = useState(initialLedgerEntries);
  const [orders, setOrders] = useState(initialOrders);
  const [selectedPlanId, setSelectedPlanId] = useState(
    () => catalog.plans.find((plan) => plan.recommended)?.planId ?? catalog.plans[0]?.planId ?? "",
  );
  const [activeOrder, setActiveOrder] = useState<SitePointRechargeOrder | null>(
    () => findPendingOrderForPlan(initialOrders, selectedPlanId),
  );
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [watchaQuotaOpen, setWatchaQuotaOpen] = useState(false);
  const [watchaQuotaChecking, setWatchaQuotaChecking] = useState(false);
  const [watchaQuotaAccess, setWatchaQuotaAccess] = useState<SiteWatchaPayQuotaAccess | null>(null);
  const [watchaQuotaError, setWatchaQuotaError] = useState<string | null>(null);
  const [message, setMessage] = useState<PaymentNotice | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<PaymentNotice | null>(null);
  const watchaReturnAttemptRef = useRef(false);

  const plans = catalog.plans;
  const planMap = useMemo(() => new Map(plans.map((plan) => [plan.planId, plan])), [plans]);
  const signedIn = viewerSession.authenticated && viewerSession.account;
  const accountStatus = viewerSession.account?.displayName || content.signedOutState;
  const accountEmail = viewerSession.account?.email?.trim() || null;
  const accountAvatarUrl = viewerSession.account?.avatarUrl?.trim() || null;
  const latestLedgerAt = ledgerEntries[0]?.occurredAt || ledgerEntries[0]?.createdAt || account?.updatedAt || null;
  const latestActivityLabel = latestLedgerAt
    ? `${content.lastUpdated} ${formatDateTime(latestLedgerAt, locale)}`
    : content.emptyLedger;
  const balanceValue = signedIn ? `${formatInteger(account?.remainingPoints ?? 0)} ${content.points}` : "-";
  const totalRechargedValue = signedIn ? `${formatInteger(account?.totalRechargedPoints ?? 0)} ${content.points}` : "-";
  const totalConsumedValue = signedIn ? `${formatInteger(account?.totalConsumedPoints ?? 0)} ${content.points}` : "-";
  const paymentPlan = planMap.get(activeOrder?.planId || selectedPlanId || "");
  const paymentPlanValue = paymentPlan ? localizedPlanName(paymentPlan, locale) : content.awaitingPayment;
  const paymentPointsValue = activeOrder
    ? includedPointsLabel(activeOrder.points, locale, content.points)
    : paymentPlan
      ? includedPointsLabel(paymentPlan.totalPoints, locale, content.points)
      : "-";
  const paymentAmountValue = activeOrder
    ? formatMoney(activeOrder.amountCents)
    : paymentPlan
      ? formatMoney(paymentPlan.amountCents)
      : "-";
  const paymentOrderValue = activeOrder?.outTradeNo || "-";
  const readyPaymentOrder = isReadyPaymentOrder(activeOrder) ? activeOrder : null;
  const paymentCompleted = activeOrder?.status === "paid";
  const paymentExpired = activeOrder ? ["closed", "failed", "expired"].includes(activeOrder.status) : false;

  async function checkWatchaQuota(planId: string, refresh = false) {
    setSelectedPlanId(planId);
    setWatchaQuotaChecking(true);
    setWatchaQuotaAccess(null);
    setWatchaQuotaError(null);
    setWatchaQuotaOpen(true);
    try {
      const payload = await requestBilling("/api/billing/points/watcha-pay/access", {
        method: "POST",
        body: { planId, locale, refresh },
      });
      const access = normalizeSiteWatchaPayQuotaAccess(payload);
      if (!access) throw new Error("watcha_pay_response_invalid");
      setWatchaQuotaAccess(access);
      if (access.access === "granted") await refreshPointsData({ quiet: true });
    } catch (error) {
      const resolved = resolveBillingError(error, content.errors);
      setWatchaQuotaError(resolved.message);
    } finally {
      setWatchaQuotaChecking(false);
    }
  }

  async function beginCheckout(planId: string) {
    setSelectedPlanId(planId);
    setPaymentNotice(null);
    setMessage(null);
    const pendingOrder = findPendingOrderForPlan(orders, planId);
    if (pendingOrder?.codeUrl) {
      setActiveOrder(pendingOrder);
      setPaymentModalOpen(true);
      return;
    }
    await createOrder(planId);
  }

  async function createOrder(planId: string) {
    setSelectedPlanId(planId);
    setActiveOrder(null);
    setPaymentModalOpen(true);
    setCreating(true);
    try {
      const payload = (await requestBilling("/api/billing/points/orders", {
        method: "POST",
        body: { planId },
      })) as ApiResult;
      const order = normalizeOrder(payload.order);
      if (!order) throw new Error("payment_qr_missing");
      setActiveOrder(order);
      await refreshPointsData({ quiet: true, preserveActiveOrder: order });
      if (order.status === "paid") {
        showPaymentSuccess();
      }
    } catch (error) {
      const resolved = resolveBillingError(error, content.errors);
      setPaymentNotice({ kind: "error", title: resolved.message });
      setMessage({ kind: "error", title: resolved.message });
    } finally {
      setCreating(false);
    }
  }

  async function refreshOrder(order: SitePointRechargeOrder, options?: { showPendingNotice?: boolean }) {
    setRefreshing(true);
    if (options?.showPendingNotice) setPaymentNotice(null);
    try {
      const payload = (await requestBilling(
        `/api/billing/points/orders/${encodeURIComponent(order.outTradeNo)}`,
      )) as ApiResult;
      const nextOrder = normalizeOrder(payload.order);
      if (!nextOrder) throw new Error("payment_qr_missing");
      setActiveOrder(nextOrder);
      await refreshPointsData({ quiet: true, preserveActiveOrder: nextOrder });
      if (nextOrder.status === "paid") {
        showPaymentSuccess();
      } else if (options?.showPendingNotice) {
        setPaymentNotice({
          kind: "info",
          title: content.paymentPendingTitle,
          body: content.paymentPendingBody,
        });
      }
      return nextOrder;
    } catch (error) {
      const resolved = resolveBillingError(error, content.errors);
      setPaymentNotice({ kind: "error", title: resolved.message });
      setMessage({ kind: "error", title: resolved.message });
      return null;
    } finally {
      setRefreshing(false);
    }
  }

  async function refreshPointsData(options?: {
    quiet?: boolean;
    preserveActiveOrder?: SitePointRechargeOrder | null;
  }) {
    if (!options?.quiet) {
      setRefreshing(true);
      setMessage(null);
    }
    try {
      const [accountPayload, ledgerPayload, ordersPayload] = (await Promise.all([
        requestBilling("/api/billing/points/account"),
        requestBilling("/api/billing/points/ledger?limit=8"),
        requestBilling("/api/billing/points/orders"),
      ])) as [ApiResult, ApiResult, ApiResult];
      const nextLedgerEntries = (Array.isArray(ledgerPayload.entries) ? ledgerPayload.entries : [])
        .map(normalizeLedgerEntry)
        .filter((entry): entry is SitePointLedgerEntry => Boolean(entry));
      const nextOrders = (Array.isArray(ordersPayload.orders) ? ordersPayload.orders : [])
        .map(normalizeOrder)
        .filter((order): order is SitePointRechargeOrder => Boolean(order));
      setAccount(
        normalizeAccount(accountPayload.account ?? accountPayload ?? ledgerPayload.account ?? ordersPayload.account) ?? account,
      );
      setLedgerEntries(nextLedgerEntries);
      setOrders(nextOrders);
      setActiveOrder((current) => {
        const preserved = options?.preserveActiveOrder ?? current;
        if (preserved) {
          const refreshed = nextOrders.find((item) => item.outTradeNo === preserved.outTradeNo);
          if (preserved.status === "paid" && refreshed?.status !== "paid") return preserved;
          return refreshed ?? preserved;
        }
        return findPendingOrderForPlan(nextOrders, selectedPlanId);
      });
    } catch (error) {
      if (!options?.quiet) {
        const resolved = resolveBillingError(error, content.errors);
        setMessage({ kind: "error", title: resolved.message });
      }
    } finally {
      if (!options?.quiet) setRefreshing(false);
    }
  }

  function showPaymentSuccess() {
    const success = {
      kind: "success" as const,
      title: content.paymentSuccessTitle,
      body: content.paymentSuccessBody,
    };
    setPaymentNotice(success);
    setMessage({ kind: "success", title: content.paidTitle, body: content.paidBody });
  }

  useEffect(() => {
    if (!paymentModalOpen || !readyPaymentOrder || !isPaymentWaiting(readyPaymentOrder)) return;

    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const poll = async () => {
      const nextOrder = await refreshOrder(readyPaymentOrder);
      if (stopped || !nextOrder || !isPaymentWaiting(nextOrder)) return;
      timer = setTimeout(() => void poll(), 3000);
    };

    timer = setTimeout(() => void poll(), 3000);
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
    // Polling is keyed by the active order identity and status.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentModalOpen, activeOrder?.outTradeNo, activeOrder?.status]);

  useEffect(() => {
    if (!signedIn || !watchaPayConfigured || !watchaReturnPlanId || watchaReturnAttemptRef.current) return;
    watchaReturnAttemptRef.current = true;
    void checkWatchaQuota(watchaReturnPlanId, true);
    // A Watcha return only rechecks the server-owned quota once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn, watchaPayConfigured, watchaReturnPlanId]);

  return (
    <BillingShell
      homeLabel={content.home}
      homeHref={withLang(locale, "/")}
      sidebarLabel={content.title}
      routes={[
        {
          href: withLang(locale, "/account/membership"),
          icon: <Crown size={20} weight="regular" aria-hidden="true" />,
          label: locale === "zh" ? "会员套餐" : "Membership plans",
        },
        {
          href: withLang(locale, "/account/recharge"),
          icon: <Sparkle size={20} weight="regular" aria-hidden="true" />,
          label: content.title,
          active: true,
        },
        {
          href: withLang(locale, "/account/tokendance/recharge"),
          icon: <Lightning size={20} weight="regular" aria-hidden="true" />,
          label: locale === "zh" ? "TokenDance 额度" : "TokenDance credits",
        },
      ]}
      signedIn={Boolean(signedIn)}
      accountStatus={accountStatus}
      accountEmail={accountEmail}
      accountAvatarUrl={accountAvatarUrl}
      signOutLabel={content.signOut}
    >
      <section className="billing-membership-header">
        <div className="billing-membership-header-row">
          <div className="billing-membership-header-copy">
            <span className="billing-membership-eyebrow">{content.eyebrow}</span>
            <h1 className="billing-membership-title">{content.title}</h1>
            <p className="billing-membership-intro">{content.intro}</p>
          </div>

          <div className="billing-membership-toolbar">
            {signedIn ? (
              <button
                type="button"
                className="billing-membership-toolbar-action"
                disabled={refreshing}
                onClick={() => void refreshPointsData()}
              >
                <ArrowClockwise size={16} weight="regular" aria-hidden="true" />
                {content.refresh}
              </button>
            ) : (
              <Link href={loginHref} className="billing-membership-toolbar-action">
                {content.signIn}
              </Link>
            )}
          </div>
        </div>

        <dl className="billing-membership-meta-strip" aria-label={content.title}>
          <div className="billing-membership-meta-item">
            <dt>{content.currentAccountLabel}</dt>
            <dd>{signedIn ? accountStatus : content.signedOutState}</dd>
            <span>{signedIn ? accountEmail || content.signedIn : content.signedOutTitle}</span>
          </div>
          <div className="billing-membership-meta-item">
            <dt>{content.balance}</dt>
            <dd>{balanceValue}</dd>
            <span>{signedIn ? latestActivityLabel : content.signInToPurchase}</span>
          </div>
          <div className="billing-membership-meta-item">
            <dt>{content.recharged}</dt>
            <dd>{totalRechargedValue}</dd>
            <span>{signedIn ? `${content.consumed} ${totalConsumedValue}` : content.signedOutBody}</span>
          </div>
        </dl>
      </section>

      <div className="billing-membership-view">
        {message ? <Feedback {...message} /> : null}

        <section className="billing-section-block billing-membership-section" id="points-plans">
          <SectionHeading title={content.choosePlan} />
          {unavailable ? (
            <div className="billing-membership-inline-note">
              <WarningCircle size={18} weight="regular" aria-hidden="true" />
              <span>{content.unavailable}</span>
            </div>
          ) : (
            <>
              <div className="billing-plan-card-grid">
                {plans.map((plan) => {
                  const selected = plan.planId === selectedPlanId;
                  return (
                    <article
                      key={plan.planId}
                      className={`billing-plan-card ${plan.recommended ? "billing-plan-card-featured" : ""} ${selected ? "billing-plan-card-selected" : ""}`.trim()}
                    >
                      <div className="billing-plan-card-main">
                        <div className="billing-plan-card-head">
                          <span className="billing-plan-card-name">{localizedPlanName(plan, locale)}</span>
                          {(plan.badgeI18n[locale] || plan.badge) ? (
                            <span className="billing-plan-card-badge">{plan.badgeI18n[locale] || plan.badge}</span>
                          ) : null}
                        </div>
                        <div className="billing-membership-plan-price-row">
                          <strong className="billing-membership-plan-price-hero">{formatInteger(plan.totalPoints)}</strong>
                          <span className="billing-membership-plan-points-note">
                            {content.points} · {formatMoney(plan.amountCents)}
                          </span>
                        </div>
                        <p className="billing-plan-card-note">{plan.descriptionI18n[locale] || plan.description}</p>
                      </div>

                      <div className="billing-plan-card-foot">
                        {signedIn ? (
                          <button
                            type="button"
                            className="billing-plan-card-action billing-plan-card-action-primary"
                            disabled={!watchaPayConfigured || watchaQuotaChecking}
                            onClick={() => {
                              void checkWatchaQuota(plan.planId);
                            }}
                          >
                            <CreditCard size={17} weight="regular" aria-hidden="true" />
                            {watchaQuotaChecking && selectedPlanId === plan.planId
                              ? content.watchaQuotaChecking
                              : watchaPayConfigured
                                ? content.watchaQuotaAction
                                : content.watchaQuotaUnavailableTitle}
                          </button>
                        ) : (
                          <Link
                            href={loginHref}
                            className="billing-plan-card-action billing-plan-card-action-primary"
                            onClick={() => setSelectedPlanId(plan.planId)}
                          >
                            {content.signInToPurchase}
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="billing-membership-content-note">
                <Sparkle size={18} weight="regular" aria-hidden="true" />
                <p>{content.tipsBody}</p>
              </div>

            </>
          )}
        </section>

        <section className="billing-section-block billing-membership-section" id="points-ledger">
          <SectionHeading title={content.recentLedger} />
          {!signedIn ? (
            <div className="billing-membership-signed-out-state">
              <p>{content.signedOutBody}</p>
              <Link href={loginHref} className="billing-plan-card-action billing-plan-card-action-primary">
                {content.signIn}
              </Link>
            </div>
          ) : ledgerEntries.length ? (
            <div className="billing-record-list">
              {ledgerEntries.map((entry) => (
                <article key={entry.entryId} className="billing-record-row">
                  <div>
                    <strong>{entry.note || ledgerKindLabel(entry.kind, content)}</strong>
                    <span>{formatDateTime(entry.occurredAt || entry.createdAt, locale)}</span>
                  </div>
                  <div>
                    <strong>
                      {entry.points > 0 ? "+" : ""}
                      {formatInteger(entry.points)} {content.points}
                    </strong>
                    <span>
                      {content.balanceAfterLabel} {formatInteger(entry.balanceAfter)}
                    </span>
                  </div>
                  <span className={`billing-status ${ledgerStatusClassName(entry.kind)}`.trim()}>
                    {ledgerKindLabel(entry.kind, content)}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <RecordEmpty title={content.emptyLedger} icon={<ListChecks size={40} weight="regular" aria-hidden="true" />} />
          )}
        </section>

        <section
          className="billing-section-block billing-membership-section billing-membership-orders-surface"
          id="points-orders"
        >
          <SectionHeading title={content.recentOrders} />
          {!signedIn ? (
            <div className="billing-membership-signed-out-state">
              <p>{content.signedOutBody}</p>
              <Link href={loginHref} className="billing-plan-card-action billing-plan-card-action-primary">
                {content.signIn}
              </Link>
            </div>
          ) : orders.length ? (
            <OrdersTable
              orders={orders}
              planMap={planMap}
              locale={locale}
              planLabel={content.choosePlan}
              amountLabel={content.amountLabel}
              statusLabelText={content.statusLabel}
              timeLabel={content.timeLabel}
              orderNumberLabel={content.orderNumber}
              pointsLabel={content.points}
              statusMap={content.status}
            />
          ) : (
            <RecordEmpty title={content.emptyOrders} icon={<Receipt size={40} weight="regular" aria-hidden="true" />} />
          )}
        </section>
      </div>

      {paymentModalOpen ? (
        <ModalShell
          title={content.paymentSectionTitle}
          subtitle={paymentCompleted ? content.paymentSuccessTitle : content.scanTitle}
          onClose={() => setPaymentModalOpen(false)}
        >
          {creating ? (
            <PaymentModalSkeleton />
          ) : paymentCompleted && activeOrder ? (
            <div className="billing-payment-sheet">
              <div className="billing-payment-success-card">
                <CheckCircle size={52} weight="fill" aria-hidden="true" />
                <strong>{content.paymentSuccessTitle}</strong>
                <p>{content.paymentSuccessBody}</p>
              </div>

              <div className="billing-payment-summary">
                <div className="billing-payment-amount">
                  <span>{content.amountLabel}</span>
                  <strong>{paymentAmountValue}</strong>
                </div>
                <div className="billing-payment-order-line">
                  <span className="billing-payment-order-label">{content.orderNumber}:</span>
                  <strong className="billing-payment-order-value">{paymentOrderValue}</strong>
                  <CopyOrderButton
                    value={activeOrder.outTradeNo}
                    label={content.copyOrderNumber}
                    copiedLabel={content.copiedOrderNumber}
                    failedLabel={content.copyFailed}
                  />
                </div>
              </div>

              <button
                type="button"
                className="billing-payment-confirm-button billing-payment-confirm-button-done"
                onClick={() => setPaymentModalOpen(false)}
              >
                {content.paymentDoneButton}
              </button>
            </div>
          ) : readyPaymentOrder && !paymentExpired ? (
            <div className="billing-payment-sheet">
              <div className="billing-payment-qr-card">
                <div className="billing-payment-qr">
                  <QRCodeSVG value={readyPaymentOrder.codeUrl} size={176} marginSize={2} level="M" />
                </div>
                <div className="billing-payment-qr-meta">
                  <strong className="billing-payment-plan-inline">{paymentPlanValue}</strong>
                  <span className="billing-subtle">{paymentPointsValue}</span>
                </div>
              </div>

              <button
                type="button"
                className="billing-payment-confirm-button"
                disabled={refreshing}
                onClick={() => void refreshOrder(readyPaymentOrder, { showPendingNotice: true })}
              >
                {refreshing ? (
                  <ArrowClockwise size={16} weight="regular" aria-hidden="true" />
                ) : (
                  <CheckCircle size={16} weight="regular" aria-hidden="true" />
                )}
                {refreshing ? content.checkingPayment : content.confirmPayment}
              </button>

              {paymentNotice ? (
                <div
                  className={`billing-payment-note billing-payment-note-${paymentNotice.kind}`}
                  role="status"
                  aria-live="polite"
                >
                  <strong>{paymentNotice.title}</strong>
                  {paymentNotice.body ? <span>{paymentNotice.body}</span> : null}
                </div>
              ) : null}

              <div className="billing-payment-summary">
                <div className="billing-payment-amount">
                  <span>{content.amountLabel}</span>
                  <strong>{paymentAmountValue}</strong>
                </div>
                <div className="billing-payment-order-line">
                  <span className="billing-payment-order-label">{content.orderNumber}:</span>
                  <strong className="billing-payment-order-value">{paymentOrderValue}</strong>
                  <CopyOrderButton
                    value={readyPaymentOrder.outTradeNo}
                    label={content.copyOrderNumber}
                    copiedLabel={content.copiedOrderNumber}
                    failedLabel={content.copyFailed}
                  />
                </div>
                <p className="billing-payment-hint">{content.scanBody}</p>
              </div>
            </div>
          ) : (
            <RecordEmpty
              title={paymentExpired ? content.expiredOrder : paymentNotice?.title || content.scanUnavailable}
              icon={<WarningCircle size={40} weight="regular" aria-hidden="true" />}
            />
          )}
        </ModalShell>
      ) : null}

      {watchaQuotaOpen ? (
        <ModalShell
          title={content.watchaQuotaTitle}
          heading={content.watchaQuotaTitle}
          description={content.watchaQuotaSeparatedBalance}
          onClose={() => setWatchaQuotaOpen(false)}
        >
          {watchaQuotaChecking ? (
            <div className="billing-watcha-sandbox-loading" role="status" aria-live="polite">
              <ArrowClockwise size={22} weight="regular" aria-hidden="true" />
              <span>{content.watchaQuotaChecking}</span>
            </div>
          ) : watchaQuotaError ? (
            <div className="billing-watcha-sandbox-state" role="alert">
              <WarningCircle size={34} weight="regular" aria-hidden="true" />
              <strong>{content.watchaQuotaUnavailableTitle}</strong>
              <p>{watchaQuotaError}</p>
              <button type="button" className="billing-payment-confirm-button" onClick={() => void checkWatchaQuota(watchaQuotaAccess?.planId || selectedPlanId || "", true)}>
                {content.watchaQuotaRecheck}
              </button>
            </div>
          ) : watchaQuotaAccess ? (
            <div className="billing-payment-sheet">
              <div className="billing-watcha-sandbox-banner">
                <CreditCard size={20} weight="regular" aria-hidden="true" />
                <strong>{content.watchaQuotaLivePaymentNotice}</strong>
              </div>

              <div className="billing-watcha-quota-balance" role="status" aria-live="polite">
                <span>{content.watchaQuotaBalance}</span>
                <strong>{formatInteger(watchaQuotaAccess.syncRemainingPoints ?? watchaQuotaAccess.remaining)} {content.points}</strong>
                <p>
                  {watchaQuotaAccess.access === "granted"
                    ? content.watchaQuotaGrantedBody
                    : watchaQuotaAccess.access === "purchase_required"
                      ? content.watchaQuotaPurchaseRequiredBody
                      : content.watchaQuotaUnavailableBody}
                </p>
              </div>

              {watchaQuotaAccess.access !== "unavailable" ? (
                <div className="billing-watcha-quota-packages">
                  <div className="billing-watcha-quota-packages-head">
                    <strong>{content.watchaQuotaPackagesTitle}</strong>
                    <p>{content.watchaQuotaPackagesBody}</p>
                  </div>
                  <div className="billing-watcha-quota-package-grid">
                    {watchaPayQuotaPackages.map((item) => {
                      const name = item.id === "starter"
                        ? content.watchaQuotaStarter
                        : item.id === "advanced"
                          ? content.watchaQuotaAdvanced
                          : content.watchaQuotaTeam;
                      const purchaseHref = watchaQuotaAccess.purchaseUrl || watchaQuotaAccess.qrCodeUrl || undefined;
                      return (
                        <article key={item.id} className="billing-watcha-quota-package">
                          <strong>{name}</strong>
                          <span>{formatInteger(item.points)} {content.points}</span>
                          <b>{formatMoney(item.amountCents)}</b>
                          <a
                            href={purchaseHref}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${content.watchaQuotaOpenPackage}: ${name}, ${formatInteger(item.points)} ${content.points}, ${formatMoney(item.amountCents)}`}
                          >
                            {content.watchaQuotaOpenPackage}
                          </a>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="billing-membership-content-note billing-watcha-quota-separation-note">
                <WarningCircle size={18} weight="regular" aria-hidden="true" />
                <p>{content.watchaQuotaSeparatedBalance}</p>
              </div>
              <button type="button" className="billing-payment-refresh-subtle" onClick={() => void checkWatchaQuota(watchaQuotaAccess?.planId || selectedPlanId || "", true)}>
                {content.watchaQuotaRecheck}
              </button>
            </div>
          ) : null}
        </ModalShell>
      ) : null}
    </BillingShell>
  );
}

function ledgerKindLabel(kind: SitePointLedgerEntry["kind"], content: typeof sitePointsCopy.en) {
  if (kind === "recharge") return content.rechargeKind;
  if (kind === "consume") return content.consumeKind;
  return content.adjustmentKind;
}

function ledgerStatusClassName(kind: SitePointLedgerEntry["kind"]) {
  if (kind === "recharge") return "billing-status-paid";
  if (kind === "adjustment") return "billing-status-created";
  return "";
}

function withLang(locale: Locale, path: string) {
  return `${path}?lang=${locale}`;
}

function isPaymentWaiting(order: SitePointRechargeOrder) {
  return order.status === "created" || order.status === "pending";
}
