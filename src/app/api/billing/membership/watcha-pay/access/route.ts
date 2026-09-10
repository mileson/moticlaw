import {
  billingJson,
  handleBillingError,
  optionalString,
  readBillingBody,
  requireBillingSameOrigin,
  requireSiteSessionToken,
} from "@/app/api/billing/_shared";
import { normalizeMembershipCatalog } from "@/lib/site-billing";
import { requestSiteAuthJson, SiteAuthRequestError } from "@/lib/site-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    requireBillingSameOrigin(request);
    const body = await readBillingBody(request);
    const planId = optionalString(body.planId ?? body.plan_id);
    const locale = body.locale === "en" ? "en" : "zh";
    const refresh = body.refresh === true;
    if (!planId) {
      throw new SiteAuthRequestError("Membership plan is missing.", {
        code: "watcha_pay_plan_invalid",
        status: 400,
      });
    }

    const token = await requireSiteSessionToken();
    const catalog = normalizeMembershipCatalog(
      await requestSiteAuthJson("/v1/billing/membership/catalog", { token }),
    );
    const plan = catalog.plans.find((item) => item.planId === planId) ?? null;
    if (!plan || (plan.tier !== "plus" && plan.tier !== "pro")) {
      throw new SiteAuthRequestError("This membership plan is not available through Watcha Pay.", {
        code: "watcha_pay_plan_invalid",
        status: 400,
      });
    }

    const returnUrl = new URL("/account/membership", request.url);
    returnUrl.searchParams.set("lang", locale);
    returnUrl.searchParams.set("view", "plans");
    returnUrl.searchParams.set("watcha_return", "1");
    returnUrl.searchParams.set("watcha_plan_id", plan.planId);
    const action = refresh ? "refresh" : "access";
    const payload = await requestSiteAuthJson(
      `/v1/billing/watcha-pay/membership/${encodeURIComponent(plan.planId)}/${action}`,
      {
        method: "POST",
        token,
        ...(refresh ? {} : { body: { return_url: returnUrl.toString() } }),
      },
    );
    return billingJson(payload);
  } catch (error) {
    return handleBillingError(error);
  }
}
