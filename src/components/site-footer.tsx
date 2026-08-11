import type { Locale } from "@/lib/locale";

type FooterLink = { label: string; href: string; external?: boolean };
type FooterColumn = { title: string; links: FooterLink[] };

function footerColumns(locale: Locale): FooterColumn[] {
  const q = `?lang=${locale}`;
  if (locale === "zh") {
    return [
      {
        title: "产品",
        links: [
          { label: "下载安装", href: `/download${q}` },
          { label: "产品能力", href: `/capabilities${q}` },
          { label: "互动产品预览", href: `/ai-partner-console${q}` },
          { label: "本地部署", href: `/local-deployment${q}` },
          { label: "Agent 管理工作台", href: `/agent-management-workbench${q}` },
          { label: "套餐价格", href: `/pricing${q}` },
        ],
      },
      {
        title: "解决方案",
        links: [
          { label: "全部解决方案", href: `/solutions${q}` },
          { label: "FDE 落地交付", href: `/fde-ai-delivery${q}` },
          { label: "AI 独立开发者", href: `/ai-workbench-for-indie-developers${q}` },
          { label: "OPC 内容运营", href: `/opc-content-ops-system${q}` },
          { label: "老板与超级个体", href: `/ai-partner-for-founders${q}` },
        ],
      },
      {
        title: "工作流",
        links: [
          { label: "全部工作流", href: `/workflows${q}` },
          { label: "FDE 本地交付路径", href: `/fde-local-ai-delivery${q}` },
          { label: "AI 内容日历", href: `/opc-ai-content-calendar-workflow${q}` },
          { label: "AI 决策工作流", href: `/founder-ai-decision-workflow${q}` },
          { label: "第一条 AI 伙伴工作流", href: `/founder-ai-employee-first-workflow${q}` },
        ],
      },
      {
        title: "资源",
        links: [
          { label: "全部资源", href: `/resources${q}` },
          { label: "博客", href: `/blog${q}` },
          { label: "产品文档", href: `/docs${q}` },
          { label: "快速开始", href: `/docs/quickstart${q}` },
          { label: "隐私政策", href: `/privacy${q}` },
          { label: "服务条款", href: `/terms-of-service${q}` },
        ],
      },
    ];
  }

  return [
    {
      title: "Product",
      links: [
        { label: "Download", href: `/download${q}` },
        { label: "Capabilities", href: `/capabilities${q}` },
        { label: "Interactive product preview", href: `/ai-partner-console${q}` },
        { label: "Local deployment", href: `/local-deployment${q}` },
        { label: "Agent workbench", href: `/agent-management-workbench${q}` },
        { label: "Pricing", href: `/pricing${q}` },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "All solutions", href: `/solutions${q}` },
        { label: "FDE delivery", href: `/fde-ai-delivery${q}` },
        { label: "Indie AI developers", href: `/ai-workbench-for-indie-developers${q}` },
        { label: "OPC content operations", href: `/opc-content-ops-system${q}` },
        { label: "Founders & solo operators", href: `/ai-partner-for-founders${q}` },
      ],
    },
    {
      title: "Workflows",
      links: [
        { label: "All workflows", href: `/workflows${q}` },
        { label: "FDE local delivery path", href: `/fde-local-ai-delivery${q}` },
        { label: "AI content calendar", href: `/opc-ai-content-calendar-workflow${q}` },
        { label: "AI decision workflow", href: `/founder-ai-decision-workflow${q}` },
        { label: "First AI partner workflow", href: `/founder-ai-employee-first-workflow${q}` },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "All resources", href: `/resources${q}` },
        { label: "Blog", href: `/blog${q}` },
        { label: "Documentation", href: `/docs${q}` },
        { label: "Quickstart", href: `/docs/quickstart${q}` },
        { label: "Privacy", href: `/privacy${q}` },
        { label: "Terms of service", href: `/terms-of-service${q}` },
      ],
    },
  ];
}

const taglines: Record<Locale, string> = {
  zh: "一个人，3 分钟搭建本地 AI 伙伴团队。数据留在你自己的设备上。",
  en: "Build your local AI partner team in 3 minutes. Your data stays on your device.",
};

export function SiteFooter({ locale }: { locale: Locale }) {
  const columns = footerColumns(locale);

  return (
    <footer className="cv-auto site-seo-footer border-t border-[var(--line)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))]">
          <div className="space-y-4">
            <a href={`/?lang=${locale}`} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg">
                <img src="/icon.svg?v=3" alt="" aria-hidden="true" loading="lazy" className="block h-full w-full object-contain" />
              </span>
              <span className="display text-[0.95rem] font-semibold tracking-[0.18em] text-[var(--accent-strong)]">MotiClaw</span>
            </a>
            <p className="max-w-xs text-sm leading-6 text-[var(--muted)]">{taglines[locale]}</p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="space-y-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{column.title}</p>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      href={link.href}
                      className="font-medium text-[var(--foreground)] transition hover:text-[var(--accent-strong)]"
                      {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} MotiClaw</p>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <span>{locale === "zh" ? "由" : "Built by"}</span>
              <a
                href="https://x.com/Mileson07"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent-strong)" }}
                className="font-medium transition-opacity hover:opacity-80"
              >
                超级峰
              </a>
              {locale === "zh" ? <span>打造</span> : null}
            </span>
            <span aria-hidden="true" className="text-[var(--line)]">
              ·
            </span>
            <span className="inline-flex items-center gap-2 text-[0.78rem]">
              <span>{locale === "zh" ? "创于" : "Created in"}</span>
              <span className="inline-flex items-center gap-1.5 text-[var(--foreground)]">
                <span
                  aria-hidden="true"
                  className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#de2910] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                >
                  <span className="absolute left-[2px] top-[1px] text-[7px] leading-none text-[#ffde00]">★</span>
                </span>
                <span>{locale === "zh" ? "中国·北京" : "Beijing, China"}</span>
              </span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
