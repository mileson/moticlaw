"use client";

/*
## 核心功能
渲染官网内页共享的站点级顶部导航，统一品牌、主题切换、语言切换，以及页面上下文导航与账号动作。
## 输入
接收当前语言、品牌首页地址、页面上下文导航项、语言切换目标，以及右侧账号动作插槽。
## 输出
输出与官网首页同体系的固定头部壳层，供法律页、账号页等内页复用。
## 定位
位于 `src/components`，作为官网内页共享的顶部导航基础组件。
## 依赖
依赖 `@phosphor-icons/react`、`next/image`、React portal，以及 `locale.ts` 类型。
## 维护规则
- 调整顶部壳层交互、主题切换、语言切换或按钮布局时，必须同步检查复用页面的桌面与移动表现。
- 若首页 header 的品牌壳层节奏发生变化，应同步评估这里是否继续保持同一体系。
*/

import { ArrowLeft, Check, Globe, Moon, Sun, Translate } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal, flushSync } from "react-dom";
import type { Locale } from "@/lib/locale";
import { lockPageScroll } from "@/lib/page-scroll-lock";

const themeStorageKey = "moticlaw-theme";

type ThemeMode = "light" | "dark" | "system";

export type SitePageHeaderNavItem = {
  key: string;
  label: string;
  href?: string;
  active?: boolean;
  icon?: "back";
};

