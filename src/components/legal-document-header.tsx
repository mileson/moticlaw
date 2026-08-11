"use client";

/*
## 核心功能
渲染官网法律文档页面的站点级顶部导航，统一品牌、跳转入口、主题切换、语言切换和登录入口。
## 输入
接收当前法律文档类型、当前语言，以及首页和登录入口所需的短文案。
## 输出
输出与官网首页风格一致的固定头部，并提供法律页内的文档切换导航。
## 定位
位于 `src/components`，作为法律页面共享的顶部壳层组件。
## 依赖
依赖 `legal-document-copy.ts`、`site-page-header.tsx` 和 `locale.ts`。
## 维护规则
- 调整法律页顶部的按钮文案、主题切换或语言切换时，必须同步检查中英文交互是否一致。
- 如果首页 header 结构或按钮风格发生变化，应同步评估这里是否继续保持同一套站点级壳层。
*/

import { legalDocumentPaths, type LegalDocumentKind } from "@/components/legal-document-copy";
import { SitePageHeader, type SitePageHeaderNavItem } from "@/components/site-page-header";
import type { Locale } from "@/lib/locale";

export function LegalDocumentHeader({
  kind,
  locale,
  homeLabel,
  loginLabel,
  languageLabel,
}: {
  kind: LegalDocumentKind;
  locale: Locale;
  homeLabel: string;
  loginLabel: string;
  languageLabel: string;
}) {
  const navigationItems: SitePageHeaderNavItem[] = [
    { key: "home", href: withLocaleQuery("/", locale), label: homeLabel, icon: "back" },
    { key: "terms", href: withLocaleQuery(legalDocumentPaths.terms, locale), label: locale === "zh" ? "服务条款" : "Terms of Service", active: kind === "terms" },
    { key: "privacy", href: withLocaleQuery(legalDocumentPaths.privacy, locale), label: locale === "zh" ? "隐私政策" : "Privacy Policy", active: kind === "privacy" },
  ];

  return (
    <SitePageHeader
      locale={locale}
      brandHref={withLocaleQuery("/", locale)}
      languageLabel={languageLabel}
      navigationItems={navigationItems}
      localeHref={(targetLocale) => withLocaleQuery(legalDocumentPaths[kind], targetLocale)}
      actionSlot={(
        <a
          href={withLocaleQuery("/login", locale)}
          className="btn-base btn-secondary inline-flex min-h-[2.75rem] items-center justify-center px-4 text-sm font-medium"
        >
          {loginLabel}
        </a>
      )}
    />
  );
}

function withLocaleQuery(path: string, locale: Locale) {
  const url = new URL(path, "https://www.moticlaw.com");
  url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}`;
}
