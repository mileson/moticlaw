import {
  billingJson,
  handleBillingError,
  optionalString,
  requireSiteSessionToken,
} from "@/app/api/billing/_shared";
import { requestSiteAuthJson } from "@/lib/site-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ outTradeNo: string }> },
) {
  const { outTradeNo } = await params;
  const normalizedOutTradeNo = optionalString(outTradeNo);
  if (!normalizedOutTradeNo) {
    return billingJson(
      { ok: false, error: { code: "billing_order_missing", message: "Order is missing." } },
      400,
    );
  }

  try {
    return billingJson(
      await requestSiteAuthJson(
        `/v1/billing/points/orders/${encodeURIComponent(normalizedOutTradeNo)}`,
        { token: await requireSiteSessionToken() },
      ),
    );
  } catch (error) {
    return handleBillingError(error);
  }
}
