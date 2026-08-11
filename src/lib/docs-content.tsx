import type { ReactNode } from "react";
import type { Locale } from "@/lib/locale";
import { ContentFigureView } from "@/components/content-figure";
import type { ContentFigure, ContentSource } from "@/lib/content-schema";

export type DocPage = {
  slug: string;
  updatedAt: string;
  version: string;
  visuals: readonly ContentFigure[];
  sources: readonly ContentSource[];
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  content: Record<Locale, ReactNode>;
};

export type DocsNavGroup = {
  title: Record<Locale, string>;
  slugs: string[];
};

const h2 = "mt-10 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-2xl";
const p = "mt-4 text-[0.95rem] leading-8 text-[var(--muted)]";
const ul = "mt-4 list-disc space-y-2 pl-6 text-[0.95rem] leading-8 text-[var(--muted)]";
const ol = "mt-4 list-decimal space-y-2 pl-6 text-[0.95rem] leading-8 text-[var(--muted)]";
const strong = "font-semibold text-[var(--foreground)]";
const tip = "mt-5 rounded-2xl border border-[rgba(239,123,67,0.25)] bg-[rgba(239,123,67,0.06)] px-4 py-3 text-sm leading-7 text-[var(--foreground)]";

const firstRepeatableWorkflowConcept: ContentFigure = {
  id: "first-repeatable-workflow-loop",
  kind: "concept",
  src: "/docs/first-repeatable-workflow/concept-01.webp",
  width: 1600,
  height: 900,
  alt: {
    zh: "独立工作者依次检查任务输入、AI 伙伴准备的草稿包和最终确认后的输出盒",
    en: "A solo operator reviews a recurring input, an AI partner's prepared draft package, and an approved output tray",
  },
  caption: {
    zh: "一条可重复工作流的最小结构：固定输入、AI 准备、人工确认、再交付。",
    en: "The smallest repeatable loop: stable input, AI preparation, human confirmation, then delivery.",
  },
};

const firstRepeatableWorkflowProductCase: ContentFigure = {
  id: "first-repeatable-workflow-agent-workspace",
  kind: "screenshot",
  src: "/docs/first-repeatable-workflow/screenshot-01.png",
  width: 1440,
  height: 1000,
  alt: {
    zh: "MotiClaw AI 伙伴管理页展示一组本地示例伙伴，以及每位伙伴的职责、状态、技能和任务数量",
    en: "The MotiClaw AI partner management page shows a local sample team with each partner's role, status, skills, and task counts",
  },
  caption: {
    zh: "先看职责和当前状态，再选择最贴近这条重复任务的一位伙伴；第一轮不需要把所有角色都接进来。",
    en: "Review each role and its current status, then choose the one closest to the recurring task; the first round does not need every partner.",
  },
  capturedAt: "2026-07-14T16:12:12.344Z",
  appVersion: "0.3.3",
  dataMode: "synthetic",
  scenarioId: "solo-operator-overview",
  fixtureVersion: "2026.07.14.2",
  fixtureSha256: "aaebab4b9eb169e5dc35213c87f0a53c324e98ef2509dcd2a18fd5c3e018ac08",
  productGitDirty: false,
  productGitSha: "3c596f2375044c38f6112757bbfb61c5d2ad1d4a",
};

const firstRepeatableWorkflowSources: readonly ContentSource[] = [
  {
    title: "Anthropic — Building effective agents",
    url: "https://www.anthropic.com/engineering/building-effective-agents",
    accessedAt: "2026-07-14",
  },
  {
    title: "MotiClaw Docs — Quickstart",
    url: "https://www.moticlaw.com/docs/quickstart?lang=zh",
    accessedAt: "2026-07-14",
  },
  {
    title: "MotiClaw Docs — Agent Workspace & Daily Ops",
    url: "https://www.moticlaw.com/docs/agent-workspace?lang=zh",
    accessedAt: "2026-07-14",
  },
];

const quickstartProductCase: ContentFigure = {
  id: "quickstart-agent-workspace",
  kind: "screenshot",
  src: "/docs/quickstart/screenshot-01.png",
  width: 1440,
  height: 1000,
  alt: {
    zh: "MotiClaw AI 伙伴页展示伙伴职责、运行状态、渠道、技能和任务数量",
    en: "The MotiClaw AI partner page shows partner roles, runtime status, channels, skills, and task counts",
  },
  caption: {
    zh: "召唤完成后回到 AI 伙伴页，先确认角色、状态和渠道，再交付第一件可退回修改的小任务。",
    en: "After summoning, return to the AI partner page to check the role, status, and channels before handing over a small task that can be revised safely.",
  },
  capturedAt: "2026-07-20T05:33:54.654Z",
  appVersion: "0.3.3",
  dataMode: "synthetic",
  scenarioId: "solo-operator-overview",
  fixtureVersion: "2026.07.14.2",
  fixtureSha256: "aaebab4b9eb169e5dc35213c87f0a53c324e98ef2509dcd2a18fd5c3e018ac08",
  productGitDirty: false,
  productGitSha: "3c596f2375044c38f6112757bbfb61c5d2ad1d4a",
};

const billingProductCase: ContentFigure = {
  id: "billing-agent-team-size",
  kind: "screenshot",
  src: "/docs/billing/screenshot-01.png",
  width: 1440,
  height: 1000,
  alt: {
    zh: "MotiClaw AI 伙伴页展示 15 位不同职责的伙伴及其运行状态、技能和任务数量",
    en: "The MotiClaw AI partner page shows 15 partners with distinct roles, runtime states, skills, and task counts",
  },
  caption: {
    zh: "升级前先数清真正需要长期保留的伙伴。接近 16 位时，Plus 仍够用；需要继续拆分更多角色时，再比较 Pro。",
    en: "Count the partners you genuinely need to keep before upgrading. Plus still fits a team near 16; compare Pro when you need to split work across more roles.",
  },
  capturedAt: "2026-07-21T05:34:14.308Z",
  appVersion: "0.3.3",
  dataMode: "synthetic",
  scenarioId: "solo-operator-overview",
  fixtureVersion: "2026.07.14.2",
  fixtureSha256: "aaebab4b9eb169e5dc35213c87f0a53c324e98ef2509dcd2a18fd5c3e018ac08",
  productGitDirty: false,
  productGitSha: "3c596f2375044c38f6112757bbfb61c5d2ad1d4a",
};

const billingSources: readonly ContentSource[] = [
  {
    title: "MotiClaw — 套餐价格",
    url: "https://www.moticlaw.com/pricing?lang=zh",
    accessedAt: "2026-07-21",
  },
];

export const docsNav: DocsNavGroup[] = [
  {
    title: { zh: "开始使用", en: "Get started" },
    slugs: ["index", "quickstart", "first-repeatable-workflow"],
  },
  {
    title: { zh: "核心概念", en: "Core concepts" },
    slugs: ["agent-workspace", "billing", "data-security"],
  },
  {
    title: { zh: "场景指南", en: "Scenario guides" },
    slugs: ["channels-feishu", "for-fde", "for-solo-operators"],
  },
  {
    title: { zh: "支持", en: "Support" },
    slugs: ["faq"],
  },
];

