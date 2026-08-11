import {
  billingJson,
  handleBillingError,
  optionalString,
  readBillingBody,
  requireSiteSessionToken,
} from "@/app/api/billing/_shared";
import { requestSiteAuthJson } from "@/lib/site-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    return billingJson(await requestSiteAuthJson("/v1/billing/membership/orders", { token: await requireSiteSessionToken() }));
  } catch (error) {
    return handleBillingError(error);
  }
}

export async function POST(request: Request) {
  const body = await readBillingBody(request);

  try {
    return billingJson(
      await requestSiteAuthJson("/v1/billing/membership/orders", {
        method: "POST",
        token: await requireSiteSessionToken(),
        body: { plan_id: optionalString(body.planId ?? body.plan_id) || "" },
      }),
    );
  } catch (error) {
    return handleBillingError(error);
  }
}
