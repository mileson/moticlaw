import type { Locale } from "@/lib/locale";
import { siteFaqItems } from "@/lib/site-faq";

export function SiteFaqSection({ locale }: { locale: Locale }) {
  const items = siteFaqItems(locale);
  const heading =
    locale === "zh" ? "常见问题 — 本地 AI 伙伴与智能体平台" : "Frequently Asked Questions — Local AI Partner Platform";
  const eyebrow = locale === "zh" ? "常见问题" : "FAQ";
  const intro =
    locale === "zh"
      ? "关于 MotiClaw 下载安装、AI 伙伴数量、会员套餐和数据安全的常见疑问。"
      : "Answers about downloading MotiClaw, AI partner limits, membership plans, and data safety.";

  return (
    <section id="faq" className="cv-auto fade-up scroll-mt-24 py-16" style={{ animationDelay: "330ms" }}>
      <p className="section-eyebrow-lg mb-3 text-center">{eyebrow}</p>
      <h2 className="mx-auto mb-3 max-w-3xl text-center text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
        {heading}
      </h2>
      <p className="mx-auto mb-8 max-w-2xl text-center text-base leading-7 text-[var(--muted)]">{intro}</p>
      <div className="mx-auto grid max-w-4xl gap-3">
        {items.map((item, index) => (
          <details
            key={item.question}
            open={index === 0 ? true : undefined}
            className="group min-w-0 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-4 shadow-[0_10px_24px_rgba(23,20,17,0.045)] transition hover:border-[rgba(0,0,0,0.32)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[1.02rem] font-semibold tracking-normal text-[var(--foreground)] [&::-webkit-details-marker]:hidden">
              <h3 className="text-left text-[1.02rem] font-semibold tracking-normal">{item.question}</h3>
              <span
                aria-hidden="true"
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--line)] text-sm text-[var(--muted)] transition group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.answer}</p>
            {item.comparison ? (
              <div className="mt-5 min-w-0 max-w-full overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--background)]">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--line)] bg-[rgba(0,0,0,0.06)] text-[var(--foreground)]">
                      <th scope="col" className="w-[22%] px-4 py-3 font-semibold">
                        {item.comparison.dimensionLabel}
                      </th>
                      <th scope="col" className="w-[39%] px-4 py-3 font-semibold">
                        {item.comparison.cloudLabel}
                      </th>
                      <th scope="col" className="w-[39%] px-4 py-3 font-semibold">
                        {item.comparison.moticlawLabel}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.comparison.rows.map((row) => (
                      <tr key={row.dimension} className="border-b border-[var(--line)] last:border-b-0">
                        <th scope="row" className="px-4 py-3 align-top font-semibold text-[var(--foreground)]">
                          {row.dimension}
                        </th>
                        <td className="px-4 py-3 align-top leading-6 text-[var(--muted)]">{row.cloud}</td>
                        <td className="px-4 py-3 align-top leading-6 text-[var(--foreground)]">{row.moticlaw}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </details>
        ))}
      </div>
    </section>
  );
}
