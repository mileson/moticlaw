import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { readSiteAuthSession, requestSiteAuthJson, siteSessionCookieName } from "@/lib/site-auth";

export const metadata: Metadata = {
  title: "连接 MotiClaw Chrome 插件",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type GrantPayload = { code?: string };

const chromeExtensionHostPattern = /^[a-p]{32}\.chromiumapp\.org$/;
const pkceChallengePattern = /^[A-Za-z0-9_-]{43}$/;
const statePattern = /^[A-Za-z0-9._~-]{16,160}$/;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeChromeRedirectUri(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || !chromeExtensionHostPattern.test(url.hostname) || url.port || url.username || url.password || url.search || url.hash) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function normalizeChromePkceChallenge(value: unknown): string | null {
  return typeof value === "string" && pkceChallengePattern.test(value.trim()) ? value.trim() : null;
}

function normalizeChromeAuthState(value: unknown): string | null {
  return typeof value === "string" && statePattern.test(value.trim()) ? value.trim() : null;
}

function chromeConnectPath(input: { redirectUri: string; codeChallenge: string; state: string; lang: string }) {
  const query = new URLSearchParams({ redirect_uri: input.redirectUri, code_challenge: input.codeChallenge, state: input.state, lang: input.lang });
  return `/chrome-connect?${query.toString()}`;
}

async function authorizeChrome(formData: FormData) {
  "use server";
  const redirectUri = normalizeChromeRedirectUri(formData.get("redirect_uri"));
  const codeChallenge = normalizeChromePkceChallenge(formData.get("code_challenge"));
  const state = normalizeChromeAuthState(formData.get("state"));
  const lang = formData.get("lang") === "en" ? "en" : "zh";
  if (!redirectUri || !codeChallenge || !state) redirect("/chrome-connect");

  const returnTo = chromeConnectPath({ redirectUri, codeChallenge, state, lang });
  const token = (await cookies()).get(siteSessionCookieName)?.value?.trim() || "";
  if (!token) redirect(`/login?return_to=${encodeURIComponent(returnTo)}&lang=${lang}`);

  let callback: URL | null = null;
  try {
    const grant = await requestSiteAuthJson<GrantPayload>("/v1/auth/browser/grants", {
      method: "POST",
      token,
      body: { redirect_uri: redirectUri, code_challenge: codeChallenge, code_challenge_method: "S256" },
    });
    if (grant.code) {
      callback = new URL(redirectUri);
      callback.searchParams.set("code", grant.code);
      callback.searchParams.set("state", state);
    }
  } catch {
    callback = null;
  }
  if (!callback) redirect(`${returnTo}&error=grant_failed`);
  redirect(callback.toString());
}

export default async function ChromeConnectPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const redirectUri = normalizeChromeRedirectUri(first(raw.redirect_uri));
  const codeChallenge = normalizeChromePkceChallenge(first(raw.code_challenge));
  const state = normalizeChromeAuthState(first(raw.state));
  const lang = first(raw.lang) === "en" ? "en" : "zh";
  const error = first(raw.error);
  const valid = Boolean(redirectUri && codeChallenge && state);
  const session = valid ? await readSiteAuthSession() : null;

  if (valid && session && !session.authenticated) {
    const returnTo = chromeConnectPath({ redirectUri: redirectUri!, codeChallenge: codeChallenge!, state: state!, lang });
    redirect(`/login?return_to=${encodeURIComponent(returnTo)}&lang=${lang}`);
  }

  const copy = lang === "en"
    ? {
        eyebrow: "MOTICLAW CHROME",
        title: "Connect this browser",
        description: "Use your signed-in MotiClaw account in the extension. Your password and website cookie stay on this site.",
        account: "Signed in as",
        button: "Connect extension",
        cancel: "Cancel",
        invalid: "This connection link is no longer valid. Reopen MotiClaw from the Chrome toolbar.",
        failed: "The connection did not finish. Please reopen the extension and try again.",
        subtitle: "Your local AI work partner",
      }
    : {
        eyebrow: "MOTICLAW CHROME",
        title: "连接这个浏览器",
        description: "把当前已登录的 MotiClaw 账号用于插件。密码和网页 Cookie 都不会交给插件或当前网页。",
        account: "当前账号",
        button: "连接 MotiClaw 插件",
        cancel: "取消",
        invalid: "这条连接链接已经无效，请从 Chrome 工具栏重新打开 MotiClaw。",
        failed: "连接没有完成，请重新打开插件再试一次。",
        subtitle: "你的本地 AI 工作伙伴",
      };

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <section className="w-full max-w-[520px] rounded-[30px] border border-black/10 bg-white/85 p-7 shadow-[0_28px_80px_rgba(61,42,25,0.14)] backdrop-blur dark:border-white/10 dark:bg-[#171923]/90 sm:p-9">
        <div className="flex items-center gap-4">
          <Image src="/icon-192.png" alt="" width={56} height={56} className="rounded-2xl" priority />
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[var(--accent-strong)]">{copy.eyebrow}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{copy.subtitle}</p>
          </div>
        </div>

        <h1 className="mt-8 text-4xl font-semibold tracking-[-0.045em] text-[var(--foreground)]">{copy.title}</h1>
        <p className="mt-4 text-[17px] leading-7 text-[var(--muted)]">{valid ? copy.description : copy.invalid}</p>

        {valid && session?.account ? (
          <div className="mt-7 rounded-2xl border border-black/8 bg-black/[0.035] px-5 py-4 dark:border-white/10 dark:bg-white/[0.05]">
            <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)]">{copy.account}</p>
            <p className="mt-2 font-semibold text-[var(--foreground)]">{session.account.displayName}</p>
            {session.account.email ? <p className="mt-1 text-sm text-[var(--muted)]">{session.account.email}</p> : null}
          </div>
        ) : null}

        {error ? <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">{copy.failed}</p> : null}

        {valid ? (
          <form action={authorizeChrome} className="mt-7 grid gap-3">
            <input type="hidden" name="redirect_uri" value={redirectUri!} />
            <input type="hidden" name="code_challenge" value={codeChallenge!} />
            <input type="hidden" name="state" value={state!} />
            <input type="hidden" name="lang" value={lang} />
            <button type="submit" className="min-h-13 rounded-2xl bg-[#171411] px-5 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black dark:bg-white dark:text-[#171411]">
              {copy.button}
            </button>
            <Link href="/" className="min-h-12 rounded-2xl px-5 py-3 text-center font-medium text-[var(--muted)] hover:text-[var(--foreground)]">{copy.cancel}</Link>
          </form>
        ) : null}
      </section>
    </main>
  );
}