export const docPages: DocPage[] = [
  {
    slug: "index",
    updatedAt: "2026-07-14",
    version: "1.1",
    visuals: [],
    sources: [],
    title: { zh: "MotiClaw 是什么", en: "What is MotiClaw" },
    description: {
      zh: "MotiClaw 是一个本地优先的 AI 伙伴与智能体控制平台：在你自己的设备上安装、配置和管理一支 AI 伙伴团队。",
      en: "MotiClaw is a local-first AI partner and agent control platform: install, configure, and manage a team of AI partners on your own device.",
    },
    content: {
      zh: (
        <>
          <p className={p}>
            MotiClaw 帮一个人经营业务的人，在自己的电脑上管理一支 AI 伙伴团队：下载桌面端、领取预配置的 Agent、接入你每天在用的渠道，就能先从资料收拢、事项跟进和初稿开始。工作数据默认留在本机；仅你主动接入的渠道与模型调用按任务所需出网。
          </p>
          <h2 className={h2}>适合谁用</h2>
          <ul className={ul}>
            <li><span className={strong}>老板个体与超级个体</span>：把收拢、跟进、提醒和初稿交给 AI 伙伴，自己保留目标与决定。</li>
            <li><span className={strong}>AI 独立开发者</span>：管理用户反馈、发布准备、文档和日常产品运营。</li>
            <li><span className={strong}>FDE 与 AI 落地交付者</span>：需要时也可以把可维护的本地工作台交付给客户；这不是本站内容的默认使用前提。</li>
          </ul>
          <h2 className={h2}>三个核心理念</h2>
          <ul className={ul}>
            <li><span className={strong}>本地优先</span>：工作数据与 Agent 状态默认保存在你的设备上，渠道和模型调用按任务所需出网。</li>
            <li><span className={strong}>开箱即用</span>：内置上百个预配置 Agent，领取即可上岗，不用从零搭建。</li>
            <li><span className={strong}>零门槛管理</span>：安装、修复、重启、更新都是一键操作，不用记命令。</li>
          </ul>
          <div className={tip}>下一步：阅读「快速开始」，3 分钟让第一个 AI 伙伴上岗。</div>
        </>
      ),
      en: (
        <>
          <p className={p}>
            MotiClaw helps one-person businesses manage a team of AI partners on their own computer. Download the desktop app, claim a pre-configured agent, connect the channels you already use, and start with gathering, follow-up, and drafts. Work data stays local by default; connected channels and model calls go online only as the task requires.
          </p>
          <h2 className={h2}>Who it is for</h2>
          <ul className={ul}>
            <li><span className={strong}>Owner-operators and solo businesses</span>: hand gathering, follow-up, reminders, and drafts to AI partners while keeping goals and decisions.</li>
            <li><span className={strong}>Indie AI developers</span>: manage user feedback, release preparation, docs, and everyday product operations.</li>
            <li><span className={strong}>FDEs and AI delivery builders</span>: when needed, deliver a maintainable local workbench to a client; client delivery is not required for the core product.</li>
          </ul>
          <h2 className={h2}>Three core ideas</h2>
          <ul className={ul}>
            <li><span className={strong}>Local-first</span>: work data and agent state stay on your device by default; channels and model calls go online only as required.</li>
            <li><span className={strong}>Ready out of the box</span>: hundreds of pre-configured agents - claim one and it works.</li>
            <li><span className={strong}>Zero-friction management</span>: install, repair, restart, update - all one click.</li>
          </ul>
          <div className={tip}>Next: read Quickstart and get your first AI partner working in 3 minutes.</div>
        </>
      ),
    },
  },
  {
    slug: "quickstart",
    updatedAt: "2026-07-20",
    version: "1.2",
    visuals: [quickstartProductCase],
    sources: [],
    title: { zh: "快速开始", en: "Quickstart" },
    description: {
      zh: "从安装桌面端到完成第一次验收：配置运行环境与模型、召唤 AI 伙伴、按需接入渠道，再确认它已经可以安全开始工作。",
      en: "Go from installing the desktop app to a verified first handoff: prepare a runtime and model, summon an AI partner, connect only the channels you need, and confirm it is ready to work safely.",
    },
    content: {
      zh: (
        <>
          <p className={p}>
            这份快速开始只完成一件事：让第一位 AI 伙伴进入工区，并用一件可退回修改的小任务确认它已经能工作。先不要急着召唤一整支团队，也不要把付款、删除、群发或正式发布交给第一轮。
          </p>

          <h2 className={h2}>开始前</h2>
          <ul className={ul}>
            <li>准备一台受支持的 macOS 或 Windows 设备，并使用官网当前提供的安装包。</li>
            <li>准备一个可用的模型配置。没有可用模型时，召唤流程会停下来提醒你先完成配置。</li>
            <li>挑一件你几分钟就能验收、做错也能退回修改的小任务，例如整理一段会议纪要或归类几条反馈。</li>
          </ul>

          <h2 className={h2}>1. 下载、安装并完成首次设置</h2>
          <ol className={ol}>
            <li>打开官网下载页，选择适合当前设备的安装包。公开版本支持 macOS Apple Silicon、macOS Intel 和 Windows x64 安装版，Windows ARM64 设备使用兼容安装版。</li>
            <li>按系统向导完成安装并登录。macOS 首次打开如被系统拦截，前往「系统设置 → 隐私与安全性」选择允许打开。</li>
            <li>在「开始使用」里选择一个 AI 伙伴运行框架，完成安装，再添加或选择一个可用模型。</li>
          </ol>

          <h2 className={h2}>2. 从 AI 伙伴市场召唤第一位伙伴</h2>
          <ol className={ol}>
            <li>打开侧边栏的「AI 伙伴市场」，先按你要完成的任务挑一个角色，不按数量挑。</li>
            <li>打开详情，检查它会带入的伙伴人设、技能和定时任务，再点击「召唤伙伴」。</li>
            <li>依次确认运行框架、模型、知识库位置和所需能力。定时任务先只启用你能解释并愿意检查的项目。</li>
            <li>点击「确认召唤」。看到“召唤成功”和落位结果后，这一步才算完成；如果中途报错，不要重复创建，先按页面提示补齐缺失配置后重试。</li>
          </ol>

          <h2 className={h2}>3. 按需要接入渠道</h2>
          <ol className={ol}>
            <li>召唤成功后选择「继续接渠道」，或回到「AI 伙伴」页打开这位伙伴的渠道设置。</li>
            <li>只接入这件任务真正需要的渠道，例如飞书或微信；第一轮不需要把所有渠道都打开。</li>
            <li>按渠道引导完成授权后，发送一条不会影响真实业务的测试消息，确认伙伴能够收到并返回结果。</li>
          </ol>
          <div className={tip}>暂时不需要渠道也可以跳过。你可以先在本地工区完成第一轮验收，之后再把稳定的任务接到日常渠道。</div>

          <ContentFigureView visual={quickstartProductCase} locale="zh" />

          <h2 className={h2}>4. 完成第一次验收</h2>
          <ol className={ol}>
            <li>回到「AI 伙伴」页，确认刚召唤的伙伴已经出现，角色说明、运行状态和渠道与你刚才的选择一致。</li>
            <li>把准备好的小任务交给它，并写清输出格式与停止位置。例如：“把这 6 条反馈分成问题、需求和提问；不确定的放进待确认，不要替我发送回复。”</li>
            <li>检查结果是否完整、能回到原始材料、方便你做决定，并且需要你确认的动作确实停了下来。</li>
          </ol>
          <p className={p}>当同一份输入可以得到一份你几分钟就能检查的结果，且没有越过人工确认点，第一位 AI 伙伴才算真正上岗。下一步再换一份新输入复跑，而不是立刻增加更多伙伴。</p>

          <h2 className={h2}>常见问题</h2>
          <ul className={ul}>
            <li><span className={strong}>召唤按钮不可用</span>：先回到「开始使用」确认运行框架已安装，并在模型设置里选择可用模型。</li>
            <li><span className={strong}>召唤没有完成</span>：保留页面上的失败信息，补齐它指出的能力或知识库配置后再重试，不要手工复制伙伴目录。</li>
            <li><span className={strong}>渠道收不到测试消息</span>：检查授权是否完成、目标群或会话是否正确，再回到伙伴页查看渠道状态。</li>
            <li><span className={strong}>结果很长但无法验收</span>：把任务缩成一种分类、一份草稿或一张清单，并写清缺失信息进入“待确认”。</li>
          </ul>

          <h2 className={h2}>数据边界与下一步</h2>
          <p className={p}>工作数据默认留在本机；仅你主动接入的渠道与模型调用按任务所需出网。完成第一轮后，可以继续阅读「Agent 工区与日常管理」「接入飞书渠道」和「用一条重复任务，跑通第一个 AI 伙伴工作流」。</p>
        </>
      ),
      en: (
        <>
          <p className={p}>
            This quickstart has one finish line: place your first AI partner in the workspace and verify it with a small task that can be sent back for revision. Do not begin with a full team or hand over payments, deletion, mass messaging, or public publishing in the first round.
          </p>

          <h2 className={h2}>Before you start</h2>
          <ul className={ul}>
            <li>Use a supported macOS or Windows device and the installer currently offered on the official download page.</li>
            <li>Prepare a working model configuration. The summon flow will stop and ask you to configure one if no model is available.</li>
            <li>Choose a task you can review in minutes and safely return for revision, such as organizing meeting notes or grouping a few feedback items.</li>
          </ul>

          <h2 className={h2}>1. Install MotiClaw and finish first-time setup</h2>
          <ol className={ol}>
            <li>Open the official download page and choose the installer for your device. Public builds cover macOS Apple Silicon, macOS Intel, and Windows x64, with the Windows build also supporting ARM64 devices through compatibility.</li>
            <li>Follow the system installer and sign in. If macOS blocks the first launch, open System Settings → Privacy &amp; Security and allow the app.</li>
            <li>Open Get Started, choose an AI partner runtime, complete its installation, then add or select a working model.</li>
          </ol>

          <h2 className={h2}>2. Summon your first partner from AI Partner Market</h2>
          <ol className={ol}>
            <li>Open AI Partner Market from the sidebar and choose one role for the task you want to finish. Do not choose by quantity.</li>
            <li>Open its details and review the partner persona, skills, and scheduled jobs it brings in, then select Summon Agent.</li>
            <li>Confirm the runtime, model, knowledge-base location, and required capabilities. Enable only scheduled jobs you understand and plan to review.</li>
            <li>Select Confirm Summon. This step is complete only when you see Summon Successful and the placement result. If it stops, follow the missing-configuration prompt before trying again.</li>
          </ol>

          <h2 className={h2}>3. Connect only the channels you need</h2>
          <ol className={ol}>
            <li>After a successful summon, choose Continue to Channels, or return to the AI Partners page and open this partner&apos;s channel settings.</li>
            <li>Connect only the channel required for this task, such as Feishu or WeChat. The first round does not need every channel.</li>
            <li>Complete the channel authorization, then send a test message that cannot affect live work and confirm the partner receives it and returns a result.</li>
          </ol>
          <div className={tip}>You can skip channels for now. Verify the first task in the local workspace, then connect the workflow to an everyday channel after it is stable.</div>

          <ContentFigureView visual={quickstartProductCase} locale="en" />

          <h2 className={h2}>4. Complete the first acceptance check</h2>
          <ol className={ol}>
            <li>Return to AI Partners and confirm the new partner appears with the role, runtime status, and channels you selected.</li>
            <li>Hand over the small task you prepared, with an output shape and a stopping point. For example: “Group these six feedback items into issues, requests, and questions. Put uncertain items under Needs Review and do not send replies for me.”</li>
            <li>Check that the result is complete, traceable to the source material, easy to decide on, and stopped before any action that needs your approval.</li>
          </ol>
          <p className={p}>Your first AI partner is ready when the same input produces something you can review in minutes without crossing the human approval point. Use fresh input for the next round before adding more partners.</p>

          <h2 className={h2}>Troubleshooting</h2>
          <ul className={ul}>
            <li><span className={strong}>Summon is unavailable</span>: return to Get Started, confirm that a runtime is installed, and select a working model in model settings.</li>
            <li><span className={strong}>Summoning did not finish</span>: keep the failure message, complete the capability or knowledge-base setup it identifies, and retry. Do not copy partner folders manually.</li>
            <li><span className={strong}>The channel does not receive the test</span>: confirm authorization, verify the target group or conversation, then review channel status on the partner page.</li>
            <li><span className={strong}>The result is long but hard to review</span>: shrink the task to one classification, draft, or checklist, and send missing information to Needs Review.</li>
          </ul>

          <h2 className={h2}>Data boundary and next steps</h2>
          <p className={p}>Work data stays on your device by default; only channels you connect and model calls go online as the task requires. Next, continue with Agent Workspace &amp; Daily Ops, Connecting Feishu, or Run Your First AI Partner Workflow with One Recurring Task.</p>
        </>
      ),
    },
  },
  {
    slug: "first-repeatable-workflow",
    updatedAt: "2026-07-14",
    version: "1.0",
    visuals: [firstRepeatableWorkflowConcept, firstRepeatableWorkflowProductCase],
    sources: firstRepeatableWorkflowSources,
    title: {
      zh: "用一条重复任务，跑通第一个 AI 伙伴工作流",
      en: "Run Your First AI Partner Workflow with One Recurring Task",
    },
    description: {
      zh: "选一件每周都会发生的小事，先让 AI 伙伴准备材料、由你确认结果，连续跑通三轮后再增加自动化。",
      en: "Choose one small weekly task, let an AI partner prepare the work for your review, and complete three reliable rounds before adding automation.",
    },
    content: {
      zh: (
        <>
          <p className={p}>
            第一条工作流的目标不是“从此不管”，而是同一类任务换一份新输入，仍能稳定得到一份你几分钟就能检查的结果。下面用一张工作流卡，把这件事压到最小。
          </p>

          <ContentFigureView visual={firstRepeatableWorkflowConcept} locale="zh" />

          <h2 className={h2}>1. 选一件适合起步的重复任务</h2>
          <p className={p}>先从最近两周的工作里找一件符合四个条件的小事：</p>
          <ul className={ul}>
            <li>每周至少出现两次，输入来源相对固定。</li>
            <li>AI 伙伴的产出可以先是草稿、清单、分类或候选项。</li>
            <li>你能在几分钟内判断结果是否可用。</li>
            <li>即使做错，也能退回修改，不会直接付款、删除、群发或上线。</li>
          </ul>
          <div className={tip}>适合起步：反馈归类、会议纪要转跟进项、资料整理、FAQ 回复草稿。暂不适合：自动付款、自动删数据、未经确认直接对外发布。</div>

          <h2 className={h2}>2. 写一张工作流卡</h2>
          <p className={p}>不要先写一段很长的提示词。先把任务的五个位置写清楚：</p>
          <ol className={ol}>
            <li><span className={strong}>触发</span>：什么时候开始，例如“每周五下午”或“收到一批新反馈”。</li>
            <li><span className={strong}>输入</span>：材料从哪里来，例如一个文件夹、一段对话或一份会议纪要。</li>
            <li><span className={strong}>AI 准备</span>：只写可检查的产出，例如“三类反馈 + 每类待确认问题”。</li>
            <li><span className={strong}>你确认</span>：列出必须由你判断的内容，例如优先级、承诺、价格与是否发送。</li>
            <li><span className={strong}>交付</span>：确认后放到哪里，例如待办清单、文档草稿或下一轮输入盒。</li>
          </ol>
          <div className={tip}>示例：收到本周用户反馈 → AI 伙伴合并重复项并分成 bug / 需求 / 提问 → 我确认优先级和回复边界 → 进入下周待办与回复草稿。</div>

          <h2 className={h2}>3. 在 Agent 工区完成最小配置</h2>
          <ol className={ol}>
            <li>打开「Agent 工区」，领取或选择一个与任务最接近的 AI 伙伴。</li>
            <li>把工作流卡中的“输入、AI 准备、你确认”写进它的角色说明或本次任务，明确遇到材料不足时先列出缺口。</li>
            <li>如果材料来自飞书等渠道，再为这个 AI 伙伴接入对应渠道；不需要的渠道先不接。</li>
            <li>准备一份你已经知道正确结果的真实样本，用它做第一轮校准。</li>
          </ol>

          <ContentFigureView visual={firstRepeatableWorkflowProductCase} locale="zh" />

          <p className={p}>上面的本地示例里，每位伙伴都有清楚的职责和状态。若你要先跑“每周反馈归类”，只选择客户回访助手即可；完成标准是它交出问题、需求和待回复项，并停在你确认的位置。</p>

          <h2 className={h2}>4. 手动跑第一轮，并检查四件事</h2>
          <ul className={ul}>
            <li><span className={strong}>完整</span>：原始材料有没有漏掉关键项。</li>
            <li><span className={strong}>有据</span>：结论能不能回到原文、文件或对话，而不是凭空补全。</li>
            <li><span className={strong}>可决定</span>：结果是否已经整理成你能比较、修改或确认的形式。</li>
            <li><span className={strong}>没越界</span>：需要你拍板的动作有没有停在确认点。</li>
          </ul>
          <p className={p}>把这轮修改写成固定检查清单。不要只在对话里说“下次注意”，否则下一份输入很难复现。</p>

          <h2 className={h2}>5. 换新输入，再跑两轮</h2>
          <p className={p}>
            第二轮用清单纠正格式和遗漏；第三轮换一份新的真实材料，确认它不是只会处理第一次的样本。三轮都能快速验收后，再从下面三件事里只加一件：固定触发时间、自动收拢输入，或把确认后的结果送到下一站。
          </p>
          <p className={p}>一次只扩一格。新增动作如果失败，你应该能退回上一版，而不是重新搭整条链路。</p>

          <h2 className={h2}>常见问题</h2>
          <ul className={ul}>
            <li><span className={strong}>每次格式都变</span>：给一份明确的输出结构，并把“缺失就留空”写进规则。</li>
            <li><span className={strong}>经常自己补事实</span>：要求每条结论附来源；找不到来源就放进“待确认”。</li>
            <li><span className={strong}>检查比自己做还慢</span>：任务仍然太大，缩成一个分类、一个草稿或一张清单。</li>
            <li><span className={strong}>结果不错，但不敢长期跑</span>：保留人工确认点，再增加运行记录和失败后的退回方式。</li>
          </ul>

          <h2 className={h2}>数据边界</h2>
          <p className={p}>工作数据默认留在本机；仅你主动接入的渠道与模型调用按任务所需出网。只接当前工作流需要的渠道，也只提供完成当前任务所需的材料。</p>
        </>
      ),
      en: (
        <>
          <p className={p}>
            The goal of your first workflow is not “never look at it again.” It is to swap in a fresh input and still receive something you can check in minutes. A small workflow card is enough to make that repeatable.
          </p>

          <ContentFigureView visual={firstRepeatableWorkflowConcept} locale="en" />

          <h2 className={h2}>1. Choose a recurring task small enough to learn from</h2>
          <p className={p}>Look at the last two weeks and pick one task that meets all four conditions:</p>
          <ul className={ul}>
            <li>It appears at least twice a week and has a reasonably stable input source.</li>
            <li>The AI partner can produce a draft, checklist, classification, or options first.</li>
            <li>You can judge the result in a few minutes.</li>
            <li>A mistake can be sent back for revision instead of paying, deleting, broadcasting, or shipping.</li>
          </ul>
          <div className={tip}>Good starters: feedback triage, meeting notes to follow-ups, research organization, or FAQ reply drafts. Wait on automatic payments, deletion, or public publishing.</div>

          <h2 className={h2}>2. Write a workflow card</h2>
          <p className={p}>Do not begin with a long prompt. Define these five parts first:</p>
          <ol className={ol}>
            <li><span className={strong}>Trigger</span>: when the work starts, such as Friday afternoon or when a new feedback batch arrives.</li>
            <li><span className={strong}>Input</span>: where the material comes from: a folder, conversation, or meeting note.</li>
            <li><span className={strong}>AI preparation</span>: a reviewable output, such as three feedback groups plus open questions.</li>
            <li><span className={strong}>Your confirmation</span>: decisions that stay with you: priority, promises, price, and whether to send.</li>
            <li><span className={strong}>Delivery</span>: where approved work goes next: a todo list, document draft, or next-input tray.</li>
          </ol>
          <div className={tip}>Example: weekly feedback arrives → the AI partner merges duplicates and groups bugs, requests, and questions → I confirm priority and reply boundaries → approved items enter next week&apos;s todos and reply drafts.</div>

          <h2 className={h2}>3. Make the smallest setup in Agent Workspace</h2>
          <ol className={ol}>
            <li>Open Agent Workspace and claim or choose the AI partner closest to the task.</li>
            <li>Put the card&apos;s input, AI preparation, and human confirmation into its role or the task. Tell it to list missing material instead of guessing.</li>
            <li>If the input comes from Feishu or another channel, connect only that channel to this partner.</li>
            <li>Prepare one real sample whose correct outcome you already understand.</li>
          </ol>

          <ContentFigureView visual={firstRepeatableWorkflowProductCase} locale="en" />

          <p className={p}>In the local sample above, every partner has a clear role and status. For a weekly feedback-triage loop, choose only the customer follow-up partner. The round is complete when it returns questions, requests, and draft replies and stops for your review.</p>

          <h2 className={h2}>4. Run the first round manually and check four things</h2>
          <ul className={ul}>
            <li><span className={strong}>Complete</span>: did it miss anything important in the raw material?</li>
            <li><span className={strong}>Traceable</span>: can each conclusion point back to a source instead of filling gaps?</li>
            <li><span className={strong}>Decision-ready</span>: is the result shaped so you can compare, edit, or approve it?</li>
            <li><span className={strong}>Within bounds</span>: did actions that need your judgment stop at the review point?</li>
          </ul>
          <p className={p}>Turn your corrections into a fixed checklist. “Remember next time” inside one conversation is not a repeatable rule.</p>

          <h2 className={h2}>5. Use fresh input for two more rounds</h2>
          <p className={p}>
            Use the checklist to correct format and omissions in round two. In round three, switch to fresh real material so you know the workflow did not merely memorize the first sample. After all three rounds can be checked quickly, add only one thing: a fixed trigger, automatic input gathering, or delivery after approval.
          </p>
          <p className={p}>Expand one box at a time. If the new action fails, you should be able to return to the previous working loop.</p>

          <h2 className={h2}>Troubleshooting</h2>
          <ul className={ul}>
            <li><span className={strong}>The format changes every time</span>: provide an explicit output shape and say that missing values stay blank.</li>
            <li><span className={strong}>It invents missing facts</span>: require a source for each conclusion and move unsupported items into “needs review.”</li>
            <li><span className={strong}>Review takes longer than doing it yourself</span>: shrink the task to one classification, one draft, or one checklist.</li>
            <li><span className={strong}>Results look good but still feel risky</span>: keep human confirmation, then add run history and a clear rollback path.</li>
          </ul>

          <h2 className={h2}>Data boundary</h2>
          <p className={p}>Work data stays on your device by default; only channels you connect and model calls go online as the task requires. Connect only what this workflow needs and provide only the material required for the current task.</p>
        </>
      ),
    },
  },
  {
    slug: "agent-workspace",
    updatedAt: "2026-07-14",
    version: "1.1",
    visuals: [],
    sources: [],
    title: { zh: "Agent 工区与日常管理", en: "Agent Workspace & Daily Ops" },
    description: {
      zh: "用一个视图管理 AI 伙伴的全生命周期：入职、身份、运行状态、渠道接入、配置与数据分析。",
      en: "Manage the full AI partner lifecycle in one view: onboarding, identity, runtime status, channels, configuration, and insights.",
    },
    content: {
      zh: (
        <>
          <p className={p}>
            Agent 工区是 MotiClaw 的核心界面：你的每个 AI 伙伴在这里入职、上岗、被查看和被管理。
          </p>
          <h2 className={h2}>全生命周期管理</h2>
          <ul className={ul}>
            <li><span className={strong}>入职</span>：从预配置库领取，或按角色模板创建新的 AI 伙伴。</li>
            <li><span className={strong}>身份</span>：每个 Agent 有独立的名字、角色说明和技能配置。</li>
            <li><span className={strong}>运行状态</span>：实时查看在线状态、当前任务和最近产出。</li>
            <li><span className={strong}>渠道接入</span>：按 Agent 配置飞书等渠道，决定它出现在哪里。</li>
          </ul>
          <h2 className={h2}>一键运维</h2>
          <p className={p}>
            安装、修复、重启、更新都是一键操作。出现异常时优先用「修复」，它会自动检查环境并恢复服务，不需要记任何命令。
          </p>
          <h2 className={h2}>配置与数据</h2>
          <ul className={ul}>
            <li><span className={strong}>灵活配置</span>：AI 模型、网关、系统参数在可视化面板里调整，每项设置清晰可控。</li>
            <li><span className={strong}>数据可视分析</span>：Token 消耗、调用频次、成本趋势多维度呈现，方便控制成本。</li>
          </ul>
        </>
      ),
      en: (
        <>
          <p className={p}>
            The Agent Workspace is MotiClaw&apos;s core surface: every AI partner onboards, works, and gets managed here.
          </p>
          <h2 className={h2}>Full lifecycle management</h2>
          <ul className={ul}>
            <li><span className={strong}>Onboarding</span>: claim from the pre-configured library or create from a role template.</li>
            <li><span className={strong}>Identity</span>: each agent has its own name, role description, and skill set.</li>
            <li><span className={strong}>Runtime status</span>: see online state, current task, and recent output at a glance.</li>
            <li><span className={strong}>Channels</span>: configure Feishu and other channels per agent to decide where it shows up.</li>
          </ul>
          <h2 className={h2}>One-click operations</h2>
          <p className={p}>
            Install, repair, restart, and update are all one click. When something looks wrong, try Repair first - it checks the environment and restores the service with no commands to remember.
          </p>
          <h2 className={h2}>Configuration and insights</h2>
          <ul className={ul}>
            <li><span className={strong}>Flexible config</span>: adjust AI models, gateway, and system parameters in a visual panel.</li>
            <li><span className={strong}>Data insights</span>: token usage, call frequency, and cost trends in multi-dimensional views.</li>
          </ul>
        </>
      ),
    },
  },
  {
    slug: "billing",
    updatedAt: "2026-07-21",
    version: "1.2",
    visuals: [billingProductCase],
    sources: billingSources,
    title: { zh: "套餐与限额", en: "Plans & Limits" },
    description: {
      zh: "根据托管模型用量和 AI 伙伴规模选择 Free、Plus 或 Pro，并在支付后确认新套餐已经生效。",
      en: "Choose Free, Plus, or Pro from your hosted-model usage and AI partner team size, then verify the new plan after payment.",
    },
    content: {
      zh: (
        <>
          <p className={p}>先从 Free 开始。只有托管模型容量或 AI 伙伴数量已经影响日常工作时，升级才有意义。这份说明帮你完成一件事：选出当前够用的套餐，并确认支付后的权益已经到账。</p>

          <h2 className={h2}>开始前：看两个实际信号</h2>
          <ul className={ul}>
            <li><span className={strong}>容量是否经常不够</span>：托管模型限额按 5 小时和 7 天两个滚动窗口计算。偶尔等窗口恢复，不一定需要升级；如果它反复打断当天工作，再比较付费套餐。</li>
            <li><span className={strong}>团队是否真的要扩</span>：先数清正在长期使用的 AI 伙伴，不要把临时试用和重复角色也算进刚需。</li>
          </ul>

          <ContentFigureView visual={billingProductCase} locale="zh" />

          <h2 className={h2}>1. 选当前够用的套餐</h2>
          <ul className={ul}>
            <li><span className={strong}>Free</span>：¥0，包含完整桌面端功能、基础托管模型限额和最多 8 位 AI 伙伴。还没稳定跑通一条工作流时，先留在 Free。</li>
            <li><span className={strong}>Plus</span>：¥39 / 30 天，提升日常托管模型容量，最多创建 16 位 AI 伙伴，并包含会员写作能力。适合已经每天使用，但团队规模仍然清楚可控的人。</li>
            <li><span className={strong}>Pro</span>：¥199 / 30 天，托管模型容量最高约为 Plus 的 4 倍，AI 伙伴数量不设上限，并包含优先支持和新能力优先体验。适合整天运行多条工作流、确实需要继续拆分角色的人。</li>
          </ul>
          <div className={tip}>不要用旧截图或旧文章里的固定次数做预算。套餐目录会调整，购买前以官网「套餐价格」和会员中心当时展示的权益为准。</div>

          <h2 className={h2}>2. 登录会员中心并完成支付</h2>
          <ol className={ol}>
            <li>登录官网，进入「会员中心 → 会员套餐」，再次核对价格、有效期和当前权益。</li>
            <li>选择 Plus 或 Pro，使用微信扫码支付。不要在支付完成前关闭结果页。</li>
            <li>等待页面显示套餐已生效，再回到 MotiClaw Desktop；桌面端需要使用同一个账号。</li>
          </ol>

          <h2 className={h2}>3. 完成生效验收</h2>
          <ol className={ol}>
            <li>在会员中心确认套餐名称、有效期和账号与付款时一致。</li>
            <li>回到桌面端刷新账号状态，确认新的使用限额与伙伴上限已经可见。</li>
            <li>重新执行刚才被限额打断的低风险任务，确认可以继续运行，再恢复其他工作流。</li>
          </ol>
          <p className={p}>会员套餐负责周期内的使用限额，积分用于按量补充；开通或到期都不会改变积分余额。套餐到期后会回到 Free 限额，已有数据和 AI 伙伴不会被删除。</p>

          <h2 className={h2}>常见问题</h2>
          <ul className={ul}>
            <li><span className={strong}>支付成功但桌面端没变化</span>：先确认网站和桌面端是不是同一个账号，再刷新会员状态；仍未同步时保留订单号和支付结果，联系支持处理，不要重复付款。</li>
            <li><span className={strong}>不知道选 Plus 还是 Pro</span>：如果 16 位伙伴够用，先选 Plus；只有容量和角色数量都持续成为限制时，再选 Pro。</li>
            <li><span className={strong}>只是偶尔触发限额</span>：先等滚动窗口恢复，或减少同一时间运行的任务。升级解决的是持续容量，不是每一次短暂等待。</li>
          </ul>

          <h2 className={h2}>数据边界</h2>
          <p className={p}>工作数据默认留在本机；仅你主动接入的渠道与模型调用按任务所需出网。订阅改变的是套餐权益，不会把本地工作数据迁移到官网。</p>
        </>
      ),
      en: (
        <>
          <p className={p}>Start with Free. Upgrading only makes sense when hosted-model capacity or the AI partner cap is already interrupting real work. This guide has one finish line: choose the plan that is enough for today and verify the benefits after payment.</p>

          <h2 className={h2}>Before you start: check two real signals</h2>
          <ul className={ul}>
            <li><span className={strong}>Capacity keeps getting in the way</span>: hosted-model limits use rolling 5-hour and 7-day windows. An occasional wait may not justify an upgrade; repeated interruptions to the day may.</li>
            <li><span className={strong}>The team genuinely needs to grow</span>: count the AI partners you use long term. Do not treat temporary trials and duplicate roles as required capacity.</li>
          </ul>

          <ContentFigureView visual={billingProductCase} locale="en" />

          <h2 className={h2}>1. Choose the plan that is enough today</h2>
          <ul className={ul}>
            <li><span className={strong}>Free</span>: ¥0, with the full desktop app, base hosted-model capacity, and up to 8 AI partners. Stay on Free until one workflow is running reliably.</li>
            <li><span className={strong}>Plus</span>: ¥39 for 30 days, with higher everyday hosted-model capacity, up to 16 AI partners, and member writing assistance. It fits daily use while the team still has a clear, controlled size.</li>
            <li><span className={strong}>Pro</span>: ¥199 for 30 days, with up to about 4x Plus hosted-model capacity, unlimited AI partners, priority support, and early access to new capabilities. It fits heavier all-day workflows that genuinely need more distinct roles.</li>
          </ul>
          <div className={tip}>Do not budget from fixed request counts in an old screenshot or article. The catalog can change; review the current Pricing page and membership center before buying.</div>

          <h2 className={h2}>2. Sign in and pay from the membership center</h2>
          <ol className={ol}>
            <li>Sign in on the website, open Membership Center → Plans, and review the current price, duration, and benefits again.</li>
            <li>Choose Plus or Pro and pay with the WeChat Pay QR code. Keep the result page open until payment finishes.</li>
            <li>Wait for the page to show that the plan is active, then return to MotiClaw Desktop using the same account.</li>
          </ol>

          <h2 className={h2}>3. Verify activation</h2>
          <ol className={ol}>
            <li>In the membership center, confirm the plan name, expiry, and account match the purchase.</li>
            <li>Refresh account status in the desktop app and confirm that the new usage and partner limits are visible.</li>
            <li>Retry the low-risk task that hit the limit. Resume other workflows only after it runs again.</li>
          </ol>
          <p className={p}>Membership covers usage limits for the plan period, while points remain a separate pay-as-you-go supplement. Starting or expiring a plan does not change the point balance. When a plan expires, the account returns to Free limits without deleting existing data or AI partners.</p>

          <h2 className={h2}>Troubleshooting</h2>
          <ul className={ul}>
            <li><span className={strong}>Payment succeeded but the desktop app did not update</span>: confirm the website and desktop app use the same account, then refresh membership status. If it still does not sync, keep the order number and payment result for support instead of paying again.</li>
            <li><span className={strong}>You cannot choose between Plus and Pro</span>: start with Plus if 16 partners are enough. Choose Pro only when both capacity and role count remain persistent constraints.</li>
            <li><span className={strong}>You hit a limit only occasionally</span>: wait for the rolling window to recover or run fewer tasks at once. An upgrade solves sustained capacity, not every short wait.</li>
          </ul>

          <h2 className={h2}>Data boundary</h2>
          <p className={p}>Work data stays on your device by default; only channels you connect and model calls go online as the task requires. A subscription changes plan benefits; it does not move local work data to the website.</p>
        </>
      ),
    },
  },
  {
    slug: "for-fde",
    updatedAt: "2026-07-14",
    version: "1.1",
    visuals: [],
    sources: [],
    title: { zh: "FDE 交付指南", en: "Guide for FDEs" },
    description: {
      zh: "面向 AI 咨询与落地交付者：用 MotiClaw 把可维护、可验收的本地 AI 伙伴工作台交付给客户。",
      en: "For AI consultants and delivery builders: ship clients a maintainable, verifiable local AI partner workbench with MotiClaw.",
    },
    content: {
      zh: (
        <>
          <p className={p}>
            FDE（Forward Deployed Engineer）和 AI 落地交付者的难点从来不是“演示效果”，而是交付之后：客户能不能自己维护？数据边界能不能讲清楚？出问题谁来修？MotiClaw 把这三件事变成产品能力。
          </p>
          <h2 className={h2}>交付前：判断客户场景</h2>
          <ul className={ul}>
            <li>客户的数据敏感度高（客户名单、合同、报价）→ 本地优先架构直接回答合规顾虑。</li>
            <li>客户没有技术团队 → 一键安装、修复、更新意味着不需要驻场运维。</li>
            <li>客户要的是“能用的工作流”而不是“模型 API” → 预配置 Agent 库就是现成的工作流目录。</li>
          </ul>
          <h2 className={h2}>交付中：搭建工作台</h2>
          <ol className={ol}>
            <li>在客户设备上安装 MotiClaw，完成模型与网关配置（可接客户自己的模型网关）。</li>
            <li>按客户业务从 Agent 库领取并定制 AI 伙伴：角色说明、技能、渠道接入。</li>
            <li>接入客户在用的飞书等渠道，让 AI 伙伴出现在客户真实的工作流里。</li>
          </ol>
          <h2 className={h2}>交付后：可验收、可维护</h2>
          <ul className={ul}>
            <li><span className={strong}>数据边界可验收</span>：工作数据与 Agent 状态默认保存在客户设备上，只有渠道与模型调用按任务所需出网。</li>
            <li><span className={strong}>客户可自维护</span>：异常时点「修复」即可，更新一键完成。</li>
            <li><span className={strong}>成本可解释</span>：Token 消耗与成本趋势可视化，客户能看懂自己在为什么付费。</li>
          </ul>
          <div className={tip}>建议从一个高频小场景切入（如会议纪要 → 跟进项），跑顺后再扩展 Agent 数量。</div>
        </>
      ),
      en: (
        <>
          <p className={p}>
            For FDEs and AI delivery builders, the hard part was never the demo - it is what happens after handover: can the client maintain it? Can you explain the data boundary? Who fixes it when it breaks? MotiClaw turns all three into product capabilities.
          </p>
          <h2 className={h2}>Before delivery: qualify the scenario</h2>
          <ul className={ul}>
            <li>Sensitive data (client lists, contracts, quotes) → the local-first architecture answers compliance concerns directly.</li>
            <li>No in-house tech team → one-click install, repair, and update mean no on-site ops.</li>
            <li>The client wants working workflows, not model APIs → the pre-configured agent library is a ready workflow catalog.</li>
          </ul>
          <h2 className={h2}>During delivery: build the workbench</h2>
          <ol className={ol}>
            <li>Install MotiClaw on the client&apos;s device and configure models and gateway (their own gateway works too).</li>
            <li>Claim and customize agents from the library for the client&apos;s business: role, skills, channels.</li>
            <li>Connect the client&apos;s existing channels such as Feishu so agents live inside real workflows.</li>
          </ol>
          <h2 className={h2}>After delivery: verifiable and maintainable</h2>
          <ul className={ul}>
            <li><span className={strong}>Verifiable boundary</span>: work data and agent state stay on the client&apos;s device by default; channel and model calls go out only as the task requires.</li>
            <li><span className={strong}>Client-maintainable</span>: Repair fixes most issues in one click; updates are one click too.</li>
            <li><span className={strong}>Explainable cost</span>: token usage and cost trends are visualized so clients understand what they pay for.</li>
          </ul>
          <div className={tip}>Start with one high-frequency micro-scenario (e.g. meeting notes → follow-ups), then scale the agent count.</div>
        </>
      ),
    },
  },
  {
    slug: "for-solo-operators",
    updatedAt: "2026-07-14",
    version: "1.1",
    visuals: [],
    sources: [],
    title: { zh: "超级个体与老板指南", en: "Guide for Solo Operators & Founders" },
    description: {
      zh: "面向一个人干活的超级个体和小团队老板：把收拢、跟进、初稿交给 AI 伙伴团队，自己只做决策。",
      en: "For solo operators and small-team founders: hand gathering, follow-up, and drafting to AI partners and keep only the decisions.",
    },
    content: {
      zh: (
        <>
          <p className={p}>
            一个人干活，最怕的不是忙，是东西太散：灵感在微信、资料在浏览器、承诺在脑子里。MotiClaw 的用法不是“多一个聊天框”，而是给自己配一支分工明确的 AI 伙伴团队。
          </p>
          <h2 className={h2}>推荐的第一支团队（3 个 AI 伙伴）</h2>
          <ul className={ul}>
            <li><span className={strong}>收拢员</span>：接收灵感、链接、截图、聊天记录，归类后列出可动手的方向。</li>
            <li><span className={strong}>跟进员</span>：消化会议纪要和承诺，生成带提醒和上下文的待办。</li>
            <li><span className={strong}>初稿员</span>：常见问题回复、周报、帮助文档先出一版草稿。</li>
          </ul>
          <h2 className={h2}>一天的工作流长什么样</h2>
          <ol className={ol}>
            <li><span className={strong}>早上</span>：打开 MotiClaw，收拢员已把昨晚丢进去的素材归好类，今天第一步已排好。</li>
            <li><span className={strong}>白天</span>：会议纪要随手发给跟进员，每个客户的当前动作和提醒自动更新。</li>
            <li><span className={strong}>晚上</span>：初稿员把今天的常见问题整理成草稿，你花十分钟修改定稿。</li>
          </ol>
          <h2 className={h2}>规模化的节奏</h2>
          <p className={p}>
            免费版的 8 个 AI 伙伴足够跑顺核心流程。当你开始把更多环节交出去（内容分发、数据整理、客户分层），再考虑 Plus / Pro 提升托管模型限额与伙伴数量上限。
          </p>
          <div className={tip}>原则：先让一个 Agent 把一件事做顺，再加下一个。一次性领一堆 Agent 反而会回到“东西太散”。</div>
        </>
      ),
      en: (
        <>
          <p className={p}>
            Working alone, the enemy is not being busy - it is scatter: ideas in WeChat, material in browser tabs, promises in your head. The right way to use MotiClaw is not &quot;one more chat box&quot; but building a clearly divided AI partner team around your work.
          </p>
          <h2 className={h2}>Your first team (3 AI partners)</h2>
          <ul className={ul}>
            <li><span className={strong}>The gatherer</span>: takes ideas, links, screenshots, and chats; returns grouped material and workable angles.</li>
            <li><span className={strong}>The follow-upper</span>: digests meeting notes and promises into todos with reminders and context.</li>
            <li><span className={strong}>The drafter</span>: produces first passes at FAQ replies, weekly reports, and docs.</li>
          </ul>
          <h2 className={h2}>What a day looks like</h2>
          <ol className={ol}>
            <li><span className={strong}>Morning</span>: open MotiClaw - last night&apos;s material is grouped and today&apos;s first step is lined up.</li>
            <li><span className={strong}>Daytime</span>: forward meeting notes to the follow-upper; each client&apos;s current action and reminder update automatically.</li>
            <li><span className={strong}>Evening</span>: the drafter turns today&apos;s common questions into drafts; you spend ten minutes editing.</li>
          </ol>
          <h2 className={h2}>Scaling up</h2>
          <p className={p}>
            The Free plan&apos;s 8 AI partners are enough to get the core loop running. When you start handing over more (content distribution, data cleanup, client tiering), consider Plus / Pro for higher hosted-model limits and AI partner caps.
          </p>
          <div className={tip}>Principle: get one agent doing one thing well before adding the next. Claiming a pile of agents at once recreates the scatter.</div>
        </>
      ),
    },
  },
  {
    slug: "data-security",
    updatedAt: "2026-07-14",
    version: "1.1",
    visuals: [],
    sources: [],
    title: { zh: "数据与安全边界", en: "Data & Security Boundary" },
    description: {
      zh: "讲清 MotiClaw 的数据边界：哪些内容默认留在本地、哪些请求会走网络、如何进一步收紧边界，以及交付场景下怎么向客户解释和验收。",
      en: "MotiClaw's data boundary explained: what stays local by default, what goes over the network, how to tighten the boundary, and how to explain and verify it in client deliveries.",
    },
    content: {
      zh: (
        <>
          <p className={p}>
            “数据去哪了”是把工作交给 AI 之前必须回答的问题。MotiClaw 的答案可以画成一条清晰的边界线：边界内是你的设备，数据和 Agent 默认全部在这里；边界外只有两类你明确知情的请求。
          </p>
          <h2 className={h2}>默认留在本地的内容</h2>
          <ul className={ul}>
            <li><span className={strong}>资料库</span>：素材、笔记、文件、聊天记录的存档，全部存储在你自己的设备上。</li>
            <li><span className={strong}>Agent 的配置与记忆</span>：每个 AI 伙伴的角色设定、技能、工作记忆都在本机。</li>
            <li><span className={strong}>运行过程</span>：任务的执行、中间产物和日志默认不离开设备。</li>
          </ul>
          <h2 className={h2}>会走网络的两类请求</h2>
          <ul className={ul}>
            <li><span className={strong}>渠道收发</span>：你主动接入的渠道（如飞书）的消息收发，范围由你在接入时决定。</li>
            <li><span className={strong}>模型调用</span>：调用大模型推理时，只发送完成当前任务所需的上下文，不会整体上传资料库。</li>
          </ul>
          <h2 className={h2}>三档收紧方式</h2>
          <ol className={ol}>
            <li><span className={strong}>默认档</span>：使用 MotiClaw 托管模型，开箱即用，计费见「套餐与限额」。</li>
            <li><span className={strong}>自管档</span>：接入你自己的模型网关或 API Key，模型流量走你自己的账单和合规域。</li>
            <li><span className={strong}>隔离档</span>：交付场景下部署在客户内网，渠道与模型端点都指向客户侧基础设施。</li>
          </ol>
          <h2 className={h2}>交付场景的验收建议</h2>
          <ul className={ul}>
            <li>和客户先对齐这条边界线：哪些数据留在内网、哪些请求出网、出网内容是什么。</li>
            <li>验收时用真实任务演示一次完整链路，让客户看到模型请求里只有任务上下文。</li>
            <li>把边界描述写进交付文档，后续扩容和审计都有据可依。</li>
          </ul>
          <div className={tip}>原则：边界不是宣传语，而是可以演示、可以验收的架构事实。说不清楚的边界等于没有边界。</div>
        </>
      ),
      en: (
        <>
          <p className={p}>
            &quot;Where does my data go&quot; is the question to answer before handing work to AI. MotiClaw&apos;s answer is a single clear boundary: inside it is your device, where data and agents live by default; outside it are exactly two kinds of requests you explicitly know about.
          </p>
          <h2 className={h2}>What stays local by default</h2>
          <ul className={ul}>
            <li><span className={strong}>Your library</span>: material, notes, files, and archived chats are stored on your own device.</li>
            <li><span className={strong}>Agent config and memory</span>: every AI partner&apos;s role, skills, and working memory stay on the machine.</li>
            <li><span className={strong}>Execution</span>: task runs, intermediate artifacts, and logs do not leave the device by default.</li>
          </ul>
          <h2 className={h2}>The two kinds of network requests</h2>
          <ul className={ul}>
            <li><span className={strong}>Channel traffic</span>: messages for channels you explicitly connect (such as Feishu), scoped by what you grant at setup.</li>
            <li><span className={strong}>Model calls</span>: inference requests carry only the context needed for the current task - never a bulk upload of your library.</li>
          </ul>
          <h2 className={h2}>Three tightening levels</h2>
          <ol className={ol}>
            <li><span className={strong}>Default</span>: MotiClaw hosted models, ready out of the box - billing covered in Plans &amp; Limits.</li>
            <li><span className={strong}>Self-managed</span>: bring your own model gateway or API key; model traffic runs on your own bill and compliance domain.</li>
            <li><span className={strong}>Isolated</span>: for deliveries, deploy inside the client network with channels and model endpoints pointing at client-side infrastructure.</li>
          </ol>
          <h2 className={h2}>Acceptance advice for deliveries</h2>
          <ul className={ul}>
            <li>Align on the boundary first: what stays in the intranet, what egresses, and what the egress contains.</li>
            <li>Demo one full chain with a real task at acceptance so the client sees only task context in model requests.</li>
            <li>Write the boundary into the delivery doc - future scaling and audits will rely on it.</li>
          </ul>
          <div className={tip}>Principle: a boundary is not a slogan - it is an architectural fact you can demo and verify. A boundary you cannot explain is no boundary.</div>
        </>
      ),
    },
  },
  {
    slug: "channels-feishu",
    updatedAt: "2026-07-14",
    version: "1.1",
    visuals: [],
    sources: [],
    title: { zh: "接入飞书渠道", en: "Connecting Feishu" },
    description: {
      zh: "把 AI 伙伴接进飞书：准备机器人、完成授权、验证收发，以及三个先跑起来的高价值用法。",
      en: "Bring your AI partners into Feishu: prepare the bot, authorize, verify messaging, and three high-value first workflows.",
    },
    content: {
      zh: (
        <>
          <p className={p}>
            AI 伙伴要真的“在场”，得出现在你每天工作的地方。对很多团队来说这个地方就是飞书。接入后，AI 伙伴可以在群里接收消息、整理纪要、发出提醒——而所有处理仍然发生在你本地的设备上。
          </p>
          <h2 className={h2}>接入前的准备</h2>
          <ul className={ul}>
            <li>一个飞书账号，以及你有权限管理的群（建议先用一个小群试跑）。</li>
            <li>MotiClaw 桌面端已安装，且至少有一个 AI 伙伴已领取上岗。</li>
          </ul>
          <h2 className={h2}>接入步骤</h2>
          <ol className={ol}>
            <li>在 MotiClaw 的渠道设置里选择「飞书」，按引导完成机器人创建与授权。</li>
            <li>把机器人拉进目标群，发一条测试消息，确认 AI 伙伴能收到并回应。</li>
            <li>在 Agent 工区里指定哪位 AI 伙伴负责这个群——一个群对应一个明确的负责人，避免多头响应。</li>
          </ol>
          <h2 className={h2}>三个先跑起来的用法</h2>
          <ul className={ul}>
            <li><span className={strong}>会议纪要 → 行动项</span>：把纪要发进群，AI 伙伴整理出下一步、负责人和提醒时间。</li>
            <li><span className={strong}>客户群跟进</span>：客户提到的需求和承诺被记录成待办，到期前在群里提醒你。</li>
            <li><span className={strong}>每日收拢</span>：每天固定时间，AI 伙伴把当天群里的关键信息汇总成一条摘要。</li>
          </ul>
          <h2 className={h2}>数据边界说明</h2>
          <p className={p}>
            接入飞书后，走网络的只有渠道消息本身；消息的整理、记忆和任务执行仍在你的设备上完成。边界细节见「数据与安全边界」。
          </p>
          <div className={tip}>建议：先在一个小群跑一周，把负责的 AI 伙伴调到顺手，再推广到客户群和大群。</div>
        </>
      ),
      en: (
        <>
          <p className={p}>
            AI partners are only useful where you actually work - and for many teams that place is Feishu. Once connected, your AI partners receive messages, digest meeting notes, and send reminders in your groups, while all processing still happens on your local device.
          </p>
          <h2 className={h2}>Before you start</h2>
          <ul className={ul}>
            <li>A Feishu account and a group you can manage (start with a small test group).</li>
            <li>MotiClaw installed, with at least one AI partner already claimed and working.</li>
          </ul>
          <h2 className={h2}>Setup steps</h2>
          <ol className={ol}>
            <li>Open channel settings in MotiClaw, choose Feishu, and follow the guided bot creation and authorization.</li>
            <li>Add the bot to your target group and send a test message to confirm the AI partner receives and replies.</li>
            <li>Assign one AI partner as the owner of that group in the workspace - one group, one owner, no crosstalk.</li>
          </ol>
          <h2 className={h2}>Three first workflows</h2>
          <ul className={ul}>
            <li><span className={strong}>Meeting notes → actions</span>: drop notes into the group; the agent extracts next steps, owners, and reminder times.</li>
            <li><span className={strong}>Client-group follow-up</span>: requests and promises mentioned by clients become todos with due-date reminders.</li>
            <li><span className={strong}>Daily digest</span>: at a fixed time each day, the agent summarizes the group&apos;s key information into one message.</li>
          </ul>
          <h2 className={h2}>Data boundary note</h2>
          <p className={p}>
            With Feishu connected, only channel messages travel over the network; digesting, memory, and task execution stay on your device. See Data &amp; Security Boundary for details.
          </p>
          <div className={tip}>Tip: run one small group for a week and tune the owning agent before rolling out to client groups and large groups.</div>
        </>
      ),
    },
  },
  {
    slug: "faq",
    updatedAt: "2026-07-14",
    version: "1.1",
    visuals: [],
    sources: [],
    title: { zh: "常见问题", en: "FAQ" },
    description: {
      zh: "关于安装、数据安全、计费与支持的常见问题。",
      en: "Common questions about installation, data privacy, billing, and support.",
    },
    content: {
      zh: (
        <>
          <h2 className={h2}>MotiClaw 是免费的吗？</h2>
          <p className={p}>桌面端免费下载使用，包含完整的本地功能与基础托管模型限额。订阅套餐只影响托管模型的用量，详见「套餐与限额」。</p>
          <h2 className={h2}>我的数据会上传到服务器吗？</h2>
          <p className={p}>不会。数据和 Agent 都运行在你自己的设备上；只有你主动接入的渠道消息和模型调用会走网络，且模型调用只发送完成当前任务所需的上下文。</p>
          <h2 className={h2}>macOS 提示无法打开应用怎么办？</h2>
          <p className={p}>前往「系统设置 → 隐私与安全性」，在安全性区域点击「仍要打开」。这是 macOS 对新安装应用的标准提示。</p>
          <h2 className={h2}>支持哪些系统？</h2>
          <p className={p}>macOS（Apple Silicon 与 Intel）和 Windows（x64 与 ARM64）。下载页会自动识别你的设备并推荐安装包。</p>
          <h2 className={h2}>订阅到期后数据会丢失吗？</h2>
          <p className={p}>不会。到期只回落到免费版限额，所有数据和 Agent 配置都保持不变。</p>
          <h2 className={h2}>遇到问题去哪里求助？</h2>
          <p className={p}>在官网首页「联系」区加入飞书群，团队和社区都会响应；也欢迎反馈你希望补充的文档内容。</p>
        </>
      ),
      en: (
        <>
          <h2 className={h2}>Is MotiClaw free?</h2>
          <p className={p}>The desktop app is free, with full local features and base hosted-model limits. Subscriptions only affect hosted-model usage - see Plans &amp; Limits.</p>
          <h2 className={h2}>Is my data uploaded to a server?</h2>
          <p className={p}>No. Data and agents run on your own device. Only channel messages you explicitly connect and model calls go over the network, and model calls send only the context needed for the current task.</p>
          <h2 className={h2}>macOS says the app cannot be opened</h2>
          <p className={p}>Go to System Settings → Privacy &amp; Security and click Open Anyway. This is macOS&apos;s standard prompt for newly installed apps.</p>
          <h2 className={h2}>Which systems are supported?</h2>
          <p className={p}>macOS (Apple Silicon and Intel) and Windows (x64 and ARM64). The download dialog detects your device and recommends the right installer.</p>
          <h2 className={h2}>Do I lose data when my subscription expires?</h2>
          <p className={p}>No. Expiry only lowers limits back to Free. All data, agents, and point balances stay intact.</p>
          <h2 className={h2}>Where do I get help?</h2>
          <p className={p}>Join the Feishu group from the Contact section on the homepage - the team and community respond there. Doc requests are welcome too.</p>
        </>
      ),
    },
  },
];

export function getDocPage(slug: string): DocPage | undefined {
  return docPages.find((page) => page.slug === slug);
}
