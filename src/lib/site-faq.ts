import type { Locale } from "@/lib/locale";

export type SiteFaqItem = {
  question: string;
  answer: string;
  comparison?: {
    dimensionLabel: string;
    cloudLabel: string;
    moticlawLabel: string;
    rows: Array<{
      dimension: string;
      cloud: string;
      moticlaw: string;
    }>;
  };
};

const faqContent: Record<Locale, SiteFaqItem[]> = {
  zh: [
    {
      question: "MotiClaw 和其他云端 AI 助手有什么不同？",
      answer:
        "很多云端 AI 助手更像一个在线工作区：你把资料放进云端，再让云端助手帮你处理。MotiClaw 更像安装在自己电脑里的 AI 伙伴工作台：工作数据默认留在本机，你可以让 AI 伙伴在授权范围内调用本机已有的文件、图片、项目和工具，也可以按自己的业务持续搭建、分工和调整整支团队。",
      comparison: {
        dimensionLabel: "对比维度",
        cloudLabel: "常见云端 AI 助手",
        moticlawLabel: "MotiClaw",
        rows: [
          {
            dimension: "数据放在哪里",
            cloud: "通常需要把资料上传或同步到云端工作区。",
            moticlaw: "工作数据默认留在你的电脑里，不强制上云。",
          },
          {
            dimension: "怎样使用 AI",
            cloud: "主要在网页或云端空间里对话、生成和处理任务。",
            moticlaw: "在本地桌面端管理 AI 伙伴，让它们围绕你的本机资料和日常工具工作。",
          },
          {
            dimension: "团队怎么搭建",
            cloud: "更多是使用平台提供的统一助手、插件或专家能力。",
            moticlaw: "你可以按业务领取、配置和调整不同角色的 AI 伙伴，形成自己的工作团队。",
          },
          {
            dimension: "交付和维护",
            cloud: "更适合直接使用一套云端服务。",
            moticlaw: "更适合给自己或客户搭一套数据边界清楚、后续可维护的本地 AI 工作台。",
          },
          {
            dimension: "一句话理解",
            cloud: "像租用一个在线 AI 助手。",
            moticlaw: "像把一支可管理的 AI 伙伴团队装到自己的电脑里。",
          },
        ],
      },
    },
    {
      question: "MotiClaw 是什么？",
      answer:
        "MotiClaw 是一个本地优先的 AI 伙伴与智能体控制平台。你可以在自己的电脑上安装、配置和管理一支 AI 伙伴团队，让它们替你完成内容创作、运营、研发协作等日常工作。",
    },
    {
      question: "MotiClaw 是免费的吗？",
      answer:
        "是的，MotiClaw 可以免费下载使用，免费版支持创建 8 个 AI 伙伴。如果需要更多托管模型额度和更大的 AI 伙伴团队，可以订阅 Plus（¥68/月或 ¥680/年，16 个 AI 伙伴）或 Pro（¥199/月，32 个 AI 伙伴）套餐。",
    },
    {
      question: "MotiClaw 支持哪些操作系统？",
      answer: "MotiClaw 桌面端目前支持 macOS 和 Windows，可以直接在官网下载安装包。",
    },
    {
      question: "我的数据安全吗？",
      answer:
        "MotiClaw 采用本地优先架构，你的工作数据默认保留在本机，不强制上传云端。这让你可以放心地把内部资料交给 AI 伙伴处理。",
    },
    {
      question: "AI 伙伴最多可以创建多少个？",
      answer:
        "免费版最多创建 8 个 AI 伙伴，Plus 会员提升到 16 个，Pro 会员提升到 32 个，适合按团队规模逐步升级。",
    },
    {
      question: "Plus 和 Pro 应该怎么选？",
      answer:
        "Plus 和 Pro 提供不同的托管模型额度。日常使用可以选择 Plus，使用更频繁或任务更多时可以选择 Pro。",
    },
    {
      question: "如何下载安装 MotiClaw？",
      answer:
        "访问官网下载页，选择 macOS 或 Windows 安装包，下载后按引导完成安装即可。安装完成后用同一账号登录，会员权益会自动同步到桌面端。",
    },
    {
      question: "MotiClaw 适合什么人用？",
      answer:
        "MotiClaw 适合想用 AI 放大个人产能的超级个体、需要给客户做 AI 落地的 FDE（前线部署工程师）、希望低成本组建 AI 团队的老板，以及 AI 独立开发者。",
    },
  ],
  en: [
    {
      question: "How is MotiClaw different from cloud AI assistant products?",
      answer:
        "Many cloud AI assistants work like an online workspace: you move material into the cloud, then ask a cloud assistant to process it. MotiClaw works more like an AI partner workbench installed on your own computer: your work data stays local by default, AI partners can use local files, images, projects, and tools within the permissions you give them, and you can keep building, assigning, and adjusting your own team.",
      comparison: {
        dimensionLabel: "Area",
        cloudLabel: "Common cloud AI assistants",
        moticlawLabel: "MotiClaw",
        rows: [
          {
            dimension: "Where data lives",
            cloud: "Material is usually uploaded or synced into a cloud workspace.",
            moticlaw: "Work data stays on your computer by default and is not force-uploaded to the cloud.",
          },
          {
            dimension: "How you use AI",
            cloud: "Most work happens in a web app or cloud workspace through chat, generation, and task handling.",
            moticlaw: "You manage AI partners in a local desktop app and let them work around your local files and daily tools.",
          },
          {
            dimension: "How the team is built",
            cloud: "You mainly use the platform's shared assistants, plugins, or expert capabilities.",
            moticlaw: "You can claim, configure, and tune AI partners for different roles so they become your own working team.",
          },
          {
            dimension: "Delivery and maintenance",
            cloud: "Best suited for directly using a hosted cloud service.",
            moticlaw: "Best suited for giving yourself or a client a local AI workbench with a clear data boundary and ongoing maintainability.",
          },
          {
            dimension: "Simple way to think about it",
            cloud: "Like renting an online AI assistant.",
            moticlaw: "Like installing a manageable AI partner team on your own computer.",
          },
        ],
      },
    },
    {
      question: "What is MotiClaw?",
      answer:
        "MotiClaw is a local-first AI partner and agent control platform. You install, configure, and manage a team of AI partners on your own computer to handle content creation, operations, and development workflows.",
    },
    {
      question: "Is MotiClaw free to use?",
      answer:
        "Yes. MotiClaw is free to download and use, and the free tier supports up to 8 AI partners. For more hosted-model allowance and a bigger team, subscribe to Plus (¥68/month or ¥680/year, 16 AI partners) or Pro (¥199/month, 32 AI partners).",
    },
    {
      question: "Which operating systems does MotiClaw support?",
      answer: "The MotiClaw desktop app currently supports macOS and Windows. Installers are available on the official download page.",
    },
    {
      question: "Is my data safe?",
      answer:
        "MotiClaw uses a local-first architecture: your work data stays on your machine by default and is never force-uploaded to the cloud, so you can safely let AI partners work with internal material.",
    },
    {
      question: "How many AI partners can I create?",
      answer:
        "The free tier supports up to 8 AI partners. Plus raises the cap to 16 and Pro to 32, so you can scale the team as your workload grows.",
    },
    {
      question: "How should I choose between Plus and Pro?",
      answer:
        "Plus and Pro provide different hosted-model allowances. Choose Plus for everyday use, or Pro when you use MotiClaw more often or run more tasks.",
    },
    {
      question: "How do I download and install MotiClaw?",
      answer:
        "Visit the official download page, pick the macOS or Windows installer, and follow the setup guide. Sign in with the same account and your membership benefits sync to the desktop app automatically.",
    },
    {
      question: "Who is MotiClaw for?",
      answer:
        "MotiClaw is built for solo builders who want to multiply their output with AI, forward-deployed engineers (FDEs) delivering AI for clients, founders building lean AI-powered teams, and indie AI developers.",
    },
  ],
};

export function siteFaqItems(locale: Locale): SiteFaqItem[] {
  return faqContent[locale] ?? faqContent.zh;
}

function siteFaqAnswerText(item: SiteFaqItem): string {
  if (!item.comparison) return item.answer;

  const comparison = item.comparison;
  const comparisonText = comparison.rows
    .map((row) => `${row.dimension}: ${comparison.cloudLabel} - ${row.cloud} ${comparison.moticlawLabel} - ${row.moticlaw}`)
    .join("\n");

  return `${item.answer}\n${comparisonText}`;
}

export function siteFaqJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: siteFaqItems(locale).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: siteFaqAnswerText(item),
      },
    })),
  };
}