export function SitePageHeader({
  locale,
  brandHref,
  languageLabel,
  navigationItems,
  localeHref,
  actionSlot,
  statusSlot,
}: {
  locale: Locale;
  brandHref: string;
  languageLabel: string;
  navigationItems: SitePageHeaderNavItem[];
  localeHref: (targetLocale: Locale) => string;
  actionSlot?: ReactNode;
  statusSlot?: ReactNode;
}) {
  const headerRef = useRef<HTMLElement | null>(null);
  const localeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  const [localeMenuRect, setLocaleMenuRect] = useState<{ top: number; right: number } | null>(null);
  const [backdropTop, setBackdropTop] = useState(88);
  const resolvedTheme = getResolvedTheme(theme);
  const closeLanguageMenuLabel = locale === "zh" ? "关闭语言菜单" : "Close language menu";
  const themeToggleLabel = locale === "zh"
    ? resolvedTheme === "dark" ? "切换到浅色主题" : "切换到深色主题"
    : resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    if (!localeMenuOpen) return;

    const onResize = () => {
      updateBackdropTop(headerRef.current, setBackdropTop);
      updateLocaleMenuRect(localeButtonRef.current, setLocaleMenuRect);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLocaleMenuOpen(false);
    };

    const unlockScroll = lockPageScroll();
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockScroll();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [localeMenuOpen]);

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    if (
      typeof document === "undefined" ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth < 768
    ) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    requestAnimationFrame(() => {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 420,
              easing: "ease-out",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        })
        .catch(() => {});
    });
  };

  const openLocaleMenu = () => {
    updateBackdropTop(headerRef.current, setBackdropTop);
    updateLocaleMenuRect(localeButtonRef.current, setLocaleMenuRect);
    setLocaleMenuOpen(true);
  };

  return (
    <>
      <div className="site-header-shell fixed inset-x-0 top-0 z-40 border-b border-[var(--line)] bg-[var(--surface-strong)]/72 shadow-[0_6px_18px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <header
          ref={headerRef}
          className="site-header mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-8 lg:px-10"
        >
          <a href={brandHref} className="site-header-brand flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg sm:h-[46px] sm:w-[46px]">
              <Image src="/icon.svg" alt="" aria-hidden="true" width={46} height={46} className="block h-full w-full object-contain" />
            </span>
            <span className="leading-tight">
              <span className="site-header-brand-title display block text-[0.9rem] font-semibold tracking-[0.15em] text-[var(--accent-strong)] sm:text-[1.04rem] sm:tracking-[0.2em]">
                MotiClaw
              </span>
            </span>
          </a>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 sm:flex md:gap-4 lg:gap-6">
            <nav className="flex min-w-0 items-center gap-3 text-sm text-[var(--muted)] md:gap-4 lg:gap-6">
              {navigationItems.map((item) => {
                const sharedClassName = `nav-link inline-flex items-center gap-1.5 transition ${item.active ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`;

                if (item.href) {
                  return (
                    <a key={item.key} href={item.href} className={sharedClassName} aria-current={item.active ? "page" : undefined}>
                      {item.icon === "back" ? <ArrowLeft size={15} weight="regular" aria-hidden="true" /> : null}
                      <span className="truncate">{item.label}</span>
                    </a>
                  );
                }

                return (
                  <span key={item.key} className={sharedClassName} aria-current={item.active ? "page" : undefined}>
                    {item.icon === "back" ? <ArrowLeft size={15} weight="regular" aria-hidden="true" /> : null}
                    <span className="truncate">{item.label}</span>
                  </span>
                );
              })}
            </nav>
            {statusSlot ? <div className="hidden shrink-0 xl:block">{statusSlot}</div> : null}
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-base btn-secondary btn-icon header-icon-btn"
              title={themeToggleLabel}
            >
              {resolvedTheme === "dark" ? <Moon size={16} weight="regular" aria-hidden="true" /> : <Sun size={16} weight="regular" aria-hidden="true" />}
            </button>

            <button
              type="button"
              ref={localeButtonRef}
              onClick={() => {
                if (localeMenuOpen) {
                  setLocaleMenuOpen(false);
                  return;
                }
                openLocaleMenu();
              }}
              className="btn-base btn-compact btn-icon header-icon-btn ml-2"
              title={`${languageLabel}: ${locale === "zh" ? "English" : "中文"}`}
              aria-haspopup="menu"
              aria-expanded={localeMenuOpen}
            >
              <Translate size={22} weight="regular" aria-hidden="true" />
            </button>

            {actionSlot ? <div className="ml-2 flex items-center gap-2">{actionSlot}</div> : null}
          </div>
        </header>
      </div>

      {localeMenuOpen && localeMenuRect && typeof document !== "undefined"
        ? createPortal(
            <>
              <button
                type="button"
                className="lang-drawer-top-catcher"
                aria-label={closeLanguageMenuLabel}
                onClick={() => setLocaleMenuOpen(false)}
                style={{ height: `${backdropTop}px` }}
              />
              <button
                type="button"
                className="lang-drawer-backdrop"
                aria-label={closeLanguageMenuLabel}
                onClick={() => setLocaleMenuOpen(false)}
                style={{ top: `${backdropTop}px` }}
              />
              <div
                className="lang-drawer-panel"
                style={{
                  top: `${localeMenuRect.top}px`,
                  right: `${localeMenuRect.right}px`,
                }}
                role="menu"
                aria-label={languageLabel}
              >
                {(["en", "zh"] as const).map((targetLocale) => {
                  const active = locale === targetLocale;

                  return (
                    <a
                      key={targetLocale}
                      href={localeHref(targetLocale)}
                      className={`lang-drawer-option ${active ? "lang-drawer-option-active" : ""}`}
                      role="menuitemradio"
                      aria-checked={active}
                    >
                      <span className="flex items-center gap-2">
                        <Globe size={16} weight="regular" aria-hidden="true" />
                        <span>{targetLocale === "zh" ? "中文" : "English"}</span>
                      </span>
                      {active ? <Check size={16} weight="regular" aria-hidden="true" /> : null}
                    </a>
                  );
                })}
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";

  const stored = window.localStorage.getItem(themeStorageKey);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getResolvedTheme(theme: ThemeMode): Exclude<ThemeMode, "system"> {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme(theme: ThemeMode) {
  const resolvedTheme = getResolvedTheme(theme);
  const root = document.documentElement;
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
}

function updateLocaleMenuRect(
  button: HTMLButtonElement | null,
  setRect: (value: { top: number; right: number }) => void,
) {
  if (!button) return;

  const rect = button.getBoundingClientRect();
  setRect({
    top: rect.bottom + 10,
    right: Math.max(16, window.innerWidth - rect.right),
  });
}

function updateBackdropTop(
  header: HTMLElement | null,
  setTop: (value: number) => void,
) {
  if (!header) return;

  const rect = header.getBoundingClientRect();
  setTop(Math.round(rect.bottom + 10));
}
