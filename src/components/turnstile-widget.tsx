"use client";

import { forwardRef, useEffect, useEffectEvent, useId, useImperativeHandle, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import type { Locale } from "@/lib/locale";

type TurnstileWidgetId = string | number;
type TurnstileRenderSelector = string | HTMLElement;

type TurnstileApi = {
  render: (
    container: TurnstileRenderSelector,
    options: Record<string, unknown> & {
      sitekey: string;
      language?: string;
      appearance?: "always" | "execute" | "interaction-only";
      execution?: "render" | "execute";
      retry?: "auto" | "never";
      "retry-interval"?: number;
      theme?: "auto" | "light" | "dark";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "timeout-callback"?: () => void;
      "error-callback"?: (errorCode?: string) => boolean | void;
    },
  ) => TurnstileWidgetId;
  execute: (selector: string) => void;
  reset: (widgetId?: TurnstileWidgetId) => void;
  remove: (widgetId: TurnstileWidgetId) => void;
  ready: (callback: () => void) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileScriptPromise: Promise<void> | null = null;
const TURNSTILE_SCRIPT_SELECTOR =
  'script[data-turnstile-script="true"], script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]';

export type TurnstileWidgetHandle = {
  execute: () => Promise<boolean>;
  reset: () => void;
};

type TurnstileWidgetProps = {
  locale: Locale;
  siteKey: string | null;
  onTokenChange: (token: string | null) => void;
  onError?: (event: TurnstileWidgetErrorEvent) => void;
  onExpired?: () => void;
  onTimeout?: () => void;
};

type TurnstileWidgetErrorEvent = {
  errorCode: string;
  retryCount: number;
  exhausted: boolean;
};

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(function TurnstileWidget(
  {
    locale,
    siteKey,
    onTokenChange,
    onError,
    onExpired,
    onTimeout,
  },
  ref,
) {
  const containerId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null);
  const mountedRef = useRef(false);
  const readyPromiseRef = useRef<Promise<boolean> | null>(null);
  const readyResolverRef = useRef<((value: boolean) => void) | null>(null);
  const retryCountRef = useRef(0);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [challengeVisible, setChallengeVisible] = useState(false);
  const handleTokenChange = useEffectEvent(onTokenChange);
  const handleError = useEffectEvent((event: TurnstileWidgetErrorEvent) => onError?.(event));
  const handleExpired = useEffectEvent(() => onExpired?.());
  const handleTimeout = useEffectEvent(() => onTimeout?.());

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    createReadyGate(readyPromiseRef, readyResolverRef);
    retryCountRef.current = 0;
    handleTokenChange(null);

    const container = containerRef.current;
    if (!siteKey || !container) {
      resolveReadyGate(readyPromiseRef, readyResolverRef, false);
      return;
    }

    let cancelled = false;

    const renderWidget = async () => {
      await ensureTurnstileScript();
      if (cancelled || !mountedRef.current || !window.turnstile) {
        resolveReadyGate(readyPromiseRef, readyResolverRef, false);
        return;
      }

      container.innerHTML = "";
      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: siteKey,
        language: locale === "zh" ? "zh-cn" : "en",
        appearance: "execute",
        execution: "execute",
        retry: "auto",
        "retry-interval": 3000,
        theme: "dark",
        callback: (token) => {
          retryCountRef.current = 0;
          setChallengeVisible(false);
          setLoadState("ready");
          handleTokenChange(token);
        },
        "expired-callback": () => {
          handleTokenChange(null);
          setChallengeVisible(false);
          handleExpired();
          if (widgetIdRef.current != null) {
            window.turnstile?.reset(widgetIdRef.current);
          }
        },
        "timeout-callback": () => {
          handleTokenChange(null);
          setChallengeVisible(false);
          handleTimeout();
          if (widgetIdRef.current != null) {
            window.turnstile?.reset(widgetIdRef.current);
          }
        },
        "error-callback": (errorCode) => {
          retryCountRef.current += 1;
          const exhausted = retryCountRef.current > 2;
          handleTokenChange(null);
          handleError({
            errorCode: errorCode || "turnstile_challenge_failed",
            retryCount: retryCountRef.current,
            exhausted,
          });
          if (exhausted) {
            setLoadState("error");
            setChallengeVisible(true);
            return true;
          }
          return false;
        },
      });

      setLoadState("ready");
      resolveReadyGate(readyPromiseRef, readyResolverRef, true);
    };

    void renderWidget().catch(() => {
      if (cancelled || !mountedRef.current) {
        return;
      }
      handleTokenChange(null);
      handleError({
        errorCode: "turnstile_script_failed",
        retryCount: retryCountRef.current,
        exhausted: true,
      });
      setChallengeVisible(true);
      setLoadState("error");
      resolveReadyGate(readyPromiseRef, readyResolverRef, false);
    });

    return () => {
      cancelled = true;
      handleTokenChange(null);
      if (widgetIdRef.current != null) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      container.innerHTML = "";
      resolveReadyGate(readyPromiseRef, readyResolverRef, false);
    };
  }, [locale, siteKey]);

  useImperativeHandle(
    ref,
    () => ({
      async execute() {
        retryCountRef.current = 0;
        setChallengeVisible(true);
        setLoadState((current) => (current === "error" ? "loading" : current));
        handleTokenChange(null);
        const ready = await waitForWidgetReady(readyPromiseRef, readyResolverRef);
        if (!ready || !window.turnstile) {
          handleError({
            errorCode: "turnstile_execute_failed",
            retryCount: retryCountRef.current,
            exhausted: true,
          });
          setLoadState("error");
          return false;
        }
        if (widgetIdRef.current != null) {
          window.turnstile.reset(widgetIdRef.current);
        }
        window.turnstile.execute(`#turnstile-${containerId}`);
        return true;
      },
      reset() {
        retryCountRef.current = 0;
        handleTokenChange(null);
        setChallengeVisible(false);
        setLoadState((current) => (current === "error" ? "ready" : current));
        if (widgetIdRef.current != null) {
          window.turnstile?.reset(widgetIdRef.current);
        }
      },
    }),
  );

  if (!siteKey) {
    return null;
  }

  const errorLabel = locale === "zh"
    ? "当前网络可能限制安全验证，请尝试切换网络或刷新页面。"
    : "Your current network may be limiting the security check. Try switching networks or refreshing the page.";

  return (
    <div
      className={`relative flex w-full justify-center overflow-hidden transition-[max-height,opacity] duration-200 ${
        challengeVisible || loadState === "error" ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
      }`}
      aria-hidden={challengeVisible || loadState === "error" ? undefined : true}
    >
      <div
        id={`turnstile-${containerId}`}
        ref={containerRef}
        className="min-h-[4.15rem]"
        aria-label={loadState === "error" ? errorLabel : undefined}
      />
      {loadState === "error" ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 text-center text-xs leading-5 text-[var(--muted)]">
          {errorLabel}
        </div>
      ) : null}
    </div>
  );
});

