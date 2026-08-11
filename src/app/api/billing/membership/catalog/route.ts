import { billingJson, handleBillingError } from "@/app/api/billing/_shared";
import { requestSiteAuthJson } from "@/lib/site-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    return billingJson(await requestSiteAuthJson("/v1/billing/membership/catalog"));
  } catch (error) {
    return handleBillingError(error);
  }
}
