
export const dynamic = "force-static";

const llmsText = `# MotiClaw

> MotiClaw is a local-first AI workspace for content creators. It brings ideas, source material, creation, and publishing into one local workspace, while AI handles much of the execution and work data stays on the user's device by default.

MotiClaw（墨爪）是一款本地内容创作 AI 工作台。它把灵感、素材、创作与发布放进同一个本地工作空间，让 AI 完成大部分内容创作执行，工作数据默认留在用户自己的设备上。

Use the Chinese pages as the canonical source unless a link explicitly includes \`?lang=en\`. The sitemap lists every indexable page; this file is the curated starting point.

## Product

- [MotiClaw homepage](https://www.moticlaw.com/): Current product positioning, primary workflow, creator use cases, and download entry.
- [Capabilities](https://www.moticlaw.com/capabilities): What creators can do across ideas, materials, drafting, collaboration, and publishing.
- [Download](https://www.moticlaw.com/download): Desktop download options, supported platforms, and installation guidance.
- [Local deployment](https://www.moticlaw.com/local-deployment): Local-first operation, device boundaries, and deployment choices.
- [Pricing](https://www.moticlaw.com/pricing): Current plans and purchasing information.

## Guides and documentation

- [Documentation index](https://www.moticlaw.com/docs): Product concepts and task-oriented guides.
- [Quickstart](https://www.moticlaw.com/docs/quickstart): The shortest path from installation to a working local workspace.
- [Data and security](https://www.moticlaw.com/docs/data-security): What stays local, what can connect externally, and the user's control boundaries.
- [FAQ](https://www.moticlaw.com/docs/faq): Common product, setup, and usage questions.
- [Workflows](https://www.moticlaw.com/workflows): Repeatable ways to use MotiClaw for real content work.
- [Solutions](https://www.moticlaw.com/solutions): Product applications for creators, solo operators, and delivery teams.

## Trust and discovery

- [About MotiClaw](https://www.moticlaw.com/about): Product purpose, local-first principles, creator identity, and provenance.
- [Contact MotiClaw](https://www.moticlaw.com/contact): Public support and partnership contact information.
- [Blog](https://www.moticlaw.com/blog): Product thinking, practical workflows, and cited research.
- [Privacy policy](https://www.moticlaw.com/privacy): How the website and product handle personal information.
- [Terms of service](https://www.moticlaw.com/terms-of-service): Terms governing use of MotiClaw.
- [XML sitemap](https://www.moticlaw.com/sitemap.xml): Complete list of canonical, indexable pages and language alternates.

## English

- [English homepage](https://www.moticlaw.com/?lang=en): English product overview.
- [English capabilities](https://www.moticlaw.com/capabilities?lang=en): English capability overview.
- [English documentation](https://www.moticlaw.com/docs?lang=en): English documentation index.

## Optional

- [AI partner console preview](https://www.moticlaw.com/ai-partner-console): Interactive product preview; useful when visual interface context is needed.
`;

export function GET() {
  return new Response(llmsText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
