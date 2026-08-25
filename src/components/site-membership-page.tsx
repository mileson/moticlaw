"use client";

import { ArrowClockwise, CheckCircle, Crown, Receipt, Sparkle, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BillingShell,
  CopyOrderButton,
  displayPlanHighlights,
  Feedback,
  findPendingOrderForPlan,
  formatDateTime,
  formatInteger,
  formatMoney,
  isReadyPaymentOrder,
  localizedPlanName,
  ModalShell,
  OrdersTable,
  PaymentModalSkeleton,
  RecordEmpty,
  requestBilling,
  resolveBillingError,
} from "@/components/site-billing-shared";
import { siteBillingCopy } from "@/components/site-billing-copy";
import type { Locale } from "@/lib/locale";
import type { SiteAuthSession } from "@/lib/site-auth";
import {
  normalizeMembershipStatus,
  normalizeOrder,
  type SiteBillingCatalog,
  type SiteMembershipStatus,
  type SitePointRechargeOrder,
} from "@/lib/site-billing";

type ApiResult = {
  ok?: boolean;
  orders?: unknown[];
  order?: unknown;
  error?: {
    code?: string;
    message?: string;
  };
};

type MembershipView = "plans" | "orders";
type PaymentNotice = { kind: "success" | "error" | "info"; title: string; body?: string };

