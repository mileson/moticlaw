"use client";

import { ArrowLeft, Copy, SignOut, User, X } from "@phosphor-icons/react";
import Link from "next/link";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/locale";
import { usePageScrollLock } from "@/lib/page-scroll-lock";
import type { SitePointRechargeOrder } from "@/lib/site-billing";

type BillingRouteItem = {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
};

type NamedPlanLike = {
  planId: string;
  name: string;
  nameI18n: Partial<Record<"en" | "zh", string>>;
};

export type BillingFeedbackMessage = {
  kind: "success" | "error" | "info";
  title: string;
  body?: string;
  code?: string;
};

type JsonRecord = Record<string, unknown>;

export type ReadyPaymentOrder = SitePointRechargeOrder & {
  codeUrl: string;
  outTradeNo: string;
};

export function BillingShell({
  homeLabel,
  homeHref,
  sidebarLabel,
  routes,
  signedIn,
  accountStatus,
  accountEmail,
  accountAvatarUrl,
  signOutLabel,
  children,
}: {
  homeLabel: string;
  homeHref: string;
  sidebarLabel: string;
  routes: BillingRouteItem[];
  signedIn: boolean;
  accountStatus: string;
  accountEmail: string | null;
  accountAvatarUrl: string | null;
  signOutLabel: string;
  children: ReactNode;
}) {
  return (
    <main className="billing-membership-page">
      <div className="billing-membership-panel">
        <aside className="billing-membership-sidebar">
          <div className="billing-membership-sidebar-block">
            <Link href={homeHref} className="billing-membership-home-link">
              <ArrowLeft size={22} weight="regular" aria-hidden="true" />
              <span>{homeLabel}</span>
            </Link>

            <nav className="billing-membership-sidebar-nav" aria-label={sidebarLabel}>
              {routes.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`billing-membership-sidebar-item ${item.active ? "billing-membership-sidebar-item-active" : ""}`.trim()}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="billing-membership-sidebar-footer">
            <div className="billing-membership-account">
              <AccountAvatar name={accountStatus} avatarUrl={accountAvatarUrl} signedIn={signedIn} />
              <div className="billing-membership-account-copy">
                <strong>{accountStatus}</strong>
                {signedIn && accountEmail ? <span>{accountEmail}</span> : null}
              </div>
            </div>

            {signedIn ? (
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="billing-membership-sidebar-auth">
                  <SignOut size={18} weight="regular" aria-hidden="true" />
                  <span>{signOutLabel}</span>
                </button>
              </form>
            ) : null}
          </div>
        </aside>

        <div className="billing-membership-main">{children}</div>
      </div>
    </main>
  );
}

export function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="billing-section-heading">
      <div className="billing-section-heading-copy">
        <h2 className="billing-panel-title">{title}</h2>
      </div>
      <div className="billing-section-heading-side">
        {action ? <div className="billing-section-heading-action">{action}</div> : null}
      </div>
    </div>
  );
}

export function Feedback({ kind, title, body }: BillingFeedbackMessage) {
  return (
    <div className={`billing-feedback billing-feedback-${kind}`}>
      <p>
        <strong>{title}</strong>
        {body ? ` ${body}` : ""}
      </p>
    </div>
  );
}

export function RecordEmpty({ title, icon }: { title: string; icon: ReactNode }) {
  return (
    <div className="billing-record-empty">
      {icon}
      <p>{title}</p>
    </div>
  );
}

