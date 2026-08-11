import {
  billingJson,
  handleBillingError,
  optionalString,
  requireSiteSessionToken,
} from "@/app/api/billing/_shared";
import { requestSiteAuthJson } from "@/lib/site-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = new URLSearchParams();
  const kind = optionalString(url.searchParams.get("kind"));
  const limit = optionalString(url.searchParams.get("limit"));
  const offset = optionalString(url.searchParams.get("offset"));
  if (kind) search.set("kind", kind);
  if (limit) search.set("limit", limit);
  if (offset) search.set("offset", offset);
  const suffix = search.toString() ? `?${search.toString()}` : "";

  try {
    return billingJson(
      await requestSiteAuthJson(`/v1/billing/points/ledger${suffix}`, {
        token: await requireSiteSessionToken(),
      }),
    );
  } catch (error) {
    return handleBillingError(error);
  }
}
