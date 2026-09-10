import "server-only";

export function isWatchaPayConfigured() {
  return process.env.MOTICLAW_WATCHA_PAY_ENABLED === "1";
}