export function OrdersTable<Plan extends NamedPlanLike>({
  orders,
  planMap,
  locale,
  planLabel,
  amountLabel,
  statusLabelText,
  timeLabel,
  orderNumberLabel,
  pointsLabel,
  statusMap,
}: {
  orders: SitePointRechargeOrder[];
  planMap: Map<string, Plan>;
  locale: Locale;
  planLabel: string;
  amountLabel: string;
  statusLabelText: string;
  timeLabel: string;
  orderNumberLabel: string;
  pointsLabel: string;
  statusMap: Record<string, string>;
}) {
  return (
    <div className="billing-detail-table-wrap">
      <table className="billing-detail-table">
        <thead>
          <tr>
            <th>{planLabel}</th>
            <th>{amountLabel}</th>
            <th>{statusLabelText}</th>
            <th>{timeLabel}</th>
            <th>{orderNumberLabel}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId || order.outTradeNo}>
              <td>{resolveOrderPlanLabel(order, planMap, locale, pointsLabel)}</td>
              <td>{formatMoney(order.amountCents)}</td>
              <td><span className={`billing-status billing-status-${order.status}`}>{statusMap[order.status] || order.status}</span></td>
              <td>{formatDateTime(order.paidAt || order.createdAt, locale)}</td>
              <td className="billing-order-code-cell">{order.outTradeNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ModalShell({
  title,
  subtitle,
  heading,
  description,
  variant = "compact",
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  heading?: string;
  description?: string;
  variant?: "compact" | "upgrade";
  onClose: () => void;
  children: ReactNode;
}) {
  usePageScrollLock(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const headingId = useId();
  const labelId = useId();
  const descriptionId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    if (!panel) return;

    const focusableSelector = [
      "button:not([disabled])",
      "[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    const focusFirst = () => {
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));
      (focusable[0] ?? panel).focus();
    };
    const frame = window.requestAnimationFrame(focusFirst);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, []);

  return (
    <div
      className="billing-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={heading || subtitle ? headingId : labelId}
      aria-describedby={description ? descriptionId : !heading && subtitle ? labelId : undefined}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={panelRef} className={`billing-modal-panel billing-modal-panel-${variant}`} tabIndex={-1}>
        <div className="billing-modal-head">
          <div className="billing-modal-heading">
            {heading ? (
              <>
                <h2 id={headingId} className="billing-panel-title">{heading}</h2>
                {description ? <p id={descriptionId} className="billing-modal-description">{description}</p> : null}
              </>
            ) : (
              <>
                <p id={labelId} className="billing-panel-label">{title}</p>
                {subtitle ? <h2 id={headingId} className="billing-panel-title">{subtitle}</h2> : null}
              </>
            )}
          </div>
          <div className="billing-modal-head-side">
            <button type="button" className="billing-modal-close" onClick={onClose} aria-label={title}>
              <X size={18} weight="regular" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="billing-modal-body">{children}</div>
      </div>
    </div>
  );
}

export function PaymentModalSkeleton() {
  return (
    <div className="billing-payment-skeleton" aria-hidden="true">
      <div className="billing-payment-skeleton-card">
        <span className="billing-payment-skeleton-qr" />
        <span className="billing-payment-skeleton-plan" />
        <span className="billing-payment-skeleton-refresh" />
      </div>
      <div className="billing-payment-skeleton-amount">
        <span className="billing-payment-skeleton-label" />
        <span className="billing-payment-skeleton-value" />
      </div>
      <div className="billing-payment-skeleton-order">
        <span className="billing-payment-skeleton-line billing-payment-skeleton-line-short" />
        <span className="billing-payment-skeleton-line billing-payment-skeleton-line-long" />
      </div>
      <div className="billing-payment-skeleton-hint">
        <span className="billing-payment-skeleton-line billing-payment-skeleton-line-long" />
        <span className="billing-payment-skeleton-line billing-payment-skeleton-line-mid" />
      </div>
    </div>
  );
}

export function CopyOrderButton({
  value,
  label,
  copiedLabel,
  failedLabel,
}: {
  value: string;
  label: string;
  copiedLabel: string;
  failedLabel: string;
}) {
  const [toast, setToast] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  async function handleCopy() {
    try {
      await copyText(value);
      setToast({ kind: "success", text: copiedLabel });
      window.setTimeout(() => setToast(null), 1600);
    } catch {
      setToast({ kind: "error", text: failedLabel });
      window.setTimeout(() => setToast(null), 1600);
    }
  }

  return (
    <span className="billing-copy-inline-wrap">
      <button
        type="button"
        className="billing-copy-button billing-copy-button-subtle"
        onClick={() => void handleCopy()}
        aria-label={label}
        title={label}
      >
        <Copy size={16} weight="regular" aria-hidden="true" />
      </button>
      {toast ? (
        <span className={`billing-copy-toast-inline billing-copy-toast-inline-${toast.kind}`} role="status" aria-live="polite">
          {toast.text}
        </span>
      ) : null}
    </span>
  );
}

export function localizedPlanName(plan: NamedPlanLike, locale: Locale) {
  return plan.nameI18n[locale] || plan.name;
}

