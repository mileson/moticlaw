import type { Locale } from "@/lib/locale";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderStatic } from "@/components/site-header-static";

type CompanyPageKind = "about" | "contact";

const content = {
  zh: {
    about: {
      eyebrow: "关于 MotiClaw",
      title: "为内容创作者打造的本地 AI 工作台",
      lead: "MotiClaw 把灵感、素材、创作与发布放进同一个本地工作空间，让 AI 接手耗时的内容执行，同时让你保留对资料、版本和发布节奏的控制。",
      sections: [
        { title: "MotiClaw 解决什么问题？", body: "它减少内容创作过程中在笔记、文件、对话和发布工具之间反复切换的成本。你可以集中整理素材、生成草稿、改写版本并完成发布前检查。" },
        { title: "为什么采用本地优先？", body: "本地优先意味着工作资料默认留在自己的设备上。只有当你主动使用需要联网的能力时，相关内容才会按对应功能的说明发送到外部服务。" },
        { title: "谁在打造 MotiClaw？", body: "MotiClaw 由超级峰在中国北京持续打造，面向个人创作者、超级个体和需要稳定内容工作流的小团队。" },
      ],
      actionLabel: "查看创作者公开主页",
      actionHref: "https://x.com/Mileson07",
    },
    contact: {
      eyebrow: "联系我们",
      title: "告诉我们你正在创作什么",
      lead: "如果你在安装、使用、合作或内容工作流上遇到问题，可以通过下面的公开渠道联系我们。邮件中请说明使用平台和问题现象，便于我们更快定位。",
      sections: [
        { title: "如何获得产品支持？", body: "发送邮件到 chaojifeng@shadowlaws.com。涉及运行问题时，请附上系统版本、MotiClaw 版本和可复现步骤；请不要发送密码、密钥或其他敏感信息。" },
        { title: "如何交流合作？", body: "产品合作、内容创作工作流和本地 AI 使用场景也可以通过同一邮箱联系，并在主题中注明合作方向。" },
        { title: "在哪里了解更新？", body: "你可以访问超级峰的公开主页，了解 MotiClaw 的产品进展与创作实践。" },
      ],
      actionLabel: "发送邮件",
      actionHref: "mailto:chaojifeng@shadowlaws.com",
    },
  },
  en: {
    about: {
      eyebrow: "About MotiClaw",
      title: "A local AI workspace built for content creators",
      lead: "MotiClaw brings ideas, source material, creation, and publishing into one local workspace. AI handles time-consuming production work while you keep control of your material, versions, and publishing decisions.",
      sections: [
        { title: "What problem does MotiClaw solve?", body: "It reduces the repeated switching between notes, files, chats, and publishing tools. You can organize source material, draft content, adapt versions, and complete pre-publish checks in one workspace." },
        { title: "Why is MotiClaw local-first?", body: "Local-first means your working material stays on your device by default. Content is sent to an external service only when you choose a connected feature that requires it, subject to that feature's description." },
        { title: "Who builds MotiClaw?", body: "MotiClaw is built by Chaojifeng in Beijing, China, for individual creators, solo operators, and small teams that need a dependable content workflow." },
      ],
      actionLabel: "View the creator profile",
      actionHref: "https://x.com/Mileson07",
    },
    contact: {
      eyebrow: "Contact",
      title: "Tell us what you are creating",
      lead: "For installation, product use, partnerships, or content-workflow questions, contact us through the public channel below. Include your platform and what happened so we can investigate efficiently.",
      sections: [
        { title: "How do I get product support?", body: "Email chaojifeng@shadowlaws.com. For a product issue, include your operating-system version, MotiClaw version, and reproduction steps. Do not send passwords, API keys, or other sensitive information." },
        { title: "How do I discuss a partnership?", body: "Use the same email for product partnerships, creator workflows, and local AI use cases, and identify the collaboration topic in the subject line." },
        { title: "Where can I follow updates?", body: "Visit Chaojifeng's public profile for MotiClaw product updates and creator-workflow notes." },
      ],
      actionLabel: "Send an email",
      actionHref: "mailto:chaojifeng@shadowlaws.com",
    },
  },
} as const;

export function CompanyInfoPage({ kind, locale }: { kind: CompanyPageKind; locale: Locale }) {
  const copy = content[locale][kind];
  const path = `/${kind}`;
  const pageUrl = `https://www.moticlaw.com${path}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": kind === "about" ? "AboutPage" : "ContactPage",
    url: pageUrl,
    name: copy.title,
    description: copy.lead,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    datePublished: "2026-08-18",
    dateModified: "2026-08-18",
    author: { "@id": "https://www.moticlaw.com/#founder" },
    publisher: { "@id": "https://www.moticlaw.com/#organization" },
    about: { "@id": "https://www.moticlaw.com/#organization" },
  };

  return (
    <main className="site-shell min-h-screen overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteHeaderStatic locale={locale} path={path} />
      <article className="mx-auto w-full max-w-5xl px-4 pb-20 pt-32 sm:px-8 sm:pt-40 lg:px-10">
        <header className="max-w-3xl">
          <p className="section-eyebrow-lg mb-4">{copy.eyebrow}</p>
          <h1 className="display text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">{copy.title}</h1>
          <p className="mt-7 text-lg leading-8 text-[var(--muted)]">{copy.lead}</p>
        </header>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
          {copy.sections.map((section) => (
            <section key={section.title} className="bg-[var(--surface)] p-7 sm:p-8">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">{section.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{section.body}</p>
            </section>
          ))}
        </div>
        <a className="btn-base btn-primary mt-10 inline-flex min-h-12 px-6" href={copy.actionHref} {...(copy.actionHref.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
          {copy.actionLabel}
        </a>
      </article>
      <SiteFooter locale={locale} />
      <script src="/landing.js" defer />
    </main>
  );
}