export function SiteMembershipPage({
  locale,
  basePath,
  activeView,
  initialCheckoutPlanId,
  loginHref,
  viewerSession,
  initialCatalog,
  initialOrders,
  initialMembershipStatus,
  unavailable,
}: {
  locale: Locale;
  basePath: string;
  activeView: MembershipView;
  initialCheckoutPlanId: string | null;
  loginHref: string;
  viewerSession: SiteAuthSession;
  initialCatalog: SiteBillingCatalog;
  initialOrders: SitePointRechargeOrder[];
  initialMembershipStatus: SiteMembershipStatus | null;
  unavailable: boolean;
}) {
  const content = siteBillingCopy[locale];
  const [catalog] = useState(() => ({
    ...initialCatalog,
    plans: [...initialCatalog.plans].sort((a, b) => {
      const tierRank = (tier: string) => (tier === "plus" ? 0 : tier === "pro" ? 1 : 2);
      return tierRank(a.tier) - tierRank(b.tier) || a.durationDays - b.durationDays || a.sortOrder - b.sortOrder;
    }),
  }));
  const [orders, setOrders] = useState(initialOrders);
  const [membershipStatus, setMembershipStatus] = useState(initialMembershipStatus);
  const [selectedPlanId, setSelectedPlanId] = useState(
    () => {
      if (initialCheckoutPlanId && catalog.plans.some((plan) => plan.planId === initialCheckoutPlanId)) {
        return initialCheckoutPlanId;
      }
      return catalog.plans.find((plan) => plan.recommended)?.planId ?? catalog.plans[0]?.planId ?? "";
    },
  );
  const [activeOrder, setActiveOrder] = useState<SitePointRechargeOrder | null>(
    () => findPendingOrderForPlan(initialOrders, selectedPlanId),
  );
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error" | "info"; title: string; body?: string } | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<PaymentNotice | null>(null);
  const autoCheckoutAttemptRef = useRef<string | null>(null);

  const plans = catalog.plans;
  const planMap = useMemo(() => new Map(plans.map((plan) => [plan.planId, plan])), [plans]);
  const signedIn = viewerSession.authenticated && viewerSession.account;
  const accountStatus = viewerSession.account?.displayName || content.signedOutState;
  const accountEmail = viewerSession.account?.email?.trim() || null;
  const accountAvatarUrl = viewerSession.account?.avatarUrl?.trim() || null;
  const activeMembershipPlan = membershipStatus?.active && membershipStatus.planId
    ? planMap.get(membershipStatus.planId) ?? plans.find((plan) => plan.tier === membershipStatus.tier) ?? null
    : null;
  const membershipStatusValue = activeMembershipPlan
    ? localizedPlanName(activeMembershipPlan, locale)
    : membershipStatus?.active
      ? membershipStatus.tier
      : content.notActivated;
  const membershipStatusNote = membershipStatus?.active && membershipStatus.expiresAt
    ? `${content.expiresOn} ${formatDateTime(membershipStatus.expiresAt, locale)}`
    : signedIn
      ? ""
      : content.signedOutBody;
  const paymentPlan = planMap.get(activeOrder?.planId || selectedPlanId || "");
  const paymentPlanValue = paymentPlan ? localizedPlanName(paymentPlan, locale) : content.awaitingPayment;
  const paymentPointsValue = paymentPlan
    ? paymentPlan.maxAgents === null
      ? content.unlimitedAgentsValue
      : `${formatInteger(paymentPlan.maxAgents)} ${content.agentsUnit}`
    : "-";
  const paymentAmountValue = activeOrder
    ? formatMoney(activeOrder.amountCents)
    : paymentPlan
      ? formatMoney(paymentPlan.amountCents)
      : "-";
  const paymentOrderValue = activeOrder?.outTradeNo || "-";
  const readyPaymentOrder = isReadyPaymentOrder(activeOrder) ? activeOrder : null;
  const paymentCompleted = activeOrder?.status === "paid";
  const paymentModalCreating = paymentModalOpen && creating;
  const homeHref = withLang(locale, "/");
  const headerTitle = activeView === "orders" ? content.recentOrders : content.choosePlan;
  const headerIntro = activeView === "orders" ? content.ordersIntro : content.intro;
  const autoCheckoutPlanId = initialCheckoutPlanId && planMap.has(initialCheckoutPlanId) ? initialCheckoutPlanId : null;
  const autoCheckoutPlan = autoCheckoutPlanId ? planMap.get(autoCheckoutPlanId) ?? null : null;
  const autoCheckoutPlanAlreadyActive = Boolean(
    signedIn &&
      autoCheckoutPlan &&
      membershipStatus?.active &&
      membershipStatus.tier.toLowerCase() === autoCheckoutPlan.tier.toLowerCase(),
  );

  async function createOrder(planId: string) {
    setSelectedPlanId(planId);
    setActiveOrder(null);
    setPaymentModalOpen(true);
    setPaymentNotice(null);
    setCreating(true);
    setMessage(null);
    try {
      const payload = (await requestBilling("/api/billing/membership/orders", {
        method: "POST",
        body: { planId },
      })) as ApiResult;
      const order = normalizeOrder(payload.order);
      if (!order) throw new Error("payment_qr_missing");
      setActiveOrder(order);
      await refreshOrders({ quiet: true });
      if (order.status === "paid") {
        await refreshMembershipStatus();
        setPaymentNotice({ kind: "success", title: content.paymentSuccessTitle, body: content.paymentSuccessBody });
        setMessage({ kind: "success", title: content.paidTitle, body: content.paidBody });
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
      const payload = (await requestBilling(`/api/billing/membership/orders/${encodeURIComponent(order.outTradeNo)}`)) as ApiResult;
      const nextOrder = normalizeOrder(payload.order);
      if (!nextOrder) throw new Error("payment_qr_missing");
      setActiveOrder(nextOrder);
      await refreshOrders({ quiet: true });
      if (nextOrder.status === "paid") {
        await refreshMembershipStatus();
        setPaymentNotice({ kind: "success", title: content.paymentSuccessTitle, body: content.paymentSuccessBody });
        setMessage({ kind: "success", title: content.paidTitle, body: content.paidBody });
      } else if (options?.showPendingNotice) {
        setPaymentNotice({ kind: "info", title: content.paymentPendingTitle, body: content.paymentPendingBody });
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

  async function refreshMembershipStatus() {
    try {
      const payload = (await requestBilling("/api/billing/membership/status")) as ApiResult;
      setMembershipStatus(normalizeMembershipStatus(payload));
    } catch {
      // The status strip keeps the previous snapshot when refresh fails.
    }
  }

  async function refreshOrders(options?: { quiet?: boolean }) {
    try {
      const payload = (await requestBilling("/api/billing/membership/orders")) as ApiResult;
      const orderItems = Array.isArray(payload.orders) ? payload.orders : [];
      const nextOrders = orderItems
        .map(normalizeOrder)
        .filter((order): order is SitePointRechargeOrder => Boolean(order));
      setOrders(nextOrders);
      setActiveOrder((current) => {
        if (current) return nextOrders.find((item) => item.outTradeNo === current.outTradeNo) ?? current;
        return findPendingOrderForPlan(nextOrders, selectedPlanId);
      });
    } catch (error) {
      if (!options?.quiet) {
        const resolved = resolveBillingError(error, content.errors);
        setMessage({ kind: "error", title: resolved.message });
      }
    }
  }

  useEffect(() => {
    if (!signedIn || !autoCheckoutPlanId || unavailable) return;
    if (autoCheckoutPlanAlreadyActive) return;
    if (autoCheckoutAttemptRef.current === autoCheckoutPlanId) return;

    const pendingOrder = findPendingOrderForPlan(orders, autoCheckoutPlanId);
    autoCheckoutAttemptRef.current = autoCheckoutPlanId;
    setSelectedPlanId(autoCheckoutPlanId);
    setPaymentNotice(null);
    if (pendingOrder) {
      setActiveOrder(pendingOrder);
      setPaymentModalOpen(true);
      return;
    }

    void createOrder(autoCheckoutPlanId);
    // The deep link should fire only once for the server-resolved initial target.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCheckoutPlanId, signedIn, unavailable, autoCheckoutPlanAlreadyActive]);

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
    // Polling is keyed by the order identity and status; refreshOrder reads the same outTradeNo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentModalOpen, activeOrder?.outTradeNo, activeOrder?.status]);

  return (
    <BillingShell
      homeLabel={content.home}
      homeHref={homeHref}
      sidebarLabel={content.title}
      routes={[
        { href: withLangAndView(locale, basePath, "plans"), icon: <Crown size={20} weight="regular" aria-hidden="true" />, label: content.choosePlan, active: activeView === "plans" },
        { href: withLangAndView(locale, basePath, "orders"), icon: <Receipt size={20} weight="regular" aria-hidden="true" />, label: content.recentOrders, active: activeView === "orders" },
        { href: withLang(locale, "/account/recharge"), icon: <Sparkle size={20} weight="regular" aria-hidden="true" />, label: locale === "zh" ? "积分充值" : "Points recharge" },
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
            <h1 className="billing-membership-title">{headerTitle}</h1>
            <p className="billing-membership-intro">{headerIntro}</p>
          </div>

          {signedIn && activeView === "orders" ? (
            <div className="billing-membership-toolbar">
              <button type="button" className="billing-membership-toolbar-action" disabled={refreshing} onClick={() => void refreshOrders()}>
                <ArrowClockwise size={16} weight="regular" aria-hidden="true" />
                {content.refresh}
              </button>
            </div>
          ) : !signedIn ? (
            <div className="billing-membership-toolbar">
              <Link href={loginHref} className="billing-membership-toolbar-action">
                {content.signIn}
              </Link>
            </div>
          ) : null}
        </div>

        <dl className="billing-membership-meta-strip" aria-label={content.title}>
          <div className="billing-membership-meta-item">
            <dt>{content.currentAccountLabel}</dt>
            <dd>{signedIn ? accountStatus : content.signedOutState}</dd>
            <span>{signedIn ? accountEmail || content.signedIn : content.signedOutTitle}</span>
          </div>
          <div className="billing-membership-meta-item">
            <dt>{content.membershipStatusLabel}</dt>
            <dd>{membershipStatusValue}</dd>
            {membershipStatusNote ? <span>{membershipStatusNote}</span> : null}
          </div>
          <div className="billing-membership-meta-item">
            <dt>{content.recentOrders}</dt>
            <dd>{signedIn ? formatInteger(orders.length) : "-"}</dd>
            <span>{signedIn ? content.viewOrders : content.ordersSignedOutBody}</span>
          </div>
        </dl>
      </section>

      <div className="billing-membership-view">
        {message ? <Feedback {...message} /> : null}

        {activeView === "plans" ? (
          <section className="billing-section-block billing-membership-section" id="membership-plans">
            {unavailable ? (
              <div className="billing-membership-inline-note">
                <WarningCircle size={18} weight="regular" aria-hidden="true" />
                <span>{content.unavailable}</span>
              </div>
            ) : (
              <div className="billing-plan-card-grid">
                {plans.map((plan) => {
                  const highlighted = plan.planId === selectedPlanId;
                  const pendingOrder = findPendingOrderForPlan(orders, plan.planId);
                  const displayHighlights = displayPlanHighlights(plan, locale);
                  const isCurrentPlan = Boolean(membershipStatus?.active && membershipStatus.tier === plan.tier);
                  return (
                    <article
                      key={plan.planId}
                      className={`billing-plan-card ${plan.recommended ? "billing-plan-card-featured" : ""} ${highlighted ? "billing-plan-card-selected" : ""}`.trim()}
                    >
                      <div className="billing-plan-card-main">
                        <div className="billing-plan-card-head">
                          <span className="billing-plan-card-name">{localizedPlanName(plan, locale)}</span>
                          {isCurrentPlan ? (
                            <span className="billing-plan-card-badge">{content.currentPlanBadge}</span>
                          ) : (plan.badgeI18n[locale] || plan.badge) ? (
                            <span className="billing-plan-card-badge">{plan.badgeI18n[locale] || plan.badge}</span>
                          ) : null}
                        </div>
                        <div className="billing-membership-plan-price-row">
                          <strong className="billing-membership-plan-price-hero">{formatMoney(plan.amountCents)}</strong>
                          <span className="billing-membership-plan-points-note">
                            {plan.durationDays >= 300 ? content.perYear : content.perMonth}
                          </span>
                        </div>
                        <p className="billing-plan-card-note">{plan.descriptionI18n[locale] || plan.description}</p>
                        {displayHighlights.length ? (
                          <ul className="billing-membership-highlights">
                            {displayHighlights.map((highlight, index) => (
                              <li key={`${plan.planId}-${index}`}>{highlight.labelI18n[locale] || highlight.label}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      <div className="billing-plan-card-foot">
                        {signedIn ? (
                          <button
                            type="button"
                            className="billing-plan-card-action billing-plan-card-action-primary"
                            disabled={creating}
                            onClick={() => void createOrder(plan.planId)}
                          >
                            {creating && selectedPlanId === plan.planId
                              ? content.creatingOrder
                              : pendingOrder
                                ? content.continuePayment
                                : isCurrentPlan
                                  ? content.renewLabel
                                  : content.createOrder}
                          </button>
                        ) : (
                          <Link href={loginHref} className="billing-plan-card-action billing-plan-card-action-primary" onClick={() => setSelectedPlanId(plan.planId)}>
                            {content.signInToPurchase}
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        ) : null}

        {activeView === "orders" ? (
          <section className="billing-section-block billing-membership-section billing-membership-orders-surface" id="membership-orders">
            {!signedIn ? (
              <div className="billing-membership-inline-note">
                <WarningCircle size={18} weight="regular" aria-hidden="true" />
                <span>{content.ordersSignedOutBody}</span>
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
        ) : null}
      </div>

      {paymentModalOpen ? (
        <ModalShell title={content.paymentSectionTitle} subtitle={content.scanTitle} onClose={() => setPaymentModalOpen(false)}>
          {paymentModalCreating ? (
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
          ) : readyPaymentOrder ? (
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
                <div className={`billing-payment-note billing-payment-note-${paymentNotice.kind}`} role="status" aria-live="polite">
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
            <RecordEmpty title={content.scanUnavailable} icon={<WarningCircle size={40} weight="regular" aria-hidden="true" />} />
          )}
        </ModalShell>
      ) : null}
    </BillingShell>
  );
}

function withLang(locale: Locale, path: string) {
  return `${path}?lang=${locale}`;
}

function withLangAndView(locale: Locale, path: string, view: MembershipView) {
  const url = new URL(path, "https://www.moticlaw.com");
  url.searchParams.set("lang", locale);
  url.searchParams.set("view", view);
  return `${url.pathname}${url.search}`;
}

function isPaymentWaiting(order: SitePointRechargeOrder) {
  return order.status === "created" || order.status === "pending";
}
