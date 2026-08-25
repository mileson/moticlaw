import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";
import { detectLocale, localeToHtmlLang } from "@/lib/locale";
import { SupportChat } from "@/components/support-chat";
import { SiteAnalytics } from "@/components/site-analytics";

const siteUrl = new URL("https://www.moticlaw.com");
const siteTitle = "MotiClaw｜本地内容创作 AI 工作台";
const siteDescription =
  "MotiClaw 是本地内容创作 AI 工作台，把灵感、素材、创作与发布收进一个本地工作空间，让 AI 完成大部分内容创作执行，数据默认留在你的设备上。";
const siteKeywords = [
  "MotiClaw",
  "本地内容创作",
  "AI 内容创作",
  "内容创作工作台",
  "本地 AI 工作台",
  "AI 写作",
  "素材管理",
  "内容发布",
  "创作者工具",
  "桌面版下载",
  "下载安装",
];

const displayFont = localFont({
  src: "./fonts/fraunces-latin-variable.woff2",
  variable: "--font-display",
  weight: "100 900",
  style: "normal",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const bodyFont = localFont({
  src: "./fonts/ibm-plex-sans-latin-variable.woff2",
  variable: "--font-body",
  weight: "100 700",
  style: "normal",
  display: "swap",
  adjustFontFallback: "Arial",
});

const monoFont = localFont({
  src: [
    {
      path: "./fonts/ibm-plex-mono-latin-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/ibm-plex-mono-latin-500.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-code",
  display: "swap",
  preload: false,
  adjustFontFallback: "Arial",
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
        alt: "MotiClaw - 本地内容创作 AI 工作台",
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
        <SiteAnalytics locale={locale} />
        <SupportChat />
      </body>
    </html>
  );
}
