import type { Locale } from "@/lib/locale";

export type LegalDocumentKind = "terms" | "privacy";

type LegalDocumentSection = {
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

type LegalDocumentContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  updatedLabel: string;
  updatedAt: string;
  highlights: readonly {
    title: string;
    body: string;
  }[];
  sections: readonly LegalDocumentSection[];
  relatedLabel: string;
  contactTitle: string;
  contactBody: string;
  contactAction: string;
  backHome: string;
  backToLogin: string;
  languageLabel: string;
  otherDocumentLabel: string;
};

export const legalDocumentPaths: Record<LegalDocumentKind, string> = {
  terms: "/terms-of-service",
  privacy: "/privacy",
};

export const legalDocumentCopy = {
  terms: {
    en: {
      eyebrow: "Official terms",
      title: "MotiClaw Terms of Service",
      subtitle: "These terms explain how you may use the MotiClaw website, desktop app, downloads, account services, and related support channels.",
      intro:
        "We wrote this version to match how MotiClaw actually works today: one account can move between the website and desktop app, password recovery happens by email, and some product experiences may still be invite-based or evolving.",
      updatedLabel: "Last updated",
      updatedAt: "May 27, 2026",
      highlights: [
        {
          title: "One account across surfaces",
          body: "The website account flow and MotiClaw Desktop are designed to work together, including sign-in handoff back to the app when you open the page from desktop.",
        },
        {
          title: "Review AI-assisted work",
          body: "MotiClaw may help organize information, draft content, or move a workflow forward, but you stay responsible for what you keep, run, send, or publish.",
        },
        {
          title: "Some features may change early",
          body: "Invite-only access, beta functions, usage allowances, and product details may change while we continue improving the service.",
        },
      ],
      sections: [
        {
          title: "1. What these terms cover",
          paragraphs: [
            "These Terms of Service apply when you access or use the MotiClaw website, MotiClaw Desktop, public download pages, account services, updates, and related support or communication channels that we operate under the MotiClaw name.",
            "If a separate written agreement applies to your organization, that agreement controls to the extent it conflicts with these terms.",
          ],
        },
        {
          title: "2. Eligibility and account basics",
          paragraphs: [
            "You may use MotiClaw only if you can legally enter into this agreement in your region. If you are using MotiClaw for a company or team, you confirm that you have authority to do so.",
            "You agree to provide accurate account information, keep it up to date, and keep your login credentials secure. You are responsible for activity that happens through your account until you notify us that it is no longer secure.",
          ],
        },
        {
          title: "3. How you may use MotiClaw",
          paragraphs: [
            "Subject to these terms, we grant you a limited, non-exclusive, revocable right to download, access, and use MotiClaw for your own internal, personal, or business workflows.",
            "You may use the same account across the website and desktop app. If you open a sign-in page from MotiClaw Desktop, the website may send the completed sign-in result back to the app on your device so you can continue there.",
          ],
        },
        {
          title: "4. What you may not do",
          paragraphs: [
            "Please do not misuse the service, interfere with other users, or try to bypass product or security controls.",
          ],
          bullets: [
            "Reverse engineer, copy, resell, or build a competing service from MotiClaw except where applicable law clearly permits it.",
            "Probe, scrape, overload, or disrupt the website, desktop app, account systems, update channels, or related infrastructure.",
            "Bypass invite gates, sign-in protections, password reset protections, usage controls, or any other access restrictions we put in place.",
            "Use MotiClaw to break the law, infringe someone else’s rights, spread malware, run abusive automation, or process data you are not allowed to share.",
          ],
        },
        {
          title: "5. AI-assisted outputs and your responsibility",
          paragraphs: [
            "MotiClaw may help you organize information, draft text, summarize material, or move work forward with AI-assisted suggestions. Those results may be incomplete, inaccurate, outdated, or inappropriate for your specific situation.",
            "You are responsible for reviewing anything MotiClaw produces before you rely on it, execute it, share it with others, or publish it. You should also make sure you have the right to submit any content, files, prompts, or instructions that you provide to the service.",
          ],
        },
        {
          title: "6. Downloads, updates, early access, and availability",
          paragraphs: [
            "We may change, improve, pause, or discontinue parts of MotiClaw at any time. Some capabilities may be invite-only, beta, region-limited, or released with different limits or allowances.",
            "Download links, update packages, supported platforms, and feature availability may change over time. We will make reasonable efforts to keep the public website current, but we do not guarantee that every part of the service will always be available or uninterrupted.",
          ],
        },
        {
          title: "7. Ownership, feedback, and brand materials",
          paragraphs: [
            "MotiClaw and its software, branding, website materials, and underlying service design remain our property or the property of our licensors.",
            "You keep the rights you already have in your own content. If you send us feedback, ideas, or suggestions, we may use them to improve MotiClaw without any obligation to compensate you.",
          ],
        },
        {
          title: "8. Suspension and termination",
          paragraphs: [
            "You may stop using MotiClaw at any time. We may suspend or terminate access if we reasonably believe you violated these terms, created risk for the service or other users, or if we must do so for legal, security, or operational reasons.",
            "If access ends, provisions that by their nature should continue will continue, including sections about ownership, responsibility, disclaimers, liability limits, and dispute-related provisions to the extent allowed by law.",
          ],
        },
        {
          title: "9. Disclaimers and limits",
          paragraphs: [
            "MotiClaw is provided on an \"as available\" basis. To the fullest extent permitted by law, we do not promise that the service will always be uninterrupted, error-free, secure, or suitable for every workflow.",
            "To the fullest extent permitted by law, we are not liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost data, or business interruption arising from your use of MotiClaw.",
          ],
        },
        {
          title: "10. Changes and contact",
          paragraphs: [
            "We may update these terms from time to time. When we do, we will post the new version here and update the date at the top of the page. Your continued use of MotiClaw after the updated terms take effect means you accept the revised terms.",
            "If you have a question about these terms, need to report an account security issue, or want to contact us about MotiClaw, please reach out through the contact address below.",
          ],
        },
      ],
      relatedLabel: "Also read",
      contactTitle: "Questions about these terms?",
      contactBody: "For account security issues, legal questions, or product support related to these terms, contact the MotiClaw team.",
      contactAction: "Email chaojifeng@shadowlaws.com",
      backHome: "Home",
      backToLogin: "Log in",
      languageLabel: "Language",
      otherDocumentLabel: "Privacy Policy",
    },
    zh: {
      eyebrow: "官方条款",
      title: "MotiClaw 服务条款",
      subtitle: "这份条款说明你在使用 MotiClaw 官网、桌面端、下载服务、账号服务以及相关支持渠道时，双方各自承担什么责任。",
      intro:
        "我们按 MotiClaw 现在真实的产品形态来写这份版本：官网和桌面端共用一个账号，找回密码通过邮件完成，从桌面端打开登录页时，成功结果会尽量自动带回 App 继续。",
      updatedLabel: "最后更新",
      updatedAt: "2026年5月27日",
      highlights: [
        {
          title: "一个账号贯通官网和桌面端",
          body: "官网账号流程会和 MotiClaw Desktop 配合工作，包括从桌面端打开页面后，把登录结果自动带回 App 继续。",
        },
        {
          title: "AI 给建议，你来做最终判断",
          body: "MotiClaw 可以帮你整理信息、起草内容或推进流程，但你仍然需要对最终保留、执行、发送或发布的内容负责。",
        },
        {
          title: "部分能力会继续迭代",
          body: "邀请码、测试能力、默认额度和具体产品细节，可能会随着服务迭代而调整。",
        },
      ],
      sections: [
        {
          title: "1. 这份条款适用什么范围",
          paragraphs: [
            "当你访问或使用 MotiClaw 官网、MotiClaw Desktop、公开下载页、账号服务、更新服务，以及我们以 MotiClaw 名义提供的相关支持或沟通渠道时，都适用这份服务条款。",
            "如果你所在的组织和我们另有单独书面协议，且和本条款存在冲突，以那份单独协议为准。",
          ],
        },
        {
          title: "2. 使用资格与账号基础责任",
          paragraphs: [
            "只有在你所在地区有权签署并遵守这类协议时，你才可以使用 MotiClaw。如果你代表公司或团队使用，也意味着你有足够授权这样做。",
            "你需要提供真实、完整并尽量保持最新的账号信息，同时妥善保管自己的登录凭证。在你明确通知我们账号已不再安全之前，该账号下发生的活动仍由你负责。",
          ],
        },
        {
          title: "3. 你可以怎样使用 MotiClaw",
          paragraphs: [
            "在你遵守本条款的前提下，我们授予你一项有限、非独占、可撤销的使用权，用于下载、访问并在自己的个人、内部或业务工作流中使用 MotiClaw。",
            "你可以在官网和桌面端使用同一个账号。如果登录页是从 MotiClaw Desktop 打开的，官网登录成功后，网站可能会把结果直接回传到你设备上的 App，帮助你无缝继续下一步。",
          ],
        },
        {
          title: "4. 哪些事情不能做",
          paragraphs: [
            "请不要滥用服务，也不要影响其他用户或绕过我们设置的产品与安全边界。",
          ],
          bullets: [
            "除非适用法律明确允许，否则不要反向工程、复制、转售 MotiClaw，或基于它搭建竞争性服务。",
            "不要探测、抓取、压测、破坏或干扰官网、桌面端、账号系统、更新链路及相关基础设施。",
            "不要绕过邀请码门槛、登录保护、找回密码保护、使用限制或任何其他访问控制。",
            "不要利用 MotiClaw 从事违法活动、侵犯他人权利、传播恶意软件、实施滥用自动化，或处理你无权提供给我们的数据。",
          ],
        },
        {
          title: "5. AI 辅助结果与最终责任",
          paragraphs: [
            "MotiClaw 可能会帮助你整理信息、起草文字、总结材料，或者用 AI 辅助方式推进工作流。但这些结果可能并不完整、并不准确，也可能不适合你的具体场景。",
            "在你依赖、执行、分享或发布任何由 MotiClaw 生成的结果之前，都应当自行复核。同时，你也需要确保你提交给服务的内容、文件、提示词和指令，本身就是你有权提供的。",
          ],
        },
        {
          title: "6. 下载、更新、早期能力与可用性",
          paragraphs: [
            "我们可以随时调整、改进、暂停或下线 MotiClaw 的部分能力。某些功能也可能处于邀请码、测试版、地区限制或不同额度策略下。",
            "下载链接、更新包、支持平台和具体功能可用性都会随着时间变化。我们会尽量让官网上的公开信息保持及时，但不能保证服务的每个部分始终可用、无中断或完全符合你的预期。",
          ],
        },
        {
          title: "7. 所有权、反馈与品牌资料",
          paragraphs: [
            "MotiClaw 的软件、品牌、官网内容以及底层服务设计，仍然归我们或我们的许可方所有。",
            "你对自己原本拥有权利的内容，仍然保留相应权利。如果你向我们提交建议、反馈或改进想法，我们可以把这些内容用于改进 MotiClaw，而无需另外向你支付报酬。",
          ],
        },
        {
          title: "8. 中止与终止",
          paragraphs: [
            "你可以随时停止使用 MotiClaw。如果我们合理认为你违反了本条款、对服务或其他用户带来了风险，或者出于法律、安全、运营原因必须这样做，我们可以暂停或终止你的访问权限。",
            "访问结束后，那些按性质本应继续有效的条款仍会继续有效，例如所有权、责任分配、免责声明、责任限制，以及法律允许范围内的争议处理相关约定。",
          ],
        },
        {
          title: "9. 免责声明与责任限制",
          paragraphs: [
            "MotiClaw 按“现状”和“可用时提供”的基础运行。在法律允许的最大范围内，我们不承诺服务一定持续不中断、完全无错误、绝对安全，或适合所有工作场景。",
            "在法律允许的最大范围内，对于因你使用 MotiClaw 而产生的间接损失、附带损失、特殊损失、后果性损失、惩罚性损失、利润损失、数据损失或业务中断，我们不承担责任。",
          ],
        },
        {
          title: "10. 条款更新与联系我们",
          paragraphs: [
            "我们可能会不定期更新这份条款。更新后会在本页发布新版本，并同步修改页面顶部日期。更新生效后你继续使用 MotiClaw，就表示你接受修订后的条款。",
            "如果你对这份条款有疑问、需要反馈账号安全问题，或希望就 MotiClaw 相关事项联系我们，可以通过下面的联系方式和我们沟通。",
          ],
        },
      ],
      relatedLabel: "配套阅读",
      contactTitle: "对这份条款有疑问？",
      contactBody: "如果是账号安全、条款相关问题，或与本条款有关的产品支持事项，都可以通过下面的方式联系 MotiClaw 团队。",
      contactAction: "发送邮件到 chaojifeng@shadowlaws.com",
      backHome: "首页",
      backToLogin: "登录",
      languageLabel: "语言",
      otherDocumentLabel: "《隐私政策》",
    },
  },
  privacy: {
    en: {
      eyebrow: "Official privacy",
      title: "MotiClaw Privacy Policy",
      subtitle: "This policy explains what information MotiClaw processes, why we use it, and the choices you have when you use our website, account services, and related product experiences.",
      intro:
        "We keep this policy tied to the product that exists today: website sign-in and password recovery, desktop handoff, public download access, and preference storage for language or theme on the website.",
      updatedLabel: "Last updated",
      updatedAt: "May 27, 2026",
      highlights: [
        {
          title: "What we collect",
          body: "Account details you submit, website session state, security-verification data, browser preferences, and support information you choose to send us.",
        },
        {
          title: "Why we use it",
          body: "To sign you in, send password reset emails, protect the service from abuse, return you to MotiClaw Desktop when needed, and keep the website reliable.",
        },
        {
          title: "Who helps us operate",
          body: "We rely on infrastructure partners for hosting, security verification, account services, email delivery, and software downloads.",
        },
      ],
      sections: [
        {
          title: "1. Scope",
          paragraphs: [
            "This Privacy Policy applies to information processed through the MotiClaw website, account pages, download pages, MotiClaw Desktop handoff flow, and related support communications.",
            "It does not override separate privacy terms that may apply when you choose to use third-party services or integrations through MotiClaw. Those providers may process data under their own terms and policies.",
          ],
        },
        {
          title: "2. Information we collect",
          paragraphs: [
            "We collect information you provide directly, information created while operating your account session, and limited technical information needed to keep the service available and secure.",
          ],
          bullets: [
            "Account information, such as your display name, email address, password, and password reset details when you sign up, sign in, or recover access.",
            "Website session information, such as whether you are signed in, when the website session expires, and the account profile needed to show your current website status.",
            "Security-verification and request data, such as Turnstile verification tokens, browser language hints, and request or diagnostic data needed to prevent abuse and troubleshoot problems.",
            "Website preference data stored in your browser, such as language and theme selections, so the website can reopen in the way you last used it.",
            "Support or feedback information that you choose to send us, such as emails, bug descriptions, screenshots, or other materials you share while asking for help.",
          ],
        },
        {
          title: "3. How we use information",
          paragraphs: [
            "We use information to operate MotiClaw in ways that are directly related to the product experience you requested.",
          ],
          bullets: [
            "Create and manage your account, authenticate you, and keep your website session working.",
            "Send password reset emails and other account-related service messages.",
            "Return a completed sign-in result to MotiClaw Desktop when you opened the page from the app and want to continue there.",
            "Protect the website and account flows from spam, abuse, fraud, or automated attacks.",
            "Operate download pages, release delivery, diagnostics, support, and general service reliability work.",
          ],
        },
        {
          title: "4. Cookies, local storage, and similar tools",
          paragraphs: [
            "MotiClaw uses an HttpOnly website session cookie named `moticlaw_site_session` so the website can recognize your signed-in state without exposing that session token to browser JavaScript.",
            "We also store limited browser-side preferences, such as theme and language, in local storage so the website can remember how you prefer it to look and which language you last selected.",
            "If you disable cookies or browser storage, some sign-in, handoff, or preference features may not work as expected.",
          ],
        },
        {
          title: "5. How we share information",
          paragraphs: [
            "We do not sell your personal information. We share information only when it is needed to run MotiClaw, comply with the law, or protect the service and its users.",
          ],
          bullets: [
            "With service providers that help us operate hosting, account infrastructure, security verification, email delivery, analytics or diagnostics, and software distribution.",
            "With MotiClaw Desktop running on your own device when you opened a website sign-in page from the app and the website needs to hand the finished result back to you locally.",
            "If required by law, legal process, or a good-faith need to protect rights, safety, users, or the integrity of the service.",
          ],
        },
        {
          title: "6. Retention",
          paragraphs: [
            "We keep information for as long as it is reasonably needed to provide the service, maintain account security, comply with legal obligations, resolve disputes, or enforce our agreements.",
            "Website session cookies usually expire automatically. Browser-side theme or language preferences remain until you clear them. Support materials may be kept for follow-up, troubleshooting, and service-improvement records.",
          ],
        },
        {
          title: "7. Security",
          paragraphs: [
            "We use reasonable administrative, technical, and operational measures to protect the information we process. That said, no website, application, storage system, or internet transmission can be guaranteed to be perfectly secure.",
            "If you believe your account or information may have been compromised, contact us as soon as possible so we can help investigate.",
          ],
        },
        {
          title: "8. Your choices",
          paragraphs: [
            "You can choose whether to create an account, whether to stay signed in on the website, and whether to keep website preference storage enabled in your browser.",
            "If you want to access, correct, or delete account information that we control, contact us and we will review your request in light of applicable law and our legitimate security or operational needs.",
          ],
        },
        {
          title: "9. Children",
          paragraphs: [
            "MotiClaw is built for adult work and product workflows and is not directed to children under 18. If we learn that we collected personal information from a child under 18 without appropriate authorization, we will take reasonable steps to delete it.",
          ],
        },
        {
          title: "10. Changes and contact",
          paragraphs: [
            "We may update this Privacy Policy from time to time. When we do, we will post the updated version here and change the date at the top of the page.",
            "If you have questions about this policy or want to contact us about your information, please use the contact address below.",
          ],
        },
      ],
      relatedLabel: "Also read",
      contactTitle: "Questions about privacy?",
      contactBody: "If you want to ask about your account data, a privacy issue, or website sign-in information, contact the MotiClaw team.",
      contactAction: "Email chaojifeng@shadowlaws.com",
      backHome: "Home",
      backToLogin: "Log in",
      languageLabel: "Language",
      otherDocumentLabel: "Terms of Service",
    },
    zh: {
      eyebrow: "官方隐私",
      title: "MotiClaw 隐私政策",
      subtitle: "这份隐私政策说明 MotiClaw 会处理哪些信息、为什么要处理，以及你在使用官网、账号服务和相关产品体验时有哪些可选项。",
      intro:
        "我们把这份政策写在现在真实存在的产品边界上：官网登录与找回密码、桌面端登录回传、公开下载入口，以及官网对主题和语言偏好的浏览器本地保存。",
      updatedLabel: "最后更新",
      updatedAt: "2026年5月27日",
      highlights: [
        {
          title: "我们会处理什么",
          body: "你主动提交的账号信息、官网 session 状态、安全验证数据、浏览器偏好，以及你主动发给我们的支持材料。",
        },
        {
          title: "为什么会处理",
          body: "为了完成登录、发送重置密码邮件、防止滥用、把结果带回 MotiClaw Desktop，并让官网保持稳定可用。",
        },
        {
          title: "谁在帮助我们运行",
          body: "我们会依赖基础设施合作方来提供托管、安全验证、账号服务、邮件发送和软件分发能力。",
        },
      ],
      sections: [
        {
          title: "1. 适用范围",
          paragraphs: [
            "这份隐私政策适用于 MotiClaw 官网、账号页面、下载页面、MotiClaw Desktop 登录回传流程，以及相关支持沟通中涉及的信息处理。",
            "如果你另外选择使用某些第三方服务或集成能力，它们可能会按照自己的条款和隐私政策处理数据；本政策不会替代那些第三方自己的规则。",
          ],
        },
        {
          title: "2. 我们会收集哪些信息",
          paragraphs: [
            "我们会处理你主动提供的信息、账号 session 运行过程中生成的信息，以及维持服务可用与安全所需的少量技术信息。",
          ],
          bullets: [
            "账号信息，例如你在注册、登录或找回密码时提交的称呼、邮箱地址、密码和重置密码相关信息。",
            "官网 session 信息，例如你是否已登录、当前官网 session 的到期时间，以及用于展示当前登录状态的账号资料。",
            "安全验证与请求信息，例如 Turnstile 验证令牌、浏览器语言提示，以及用于防滥用和排查问题的请求或诊断数据。",
            "保存在浏览器里的官网偏好信息，例如语言和主题选择，用来帮助你下次打开网站时保持上次的使用方式。",
            "你主动发给我们的支持或反馈信息，例如邮件、问题描述、截图或其他求助材料。",
          ],
        },
        {
          title: "3. 我们如何使用这些信息",
          paragraphs: [
            "我们会把这些信息用于和你当前请求直接相关的产品能力，而不是脱离场景地泛化使用。",
          ],
          bullets: [
            "创建和管理账号、验证你的身份，并维持官网登录状态。",
            "发送重置密码邮件和其他与账号直接相关的服务消息。",
            "当页面是从 App 打开的情况下，把已完成的登录结果带回 MotiClaw Desktop，让你可以继续下一步。",
            "保护官网和账号流程，减少垃圾请求、滥用、欺诈和自动化攻击。",
            "支撑下载页、版本发布、诊断排查、用户支持和整体服务可靠性工作。",
          ],
        },
        {
          title: "4. Cookie、本地存储与类似工具",
          paragraphs: [
            "MotiClaw 会使用名为 `moticlaw_site_session` 的 HttpOnly 官网 session cookie，帮助官网识别你的登录状态，同时避免把这个 session token 暴露给浏览器里的 JavaScript。",
            "我们也会把少量浏览器侧偏好，例如主题和语言，保存在 localStorage 里，方便官网记住你的显示方式和上次选择的语言。",
            "如果你关闭了 cookie 或浏览器本地存储，一些登录、回 App 或偏好记忆能力可能无法正常工作。",
          ],
        },
        {
          title: "5. 我们会如何共享信息",
          paragraphs: [
            "我们不会出售你的个人信息。只有在运行 MotiClaw、遵守法律义务，或保护服务及用户安全所必需时，我们才会共享相关信息。",
          ],
          bullets: [
            "共享给帮助我们提供托管、账号基础设施、安全验证、邮件发送、分析或诊断、软件分发等能力的服务提供方。",
            "当官网登录页是从 App 打开的，并且你希望回到 App 继续时，共享给你自己设备上正在运行的 MotiClaw Desktop，用于把完成后的结果回传给你。",
            "在法律要求、法律程序要求，或为了保护权利、安全、用户和服务完整性而有正当必要时进行共享。",
          ],
        },
        {
          title: "6. 保留期限",
          paragraphs: [
            "我们会在合理必要的时间内保留相关信息，用于提供服务、维护账号安全、履行法律义务、解决争议或执行双方约定。",
            "官网 session cookie 通常会自动过期。浏览器里的主题或语言偏好会保留到你主动清除为止。支持材料可能会为了后续跟进、排查和服务改进记录而保留一段时间。",
          ],
        },
        {
          title: "7. 安全措施",
          paragraphs: [
            "我们会采用合理的管理、技术和运营措施来保护正在处理的信息。但也请理解，没有任何网站、应用、存储系统或网络传输方式能够保证绝对安全。",
            "如果你怀疑自己的账号或信息可能已经受到影响，请尽快联系我们，以便我们协助排查。",
          ],
        },
        {
          title: "8. 你的选择",
          paragraphs: [
            "你可以决定是否创建账号、是否保持官网登录状态，以及是否允许浏览器保存官网偏好信息。",
            "如果你希望访问、更正或删除由我们控制的账号信息，可以联系我们。我们会结合适用法律以及合理的安全、运营需要来处理你的请求。",
          ],
        },
        {
          title: "9. 未成年人",
          paragraphs: [
            "MotiClaw 面向成年人的工作与产品场景，不以 18 岁以下未成年人为目标用户。如果我们发现自己在没有适当授权的情况下收集了 18 岁以下未成年人的个人信息，会采取合理措施删除相关信息。",
          ],
        },
        {
          title: "10. 政策更新与联系我们",
          paragraphs: [
            "我们可能会不定期更新这份隐私政策。更新后会在本页发布新版本，并同步调整页面顶部日期。",
            "如果你对这份政策有疑问，或者希望就你的信息联系 MotiClaw 团队，请使用下面的联系方式。",
          ],
        },
      ],
      relatedLabel: "配套阅读",
      contactTitle: "对隐私有疑问？",
      contactBody: "如果你想咨询账号数据、隐私问题，或与官网登录信息相关的事项，可以通过下面的方式联系 MotiClaw 团队。",
      contactAction: "发送邮件到 chaojifeng@shadowlaws.com",
      backHome: "首页",
      backToLogin: "登录",
      languageLabel: "语言",
      otherDocumentLabel: "《服务条款》",
    },
  },
} as const satisfies Record<LegalDocumentKind, Record<Locale, LegalDocumentContent>>;
