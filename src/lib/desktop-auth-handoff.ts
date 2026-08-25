// # 文件说明书 (File Manual)
// ## 核心功能 (Core Function)
// 约束官网登录回桌面端的单次发放、并发互斥、页面焦点信号忽略和历史回流地址复用边界。
//
// ## 输入 (Input)
// 接收当前登录链接携带的原生/loopback 回流地址、localStorage 中的历史候选、当前时间和发放来源。
//
// ## 输出 (Output)
// 输出安全的有效回流上下文、可持久化的原生回流上下文，以及单次幂等的 handoff 尝试协调器。
//
// ## 定位 (Position)
// 位于 `src/lib`，作为 `site-auth-page.tsx` 的浏览器无关 handoff 状态与地址策略层。
//
// ## 依赖 (Dependency)
// - 仅依赖标准 URL 与 JavaScript 运行时，不访问 React、DOM、网络或存储。
//
// ## 维护规则 (Maintenance Rules)
// 1. 每次修改代码逻辑后，必须检查并更新上述的【核心功能】、【输入】、【输出】等信息，确保文档与代码一致。
// 2. 禁止修改或删除本【维护规则】章节的内容。
// 3. 修改完成后，必须扫描当前文件所在的文件夹目录，找到对应的 `moticlaw-site_lib_README.md` 文档，并同步更新该 README 中关于本文件的描述信息。

export type DesktopReturnContext = {
  clientRedirectUri: string;
  fallbackRedirectUri: string | null;
  updatedAt: number;
};

export type DesktopHandoffAttemptSource = "automatic" | "manual";
export type DesktopHandoffPageSignal = "blur" | "focus" | "hidden" | "visible";

const nativeDesktopReturnProtocols = new Set(["moticlaw:", "moticlaw-dev:"]);
const loopbackHostnames = new Set(["127.0.0.1", "localhost", "::1"]);

export const nativeDesktopReturnCooldownMs = 1_200;

export function isNativeDesktopReturnUri(value: string) {
  try {
    return nativeDesktopReturnProtocols.has(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function isLoopbackDesktopReturnUri(value: string) {
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && loopbackHostnames.has(parsed.hostname);
  } catch {
    return false;
  }
}

export function normalizeRememberedDesktopReturnContext(
  value: unknown,
  now: number,
  ttlMs: number,
): DesktopReturnContext | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Partial<DesktopReturnContext>;
  const clientRedirectUri = normalizeRememberedNativeUri(candidate.clientRedirectUri);
  const fallbackRedirectUri = normalizeRememberedNativeUri(candidate.fallbackRedirectUri);
  const updatedAt = typeof candidate.updatedAt === "number" && Number.isFinite(candidate.updatedAt) ? candidate.updatedAt : 0;

  if (!clientRedirectUri || updatedAt <= 0 || now - updatedAt > ttlMs) return null;
  return { clientRedirectUri, fallbackRedirectUri, updatedAt };
}

export function resolveEffectiveDesktopReturnContext(
  currentClientRedirectUri: string | null,
  currentFallbackRedirectUri: string | null,
  remembered: DesktopReturnContext | null,
) {
  const currentLinkContainsLoopback = Boolean(
    (currentClientRedirectUri && isLoopbackDesktopReturnUri(currentClientRedirectUri))
      || (currentFallbackRedirectUri && isLoopbackDesktopReturnUri(currentFallbackRedirectUri)),
  );

  if (currentLinkContainsLoopback) {
    return {
      clientRedirectUri: currentClientRedirectUri,
      fallbackRedirectUri: currentFallbackRedirectUri,
    };
  }

  return {
    clientRedirectUri: currentClientRedirectUri || remembered?.clientRedirectUri || null,
    fallbackRedirectUri: currentFallbackRedirectUri || remembered?.fallbackRedirectUri || null,
  };
}

export function selectDesktopReturnRetryTarget<T extends { fallback?: T | null }>(redirect: T) {
  return redirect.fallback || redirect;
}

export function createDesktopHandoffAttemptGuard() {
  let active = false;
  let autoTriggered = false;

  return {
    begin(source: DesktopHandoffAttemptSource) {
      if (active || (source === "automatic" && autoTriggered)) return false;
      active = true;
      autoTriggered = true;
      return true;
    },
    finish() {
      active = false;
    },
    reset() {
      active = false;
      autoTriggered = false;
    },
    observePageSignal(signal: DesktopHandoffPageSignal) {
      void signal;
      return false;
    },
    snapshot() {
      return { active, autoTriggered, canRetry: autoTriggered && !active };
    },
  };
}

function normalizeRememberedNativeUri(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const normalized = value.trim();
  return isNativeDesktopReturnUri(normalized) ? new URL(normalized).toString() : null;
}