TurnstileWidget.displayName = "TurnstileWidget";

function ensureTurnstileScript() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (window.turnstile) {
    return Promise.resolve();
  }
  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const resolveWhenReady = () => {
      if (window.turnstile) {
        resolve();
        return;
      }
      turnstileScriptPromise = null;
      reject(new Error("turnstile_script_unavailable"));
    };
    const rejectWhenFailed = () => {
      turnstileScriptPromise = null;
      reject(new Error("turnstile_script_failed"));
    };

    document.querySelectorAll<HTMLScriptElement>(TURNSTILE_SCRIPT_SELECTOR).forEach((script) => {
      script.remove();
    });

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.turnstileScript = "true";
    script.onload = resolveWhenReady;
    script.onerror = rejectWhenFailed;
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

function createReadyGate(
  readyPromiseRef: MutableRefObject<Promise<boolean> | null>,
  readyResolverRef: MutableRefObject<((value: boolean) => void) | null>,
) {
  readyPromiseRef.current = new Promise<boolean>((resolve) => {
    readyResolverRef.current = resolve;
  });
}

function resolveReadyGate(
  readyPromiseRef: MutableRefObject<Promise<boolean> | null>,
  readyResolverRef: MutableRefObject<((value: boolean) => void) | null>,
  value: boolean,
) {
  readyResolverRef.current?.(value);
  readyResolverRef.current = null;
  readyPromiseRef.current = Promise.resolve(value);
}

async function waitForWidgetReady(
  readyPromiseRef: MutableRefObject<Promise<boolean> | null>,
  readyResolverRef: MutableRefObject<((value: boolean) => void) | null>,
) {
  if (!readyPromiseRef.current) {
    createReadyGate(readyPromiseRef, readyResolverRef);
  }
  return readyPromiseRef.current ?? false;
}
