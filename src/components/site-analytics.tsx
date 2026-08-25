import type { Locale } from "@/lib/locale";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export function SiteAnalytics({ locale }: { locale: Locale }) {
  if (!measurementId) return null;

  const consentLabel = locale === "zh" ? "网站统计偏好" : "Analytics preferences";
  const privacyCopy = locale === "zh" ? "查看隐私政策" : "Privacy policy";
  const description = locale === "zh"
    ? "允许匿名使用统计，帮助我们了解哪些内容更有用。拒绝不会影响网站使用。"
    : "Allow anonymous analytics to help us understand which content is useful. Declining will not affect the site.";
  const script = `
    (() => {
      const consentKey = "moticlaw-analytics-consent";
      const measurementId = ${JSON.stringify(measurementId)};
      const panel = document.getElementById("analytics-consent");
      const loadAnalytics = () => {
        if (window.__moticlawAnalyticsLoaded) return;
        window.__moticlawAnalyticsLoaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag("js", new Date());
        window.gtag("config", measurementId, { anonymize_ip: true });
        const tag = document.createElement("script");
        tag.async = true;
        tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
        document.head.appendChild(tag);
      };
      const setConsent = (value) => {
        try { localStorage.setItem(consentKey, value); } catch (error) {}
        if (panel) panel.hidden = true;
        if (value === "granted") loadAnalytics();
      };
      let consent = null;
      try { consent = localStorage.getItem(consentKey); } catch (error) {}
      if (consent === "granted") loadAnalytics();
      else if (consent !== "denied" && panel) panel.hidden = false;
      document.getElementById("analytics-consent-accept")?.addEventListener("click", () => setConsent("granted"));
      document.getElementById("analytics-consent-reject")?.addEventListener("click", () => setConsent("denied"));
      document.addEventListener("click", (event) => {
        const target = event.target instanceof Element ? event.target.closest("[data-analytics-event]") : null;
        const eventName = target?.getAttribute("data-analytics-event");
        if (!eventName || typeof window.gtag !== "function") return;
        window.gtag("event", eventName, { placement: target.getAttribute("data-analytics-label") || "unknown" });
      });
    })();
  `;

  return (
    <>
      <aside id="analytics-consent" className="analytics-consent" aria-label={consentLabel} hidden>
        <p className="text-sm leading-6">{description}</p>
        <p className="mt-1 text-xs"><a href={`/privacy?lang=${locale}`} className="underline">{privacyCopy}</a></p>
        <div className="analytics-consent-actions">
          <button id="analytics-consent-accept" type="button" className="accept">{locale === "zh" ? "允许统计" : "Allow"}</button>
          <button id="analytics-consent-reject" type="button" className="reject">{locale === "zh" ? "暂不允许" : "Not now"}</button>
        </div>
      </aside>
      <script id="moticlaw-analytics" dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}

declare global {
  interface Window {
    __moticlawAnalyticsLoaded?: boolean;
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
