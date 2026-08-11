import type { Metadata } from "next";
import { headers } from "next/headers";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { detectLocale, localeToHtmlLang } from "@/lib/locale";
import { SupportChat } from "@/components/support-chat";

const siteUrl = new URL("https://www.moticlaw.com");
const siteTitle = "MotiClaw 官网 - 本地 AI 伙伴与智能体控制平台";
const siteDescription =
  "MotiClaw 是一个本地优先的 AI 伙伴与智能体控制平台，支持 macOS 与 Windows 下载部署。适合 FDE、老板、超级个体和 AI 独立开发者，用一个平台完成本地部署、Agent 管理和 AI 助手团队协作。";
const siteKeywords = [
  "MotiClaw",
  "本地 AI 伙伴",
  "AI 智能体",
  "本地 AI",
  "本地智能体",
  "AI 伙伴",
  "智能体控制平台",
  "本地部署 AI",
  "Agent 管理",
  "AI 助手",
  "FDE AI 落地",
  "超级个体 AI 平台",
  "桌面版下载",
  "下载安装",
];

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  applicationName: "MotiClaw",
  title: siteTitle,
  description: siteDescription,
  keywords: siteKeywords,
  metadataBase: siteUrl,
  verification: {
    google: "pNUc-XL5KI-iIherSja6-5o0AlhMqdeS8udl51ivEjw",
    other: {
      "baidu-site-verification": "codeva-cUrAvJhefb",
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/?lang=zh",
      en: "/?lang=en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "MotiClaw",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MotiClaw - 本地优先的 AI 伙伴与智能体控制平台",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg?v=3", type: "image/svg+xml" },
    ],
    shortcut: "/icon-192.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const locale = detectLocale(
    requestHeaders.get("x-moticlaw-locale") ?? requestHeaders.get("accept-language"),
  );

  return (
    <html
      lang={localeToHtmlLang(locale)}
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Plain inline script (not next/script) so theme init survives the marketing-page script-strip layer. */}
        <script
          id="moticlaw-theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const stored = localStorage.getItem("moticlaw-theme");
                  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  const resolved = stored === "light" || stored === "dark" ? stored : (systemDark ? "dark" : "light");
                  const root = document.documentElement;
                  root.classList.toggle("dark", resolved === "dark");
                  root.dataset.theme = resolved;
                  root.style.colorScheme = resolved;
                } catch (error) {}
              })();
            `,
          }}
        />
        {children}
        <SupportChat />
      </body>
    </html>
  );
}