export function formatMoney(amountCents: number) {
  const amount = Number.isFinite(amountCents) ? amountCents / 100 : 0;
  const fractionDigits = amountCents % 100 === 0 ? 0 : amountCents % 10 === 0 ? 1 : 2;
  return `¥${amount.toLocaleString("zh-CN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function formatInteger(value: number) {
  return Number.isFinite(value) ? Math.round(value).toLocaleString("en-US") : "0";
}

export function formatDateTime(value: string | null | undefined, locale: Locale) {
  if (!value) return "-";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "-";
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function includedPointsLabel(points: number, locale: Locale, pointsLabel: string) {
  const value = `${formatInteger(points)} ${pointsLabel}`;
  return locale === "zh" ? `含 ${value}` : `Includes ${value}`;
}

export function findPendingOrderForPlan(orders: SitePointRechargeOrder[], planId: string) {
  return orders.find((order) => order.planId === planId && (order.status === "created" || order.status === "pending")) ?? null;
}

export function isReadyPaymentOrder(order: SitePointRechargeOrder | null | undefined): order is ReadyPaymentOrder {
  return Boolean(order?.codeUrl && order.outTradeNo);
}

export function displayPlanHighlights(
  plan: {
    totalPoints: number;
    highlights: Array<{ label: string; labelI18n: Partial<Record<"en" | "zh", string>> }>;
  },
  locale: Locale,
) {
  return plan.highlights.filter((highlight) => !isIncludedPointsHighlight(highlight, plan.totalPoints, locale));
}

export async function requestBilling(path: string, init?: { method?: string; body?: JsonRecord }) {
  const response = await fetch(path, {
    method: init?.method || "GET",
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as JsonRecord;
  if (!response.ok) {
    const error = new Error(readErrorMessage(payload) || `billing_http_${response.status}`);
    Object.assign(error, { code: readErrorCode(payload) || `billing_http_${response.status}` });
    throw error;
  }
  return payload;
}

export function resolveBillingError(error: unknown, errors: Record<string, string>) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "site_billing_http_502";
  const fallback = typeof error === "object" && error && "message" in error ? String(error.message) : errors.site_billing_http_502;
  return {
    code,
    message: errors[code] || fallback || errors.site_billing_http_502,
  };
}

async function copyText(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  if (typeof document === "undefined") {
    throw new Error("clipboard_unavailable");
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "true");
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

function AccountAvatar({ name, avatarUrl, signedIn }: { name: string; avatarUrl?: string | null; signedIn: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initial = initialsFromName(name);
  const showImage = Boolean(avatarUrl && !imageFailed);
  return (
    <span className="billing-membership-account-avatar" aria-hidden="true">
      {showImage ? (
        <img src={avatarUrl!} alt="" onError={() => setImageFailed(true)} referrerPolicy="no-referrer" />
      ) : signedIn ? (
        initial
      ) : (
        <User size={22} weight="regular" aria-hidden="true" />
      )}
    </span>
  );
}

function initialsFromName(name: string) {
  const normalized = name.trim();
  if (!normalized) return "?";
  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function resolveOrderPlanLabel<Plan extends NamedPlanLike>(
  order: SitePointRechargeOrder,
  planMap: Map<string, Plan>,
  locale: Locale,
  pointsLabel: string,
) {
  const plan = planMap.get(order.planId);
  if (!plan) return includedPointsLabel(order.points, locale, pointsLabel);
  return `${localizedPlanName(plan, locale)} / ${includedPointsLabel(order.points, locale, pointsLabel)}`;
}

function readErrorMessage(payload: JsonRecord) {
  const error = readErrorRecord(payload);
  return typeof error?.message === "string" ? error.message : null;
}

function readErrorCode(payload: JsonRecord) {
  const error = readErrorRecord(payload);
  return typeof error?.code === "string" ? error.code : null;
}

function readErrorRecord(payload: JsonRecord) {
  const error = payload.error;
  return error && typeof error === "object" && !Array.isArray(error) ? (error as JsonRecord) : null;
}

function isIncludedPointsHighlight(
  highlight: { label: string; labelI18n: Partial<Record<"en" | "zh", string>> },
  totalPoints: number,
  locale: Locale,
) {
  const text = (highlight.labelI18n[locale] || highlight.label || "").toLowerCase();
  const pointsValue = formatInteger(totalPoints).toLowerCase();
  if (!text.includes(pointsValue)) return false;
  if (locale === "zh") return text.includes("积分") && text.includes("到账");
  return text.includes("points") && text.includes("arrive");
}
